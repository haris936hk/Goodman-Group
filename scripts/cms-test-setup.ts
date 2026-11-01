import { chmod, lstat, mkdir, realpath, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getPayload, type Payload } from "payload";
import { withAdministratorMaintenance } from "../src/cms/administrator-maintenance";
import { readCmsEnvironment } from "../src/cms/environment";

function isWithinOrEqual(parent: string, candidate: string): boolean {
  const relativePath = path.relative(parent, candidate);
  return relativePath === "" || (
    relativePath !== ".."
    && !relativePath.startsWith(`..${path.sep}`)
    && !path.isAbsolute(relativePath)
  );
}

async function pathExists(candidate: string): Promise<boolean> {
  try {
    await lstat(candidate);
    return true;
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") return false;
    throw error;
  }
}

async function main(): Promise<void> {
  const environment = readCmsEnvironment();
  const configuredRoot = process.env.CMS_TEST_ROOT;
  const adminEmail = process.env.CMS_TEST_ADMIN_EMAIL;
  const adminPassword = process.env.CMS_TEST_ADMIN_PASSWORD;

  if (!configuredRoot || !adminEmail?.endsWith("@example.test") || !adminPassword || adminPassword.length < 16) {
    throw new Error("CMS test setup requires CMS_TEST_ROOT and disposable @example.test administrator credentials.");
  }

  const root = path.resolve(configuredRoot);
  const databasePath = path.resolve(fileURLToPath(environment.databaseUrl));
  const uploadDirectory = path.resolve(environment.uploadDir);
  if (databasePath !== path.join(root, "blog.sqlite") || uploadDirectory !== path.join(root, "uploads")) {
    throw new Error("CMS test setup refuses paths other than CMS_TEST_ROOT/blog.sqlite and CMS_TEST_ROOT/uploads.");
  }

  const temporaryCandidates = [...new Set([tmpdir(), process.env.RUNNER_TEMP].filter((value): value is string => Boolean(value)))];
  const temporaryRoots = await Promise.all(temporaryCandidates.map((candidate) => realpath(candidate)));
  const rootParent = await realpath(path.dirname(root));
  if (!temporaryRoots.some((temporaryRoot) => isWithinOrEqual(temporaryRoot, rootParent))) {
    throw new Error(`CMS test setup refuses non-temporary CMS_TEST_ROOT: ${root}`);
  }
  if (await pathExists(root)) {
    throw new Error(`CMS test setup refuses an existing directory; use a fresh disposable temporary path: ${root}`);
  }

  await mkdir(root, { mode: 0o700 });
  let payload: Payload | undefined;
  try {
    const canonicalRoot = await realpath(root);
    if (!temporaryRoots.some((temporaryRoot) => isWithinOrEqual(temporaryRoot, canonicalRoot))) {
      throw new Error(`CMS test setup refuses a temporary path resolving outside the system temp directory: ${root}`);
    }

    await mkdir(uploadDirectory, { mode: 0o700 });
    await chmod(root, 0o700);
    await chmod(uploadDirectory, 0o700);

    // Load config only after validating that every CMS path is disposable and outside the checkout.
    const { default: config } = await import("../payload.config");
    const cmsPayload = await getPayload({ config });
    payload = cmsPayload;
    await cmsPayload.db.migrate();

    const existingAdministrators = await cmsPayload.find({
      collection: "administrators",
      limit: 1,
      overrideAccess: true,
    });
    if (existingAdministrators.docs.length !== 0) {
      throw new Error("CMS test setup refuses to bootstrap an administrator into a non-empty account collection.");
    }

    await withAdministratorMaintenance(() => cmsPayload.create({
      collection: "administrators",
      data: { email: adminEmail, password: adminPassword },
      overrideAccess: true,
    }));
    await chmod(databasePath, 0o600);
    console.log(`CMS test database migrated and disposable administrator bootstrapped under ${canonicalRoot}`);
  } catch (error) {
    await payload?.destroy();
    await rm(root, { recursive: true, force: true });
    throw error;
  }

  if (payload) await payload.destroy();
}

await main();
