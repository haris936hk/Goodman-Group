// @vitest-environment node
import { spawn } from "node:child_process";
import { mkdtemp, mkdir, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

interface CliResult {
  code: number | null;
  stdout: string;
  stderr: string;
}

function runCmsRestore(env: Record<string, string>, args: string[] = []): Promise<CliResult> {
  const { promise, resolve, reject } = Promise.withResolvers<CliResult>();
  const cliScript = path.resolve("scripts/cms-restore.mjs");
  const child = spawn(process.execPath, [cliScript, ...args], {
    env: {
      ...process.env,
      ...env,
    },
    stdio: ["pipe", "pipe", "pipe"],
  });

  let stdout = "";
  let stderr = "";
  child.stdout.on("data", (chunk: Buffer) => {
    stdout += chunk.toString("utf8");
  });
  child.stderr.on("data", (chunk: Buffer) => {
    stderr += chunk.toString("utf8");
  });
  child.on("error", reject);
  child.on("close", (code) => {
    resolve({ code, stdout, stderr });
  });
  return promise;
}

describe("CMS restore operations canonical overlap protection", () => {
  let root: string;
  let realDir: string;
  let aliasDir: string;

  beforeAll(async () => {
    root = await mkdtemp(path.join(tmpdir(), "goodman-restore-ops-test-"));
    realDir = path.join(root, "real");
    aliasDir = path.join(root, "alias");
    await mkdir(realDir, { recursive: true, mode: 0o700 });
    await symlink(realDir, aliasDir, "dir");
  });

  afterAll(async () => {
    if (root) await rm(root, { recursive: true, force: true });
  });

  it("rejects physically overlapping database and uploads paths configured through parent-directory aliases before confirmation", async () => {
    const uploadsDir = path.join(realDir, "uploads");
    await mkdir(uploadsDir, { recursive: true, mode: 0o700 });
    const dbFile = path.join(uploadsDir, "blog.sqlite");
    await writeFile(dbFile, "");

    // Lexically, paths differ: realDir/uploads/blog.sqlite vs aliasDir/uploads
    const databaseUrl = `file:${dbFile}`;
    const uploadDir = path.join(aliasDir, "uploads");

    const result = await runCmsRestore({
      DATABASE_URL: databaseUrl,
      UPLOAD_DIR: uploadDir,
    });

    const output = `${result.stdout}\n${result.stderr}`;
    expect(result.code).toBe(1);
    expect(output).toContain("DATABASE_URL and UPLOAD_DIR must not overlap.");
    // Assert rejection happens before any confirmation prompts or cutover
    expect(output).not.toContain("Type RESTORE");
    expect(output).not.toContain("Confirm the web app");
    expect(output).not.toContain("This maintenance command requires an interactive terminal");
  });

  it("rejects database nested under uploads when database uses parent alias before confirmation", async () => {
    const uploadsDir = path.join(realDir, "shared_uploads");
    await mkdir(uploadsDir, { recursive: true, mode: 0o700 });
    const dbFile = path.join(aliasDir, "shared_uploads", "blog.sqlite");
    await writeFile(path.join(uploadsDir, "blog.sqlite"), "");

    const databaseUrl = `file:${dbFile}`;
    const uploadDir = uploadsDir;

    const result = await runCmsRestore({
      DATABASE_URL: databaseUrl,
      UPLOAD_DIR: uploadDir,
    });

    const output = `${result.stdout}\n${result.stderr}`;
    expect(result.code).toBe(1);
    expect(output).toContain("DATABASE_URL and UPLOAD_DIR must not overlap.");
    expect(output).not.toContain("Type RESTORE");
    expect(output).not.toContain("Confirm the web app");
    expect(output).not.toContain("This maintenance command requires an interactive terminal");
  });

  it("rejects backup set overlapping live upload target through an aliased path", async () => {
    const dataDir = path.join(realDir, "isolated_data");
    const uploadsDir = path.join(realDir, "isolated_uploads");
    const nestedBackup = path.join(uploadsDir, "backups", "snap-1");
    await mkdir(dataDir, { recursive: true, mode: 0o700 });
    await mkdir(nestedBackup, { recursive: true, mode: 0o700 });
    await writeFile(path.join(dataDir, "blog.sqlite"), "");

    // Backup set is passed through aliasDir, pointing inside uploadsDir
    const aliasedBackup = path.join(aliasDir, "isolated_uploads", "backups", "snap-1");

    const result = await runCmsRestore(
      {
        DATABASE_URL: `file:${path.join(dataDir, "blog.sqlite")}`,
        UPLOAD_DIR: uploadsDir,
      },
      [aliasedBackup]
    );

    const output = `${result.stdout}\n${result.stderr}`;
    expect(result.code).toBe(1);
    expect(output).toContain("Backup set must be separate from the live database and uploads paths.");
    expect(output).not.toContain("Type RESTORE");
    expect(output).not.toContain("Confirm the web app");
  });

  it("preserves direct symlink target rejection for database target", async () => {
    const targetDir = path.join(realDir, "symlink_test");
    await mkdir(targetDir, { recursive: true, mode: 0o700 });
    const realDb = path.join(targetDir, "actual.sqlite");
    const symlinkDb = path.join(targetDir, "link.sqlite");
    const safeUploads = path.join(targetDir, "safe_uploads");
    await writeFile(realDb, "");
    await mkdir(safeUploads, { recursive: true, mode: 0o700 });
    await symlink(realDb, symlinkDb, "file");

    const result = await runCmsRestore({
      DATABASE_URL: `file:${symlinkDb}`,
      UPLOAD_DIR: safeUploads,
    });

    const output = `${result.stdout}\n${result.stderr}`;
    expect(result.code).toBe(1);
    expect(output).toContain("Live database target is not a regular file");
  });

  it("preserves direct symlink target rejection for uploads target", async () => {
    const targetDir = path.join(realDir, "symlink_test_uploads");
    await mkdir(targetDir, { recursive: true, mode: 0o700 });
    const realUploads = path.join(targetDir, "actual_uploads");
    const symlinkUploads = path.join(targetDir, "link_uploads");
    const safeDb = path.join(targetDir, "safe.sqlite");
    await writeFile(safeDb, "");
    await mkdir(realUploads, { recursive: true, mode: 0o700 });
    await symlink(realUploads, symlinkUploads, "dir");

    const result = await runCmsRestore({
      DATABASE_URL: `file:${safeDb}`,
      UPLOAD_DIR: symlinkUploads,
    });

    const output = `${result.stdout}\n${result.stderr}`;
    expect(result.code).toBe(1);
    expect(output).toContain("Live uploads target is not a real directory");
  });

  it("supports missing live targets when non-overlapping", async () => {
    const nonExistentDb = path.join(realDir, "fresh_deploy", "blog.sqlite");
    const nonExistentUploads = path.join(realDir, "fresh_uploads");
    const nonExistentBackup = path.join(realDir, "fresh_backup_dir");

    // Both live targets do not exist yet. They are non-overlapping.
    // The CLI should NOT fail with "Live database target is not a regular file"
    // or "Live uploads target is not a real directory" or overlap errors.
    const result = await runCmsRestore(
      {
        DATABASE_URL: `file:${nonExistentDb}`,
        UPLOAD_DIR: nonExistentUploads,
      },
      [nonExistentBackup]
    );

    const output = `${result.stdout}\n${result.stderr}`;
    expect(result.code).toBe(1);
    // Should fail downstream when inspecting the non-existent backup manifest,
    // not during live target validation.
    expect(output).not.toContain("DATABASE_URL and UPLOAD_DIR must not overlap.");
    expect(output).not.toContain("Live database target is not a regular file");
    expect(output).not.toContain("Live uploads target is not a real directory");
    expect(output).toMatch(/manifest\.json|ENOENT/);
  });

  it("preserves release guards when database or uploads are within the release root", async () => {
    const inReleaseDb = path.join(process.cwd(), "in-release.sqlite");
    const safeUploads = path.join(realDir, "release_guard_uploads");
    await mkdir(safeUploads, { recursive: true, mode: 0o700 });

    const result = await runCmsRestore({
      DATABASE_URL: `file:${inReleaseDb}`,
      UPLOAD_DIR: safeUploads,
    });

    const output = `${result.stdout}\n${result.stderr}`;
    expect(result.code).toBe(1);
    expect(output).toContain("must be outside the replaceable release directory.");
  });
});
