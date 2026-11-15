import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { Client } from "pg";
import { getPayload, type Payload } from "payload";
import { withAdministratorMaintenance } from "../src/cms/administrator-maintenance";
import { readCmsEnvironment } from "../src/cms/environment";

const exec = promisify(execFile);

async function main(): Promise<void> {
  const environment = readCmsEnvironment();
  const container = process.env.CMS_TEST_POSTGRES_CONTAINER;
  const adminEmail = process.env.CMS_TEST_ADMIN_EMAIL;
  const adminPassword = process.env.CMS_TEST_ADMIN_PASSWORD;
  const testToken = process.env.CMS_TEST_BLOB_READ_WRITE_TOKEN;
  const store = process.env.CMS_TEST_BLOB_STORE_ID;
  if (!container || !/^[a-f0-9]{64}$/.test(container) || !adminEmail?.endsWith("@example.test") ||
      !adminPassword || adminPassword.length < 16 || !store || !/^[a-z\d]+$/i.test(store) ||
      !testToken?.startsWith(`vercel_blob_rw_${store}_`) || environment.blobToken !== testToken) {
    throw new Error("CMS test setup requires a disposable Docker container, dedicated test Blob store and @example.test administrator credentials.");
  }

  const url = new URL(environment.databaseUrl);
  const { stdout: inspection } = await exec("docker", ["inspect", container]);
  const [info] = JSON.parse(inspection);
  const binding = info.NetworkSettings?.Ports?.["5432/tcp"]?.[0];
  if (info.Id !== container || info.Config?.Image !== "postgres:17-alpine" ||
      info.Config?.Labels?.["goodman.cms.disposable"] !== "true" ||
      binding?.HostIp !== "127.0.0.1" || url.hostname !== "127.0.0.1" ||
      url.port !== binding.HostPort || url.username !== "postgres" ||
      url.pathname !== "/goodman_test" || url.search || url.hash) {
    throw new Error("CMS test setup refuses a database outside its labelled disposable Docker container.");
  }

  const client = new Client({ connectionString: environment.databaseUrl });
  await client.connect();
  try {
    const result = await client.query("SELECT 1 FROM pg_tables WHERE schemaname NOT IN ('pg_catalog', 'information_schema') LIMIT 1");
    if (result.rowCount !== 0) throw new Error("CMS test setup refuses a non-empty database.");
  } finally {
    await client.end();
  }

  let payload: Payload | undefined;
  try {
    // The config reads credentials at import time, after the safety checks above.
    const { default: config } = await import("../payload.config");
    payload = await getPayload({ config });
    await payload.db.migrate();
    const cmsPayload = payload;
    await withAdministratorMaintenance(() => cmsPayload.create({
      collection: "administrators",
      data: { email: adminEmail, password: adminPassword },
      overrideAccess: true,
    }));
    console.log("Disposable CMS database migrated and test administrator bootstrapped.");
  } finally {
    await payload?.destroy();
  }
}

await main();
