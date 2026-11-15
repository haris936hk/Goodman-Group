import { execFile } from "node:child_process";
import { randomBytes, randomUUID } from "node:crypto";
import { promisify } from "node:util";
import { Client, type PoolClient } from "pg";
import { del, list, type ListBlobResultBlob } from "@vercel/blob";
import type { Payload } from "payload";
import { closeCmsMutationGatePool } from "../../src/cms/mutation-gate";

const exec = promisify(execFile);
/** Payload's Drizzle destroy resets adapter metadata but does not close its pg pool. */
export async function destroyCmsPayload(payload: Payload | undefined): Promise<void> {
  if (!payload) return;
  const sessions = Object.keys(payload.db.sessions ?? {});
  let invalidCheckouts = false;
  try {
    // Explicitly release abandoned transactions, but report them as failures.
    await Promise.all(sessions.map((id) => payload.db.rollbackTransaction(id)));
    await payload.destroy();
  } finally {
    // Payload 3.92.1's Postgres adapter checks out a reconnect-listener client
    // without ever releasing it. Drizzle's destroy also leaves the pool open.
    // Reclaim that one known client; report any other outstanding checkout.
    const pool = payload.db.pool as unknown as { _clients: PoolClient[]; _idle: Array<{ client: PoolClient }> };
    const idle = new Set(pool._idle.map(({ client }) => client));
    const checkedOut = pool._clients.filter((client) => !idle.has(client));
    const reconnectClients = checkedOut.filter((client) =>
      client.listeners("error").some((listener) => String(listener).includes("connectWithReconnect")),
    );
    invalidCheckouts = checkedOut.length !== 1 || reconnectClients.length !== 1;
    for (const client of checkedOut) client.release();
    await payload.db.pool.end();
  }
  if (sessions.length || invalidCheckouts) {
    throw new Error(`CMS fixture found ${sessions.length} unclosed transaction(s) or unexpected Postgres adapter checkouts.`);
  }
}


export interface CmsFixture {
  prefix: string;
  blobs(): Promise<ListBlobResultBlob[]>;
  destroy(): Promise<void>;
}

/** Each file gets its own Docker database and a unique namespace in a dedicated test Blob store. */
export async function createCmsFixture(options: { realBlob?: boolean } = {}): Promise<CmsFixture> {
  const token = options.realBlob ? process.env.CMS_TEST_REAL_BLOB_READ_WRITE_TOKEN : process.env.CMS_TEST_BLOB_READ_WRITE_TOKEN;
  const store = options.realBlob ? process.env.CMS_TEST_REAL_BLOB_STORE_ID : process.env.CMS_TEST_BLOB_STORE_ID;
  if (!token || !store || !/^[a-z\d]+$/i.test(store) || !token.startsWith(`vercel_blob_rw_${store}_`)) {
    throw new Error(options.realBlob
      ? "Set CMS_TEST_REAL_BLOB_READ_WRITE_TOKEN and CMS_TEST_REAL_BLOB_STORE_ID to a dedicated real test store, never production."
      : "Set CMS_TEST_BLOB_READ_WRITE_TOKEN and CMS_TEST_BLOB_STORE_ID to the emulator or a dedicated test store, never production.");
  }
  const keys = ["DATABASE_URL", "BLOB_READ_WRITE_TOKEN", "PAYLOAD_SECRET", "VERCEL_BLOB_API_URL", "NEXT_PUBLIC_VERCEL_BLOB_API_URL", "STORAGE_VERCEL_BLOB_BASE_URL"] as const;
  const previous = keys.map((key) => process.env[key]);
  const prefix = `cms-test-${randomUUID()}-`;
  const name = `goodman-cms-test-${randomUUID()}`;
  const password = randomBytes(24).toString("hex");
  let started = false;
  try {
    await exec("docker", ["run", "--detach", "--rm", "--name", name, "-e", `POSTGRES_PASSWORD=${password}`, "-e", "POSTGRES_DB=goodman_test", "-p", "127.0.0.1::5432", "postgres:17-alpine"]);
    started = true;
    const { stdout } = await exec("docker", ["port", name, "5432/tcp"]);
    const port = stdout.trim().match(/:(\d+)$/)?.[1];
    if (!port) throw new Error("Docker did not report the disposable Postgres port.");
    const url = `postgresql://postgres:${password}@127.0.0.1:${port}/goodman_test`;
    let ready = false;
    for (let attempt = 0; attempt < 60; attempt++) {
      const client = new Client({ connectionString: url });
      try {
        await client.connect();
        ready = true;
      } catch {
        const { promise, resolve } = Promise.withResolvers<void>();
        setTimeout(resolve, 500);
        await promise;
      } finally {
        await client.end().catch(() => {});
      }
      if (ready) break;
    }
    if (!ready) throw new Error("Disposable Postgres did not become ready.");
    process.env.DATABASE_URL = url;
    process.env.BLOB_READ_WRITE_TOKEN = token;
    process.env.PAYLOAD_SECRET = "disposable-cms-integration-secret-at-least-32-characters";
    if (options.realBlob) {
      delete process.env.VERCEL_BLOB_API_URL;
      delete process.env.NEXT_PUBLIC_VERCEL_BLOB_API_URL;
      delete process.env.STORAGE_VERCEL_BLOB_BASE_URL;
    }
    async function blobs(): Promise<ListBlobResultBlob[]> {
      const entries: ListBlobResultBlob[] = [];
      let cursor: string | undefined;
      do {
        const page = await list({ token, prefix, cursor });
        entries.push(...page.blobs);
        cursor = page.hasMore ? page.cursor : undefined;
      } while (cursor);
      return entries;
    }
    return {
      prefix,
      blobs,
      async destroy() {
        try {
          const entries = await blobs();
          if (entries.length) await del(entries.map((entry) => entry.url), { token });
        } finally {
          try {
            try {
              await closeCmsMutationGatePool();
            } finally {
              await exec("docker", ["rm", "--force", name]);
            }
          } finally {
            keys.forEach((key, index) => {
              const value = previous[index];
              if (value === undefined) delete process.env[key];
              else process.env[key] = value;
            });
          }
        }
      },
    };
  } catch (error) {
    if (started) await exec("docker", ["rm", "--force", name]).catch(() => {});
    throw error;
  }
}
