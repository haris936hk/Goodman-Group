import { randomUUID } from 'node:crypto';
import { chmod, copyFile, lstat, mkdir, mkdtemp, readFile, readdir, rename, rm, writeFile } from 'node:fs/promises';
import { dirname, basename, join, resolve, sep } from 'node:path';
import * as tar from 'tar';
import { pathToFileURL } from 'node:url';
import {
  assertOutsideRelease,
  checkDatabaseIntegrity,
  confirmWritersStopped,
  fail,
  isWithin,
  promptLine,
  readCmsDataPaths,
  sha256Buffer,
  sha256File,
} from './cms-backup.mjs';

const sidecarSuffixes = ['-wal', '-shm', '-journal'];
const checksumPattern = /^([a-f0-9]{64})\s+(.+)\s*$/;

function safeRelativePath(value, label) {
  if (typeof value !== 'string' || value.length === 0 || value.includes('\0') || value.includes('\n') || value.includes('\r') || value.includes('\\') || value.startsWith('/')) {
    fail(`${label} contains an unsafe path.`);
  }
  const components = value.split('/');
  if (components.some((component) => component === '' || component === '.' || component === '..')) fail(`${label} contains an unsafe path component.`);
  return components;
}

function assertSha256(value, label) {
  if (typeof value !== 'string' || !/^[a-f0-9]{64}$/.test(value)) fail(`${label} is not a SHA-256 checksum.`);
}

function verifyManifest(manifest) {
  if (!manifest || typeof manifest !== 'object' || Array.isArray(manifest) || manifest.formatVersion !== 1) fail('Unsupported or malformed backup manifest.');
  if (typeof manifest.backupId !== 'string' || !/^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/.test(manifest.backupId)) fail('Backup manifest has an invalid backupId.');
  if (typeof manifest.createdAt !== 'string' || !Number.isFinite(Date.parse(manifest.createdAt))) fail('Backup manifest has an invalid timestamp.');
  if (!manifest.database || typeof manifest.database !== 'object' || !manifest.uploads || typeof manifest.uploads !== 'object' || !manifest.archive || typeof manifest.archive !== 'object') fail('Backup manifest is missing the database, uploads or archive record.');
  const filename = manifest.database.filename;
  if (typeof filename !== 'string' || filename.length === 0 || filename !== basename(filename) || filename.includes('/') || filename.includes('\\') || filename.includes('\0') || filename.includes('\n') || filename.includes('\r') || filename === '.' || filename === '..') fail('Backup manifest database filename is unsafe.');
  if (manifest.database.integrityCheck !== 'ok') fail('Backup manifest does not record a successful SQLite integrity check.');
  if (!Array.isArray(manifest.database.files) || manifest.database.files.length < 1 || !Array.isArray(manifest.uploads.files)) fail('Backup manifest file lists are malformed.');
  const databasePaths = new Set();
  let databaseBytes = 0;
  for (const file of manifest.database.files) {
    if (!file || typeof file !== 'object') fail('Backup manifest contains a malformed database file entry.');
    const path = file.path;
    const allowed = path === filename || sidecarSuffixes.some((suffix) => path === `${filename}${suffix}`);
    if (!allowed || databasePaths.has(path)) fail('Backup manifest contains an unexpected database sidecar.');
    if (!Number.isSafeInteger(file.bytes) || file.bytes < 0) fail(`Invalid file size for database/${path}.`);
    assertSha256(file.sha256, `database/${path}`);
    databasePaths.add(path);
    databaseBytes += file.bytes;
    if (!Number.isSafeInteger(databaseBytes)) fail('Backup manifest database byte total exceeds the supported range.');
  }
  if (!databasePaths.has(filename) || !Number.isSafeInteger(manifest.database.bytes) || databaseBytes !== manifest.database.bytes) fail('Backup manifest database file list is incomplete or its byte total is inconsistent.');
  const uploadPaths = new Set();
  let uploadBytes = 0;
  for (const file of manifest.uploads.files) {
    if (!file || typeof file !== 'object') fail('Backup manifest contains a malformed upload file entry.');
    const components = safeRelativePath(file.path, 'Upload path');
    if (uploadPaths.has(file.path)) fail(`Backup manifest contains duplicate upload path ${file.path}.`);
    if (!Number.isSafeInteger(file.bytes) || file.bytes < 0) fail(`Invalid size for upload ${file.path}.`);
    assertSha256(file.sha256, `uploads/${file.path}`);
    uploadPaths.add(file.path);
    uploadBytes += file.bytes;
    if (!Number.isSafeInteger(uploadBytes)) fail('Backup manifest upload byte total exceeds the supported range.');
    if (components.length === 0) fail('Backup manifest contains an empty upload path.');
  }
  if (!Number.isSafeInteger(manifest.uploads.count) || manifest.uploads.count !== manifest.uploads.files.length || !Number.isSafeInteger(manifest.uploads.bytes) || manifest.uploads.bytes !== uploadBytes) fail('Backup manifest upload totals are inconsistent.');
  if (manifest.uploads.directories !== undefined && !Array.isArray(manifest.uploads.directories)) fail('Backup manifest upload directory list is malformed.');
  const uploadDirectories = new Set();
  for (const directory of manifest.uploads.directories ?? []) {
    safeRelativePath(directory, 'Upload directory');
    if (uploadDirectories.has(directory)) fail(`Backup manifest contains duplicate upload directory ${directory}.`);
    uploadDirectories.add(directory);
  }
  for (const uploadPath of uploadPaths) {
    const components = uploadPath.split('/');
    for (let index = 1; index < components.length; index += 1) {
      const parent = components.slice(0, index).join('/');
      if (uploadPaths.has(parent)) fail(`Backup manifest file ${parent} conflicts with nested upload ${uploadPath}.`);
      uploadDirectories.add(parent);
    }
  }
  for (const directory of uploadDirectories) {
    if (uploadPaths.has(directory)) fail(`Backup manifest upload path ${directory} is both a file and a directory.`);
    const components = directory.split('/');
    for (let index = 1; index < components.length; index += 1) {
      if (uploadPaths.has(components.slice(0, index).join('/'))) fail(`Backup manifest upload directory ${directory} is nested beneath a file.`);
    }
  }
  if (!Array.isArray(manifest.migrations) || manifest.migrations.some((migration) => typeof migration !== 'string')) fail('Backup manifest migration identifiers are malformed.');
  if (manifest.archive.filename !== 'snapshot.tar.gz' || !Number.isSafeInteger(manifest.archive.bytes) || manifest.archive.bytes < 1) fail('Backup manifest archive record is invalid.');
  assertSha256(manifest.archive.sha256, 'Archive checksum');
}

async function readVerifiedManifest(backupRoot) {
  const manifestPath = join(backupRoot, 'manifest.json');
  const manifestInfo = await lstat(manifestPath);
  if (manifestInfo.isSymbolicLink() || !manifestInfo.isFile()) fail('manifest.json must be a regular file in the backup set.');
  const manifestBytes = await readFile(manifestPath);
  const manifestChecksumPath = `${manifestPath}.sha256`;
  const manifestChecksumInfo = await lstat(manifestChecksumPath);
  if (manifestChecksumInfo.isSymbolicLink() || !manifestChecksumInfo.isFile()) fail('manifest.json.sha256 is missing or is not a regular file.');
  const expectedManifestChecksum = (await readFile(manifestChecksumPath, 'utf8')).trim().match(checksumPattern);
  if (!expectedManifestChecksum || expectedManifestChecksum[1] !== sha256Buffer(manifestBytes) || expectedManifestChecksum[2] !== 'manifest.json') fail('Manifest SHA-256 verification failed.');
  let manifest;
  try {
    manifest = JSON.parse(manifestBytes.toString('utf8'));
  } catch (error) {
    fail(`Backup manifest is not valid JSON: ${error.message}`);
  }
  verifyManifest(manifest);
  const archivePath = join(backupRoot, manifest.archive.filename);
  const archiveInfo = await lstat(archivePath);
  if (archiveInfo.isSymbolicLink() || !archiveInfo.isFile()) fail('Backup archive must be a regular file.');
  if (archiveInfo.size !== manifest.archive.bytes) fail('Backup archive size does not match the manifest.');
  const archiveChecksumPath = `${archivePath}.sha256`;
  const checksumInfo = await lstat(archiveChecksumPath);
  if (checksumInfo.isSymbolicLink() || !checksumInfo.isFile()) fail('Backup archive checksum file is missing or is not regular.');
  const checksumSidecar = (await readFile(archiveChecksumPath, 'utf8')).trim().match(checksumPattern);
  if (!checksumSidecar || checksumSidecar[1] !== manifest.archive.sha256 || checksumSidecar[2] !== manifest.archive.filename) fail('Archive checksum sidecar disagrees with the manifest.');
  if (await sha256File(archivePath) !== manifest.archive.sha256) fail('Backup archive SHA-256 verification failed.');
  return { manifest, archivePath };
}

function expectedArchiveDirectories(manifest) {
  const directories = new Set(['database', 'uploads']);
  for (const directory of manifest.uploads.directories ?? []) directories.add(`uploads/${directory}`);
  for (const file of manifest.uploads.files) {
    const components = file.path.split('/');
    for (let index = 1; index < components.length; index += 1) {
      directories.add(`uploads/${components.slice(0, index).join('/')}`);
    }
  }
  return directories;
}

function archiveEntryPath(entry) {
  if (entry.type !== 'Directory' && entry.type !== 'File') fail(`Backup archive contains unsupported entry type ${entry.type}.`);
  const path = entry.type === 'Directory' && entry.path.endsWith('/') ? entry.path.slice(0, -1) : entry.path;
  safeRelativePath(path, 'Archive path');
  return path;
}

async function extractArchive(archivePath, manifest, databaseStage, uploadsStage, destinationFilename) {
  const expectedDatabase = new Map(manifest.database.files.map((file) => [file.path, file]));
  const expectedUploads = new Map(manifest.uploads.files.map((file) => [file.path, file]));
  const expectedDirectories = expectedArchiveDirectories(manifest);
  const seenDatabase = new Set();
  const seenUploads = new Set();
  const seenDirectories = new Set();
  const seenEntries = new Set();
  let databaseBytes = 0;
  let uploadBytes = 0;
  await tar.list({
    file: archivePath,
    gzip: true,
    strict: true,
    onReadEntry(entry) {
      const path = archiveEntryPath(entry);
      if (seenEntries.has(path)) fail(`Backup archive contains a duplicate entry: ${path}`);
      seenEntries.add(path);
      if (entry.type === 'Directory') {
        const parts = safeRelativePath(path, 'Archive directory');
        const recorded = expectedDirectories.has(path);
        const legacyUploadDirectory = manifest.uploads.directories === undefined && parts[0] === 'uploads' && parts.length > 1;
        if (entry.size !== 0 || (!recorded && !legacyUploadDirectory)) fail(`Unexpected archive directory: ${path}`);
        seenDirectories.add(path);
        return;
      }
      const parts = safeRelativePath(path, 'Archive path');
      if (parts[0] === 'database' && parts.length === 2) {
        const file = expectedDatabase.get(parts[1]);
        if (!file || entry.size !== file.bytes) fail(`Unexpected or mismatched database file in archive: ${path}`);
        seenDatabase.add(file.path);
        databaseBytes += entry.size;
      } else if (parts[0] === 'uploads' && parts.length > 1) {
        const relativePath = parts.slice(1).join('/');
        const file = expectedUploads.get(relativePath);
        if (!file || entry.size !== file.bytes) fail(`Unexpected or mismatched upload in archive: ${path}`);
        seenUploads.add(file.path);
        uploadBytes += entry.size;
      } else {
        fail(`Unexpected archive file: ${path}`);
      }
      if (!Number.isSafeInteger(databaseBytes) || !Number.isSafeInteger(uploadBytes)) fail('Backup archive byte totals exceed the supported range.');
    },
  });
  if ([...expectedDirectories].some((path) => !seenDirectories.has(path))) fail('Backup archive is missing a manifest directory.');
  if (manifest.uploads.directories !== undefined && seenDirectories.size !== expectedDirectories.size) fail('Backup archive directory set does not match its manifest.');
  if (databaseBytes !== manifest.database.bytes || uploadBytes !== manifest.uploads.bytes) fail('Backup archive byte totals do not match its manifest.');

  const extractSection = async (section, cwd) => {
    await tar.extract({
      file: archivePath,
      cwd,
      gzip: true,
      strict: true,
      strip: 1,
      unlink: true,
      preserveOwner: false,
      fmode: 0o600,
      dmode: 0o700,
      filter(path, entry) {
        archiveEntryPath(entry);
        return path === `${section}/` || path === section || path.startsWith(`${section}/`);
      },
    });
  };
  await extractSection('database', databaseStage);
  await extractSection('uploads', uploadsStage);

  const verifyFile = async (root, path, file, label) => {
    const stagedPath = join(root, ...safeRelativePath(path, label));
    const info = await lstat(stagedPath);
    if (info.isSymbolicLink() || !info.isFile() || info.size !== file.bytes) fail(`Staged file does not match manifest metadata: ${label}`);
    if (await sha256File(stagedPath) !== file.sha256) fail(`Checksum mismatch for staged file ${label}.`);
  };
  for (const file of manifest.database.files) await verifyFile(databaseStage, file.path, file, `database/${file.path}`);
  for (const file of manifest.uploads.files) await verifyFile(uploadsStage, file.path, file, `uploads/${file.path}`);

  const mappings = manifest.database.files.map((file) => {
    const suffix = file.path === manifest.database.filename ? '' : file.path.slice(manifest.database.filename.length);
    return { source: file.path, target: `${destinationFilename}${suffix}` };
  });
  let mappedDirectory;
  do {
    mappedDirectory = await mkdtemp(join(databaseStage, '.mapped-'));
    if (mappings.some((mapping) => mapping.target === basename(mappedDirectory))) {
      await rm(mappedDirectory, { recursive: true, force: true });
      mappedDirectory = undefined;
    }
  } while (!mappedDirectory);
  for (const mapping of mappings) await rename(join(databaseStage, mapping.source), join(mappedDirectory, mapping.target));
  for (const mapping of mappings) await rename(join(mappedDirectory, mapping.target), join(databaseStage, mapping.target));
  await rm(mappedDirectory, { recursive: true, force: true });
  return mappings.map(({ target }) => ({ target }));
}

async function copyPreservedTree(source, destination, relativePath = '') {
  const sourceInfo = await lstat(source);
  if (sourceInfo.isSymbolicLink() || !sourceInfo.isDirectory()) fail(`Refusing to preserve unsafe uploads path: ${source}`);
  await mkdir(destination, { recursive: true, mode: 0o700 });
  const files = [];
  for (const entry of (await readdir(source, { withFileTypes: true })).sort((left, right) => left.name.localeCompare(right.name))) {
    const sourcePath = join(source, entry.name);
    const targetPath = join(destination, entry.name);
    const itemPath = relativePath ? `${relativePath}/${entry.name}` : entry.name;
    const info = await lstat(sourcePath);
    if (info.isSymbolicLink()) fail(`Refusing to preserve symlink in current uploads: ${itemPath}`);
    if (info.isDirectory()) files.push(...await copyPreservedTree(sourcePath, targetPath, itemPath));
    else if (info.isFile()) {
      await copyFile(sourcePath, targetPath);
      await chmod(targetPath, info.mode & 0o777);
      files.push({ path: itemPath, bytes: info.size, sha256: await sha256File(targetPath) });
    } else fail(`Refusing to preserve non-regular upload: ${itemPath}`);
  }
  return files;
}

async function preserveFailedState(canonicalPaths) {
  const id = `${new Date().toISOString().replace(/[:.]/g, '-')}-${randomUUID()}`;
  const databaseParent = dirname(canonicalPaths.databasePath);
  const uploadsParent = dirname(canonicalPaths.uploadDir);
  const databaseState = join(databaseParent, `.cms-failed-state-${id}-database`);
  const uploadsState = join(uploadsParent, `.cms-failed-state-${id}-uploads`);
  const databaseFilesDir = join(databaseState, 'database');
  const databaseFiles = [];
  await mkdir(databaseState, { mode: 0o700 });
  await mkdir(databaseFilesDir, { mode: 0o700 });
  for (const suffix of ['', ...sidecarSuffixes]) {
    const source = `${canonicalPaths.databasePath}${suffix}`;
    try {
      const info = await lstat(source);
      if (info.isSymbolicLink() || !info.isFile()) fail(`Current database set contains an unsafe file: ${source}`);
      const target = join(databaseFilesDir, basename(source));
      await copyFile(source, target);
      await chmod(target, 0o600);
      databaseFiles.push({ path: basename(source), bytes: info.size, sha256: await sha256File(target) });
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }
  let uploadsFiles = [];
  let uploadsPreserved = false;
  try {
    uploadsFiles = await copyPreservedTree(canonicalPaths.uploadDir, uploadsState);
    uploadsPreserved = true;
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  const record = {
    formatVersion: 1,
    preservedAt: new Date().toISOString(),
    database: { original: canonicalPaths.databasePath, directory: databaseFilesDir, files: databaseFiles },
    uploads: { original: canonicalPaths.uploadDir, directory: uploadsPreserved ? uploadsState : null, files: uploadsFiles },
  };
  const bytes = `${JSON.stringify(record, null, 2)}\n`;
  await writeFile(join(databaseState, 'preservation.json'), bytes, { flag: 'wx', mode: 0o600 });
  console.log(`Failed/current database state preserved at: ${databaseState}`);
  if (record.uploads.directory) console.log(`Failed/current uploads preserved at: ${uploadsState}`);
  return { databaseState, uploadsState: record.uploads.directory ? uploadsState : null };
}

async function validateLiveTargets(paths, canonicalPaths = paths) {
  if (
    isWithin(canonicalPaths.uploadDir, canonicalPaths.databasePath) ||
    isWithin(canonicalPaths.databasePath, canonicalPaths.uploadDir) ||
    isWithin(paths.uploadDir, paths.databasePath) ||
    isWithin(paths.databasePath, paths.uploadDir)
  ) {
    fail('DATABASE_URL and UPLOAD_DIR must not overlap.');
  }
  for (const path of [paths.databasePath, ...sidecarSuffixes.map((suffix) => `${paths.databasePath}${suffix}`)]) {
    try {
      const info = await lstat(path);
      if (info.isSymbolicLink() || !info.isFile()) fail(`Live database target is not a regular file: ${path}`);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }
  try {
    const info = await lstat(paths.uploadDir);
    if (info.isSymbolicLink() || !info.isDirectory()) fail(`Live uploads target is not a real directory: ${paths.uploadDir}`);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
}

async function moveExistingDatabaseFiles(canonicalPaths, holdDirectory) {
  await mkdir(holdDirectory, { recursive: true, mode: 0o700 });
  const moved = [];
  try {
    for (const suffix of ['', ...sidecarSuffixes]) {
      const source = `${canonicalPaths.databasePath}${suffix}`;
      try {
        await lstat(source);
        const held = join(holdDirectory, basename(source));
        await rename(source, held);
        moved.push({ active: source, held });
      } catch (error) {
        if (error.code !== 'ENOENT') throw error;
      }
    }
    return moved;
  } catch (error) {
    const rollbackErrors = [];
    for (const item of moved.reverse()) await rename(item.held, item.active).catch((rollbackError) => rollbackErrors.push(rollbackError.message));
    if (rollbackErrors.length) throw new Error(`Could not move the old database set and rollback was incomplete: ${rollbackErrors.join('; ')}. Original files are in ${holdDirectory}. Cause: ${error.message}`);
    throw error;
  }
}

async function restoreActiveState(canonicalPaths, expectedDatabase, databaseStage, uploadsStage, preserve) {
  const databaseParent = dirname(canonicalPaths.databasePath);
  const uploadsParent = dirname(canonicalPaths.uploadDir);
  const databaseHold = await mkdtemp(join(databaseParent, '.cms-restore-hold-db-'));
  const uploadsHold = await mkdtemp(join(uploadsParent, '.cms-restore-hold-uploads-'));
  const movedDatabase = [];
  const installedDatabase = [];
  let movedUploads = false;
  let installedUploads = false;
  const oldUploadsPath = join(uploadsHold, 'uploads');
  try {
    const existing = await moveExistingDatabaseFiles(canonicalPaths, databaseHold);
    movedDatabase.push(...existing);
    const uploadInfo = await lstat(canonicalPaths.uploadDir).catch((error) => error.code === 'ENOENT' ? null : Promise.reject(error));
    if (uploadInfo) {
      await rename(canonicalPaths.uploadDir, oldUploadsPath);
      movedUploads = true;
    }
    for (const file of expectedDatabase) {
      const staged = join(databaseStage, file.target);
      const active = join(databaseParent, file.target);
      await rename(staged, active);
      installedDatabase.push(active);
    }
    await rename(uploadsStage, canonicalPaths.uploadDir);
    installedUploads = true;
  } catch (error) {
    const rollbackErrors = [];
    if (installedUploads) await rm(canonicalPaths.uploadDir, { recursive: true, force: true }).catch((rollbackError) => rollbackErrors.push(rollbackError.message));
    if (movedUploads) await rename(oldUploadsPath, canonicalPaths.uploadDir).catch((rollbackError) => rollbackErrors.push(rollbackError.message));
    for (const path of installedDatabase.reverse()) await rm(path, { force: true }).catch((rollbackError) => rollbackErrors.push(rollbackError.message));
    for (const item of movedDatabase.reverse()) await rename(item.held, item.active).catch((rollbackError) => rollbackErrors.push(rollbackError.message));
    const suffix = rollbackErrors.length ? ` Rollback also reported: ${rollbackErrors.join('; ')}` : '';
    throw new Error(`Restore cutover failed; original state restoration was attempted. Preserved state remains at ${preserve.databaseState} and ${preserve.uploadsState ?? '(no uploads state)'}.${suffix} Cause: ${error.message}`);
  }
  await rm(databaseHold, { recursive: true, force: true });
  await rm(uploadsHold, { recursive: true, force: true });
  console.log('Restore cutover completed. The failed/current-state copies remain untouched; do not restart until release-specific migration status and application smoke checks are complete.');
  console.log(`Preserved database state: ${preserve.databaseState}`);
  if (preserve.uploadsState) console.log(`Preserved uploads state: ${preserve.uploadsState}`);
}

async function main() {
  const paths = readCmsDataPaths();
  const canonicalDatabasePath = await assertOutsideRelease(paths.databasePath, 'DATABASE_URL');
  const canonicalUploadDir = await assertOutsideRelease(paths.uploadDir, 'UPLOAD_DIR');
  const canonicalPaths = { databasePath: canonicalDatabasePath, uploadDir: canonicalUploadDir };
  await validateLiveTargets(paths, canonicalPaths);
  const configuredBasename = basename(paths.databasePath);
  const backupInput = process.argv[2] || await promptLine('Enter the absolute path to a known-good backup-set directory: ');
  if (!backupInput.startsWith(sep)) fail('Backup set path must be absolute; no host-specific path is assumed.');
  const backupRoot = await assertOutsideRelease(backupInput, 'Backup set');
  for (const target of [canonicalPaths.databasePath, canonicalPaths.uploadDir, paths.databasePath, paths.uploadDir]) {
    if (isWithin(backupRoot, target) || isWithin(target, backupRoot) || isWithin(backupInput, target) || isWithin(target, backupInput)) {
      fail('Backup set must be separate from the live database and uploads paths.');
    }
  }
  const { manifest, archivePath } = await readVerifiedManifest(backupRoot);
  const databaseParent = dirname(canonicalPaths.databasePath);
  const uploadsParent = dirname(canonicalPaths.uploadDir);
  await mkdir(databaseParent, { recursive: true, mode: 0o700 });
  await mkdir(uploadsParent, { recursive: true, mode: 0o700 });
  const databaseStage = await mkdtemp(join(databaseParent, '.cms-restore-stage-db-'));
  const uploadsStage = await mkdtemp(join(uploadsParent, '.cms-restore-stage-uploads-'));
  try {
    const expectedDatabase = await extractArchive(archivePath, manifest, databaseStage, uploadsStage, configuredBasename);
    await checkDatabaseIntegrity(join(databaseStage, configuredBasename));
    await confirmWritersStopped();
    const answerRestore = await promptLine(`This replaces ${paths.databasePath} and ${paths.uploadDir} using backup ${manifest.backupId} from ${backupRoot}. Type RESTORE ${manifest.backupId} to confirm: `);
    if (answerRestore !== `RESTORE ${manifest.backupId}`) fail('Restore cancelled; the explicit backup confirmation did not match.');
    let preserve;
    try {
      preserve = await preserveFailedState(canonicalPaths);
    } catch (error) {
      throw new Error(`Failed to preserve the current data before cutover; live data was not replaced. Inspect any .cms-failed-state-* siblings beside ${dirname(canonicalPaths.databasePath)} and ${dirname(canonicalPaths.uploadDir)}. Cause: ${error.message}`);
    }
    await restoreActiveState(canonicalPaths, expectedDatabase, databaseStage, uploadsStage, preserve);
  } finally {
    await rm(databaseStage, { recursive: true, force: true });
    await rm(uploadsStage, { recursive: true, force: true });
  }
}

const invokedPath = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : '';
if (invokedPath === import.meta.url) {
  main().catch((error) => {
    console.error(`CMS restore failed: ${error.message}`);
    process.exitCode = 1;
  });
}
