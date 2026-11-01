// @vitest-environment node
import { mkdtemp, mkdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createLocalReq, getPayload, type Payload } from "payload";
import { withCmsMutation } from "../../src/cms/mutation-gate";
import { withAdministratorMaintenance } from "../../src/cms/administrator-maintenance";
import { restoreDraftEndpoint } from "../../src/cms/restore-draft";
import type { Announcement } from "../../src/payload-types";

const body = (text: string): NonNullable<Announcement["body"]> => ({ root: { type: "root", version: 1, direction: null, format: "", indent: 0, children: [{ type: "paragraph", version: 1, direction: null, format: "", indent: 0, children: [{ type: "text", version: 1, text, format: 0, detail: 0, mode: "normal", style: "" }] }] } });
let payload: Payload;
let directory: string;

beforeAll(async () => {
  directory = await mkdtemp(path.join(tmpdir(), "goodman-cms-test-"));
  process.env.DATABASE_URL = `file:${directory}/blog.sqlite`;
  process.env.UPLOAD_DIR = `${directory}/uploads`;
  process.env.PAYLOAD_SECRET = "isolated-test-secret-not-a-production-credential-123456";
  await mkdir(process.env.UPLOAD_DIR);
  // Exercise config loading after disposable paths are set; a static import would read ambient deployment settings.
  const { default: config } = await import("../../payload.config");
  payload = await getPayload({ config });
  await payload.db.migrate();
  await withAdministratorMaintenance(() => payload.create({ collection: "administrators", data: { email: "cms-integration@example.test", password: "Disposable-test-password-42!" }, overrideAccess: true }));
});
afterAll(async () => {
  await payload?.destroy();
  if (directory) await rm(directory, { recursive: true, force: true });
});

describe("persisted announcement lifecycle", () => {
  it("rejects unscoped mutation and anonymous drafts/versions/accounts", async () => {
    await expect(payload.create({ collection: "announcements", data: { title: "Outside scope" }, draft: true })).rejects.toThrow();
    const draft = await withCmsMutation(() => payload.create({ collection: "announcements", data: { title: "Private draft" }, draft: true }));
    const anonymous = await payload.find({ collection: "announcements", overrideAccess: false, draft: false });
    expect(anonymous.docs.some((doc) => doc.id === draft.id)).toBe(false);
    await expect(payload.findVersions({ collection: "announcements", overrideAccess: false })).rejects.toThrow();
    await expect(payload.find({ collection: "administrators", overrideAccess: false })).rejects.toThrow();
    const history = await payload.findVersions({ collection: "announcements", where: { parent: { equals: draft.id } } });
    await expect(withCmsMutation(() => payload.restoreVersion({ collection: "announcements", id: history.docs[0].id }))).rejects.toThrow("Restore as draft");
  });

  it("publishes for the first time after revision pruning and preserves a private edit", async () => {
    let doc = await withCmsMutation(() => payload.create({ collection: "announcements", draft: true, data: { title: "Initial unfinished article" } }));
    for (let revision = 0; revision < 25; revision++) {
      doc = await withCmsMutation(() => payload.update({ collection: "announcements", id: doc.id, draft: true, data: { title: `Revision ${revision}`, summary: `Summary ${revision}`, body: body(`Body ${revision}`), _status: "draft" } }));
    }
    const versions = await payload.findVersions({ collection: "announcements", where: { parent: { equals: doc.id } }, limit: 100 });
    expect(versions.totalDocs).toBeLessThanOrEqual(20);
    const main = await payload.findByID({ collection: "announcements", id: doc.id, draft: false });
    expect(main.publishedAt).toBeFalsy();
    const before = Date.now();
    const published = await withCmsMutation(() => payload.update({ collection: "announcements", id: doc.id, data: { title: doc.title, summary: doc.summary, body: doc.body, _status: "published" } }));
    expect(Date.parse(published.publishedAt!)).toBeGreaterThanOrEqual(before);
    expect(published.title).toBe("Revision 24");
    await withCmsMutation(() => payload.update({ collection: "announcements", id: doc.id, draft: true, data: { title: "Unreleased edit", _status: "draft" } }));
    const publicDoc = await payload.findByID({ collection: "announcements", id: doc.id, draft: false, overrideAccess: false });
    expect(publicDoc.title).toBe("Revision 24");
    expect(publicDoc.publishedAt).toBe(published.publishedAt);
    const preview = await payload.findByID({ collection: "announcements", id: doc.id, draft: true });
    expect(preview.title).toBe("Unreleased edit");
    await expect(withCmsMutation(() => payload.update({ collection: "announcements", id: doc.id, data: { slug: "changed-url" } }))).rejects.toThrow();
    await expect(withCmsMutation(() => payload.update({ collection: "announcements", id: doc.id, data: { publishedAt: "2000-01-01T00:00:00.000Z" } }))).rejects.toThrow();
    await withCmsMutation(() => payload.update({ collection: "announcements", id: doc.id, data: { _status: "draft" } }));
    const hidden = await payload.find({ collection: "announcements", overrideAccess: false, where: { id: { equals: doc.id } } });
    expect(hidden.docs).toEqual([]);
  });

  it("rejects incomplete publication, backdating and reserved URLs", async () => {
    await expect(withCmsMutation(() => payload.create({ collection: "announcements", data: { title: "Missing body", _status: "published" } }))).rejects.toThrow();
    await expect(withCmsMutation(() => payload.create({ collection: "announcements", draft: true, data: { title: "Backdated", publishedAt: "2000-01-01T00:00:00.000Z" } }))).rejects.toThrow();
    await expect(withCmsMutation(() => payload.create({ collection: "announcements", draft: true, data: { title: "Reserved", slug: "preview" } }))).rejects.toThrow();
  });
});

describe("historical content restored only as drafts", () => {
  it("restores published and draft revisions without changing the live snapshot or identity", async () => {
    const account = (await payload.find({ collection: "administrators", overrideAccess: true })).docs[0];
    const user = { ...account, collection: "administrators" as const };
    const article = await withCmsMutation(() => payload.create({ collection: "announcements", data: { title: "Public one", summary: "Original public summary", body: body("Original public body"), _status: "published" } }));
    await withCmsMutation(() => payload.update({ collection: "announcements", id: article.id, draft: true, data: { title: "Historical draft", body: body("Historical draft body"), _status: "draft" } }));
    await withCmsMutation(() => payload.update({ collection: "announcements", id: article.id, data: { title: "Public two", summary: "Current public summary", body: body("Current public body"), _status: "published" } }));
    const versions = await payload.findVersions({ collection: "announcements", where: { parent: { equals: article.id } }, limit: 100 });
    const original = versions.docs.find((entry) => entry.version.title === "Public one");
    const draft = versions.docs.find((entry) => entry.version.title === "Historical draft");
    expect(original).toBeDefined();
    expect(draft).toBeDefined();
    const restore = async (versionId: number | string) => {
      const req = await createLocalReq({ user, req: {
        url: `http://localhost:3000/api/cms/announcements/${article.id}/restore-as-draft`,
        headers: new Headers({ origin: "http://localhost:3000", "content-type": "application/json" }),
        routeParams: { id: String(article.id) },
        json: async () => ({ versionId }),
      } }, payload);
      return restoreDraftEndpoint.handler(req);
    };
    for (const revision of [original!, draft!]) {
      expect((await restore(revision.id)).status).toBe(200);
      const main = await payload.findByID({ collection: "announcements", id: article.id, draft: false, overrideAccess: false });
      expect(main.title).toBe("Public two");
      expect(main.summary).toBe("Current public summary");
      expect(main.slug).toBe(article.slug);
      expect(main.publishedAt).toBe(article.publishedAt);
      const saved = await payload.findByID({ collection: "announcements", id: article.id, draft: true, user, overrideAccess: false });
      expect(saved.title).toBe(revision.version.title);
      expect(saved._status).toBe("draft");
    }
    await withCmsMutation(() => payload.update({ collection: "announcements", id: article.id, data: { _status: "draft" } }));
    expect((await restore(original!.id)).status).toBe(200);
    expect((await payload.find({ collection: "announcements", overrideAccess: false, where: { id: { equals: article.id } } })).docs).toEqual([]);
  });
});

it("enforces restore HTTP authentication, CSRF and version ownership without accepting publication flags", async () => {
  // Load the actual dispatch boundary after the disposable config has initialized.
  const { POST } = await import("../../src/app/(payload)/api/cms/[...slug]/route");
  const article = await withCmsMutation(() => payload.create({ collection: "announcements", data: { title: "HTTP public original", summary: "Public summary", body: body("Public original body"), _status: "published" } }));
  await withCmsMutation(() => payload.update({ collection: "announcements", id: article.id, draft: true, data: { title: "HTTP historical draft", body: body("Historical saved content"), _status: "draft" } }));
  await withCmsMutation(() => payload.update({ collection: "announcements", id: article.id, data: { title: "HTTP current public", body: body("Current public body"), _status: "published" } }));
  const versions = await payload.findVersions({ collection: "announcements", where: { parent: { equals: article.id } }, limit: 20 });
  const selected = versions.docs.find((entry) => entry.version.title === "HTTP historical draft")!;
  const other = await withCmsMutation(() => payload.create({ collection: "announcements", draft: true, data: { title: "Different parent" } }));
  const unrelated = await payload.findVersions({ collection: "announcements", where: { parent: { equals: other.id } } });
  const { token } = await payload.login({ collection: "administrators", data: { email: "cms-integration@example.test", password: "Disposable-test-password-42!" } });
  const restore = (raw: string, { authenticated = true, origin = "http://localhost:3000", contentType = "application/json" } = {}) => {
    const headers = new Headers({ "content-type": contentType });
    if (origin) headers.set("origin", origin);
    if (authenticated) headers.set("authorization", `JWT ${token}`);
    return POST(new Request(`http://localhost:3000/api/cms/announcements/${article.id}/restore-as-draft`, { method: "POST", headers, body: raw }), {
      params: Promise.resolve({ slug: ["announcements", String(article.id), "restore-as-draft"] }),
    });
  };
  const request = JSON.stringify({ versionId: selected.id });
  expect((await restore(request, { authenticated: false })).status).toBe(401);
  expect((await restore(request, { origin: "https://untrusted.example" })).status).toBe(403);
  expect((await restore(request, { origin: "" })).status).toBe(403);
  expect((await restore(request, { contentType: "text/plain" })).status).toBe(415);
  expect((await restore("{")).status).toBe(400);
  expect((await restore("{}")).status).toBe(400);
  expect((await restore(JSON.stringify({ versionId: unrelated.docs[0].id }))).status).toBe(404);
  expect((await restore(JSON.stringify({ versionId: 999999999 }))).status).toBe(404);
  expect((await payload.findVersions({ collection: "announcements", where: { parent: { equals: article.id } } })).totalDocs).toBe(versions.totalDocs);
  // Public Origin differs from the internal request URL behind a reverse proxy.
  const result = await restore(JSON.stringify({ versionId: selected.id, _status: "published", body: body("Injected publication content") }), { origin: "http://127.0.0.1:3000" });
  expect(result.status).toBe(200);
  expect(await result.json()).toEqual({ id: article.id, _status: "draft" });
  const main = await payload.findByID({ collection: "announcements", id: article.id, draft: false, overrideAccess: false });
  expect(main.title).toBe("HTTP current public");
  expect(main.body).toEqual(body("Current public body"));
  const saved = await payload.findByID({ collection: "announcements", id: article.id, draft: true });
  expect(saved.title).toBe("HTTP historical draft");
  expect(saved.body).toEqual(body("Historical saved content"));
  expect(saved.publishedAt).toBe(article.publishedAt);
});
