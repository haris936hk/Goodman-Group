import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { chmod, copyFile, lstat, mkdir, mkdtemp, readFile, readdir, realpath, rename, rm, stat, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, basename, join, relative, resolve, sep } from 'node:path';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import * as tar from 'tar';

const require = createRequire(import.meta.url);
const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
const releaseRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const backupFormatVersion = 1;
const sidecarSuffixes = ['-wal', '-shm', '-journal'];

export function fail(message) {
  throw new Error(message);
}

export function sha256Buffer(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

export async function sha256File(path) {
  const hash = createHash('sha256');
  for await (const chunk of createReadStream(path)) hash.update(chunk);
  return hash.digest('hex');
}

export function isWithin(parentPath, childPath) {
  const relativePath = relative(resolve(parentPath), resolve(childPath));
  return relativePath === '' || (relativePath !== '..' && !relativePath.startsWith(`..${sep}`));
}

async function canonicalizePath(path) {
  let cursor = resolve(path);
  const missing = [];
  while (true) {
    try {
      const actual = await realpath(cursor);
      return resolve(actual, ...missing.reverse());
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      const parent = dirname(cursor);
      if (parent === cursor) throw error;
      missing.push(cursor.slice(parent.length + 1));
      cursor = parent;
    }
  }
}

export async function assertOutsideRelease(path, label) {
  if (!path || !path.startsWith(sep)) fail(`${label} must be an absolute path.`);
  const actual = await canonicalizePath(path);
  const release = await realpath(releaseRoot);
  if (isWithin(release, actual)) fail(`${label} must be outside the replaceable release directory.`);
  return actual;
}

export function readCmsDataPaths() {
  const databaseUrl = process.env.DATABASE_URL;
  const uploadDir = process.env.UPLOAD_DIR;
  if (!databaseUrl?.startsWith('file:') || !uploadDir) fail('Set DATABASE_URL=file:/ABSOLUTE_PRIVATE_PATH/data/blog.sqlite and an absolute UPLOAD_DIR in the protected CMS environment.');
  let databasePath;
  try {
    const parsed = new URL(databaseUrl);
    if (parsed.protocol !== 'file:' || parsed.host || parsed.search || parsed.hash) fail('DATABASE_URL must be a local absolute file URL without query or fragment options.');
    databasePath = fileURLToPath(parsed);
  } catch (error) {
    if (error.message?.includes('DATABASE_URL')) throw error;
    fail(`DATABASE_URL is not a valid local file URL: ${error.message}`);
  }
  if (!databasePath.startsWith(sep) || !uploadDir.startsWith(sep)) fail('DATABASE_URL and UPLOAD_DIR must resolve to absolute filesystem paths.');
  const resolvedDatabasePath = resolve(databasePath);
  const databaseFilename = basename(resolvedDatabasePath);
  if (!databaseFilename || databaseFilename.includes('\\') || databaseFilename.includes('\0') || databaseFilename.includes('\n') || databaseFilename.includes('\r')) fail('DATABASE_URL must name a regular SQLite database file.');
  return { databasePath: resolvedDatabasePath, uploadDir: resolve(uploadDir) };
}

export async function promptLine(question) {
  if (!stdin.isTTY || !stdout.isTTY) fail('This maintenance command requires an interactive terminal; no confirmation was received.');
  const interfaceHandle = createInterface({ input: stdin, output: stdout });
  try {
    return (await interfaceHandle.question(question)).trim();
  } finally {
    interfaceHandle.close();
  }
}

export async function confirmWritersStopped() {
  const answer = await promptLine('Confirm the web app and every other database/upload writer are stopped. Type STOPPED to continue: ');
  if (answer !== 'STOPPED') fail('Operation cancelled; the required STOPPED confirmation did not match.');
}

async function copySafeTree(source, destination, prefix = '') {
  const info = await lstat(source);
  if (info.isSymbolicLink() || !info.isDirectory()) fail(`Uploads must be a real directory with no symlinks: ${source}`);
  await mkdir(destination, { recursive: true, mode: 0o700 });
  const files = [];
  const directories = prefix ? [prefix] : [];
  let totalBytes = 0;
  const entries = await readdir(source, { withFileTypes: true });
  for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
    if (entry.name === '.' || entry.name === '..' || entry.name.includes('\0') || entry.name.includes('\n') || entry.name.includes('\r') || entry.name.includes('\\')) fail(`Unsafe upload filename: ${entry.name}`);
    const sourcePath = join(source, entry.name);
    const destinationPath = join(destination, entry.name);
    const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;
    const entryInfo = await lstat(sourcePath);
    if (entryInfo.isSymbolicLink()) fail(`Uploads contain a symlink; refusing inconsistent backup: ${relativePath}`);
    if (entryInfo.isDirectory()) {
      const nested = await copySafeTree(sourcePath, destinationPath, relativePath);
      files.push(...nested.files);
      directories.push(...nested.directories);
      totalBytes += nested.bytes;
    } else if (entryInfo.isFile()) {
      await copyFile(sourcePath, destinationPath);
      await chmod(destinationPath, entryInfo.mode & 0o777);
      files.push({ path: relativePath, bytes: entryInfo.size, sha256: await sha256File(destinationPath) });
      totalBytes += entryInfo.size;
    } else {
      fail(`Uploads contain a non-regular file; refusing backup: ${relativePath}`);
    }
  }
  return { files, bytes: totalBytes, directories };
}

async function collectDatabaseFiles(sourcePath, destinationDirectory) {
  const names = [basename(sourcePath), ...sidecarSuffixes.map((suffix) => `${basename(sourcePath)}${suffix}`)];
  const files = [];
  for (const name of names) {
    const from = name === basename(sourcePath) ? sourcePath : `${sourcePath}${name.slice(basename(sourcePath).length)}`;
    try {
      const info = await lstat(from);
      if (info.isSymbolicLink() || !info.isFile()) fail(`Database set contains a non-regular file: ${from}`);
      const to = join(destinationDirectory, name);
      await copyFile(from, to);
      await chmod(to, info.mode & 0o600);
      files.push({ path: name, bytes: info.size, sha256: await sha256File(to) });
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }
  if (!files.some((file) => file.path === basename(sourcePath))) fail(`Database file does not exist: ${sourcePath}`);
  return files;
}

export async function checkDatabaseIntegrity(databasePath) {
  const { createClient } = require('@libsql/client');
  const client = createClient({ url: pathToFileURL(databasePath).href });
  try {
    const result = await client.execute('PRAGMA integrity_check');
    const rows = result.rows.map((row) => String(row.integrity_check ?? Object.values(row)[0] ?? ''));
    if (rows.length !== 1 || rows[0].toLowerCase() !== 'ok') fail(`SQLite integrity_check failed: ${rows.join('; ') || 'no result'}`);
  } finally {
    client.close();
  }
}

async function appliedMigrations(databasePath) {
  const { createClient } = require('@libsql/client');
  const client = createClient({ url: pathToFileURL(databasePath).href });
  try {
    const tables = await client.execute("SELECT name FROM sqlite_master WHERE type = 'table' AND name IN ('payload_migrations', '_payload_migrations')");
    const migrations = [];
    for (const entry of tables.rows) {
      const table = String(entry.name);
      const columns = await client.execute(`PRAGMA table_info('${table}')`);
      const names = columns.rows.map((row) => String(row.name));
      const key = names.includes('name') ? 'name' : names.includes('id') ? 'id' : null;
      if (!key) continue;
      const rows = await client.execute(`SELECT "${key}" AS migration FROM "${table}" ORDER BY "${key}"`);
      migrations.push(...rows.rows.map((row) => String(row.migration)));
    }
    return [...new Set(migrations)].sort();
  } finally {
    client.close();
  }
}

export async function createSnapshotArchive(snapshotRoot, archivePath) {
  await tar.create({
    file: archivePath,
    gzip: true,
    cwd: snapshotRoot,
    portable: true,
    strict: true,
    mode: 0o600,
    filter(path, entry) {
      if (!entry.isFile() && !entry.isDirectory()) fail(`Refusing to archive a symlink or non-regular entry: ${path}`);
      return true;
    },
  }, ['database', 'uploads']);
}

async function hashFilesInDirectory(root, relativeRoot = '') {
  const files = [];
  let bytes = 0;
  for (const entry of (await readdir(root, { withFileTypes: true })).sort((left, right) => left.name.localeCompare(right.name))) {
    const path = join(root, entry.name);
    const relativePath = relativeRoot ? `${relativeRoot}/${entry.name}` : entry.name;
    const info = await lstat(path);
    if (info.isSymbolicLink()) fail(`Snapshot contains a symlink: ${relativePath}`);
    if (info.isDirectory()) {
      const nested = await hashFilesInDirectory(path, relativePath);
      files.push(...nested.files);
      bytes += nested.bytes;
    } else if (info.isFile()) {
      files.push({ path: relativePath, bytes: info.size, sha256: await sha256File(path) });
      bytes += info.size;
    } else {
      fail(`Snapshot contains a non-regular file: ${relativePath}`);
    }
  }
  return { files, bytes };
}

async function appliedReleaseId() {
  const explicit = process.env.RELEASE_ID || process.env.SOURCE_REVISION || process.env.GIT_COMMIT;
  if (explicit) return explicit.slice(0, 128);
  try {
    const manifest = JSON.parse(await readFile(join(releaseRoot, 'release-manifest.json'), 'utf8'));
    return typeof manifest.releaseId === 'string' ? manifest.releaseId : 'unrecorded';
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    return 'unrecorded';
  }
}

async function validateDestination(destination, paths) {
  if (!destination.startsWith(sep)) fail('Backup destination must be an absolute path supplied by the operator.');
  const canonicalDestination = await assertOutsideRelease(destination, 'Backup destination');
  for (const active of [paths.databasePath, paths.uploadDir]) {
    const canonicalActive = await canonicalizePath(active);
    if (isWithin(canonicalActive, canonicalDestination) || isWithin(canonicalDestination, canonicalActive)) {
      fail('Backup destination must be separate from both live database and uploads paths.');
    }
  }
  try {
    await lstat(destination);
    fail(`Backup destination already exists: ${destination}`);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  return canonicalDestination;
}

async function makeBackup(destination, paths) {
  const backupId = basename(destination);
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/.test(backupId)) fail('Backup directory name must use letters, numbers, dot, underscore or hyphen.');
  const destinationParent = dirname(destination);
  await mkdir(destinationParent, { recursive: true, mode: 0o700 });
  const workRoot = await mkdtemp(join(destinationParent, `.${backupId}.staging-`));
  await chmod(workRoot, 0o700);
  try {
    const snapshotRoot = join(workRoot, 'snapshot');
    const databaseSnapshot = join(snapshotRoot, 'database');
    const uploadsSnapshot = join(snapshotRoot, 'uploads');
    await mkdir(databaseSnapshot, { recursive: true, mode: 0o700 });
    await mkdir(uploadsSnapshot, { recursive: true, mode: 0o700 });
    await collectDatabaseFiles(paths.databasePath, databaseSnapshot);
    const copiedUploads = await copySafeTree(paths.uploadDir, uploadsSnapshot);
    await checkDatabaseIntegrity(join(databaseSnapshot, basename(paths.databasePath)));
    const migrationIdentifiers = await appliedMigrations(join(databaseSnapshot, basename(paths.databasePath)));
    const verifiedDatabaseFiles = await hashFilesInDirectory(databaseSnapshot);
    const verifiedUploads = await hashFilesInDirectory(uploadsSnapshot);
    const sourceReleaseId = await appliedReleaseId();
    const archiveName = 'snapshot.tar.gz';
    const archivePath = join(workRoot, archiveName);
    await createSnapshotArchive(snapshotRoot, archivePath);
    const archiveHash = await sha256File(archivePath);
    const manifest = {
      formatVersion: backupFormatVersion,
      backupId,
      createdAt: new Date().toISOString(),
      sourceReleaseId,
      runtime: { node: process.version, payload: packageJson.dependencies?.payload ?? 'unknown' },
      migrations: migrationIdentifiers,
      database: {
        filename: basename(paths.databasePath),
        integrityCheck: 'ok',
        files: verifiedDatabaseFiles.files,
        bytes: verifiedDatabaseFiles.bytes,
      },
      uploads: {
        files: verifiedUploads.files,
        directories: copiedUploads.directories,
        count: verifiedUploads.files.length,
        bytes: verifiedUploads.bytes,
      },
      archive: { filename: archiveName, bytes: (await stat(archivePath)).size, sha256: archiveHash },
    };
    const manifestBytes = Buffer.from(`${JSON.stringify(manifest, null, 2)}\n`);
    await writeFile(join(workRoot, 'manifest.json'), manifestBytes, { flag: 'wx', mode: 0o600 });
    await writeFile(join(workRoot, `${archiveName}.sha256`), `${archiveHash}  ${archiveName}\n`, { flag: 'wx', mode: 0o600 });
    await writeFile(join(workRoot, 'manifest.json.sha256'), `${sha256Buffer(manifestBytes)}  manifest.json\n`, { flag: 'wx', mode: 0o600 });
    await rm(snapshotRoot, { recursive: true, force: true });
    await rename(workRoot, destination);
    console.log(`Backup set created: ${destination}`);
    console.log(`Archive: ${join(destination, archiveName)}`);
    console.log(`Archive SHA-256: ${archiveHash}`);
    console.log(`Manifest: ${join(destination, 'manifest.json')}`);
    console.log(`Database files: ${verifiedDatabaseFiles.files.length}; upload files: ${verifiedUploads.files.length}; upload bytes: ${verifiedUploads.bytes}`);
    console.log(`Applied migrations: ${migrationIdentifiers.length ? migrationIdentifiers.join(', ') : '(none recorded)'}`);
    console.log('Keep the application stopped until this matched database/uploads snapshot is complete; then restart and check Blog, admin and images.');
  } catch (error) {
    await rm(workRoot, { recursive: true, force: true });
    throw error;
  }
}

async function main() {
  const paths = readCmsDataPaths();
  await assertOutsideRelease(paths.databasePath, 'DATABASE_URL');
  await assertOutsideRelease(paths.uploadDir, 'UPLOAD_DIR');
  const destinationInput = process.argv[2] || await promptLine('Enter a new absolute private backup-set directory: ');
  if (!destinationInput.startsWith(sep)) fail('Backup destination must be an absolute path supplied by the operator.');
  const canonicalDestination = await validateDestination(resolve(destinationInput), paths);
  await confirmWritersStopped();
  await makeBackup(canonicalDestination, paths);
}

const invokedPath = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : '';
if (invokedPath === import.meta.url) {
  main().catch((error) => {
    console.error(`CMS backup failed: ${error.message}`);
    process.exitCode = 1;
  });
}
