// @vitest-environment node
import { mkdtemp, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { getPayload, type Payload } from "payload";
import type { Announcement, Media } from "../../src/payload-types";
import { withAdministratorMaintenance } from "../../src/cms/administrator-maintenance";
import { withCmsMutation } from "../../src/cms/mutation-gate";

let payload: Payload;
let directory: string;
let uploadDirectory: string;
const originalEnvironment = new Map<string, string | undefined>();
const environmentKeys = ["DATABASE_URL", "UPLOAD_DIR", "PAYLOAD_SECRET"];

const emptyBody = (): NonNullable<Announcement["body"]> => ({
  root: {
    type: "root",
    version: 1,
    direction: null,
    format: "",
    indent: 0,
    children: [],
  },
});

const bodyWithUpload = (mediaID: number): NonNullable<Announcement["body"]> => ({
  root: {
    type: "root",
    version: 1,
    direction: null,
    format: "",
    indent: 0,
    children: [{
      type: "paragraph",
      version: 1,
      direction: null,
      format: "",
      indent: 0,
      children: [{
        type: "upload",
        version: 1,
        relationTo: "media",
        value: mediaID,
        fields: { alt: "Article image", caption: "An embedded image" },
        children: [],
      }],
    }],
  },
});

async function imageBytes(format: "jpeg" | "png" | "webp", width = 32, height = 24): Promise<Buffer> {
  const source = sharp({
    create: {
      width,
      height,
      channels: 3,
      background: { r: 34, g: 104, b: 190 },
    },
  });
  if (format === "jpeg") return source.jpeg().toBuffer();
  if (format === "webp") return source.webp().toBuffer();
  return source.png().toBuffer();
}

async function addMedia(
  bytes: Buffer,
  extension = "png",
  alt = "  A meaningful image description  ",
  caption?: string,
): Promise<Media> {
  const inputPath = path.join(directory, `upload-${randomUUID()}.${extension}`);
  await writeFile(inputPath, bytes);
  try {
    return await withCmsMutation(() => payload.create({
      collection: "media",
      data: { alt, ...(caption === undefined ? {} : { caption }) },
      filePath: inputPath,
    }));
  } finally {
    await rm(inputPath, { force: true });
  }
}

function mediaFileNames(media: Media): string[] {
  return [...new Set([
    media.filename,
    ...Object.values(media.sizes ?? {}).map((size) => size?.filename),
  ].filter((filename): filename is string => Boolean(filename)))];
}

function relationshipID(value: unknown): number | undefined {
  if (typeof value === "number") return value;
  if (value && typeof value === "object") {
    if ("id" in value) return relationshipID(value.id);
    if ("value" in value) return relationshipID(value.value);
  }
  return undefined;
}

async function listStoredFiles(): Promise<string[]> {
  const files: string[] = [];
  const visit = async (current: string): Promise<void> => {
    for (const entry of await readdir(current, { withFileTypes: true })) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) await visit(fullPath);
      else files.push(fullPath);
    }
  };
  await visit(uploadDirectory);
  return files.sort();
}

async function snapshotMediaFiles(media: Media): Promise<Array<[string, Buffer]>> {
  return Promise.all(mediaFileNames(media).map(async (filename) => [
    filename,
    await readFile(path.join(uploadDirectory, filename)),
  ]));
}

async function expectMediaFilesExist(media: Media): Promise<void> {
  const files = await listStoredFiles();
  const names = new Set(files.map((file) => path.basename(file)));
  for (const filename of mediaFileNames(media)) expect(names.has(filename), `${filename} should exist on disk`).toBe(true);
}

async function expectMediaFilesAbsent(media: Media): Promise<void> {
  const files = await listStoredFiles();
  const names = new Set(files.map((file) => path.basename(file)));
  for (const filename of mediaFileNames(media)) expect(names.has(filename), `${filename} should be removed from disk`).toBe(false);
}

async function createDraft(data: {
  title: string;
  body?: NonNullable<Announcement["body"]>;
  coverImage?: number | null;
}): Promise<Announcement> {
  return withCmsMutation(() => payload.create({
    collection: "announcements",
    draft: true,
    data,
  }));
}

async function expectMediaMissing(media: Media): Promise<void> {
  await expect(payload.findByID({ collection: "media", id: media.id, overrideAccess: true })).rejects.toThrow();
}

beforeAll(async () => {
  directory = await mkdtemp(path.join(tmpdir(), "goodman-cms-media-test-"));
  uploadDirectory = path.join(directory, "uploads");
  for (const key of environmentKeys) originalEnvironment.set(key, process.env[key]);
  process.env.DATABASE_URL = `file:${path.join(directory, "blog.sqlite")}`;
  process.env.UPLOAD_DIR = uploadDirectory;
  process.env.PAYLOAD_SECRET = "disposable-media-test-secret-not-a-production-credential-123456";
  await mkdir(uploadDirectory);

  // Load Payload only after the database and upload paths point to this disposable directory.
  const { default: config } = await import("../../payload.config");
  payload = await getPayload({ config });
  await payload.db.migrate();
  await withAdministratorMaintenance(() => payload.create({
    collection: "administrators",
    data: { email: "cms-media-integration@example.test", password: "Disposable-test-password-42!" },
    overrideAccess: true,
  }));
});

afterAll(async () => {
  await payload?.destroy();
  if (directory) await rm(directory, { recursive: true, force: true });
  for (const key of environmentKeys) {
    const value = originalEnvironment.get(key);
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
});

describe("persisted media lifecycle", () => {
  it("accepts decoded JPEG, PNG, and WebP uploads with required normalized alt text", async () => {
    for (const format of ["jpeg", "png", "webp"] as const) {
      const media = await addMedia(await imageBytes(format), format, `  ${format.toUpperCase()} announcement image  `, "  Shared caption  ");
      expect(media.alt).toBe(`${format.toUpperCase()} announcement image`);
      expect(media.caption).toBe("Shared caption");
      expect(media.mimeType).toBe(`image/${format}`);
      expect(media.width).toBe(32);
      expect(media.height).toBe(24);
      await expectMediaFilesExist(media);
      const original = await readFile(path.join(uploadDirectory, media.filename!));
      await expect(sharp(original).metadata()).resolves.toMatchObject({ format, width: 32, height: 24 });
    }

    const filesBeforeBlankAlt = await listStoredFiles();
    await expect(addMedia(await imageBytes("png"), "blank-alt.png", "   ")).rejects.toThrow();
    expect(await listStoredFiles()).toEqual(filesBeforeBlankAlt);
  });

  it("uses decoded bytes rather than a misleading filename and rejects corrupt or disguised uploads", async () => {
    const pngNamedAsJpeg = await addMedia(await imageBytes("png"), "actually-png.jpg");
    expect(pngNamedAsJpeg.mimeType).toBe("image/png");
    await expect(sharp(await readFile(path.join(uploadDirectory, pngNamedAsJpeg.filename!))).metadata())
      .resolves.toMatchObject({ format: "png" });

    const before = await listStoredFiles();
    const svg = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="4" height="4"><script>alert(1)</script></svg>');
    await expect(addMedia(svg, "disguised.png")).rejects.toThrow();
    await expect(addMedia(Buffer.from("not an image"), "corrupt.jpg")).rejects.toThrow();
    expect(await listStoredFiles()).toEqual(before);
  });

  it("enforces the 5,000,000-byte and 25-megapixel input ceilings", async () => {
    const validPng = await imageBytes("png");
    const oversized = Buffer.concat([validPng, Buffer.alloc(5_000_001 - validPng.length)]);
    const filesBeforeOversize = await listStoredFiles();
    await expect(addMedia(oversized, "oversized.png")).rejects.toMatchObject({ status: 413 });
    expect(await listStoredFiles()).toEqual(filesBeforeOversize);

    // The encoded image is small; only its decoded dimensions exceed the cap.
    const tooManyPixels = await sharp({
      create: {
        width: 5_001,
        height: 5_000,
        channels: 3,
        background: { r: 10, g: 20, b: 30 },
      },
    }).png().toBuffer();
    expect(tooManyPixels.length).toBeLessThan(5_000_000);
    const filesBeforePixels = await listStoredFiles();
    await expect(addMedia(tooManyPixels, "too-many-pixels.png")).rejects.toThrow(/25 megapixels|decodable/i);
    expect(await listStoredFiles()).toEqual(filesBeforePixels);
  });

  it("allows metadata edits but rejects replacement bytes without changing any stored image file", async () => {
    const media = await addMedia(await imageBytes("png"), "immutable.png", "Initial alt");
    const originalFiles = await snapshotMediaFiles(media);
    expect(originalFiles.length).toBeGreaterThan(0);

    const metadataEdit = await withCmsMutation(() => payload.update({
      collection: "media",
      id: media.id,
      data: {
        alt: "  Updated shared alt  ",
        caption: "  Updated shared caption  ",
        filename: "forged.png",
        mimeType: "text/plain",
        width: 999,
      },
    }));
    expect(metadataEdit.alt).toBe("Updated shared alt");
    expect(metadataEdit.caption).toBe("Updated shared caption");
    expect(metadataEdit.filename).toBe(media.filename);
    expect(metadataEdit.mimeType).toBe(media.mimeType);
    expect(metadataEdit.width).toBe(media.width);
    expect(await snapshotMediaFiles(media)).toEqual(originalFiles);
    const allFilesBeforeReplacement = await listStoredFiles();

    const replacementPath = path.join(directory, `replacement-${randomUUID()}.webp`);
    await writeFile(replacementPath, await imageBytes("webp", 48, 36));
    try {
      await expect(withCmsMutation(() => payload.update({
        collection: "media",
        id: media.id,
        data: { alt: "Must not replace the original" },
        filePath: replacementPath,
      }))).rejects.toThrow(/immutable|new media item/i);
    } finally {
      await rm(replacementPath, { force: true });
    }

    expect(await snapshotMediaFiles(media)).toEqual(originalFiles);
    expect(await listStoredFiles()).toEqual(allFilesBeforeReplacement);
    const persisted = await payload.findByID({ collection: "media", id: media.id, overrideAccess: true });
    expect(persisted.alt).toBe("Updated shared alt");
    expect(persisted.filename).toBe(media.filename);
    await expectMediaFilesExist(media);
  });

  it("protects cover-image and nested Lexical upload references on current announcement documents", async () => {
    const cover = await addMedia(await imageBytes("png"), "current-cover.png");
    const embedded = await addMedia(await imageBytes("webp"), "nested-upload.webp");
    const announcement = await createDraft({
      title: "Current media references",
      coverImage: cover.id,
      body: bodyWithUpload(embedded.id),
    });

    await expect(withCmsMutation(() => payload.delete({ collection: "media", id: cover.id })))
      .rejects.toThrow(/Cannot delete media while it is referenced/);
    await expect(withCmsMutation(() => payload.delete({ collection: "media", id: embedded.id })))
      .rejects.toThrow(/Cannot delete media while it is referenced/);
    expect((await payload.findByID({ collection: "announcements", id: announcement.id, draft: true })).coverImage)
      .toMatchObject({ id: cover.id });
    await expect(payload.findByID({ collection: "media", id: cover.id, overrideAccess: true })).resolves.toMatchObject({ id: cover.id });
    await expect(payload.findByID({ collection: "media", id: embedded.id, overrideAccess: true })).resolves.toMatchObject({ id: embedded.id });
    await expectMediaFilesExist(cover);
    await expectMediaFilesExist(embedded);
  });

  it("protects a cover image referenced only by a retained announcement version", async () => {
    const media = await addMedia(await imageBytes("jpeg"), "version-cover.jpg");
    const announcement = await createDraft({
      title: "Version-only media reference",
      coverImage: media.id,
      body: emptyBody(),
    });
    await withCmsMutation(() => payload.update({
      collection: "announcements",
      id: announcement.id,
      draft: true,
      data: { coverImage: null, body: emptyBody() },
    }));

    const latestDraft = await payload.findByID({ collection: "announcements", id: announcement.id, draft: true });
    expect(latestDraft.coverImage).toBeNull();
    const history = await payload.findVersions({
      collection: "announcements",
      where: { parent: { equals: announcement.id } },
      limit: 100,
    });
    const retainedCoverIDs = history.docs.map((record) => {
      const document: unknown = record;
      if (!document || typeof document !== "object" || !("version" in document)) return undefined;
      const version = document.version;
      if (!version || typeof version !== "object" || !("coverImage" in version)) return undefined;
      return relationshipID(version.coverImage);
    });
    expect(retainedCoverIDs).toContain(media.id);

    await expect(withCmsMutation(() => payload.delete({ collection: "media", id: media.id })))
      .rejects.toThrow(/retained version|Cannot delete media while it is referenced/);
    await expect(payload.findByID({ collection: "media", id: media.id, overrideAccess: true })).resolves.toMatchObject({ id: media.id });
    await expectMediaFilesExist(media);
  });

  it("deletes genuinely unused media records and their original and generated files", async () => {
    const media = await addMedia(await imageBytes("webp"), "unused.webp");
    const filesBefore = await snapshotMediaFiles(media);
    expect(filesBefore.length).toBeGreaterThan(0);
    await withCmsMutation(() => payload.delete({ collection: "media", id: media.id }));
    await expectMediaMissing(media);
    await expectMediaFilesAbsent(media);
  });

  it("preflights bulk deletion so a referenced item cannot partially delete the batch", async () => {
    const referenced = await addMedia(await imageBytes("png"), "bulk-referenced.png");
    const unused = await addMedia(await imageBytes("jpeg"), "bulk-unused.jpg");
    const announcement = await createDraft({ title: "Bulk delete guard", coverImage: referenced.id, body: emptyBody() });
    const filesBefore = [await snapshotMediaFiles(referenced), await snapshotMediaFiles(unused)];

    await expect(withCmsMutation(() => payload.delete({
      collection: "media",
      where: { id: { in: [referenced.id, unused.id] } },
    }))).rejects.toThrow(/Cannot delete media while it is referenced/);

    await expect(payload.findByID({ collection: "announcements", id: announcement.id, draft: true }))
      .resolves.toMatchObject({ id: announcement.id });
    await expect(payload.findByID({ collection: "media", id: referenced.id, overrideAccess: true })).resolves.toMatchObject({ id: referenced.id });
    await expect(payload.findByID({ collection: "media", id: unused.id, overrideAccess: true })).resolves.toMatchObject({ id: unused.id });
    expect(await snapshotMediaFiles(referenced)).toEqual(filesBefore[0]);
    expect(await snapshotMediaFiles(unused)).toEqual(filesBefore[1]);
  });

  it("serializes save-first against deletion so the new reference prevents removal", async () => {
    const media = await addMedia(await imageBytes("png"), "save-first.png");
    const saved = Promise.withResolvers<void>();
    const allowSaveScopeToFinish = Promise.withResolvers<void>();
    const save = withCmsMutation(async () => {
      await createDraft({ title: "Saved before deletion", coverImage: media.id, body: emptyBody() });
      saved.resolve();
      await allowSaveScopeToFinish.promise;
    });
    const saveExpectation = expect(save).resolves.toBeUndefined();
    await saved.promise;

    let deletionEntered = false;
    const deletion = withCmsMutation(async () => {
      deletionEntered = true;
      return payload.delete({ collection: "media", id: media.id });
    });
    expect(deletionEntered).toBe(false);
    allowSaveScopeToFinish.resolve();
    await saveExpectation;
    await expect(deletion).rejects.toThrow(/Cannot delete media while it is referenced/);

    await expect(payload.findByID({ collection: "media", id: media.id, overrideAccess: true })).resolves.toMatchObject({ id: media.id });
    await expectMediaFilesExist(media);
  });

  it("serializes delete-first against a save so missing media rejects the new reference", async () => {
    const media = await addMedia(await imageBytes("webp"), "delete-first.webp");
    const deleted = Promise.withResolvers<void>();
    const allowDeleteScopeToFinish = Promise.withResolvers<void>();
    const deletion = withCmsMutation(async () => {
      await payload.delete({ collection: "media", id: media.id });
      deleted.resolve();
      await allowDeleteScopeToFinish.promise;
    });
    const deletionExpectation = expect(deletion).resolves.toBeUndefined();
    await deleted.promise;

    let saveEntered = false;
    const save = withCmsMutation(async () => {
      saveEntered = true;
      return payload.create({
        collection: "announcements",
        draft: true,
        data: { title: "Must not reference deleted media", coverImage: media.id, body: emptyBody() },
      });
    });
    expect(saveEntered).toBe(false);
    allowDeleteScopeToFinish.resolve();
    await deletionExpectation;
    await expect(save).rejects.toThrow(/missing media/i);

    await expectMediaMissing(media);
    await expectMediaFilesAbsent(media);
    const announcements = await payload.find({ collection: "announcements", overrideAccess: true, where: { title: { equals: "Must not reference deleted media" } } });
    expect(announcements.docs).toHaveLength(0);
  });

  it("releases the gate after an injected failure and then safely runs the queued deletion", async () => {
    const media = await addMedia(await imageBytes("jpeg"), "failed-save.jpeg");
    const failedOperationEntered = Promise.withResolvers<void>();
    const allowInjectedFailure = Promise.withResolvers<void>();
    const failedOperation = withCmsMutation(async () => {
      await createDraft({ title: "Committed before injected failure", coverImage: media.id, body: emptyBody() });
      failedOperationEntered.resolve();
      await allowInjectedFailure.promise;
      throw new Error("injected failure after saved reference");
    });
    const failureExpectation = expect(failedOperation).rejects.toThrow("injected failure after saved reference");
    await failedOperationEntered.promise;

    let deletionEntered = false;
    const deletion = withCmsMutation(async () => {
      deletionEntered = true;
      return payload.delete({ collection: "media", id: media.id });
    });
    expect(deletionEntered).toBe(false);
    allowInjectedFailure.resolve();
    await failureExpectation;
    await expect(deletion).rejects.toThrow(/Cannot delete media while it is referenced/);

    await expect(payload.findByID({ collection: "media", id: media.id, overrideAccess: true })).resolves.toMatchObject({ id: media.id });
    await expectMediaFilesExist(media);
  });
});

it("accepts native multipart memory uploads at the exact byte limit and rejects larger files without leftovers", async () => {
  // Exercise the real REST parsing boundary after installing disposable configuration.
  const { POST } = await import("../../src/app/(payload)/api/cms/[...slug]/route");
  const { token } = await payload.login({ collection: "administrators", data: { email: "cms-media-integration@example.test", password: "Disposable-test-password-42!" } });
  const upload = (bytes: Buffer, name: string) => {
    const form = new FormData();
    form.append("_payload", JSON.stringify({ alt: "Equipment at a Group event" }));
    form.append("file", new Blob([Uint8Array.from(bytes)], { type: "image/png" }), name);
    return POST(new Request("http://localhost:3000/api/cms/media", {
      method: "POST", body: form,
      headers: { authorization: `JWT ${token}`, origin: "http://localhost:3000" },
    }), { params: Promise.resolve({ slug: ["media"] }) });
  };
  const png = await imageBytes("png");
  const small = await upload(png, "native-memory.png");
  expect(small.status).toBe(201);
  const result = await small.json();
  expect(result.doc).toMatchObject({ id: expect.any(Number), alt: "Equipment at a Group event" });
  const stored = await payload.findByID({ collection: "media", id: result.doc.id, overrideAccess: false });
  expect((await sharp(await readFile(path.join(uploadDirectory, stored.filename!))).metadata()).format).toBe("png");
  const exact = Buffer.concat([png, Buffer.alloc(5_000_000 - png.length)]);
  expect((await upload(exact, "native-exact-limit.png")).status).toBe(201);
  const before = await listStoredFiles();
  expect((await upload(Buffer.concat([exact, Buffer.alloc(1)]), "native-oversized.png")).status).toBe(413);
  expect(await listStoredFiles()).toEqual(before);
});

it("serves public media downloads without private or noindex headers while protecting CMS API endpoints", async () => {
  // Dynamic import required: route module initializes payload.config which evaluates environment variables configured in beforeAll.
  const { GET, POST } = await import("../../src/app/(payload)/api/cms/[...slug]/route");
  const { token } = await payload.login({ collection: "administrators", data: { email: "cms-media-integration@example.test", password: "Disposable-test-password-42!" } });

  const form = new FormData();
  form.append("_payload", JSON.stringify({ alt: "Public photo test" }));
  const png = await imageBytes("png");
  form.append("file", new Blob([Uint8Array.from(png)], { type: "image/png" }), "public-header-test.png");

  const uploadResponse = await POST(new Request("http://localhost:3000/api/cms/media", {
    method: "POST",
    body: form,
    headers: { authorization: `JWT ${token}`, origin: "http://localhost:3000" },
  }), { params: Promise.resolve({ slug: ["media"] }) });
  expect(uploadResponse.status).toBe(201);
  const { doc } = await uploadResponse.json();

  // Public immutable media file download: no private or noindex headers
  const fileResponse = await GET(new Request(`http://localhost:3000/api/cms/media/file/${doc.filename}`, {
    method: "GET",
  }), { params: Promise.resolve({ slug: ["media", "file", doc.filename] }) });
  expect(fileResponse.status).toBe(200);
  expect(fileResponse.headers.get("x-robots-tag")).toBeNull();
  const fileCacheControl = fileResponse.headers.get("cache-control") ?? "";
  expect(fileCacheControl).not.toContain("private");
  expect(fileCacheControl).not.toContain("no-store");

  // CMS API collection endpoint: retains private, no-store and noindex
  const apiResponse = await GET(new Request("http://localhost:3000/api/cms/media", {
    method: "GET",
  }), { params: Promise.resolve({ slug: ["media"] }) });
  expect(apiResponse.headers.get("x-robots-tag")).toBe("noindex, nofollow");
  expect(apiResponse.headers.get("cache-control")).toBe("private, no-store");
});
