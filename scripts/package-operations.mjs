import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { chmod, copyFile, link, lstat, mkdir, mkdtemp, readFile, readdir, readlink, realpath, rm, symlink, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import * as tar from 'tar';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const distRoot = join(projectRoot, 'dist');
const stageDir = join(distRoot, 'operations');
const requiredFiles = [
  'package.json',
  'package-lock.json',
  'tsconfig.json',
  'payload.config.ts',
  'scripts/cms-create-admin.ts',
  'scripts/cms-reset-password.ts',
  'scripts/cms-backup.mjs',
  'scripts/cms-restore.mjs',
];
const sourceDirectories = ['src'];
const packageJson = JSON.parse(await readFile(join(projectRoot, 'package.json'), 'utf8'));
const lockBytes = await readFile(join(projectRoot, 'package-lock.json'));
const expectedNpm = packageJson.packageManager?.match(/^npm@(.+)$/)?.[1];
const payloadVersion = packageJson.dependencies?.payload;

function fail(message) {
  throw new Error(message);
}

function sha256(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

function isExcluded(relativePath, entryName) {
  const lowerName = entryName.toLowerCase();
  const parts = relativePath.split(/[\\/]/);
  if (parts.some((part) => ['.git', '.next', 'node_modules', 'coverage', 'reports', '__tests__', '__mocks__', 'test', 'tests', 'uploads', 'backups', 'secrets'].includes(part.toLowerCase()))) return true;
  if (lowerName.startsWith('.env') || lowerName === '.npmrc' || lowerName === '.ds_store') return true;
  if (/\.(?:test|spec)\.[^.]+$/i.test(entryName) || /\.snap$/i.test(entryName)) return true;
  if (/\.(?:pem|key|p12|pfx|sqlite|sqlite3|db)(?:-(?:wal|shm|journal))?$/i.test(entryName)) return true;
  if (/\.(?:wal|shm|journal)$/i.test(entryName) || /\.(?:report|lcov)$/i.test(entryName)) return true;
  if (/\.secret(?:\.[^.]+)?$/i.test(entryName) || /^(?:secrets?|credentials?)(?:\.(?:json|ya?ml|toml|env|txt))?$/i.test(entryName) || /\.env$/i.test(entryName)) return true;
  return false;
}

async function copyTree(source, destination, relativePath = '') {
  const entries = await readdir(source, { withFileTypes: true });
  await mkdir(destination, { recursive: true });
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    const itemRelative = relativePath ? `${relativePath}/${entry.name}` : entry.name;
    const sourcePath = join(source, entry.name);
    const destinationPath = join(destination, entry.name);
    if (isExcluded(itemRelative, entry.name)) continue;
    const info = await lstat(sourcePath);
    if (info.isSymbolicLink()) {
      const target = await realpath(sourcePath);
      const fromRoot = relative(projectRoot, target);
      if (fromRoot.startsWith(`..${sep}`) || fromRoot === '..' || resolve(target) === resolve(projectRoot)) {
        fail(`Refusing source symlink outside the repository: ${itemRelative}`);
      }
      const linkText = await readlink(sourcePath);
      await symlink(linkText, destinationPath, info.isDirectory() ? 'dir' : 'file');
    } else if (info.isDirectory()) {
      await copyTree(sourcePath, destinationPath, itemRelative);
    } else if (info.isFile()) {
      await copyFile(sourcePath, destinationPath);
      await chmod(destinationPath, info.mode & 0o777);
    } else {
      fail(`Refusing unsupported source entry: ${itemRelative}`);
    }
  }
}


async function listMigrationChecksums(migrationRoot = join(projectRoot, 'src', 'migrations')) {
  const files = [];
  async function walk(directory, prefix = '') {
    for (const entry of (await readdir(directory, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name))) {
      const child = join(directory, entry.name);
      const childName = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        if (!['test', 'tests', '__tests__'].includes(entry.name.toLowerCase())) await walk(child, childName);
      } else if (entry.isFile() && /\.(?:ts|js|mjs|json)$/.test(entry.name) && !/\.(?:test|spec)\.[^.]+$/i.test(entry.name)) {
        files.push({ path: `src/migrations/${childName}`, sha256: sha256(await readFile(child)) });
      }
    }
  }
  try {
    await walk(migrationRoot);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  if (!files.some((file) => file.path === 'src/migrations/index.ts')) fail('src/migrations/index.ts is required in the operations package.');
  return files;
}

async function getNpmCli() {
  const cliPath = process.env.npm_execpath;
  if (cliPath) {
    const result = spawnSync(process.execPath, [cliPath, '--version'], { cwd: projectRoot, encoding: 'utf8' });
    if (result.status !== 0) fail(`Unable to query repository npm: ${result.stderr || result.error?.message || 'unknown error'}`);
    return { executable: process.execPath, prefixArgs: [cliPath], version: result.stdout.trim() };
  }
  const result = spawnSync('npm', ['--version'], { cwd: projectRoot, encoding: 'utf8' });
  if (result.status !== 0) fail(`Unable to query npm: ${result.stderr || result.error?.message || 'unknown error'}`);
  return { executable: 'npm', prefixArgs: [], version: result.stdout.trim() };
}

async function assertNativeDependencies() {
  const temporaryRoot = await mkdtemp(join(tmpdir(), 'goodman-operations-check-'));
  let client;
  try {
    const require = createRequire(join(stageDir, 'package.json'));
    const sharp = require('sharp');
    await sharp({ create: { width: 1, height: 1, channels: 3, background: '#000000' } }).png().toBuffer();
    const { createClient } = require('@libsql/client');
    client = createClient({ url: pathToFileURL(join(temporaryRoot, 'native-check.sqlite')).href });
    const result = await client.execute('SELECT 1 AS native_dependency_check');
    if (Number(result.rows?.[0]?.native_dependency_check) !== 1) fail('libSQL did not return the expected local query result.');
  } finally {
    client?.close();
    await rm(temporaryRoot, { recursive: true, force: true });
  }
}

function sourceRevision() {
  const revision = process.env.SOURCE_REVISION || process.env.GITHUB_SHA || process.env.GIT_COMMIT || 'unrecorded';
  return revision.trim().slice(0, 128);
}

function releaseIdentifier(source) {
  const generated = new Date().toISOString().replace(/[-:.]/g, '').replace('T', '-').replace('Z', 'Z');
  const value = process.env.RELEASE_ID || (source !== 'unrecorded' ? source.slice(0, 12) : `source-${generated}`);
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/.test(value)) fail('RELEASE_ID must use only letters, numbers, dot, underscore or hyphen.');
  return value;
}

async function main() {
  if (process.versions.node.split('.')[0] !== '24' || Number(process.versions.node.split('.')[1]) < 22 || (Number(process.versions.node.split('.')[1]) === 22 && Number(process.versions.node.split('.')[2]) < 1)) {
    fail('Operations packaging requires the supported Node 24.22.1+ runtime.');
  }
  if (!expectedNpm) fail('package.json must pin npm through its packageManager field.');
  const npm = await getNpmCli();
  if (npm.version !== expectedNpm) fail(`Expected npm ${expectedNpm} from packageManager, found ${npm.version}. Run packaging with the pinned npm release.`);
  if (!payloadVersion) fail('package.json must declare the production Payload version.');
  for (const path of requiredFiles) {
    try {
      const info = await lstat(join(projectRoot, path));
      if (!info.isFile()) fail(`${path} must be a regular file.`);
    } catch (error) {
      if (error.code === 'ENOENT') fail(`Required operations package input is missing: ${path}`);
      throw error;
    }
  }
  for (const path of sourceDirectories) {
    const info = await lstat(join(projectRoot, path));
    if (!info.isDirectory()) fail(`${path} must be a directory.`);
  }
  const source = sourceRevision();
  const releaseId = releaseIdentifier(source);
  const archiveName = `operations-${releaseId}.tar.gz`;
  const archivePath = join(distRoot, archiveName);
  const checksumPath = `${archivePath}.sha256`;
  try {
    const distInfo = await lstat(distRoot);
    if (distInfo.isSymbolicLink() || !distInfo.isDirectory()) fail(`Refusing to write operations artifacts through a non-directory dist path: ${distRoot}`);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    await mkdir(distRoot, { recursive: true });
  }
  for (const output of [archivePath, checksumPath]) {
    try {
      await lstat(output);
      fail(`Refusing to overwrite existing operations artifact: ${relative(projectRoot, output)}`);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }
  try {
    const stageInfo = await lstat(stageDir);
    if (stageInfo.isSymbolicLink() || !stageInfo.isDirectory()) fail(`Refusing to clean non-directory operations staging path: ${stageDir}`);
    await rm(stageDir, { recursive: true, force: true });
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  await mkdir(stageDir, { recursive: true });
  for (const file of ['package.json', 'package-lock.json', 'tsconfig.json', 'payload.config.ts']) {
    await copyFile(join(projectRoot, file), join(stageDir, file));
  }
  for (const script of requiredFiles.filter((file) => file.startsWith('scripts/'))) {
    const output = join(stageDir, script);
    await mkdir(dirname(output), { recursive: true });
    await copyFile(join(projectRoot, script), output);
  }
  await copyTree(join(projectRoot, 'src'), join(stageDir, 'src'));

  const immutableChecksums = new Map();
  for (const file of ['package.json', 'package-lock.json', 'tsconfig.json']) {
    immutableChecksums.set(file, sha256(await readFile(join(stageDir, file))));
  }
  const npmArgs = [...npm.prefixArgs, 'ci', '--omit=dev', '--include=optional'];
  const install = spawnSync(npm.executable, npmArgs, { cwd: stageDir, stdio: 'inherit', env: process.env });
  if (install.error) throw install.error;
  if (install.status !== 0) fail(`Pinned npm ci failed with status ${install.status ?? 'unknown'}.`);
  for (const [file, expected] of immutableChecksums) {
    if (sha256(await readFile(join(stageDir, file))) !== expected) fail(`npm ci changed the staged ${file}; the release manifest and lock must remain unchanged.`);
  }
  await assertNativeDependencies();

  const migrationChecksums = await listMigrationChecksums(join(stageDir, 'src', 'migrations'));
  const libc = process.report?.getReport?.().header?.glibcVersionRuntime;
  const manifest = {
    formatVersion: 1,
    releaseId,
    sourceRevision: source,
    createdAt: new Date().toISOString(),
    lockfile: { path: 'package-lock.json', sha256: sha256(lockBytes) },
    runtime: { node: process.version, npm: npm.version, payload: payloadVersion },
    buildTarget: {
      platform: process.platform,
      architecture: process.arch,
      libc: libc ? `glibc ${libc}` : process.platform === 'linux' ? 'not reported by Node' : 'not applicable',
      nodeAbi: process.versions.modules,
    },
    migrations: migrationChecksums,
  };
  await writeFile(join(stageDir, 'release-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, { flag: 'wx', mode: 0o600 });
  const temporaryDirectory = await mkdtemp(join(distRoot, '.operations-archive-'));
  const temporaryArchivePath = join(temporaryDirectory, 'archive.tar.gz');
  try {
    await tar.create({ file: temporaryArchivePath, gzip: true, cwd: stageDir, portable: true, strict: true, mode: 0o600 }, ['.']);
    await link(temporaryArchivePath, archivePath);
  } finally {
    await rm(temporaryDirectory, { recursive: true, force: true });
  }
  const archiveHash = createHash('sha256');
  for await (const chunk of createReadStream(archivePath)) archiveHash.update(chunk);
  const digest = archiveHash.digest('hex');
  await writeFile(checksumPath, `${digest}  ${archiveName}\n`, { flag: 'wx', mode: 0o600 });
  console.log(`Operations package: ${relative(projectRoot, archivePath)}`);
  console.log(`SHA-256: ${digest}`);
  console.log(`Manifest: ${relative(projectRoot, join(stageDir, 'release-manifest.json'))}`);
  console.log(`Target: ${process.platform}/${process.arch}${libc ? ` (glibc ${libc})` : ''}; Node ${process.version}; npm ${npm.version}`);
}

await main();
