import { AsyncLocalStorage } from "node:async_hooks";
import { randomUUID } from "node:crypto";
import { Pool } from "pg";
import { cmsDatabasePoolConfig } from "./database-connection";

interface MutationScope {
  active: boolean;
  pending: Set<Promise<unknown>>;
}

interface MutationGate {
  scope: AsyncLocalStorage<MutationScope>;
  pool?: Pool;
  users: number;
}

const gateKey = Symbol.for("goodman.cms.mutation-gate");
const globals = globalThis as typeof globalThis & {
  [gateKey]?: MutationGate;
};
const gate = globals[gateKey] ??= {
  scope: new AsyncLocalStorage<MutationScope>(),
  users: 0,
};

const lockWaitMs = 10_000;
const lockPollMs = 100;

function lockPool(): Pool {
  if (!gate.pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString || !/^postgres(?:ql)?:\/\//.test(connectionString)) {
      throw new Error("CMS mutation gate requires a Postgres DATABASE_URL.");
    }
    gate.pool = new Pool({
      ...cmsDatabasePoolConfig(connectionString),
      max: 2,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 5_000,
      query_timeout: 5_000,
    });
    // pg removes a failed idle client from the pool; later queries reconnect.
    // Do not log the client or error object, which can contain credentials.
    gate.pool.on("error", () => {
      console.error("CMS mutation gate: an idle Postgres connection failed.");
    });
  }
  return gate.pool;
}

async function acquireLock(token: string): Promise<void> {
  const deadline = Date.now() + lockWaitMs;
  const pool = lockPool();
  for (;;) {
    if (Date.now() >= deadline) throw new Error("Timed out waiting for the CMS mutation lock.");
    // Each statement commits independently, so transaction-pooling proxies are safe.
    // An ambiguous insert failure may leave a stale row, intentionally failing closed.
    const result = await pool.query(
      "INSERT INTO cms_mutation_lock (id, token) VALUES (1, $1) ON CONFLICT (id) DO NOTHING RETURNING id",
      [token],
    );
    if (result.rowCount === 1) return;
    const remaining = deadline - Date.now();
    if (remaining <= 0) throw new Error("Timed out waiting for the CMS mutation lock.");
    const { promise, resolve } = Promise.withResolvers<void>();
    setTimeout(resolve, Math.min(lockPollMs, remaining));
    await promise;
  }
}

async function releaseLock(token: string): Promise<void> {
  const result = await lockPool().query(
    "DELETE FROM cms_mutation_lock WHERE id = 1 AND token = $1",
    [token],
  );
  if (result.rowCount !== 1) throw new Error("CMS mutation lock ownership was lost.");
}

/** Only server-owned async scope, never request data, grants mutation authority. */
export function assertCmsMutationScope(): void {
  if (!gate.scope.getStore()?.active) {
    throw new Error("CMS mutations require withCmsMutation.");
  }
}

/** Close the idle pool during shutdown, after callers have stopped scheduling mutations. */
export async function closeCmsMutationGatePool(): Promise<void> {
  if (gate.users) throw new Error("Cannot close the CMS mutation pool while mutations are active.");
  const pool = gate.pool;
  gate.pool = undefined;
  if (pool) await pool.end();
}

/**
 * Serialize the complete awaited operation across instances; nested operations
 * reuse its scope. A crashed owner leaves the durable lock in place. Operators
 * must confirm the owner has stopped before manually deleting the lock row.
 */
export async function withCmsMutation<T>(operation: () => Promise<T>): Promise<T> {
  const current = gate.scope.getStore();
  if (current?.active) {
    const pending = operation();
    current.pending.add(pending);
    void pending.then(
      () => current.pending.delete(pending),
      () => current.pending.delete(pending),
    );
    return pending;
  }

  gate.users++;
  try {
    const token = randomUUID();
    await acquireLock(token);
    const scope: MutationScope = { active: true, pending: new Set() };
    try {
      return await gate.scope.run(scope, operation);
    } finally {
      // Nested calls may have been started without awaiting them. Do not release
      // while any call that inherited this authority can still be mutating.
      while (scope.pending.size) await Promise.allSettled([...scope.pending]);
      scope.active = false;
      await releaseLock(token);
    }
  } finally {
    gate.users--;
  }
}
