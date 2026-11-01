import { isAbsolute, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";
import { SITE_ORIGIN } from "../data/goodman-group";

export function readCmsEnvironment() {
  const { DATABASE_URL, UPLOAD_DIR, PAYLOAD_SECRET } = process.env;
  if (!DATABASE_URL?.startsWith("file:/") || !UPLOAD_DIR || !PAYLOAD_SECRET || PAYLOAD_SECRET.length < 32) {
    throw new Error("CMS requires an absolute file DATABASE_URL, absolute UPLOAD_DIR and PAYLOAD_SECRET of at least 32 characters.");
  }
  const databasePath = fileURLToPath(DATABASE_URL);
  for (const path of [databasePath, UPLOAD_DIR]) {
    if (!isAbsolute(path)) throw new Error("CMS persistent paths must be absolute.");
    const inside = relative(process.cwd(), path);
    if (!inside.startsWith("..") && !isAbsolute(inside)) {
      throw new Error("CMS persistent paths must be outside the release directory.");
    }
  }
  const testRoot = process.env.CMS_TEST_ROOT;
  const temporaryRelative = testRoot ? relative(tmpdir(), testRoot) : "..";
  const isolatedTest = Boolean(testRoot && isAbsolute(testRoot)
    && temporaryRelative !== ".." && !temporaryRelative.startsWith("../") && !isAbsolute(temporaryRelative)
    && databasePath === resolve(testRoot, "blog.sqlite") && UPLOAD_DIR === resolve(testRoot, "uploads"));
  return {
    databaseUrl: DATABASE_URL,
    uploadDir: UPLOAD_DIR,
    secret: PAYLOAD_SECRET,
    origins: process.env.NODE_ENV === "production" && !isolatedTest
      ? [SITE_ORIGIN]
      : [SITE_ORIGIN, "http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:4173", "http://127.0.0.1:4173"],
  };
}
