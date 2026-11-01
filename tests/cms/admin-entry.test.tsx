// @vitest-environment node
import { mkdtemp, mkdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { getPayload, type Payload } from "payload";
import { withAdministratorMaintenance } from "../../src/cms/administrator-maintenance";
import type AdminPageComponent from "../../src/app/(payload)/admin/[[...segments]]/page";

const request = vi.hoisted(() => ({ headers: new Headers() }));
vi.mock("next/headers", () => ({ headers: async () => request.headers }));
// Isolate only Payload's framework renderer/import map, not its authentication or writes.
vi.mock("@payloadcms/next/views", () => ({ RootPage: () => null, generatePageMetadata: async () => ({}) }));
vi.mock("../../src/app/(payload)/admin/importMap", () => ({ importMap: {} }));

let payload: Payload;
let directory: string;
let adminPage: typeof AdminPageComponent;

beforeAll(async () => {
  directory = await mkdtemp(path.join(tmpdir(), "goodman-cms-entry-"));
  process.env.DATABASE_URL = `file:${directory}/blog.sqlite`;
  process.env.UPLOAD_DIR = `${directory}/uploads`;
  process.env.PAYLOAD_SECRET = "disposable-admin-entry-fixture-secret-of-at-least-32-characters";
  await mkdir(process.env.UPLOAD_DIR);
  // Load configuration and the entry point only after external disposable paths are installed.
  const { default: config } = await import("../../payload.config");
  payload = await getPayload({ config });
  await payload.db.migrate();
  await withAdministratorMaintenance(() => payload.create({ collection: "administrators", data: { email: "entry@example.test", password: "Disposable-entry-password-42!" }, overrideAccess: true }));
  adminPage = (await import("../../src/app/(payload)/admin/[[...segments]]/page")).default;
});
afterAll(async () => {
  await payload?.destroy();
  if (directory) await rm(directory, { recursive: true, force: true });
});

describe("admin initial autosave entry point", () => {
  it("creates a scoped saved private draft only for a currently authenticated session", async () => {
    const args = () => ({ params: Promise.resolve({ segments: ["collections", "announcements", "create"] }), searchParams: Promise.resolve({}) });
    await expect(adminPage(args())).rejects.toMatchObject({ digest: expect.stringContaining("/admin/login") });
    expect((await payload.find({ collection: "announcements", overrideAccess: true })).docs).toEqual([]);
    const { token, user } = await payload.login({ collection: "administrators", data: { email: "entry@example.test", password: "Disposable-entry-password-42!" } });
    request.headers = new Headers({ cookie: `${payload.config.cookiePrefix}-token=${token}`, "sec-fetch-site": "same-origin" });
    await expect(adminPage(args())).rejects.toMatchObject({ digest: expect.stringMatching(/\/admin\/collections\/announcements\/\d+;/) });
    const drafts = await payload.find({ collection: "announcements", draft: true, overrideAccess: true });
    expect(drafts.docs).toHaveLength(1);
    expect(drafts.docs[0]._status).toBe("draft");
    expect((await payload.find({ collection: "announcements", draft: false, overrideAccess: false })).docs).toEqual([]);
    await withAdministratorMaintenance(() => payload.update({ collection: "administrators", id: user!.id, data: { sessions: [] }, overrideAccess: true }));
    await expect(adminPage(args())).rejects.toMatchObject({ digest: expect.stringContaining("/admin/login") });
    expect((await payload.find({ collection: "announcements", overrideAccess: true })).docs.map((doc) => doc.id)).toEqual([drafts.docs[0].id]);
  });
});
