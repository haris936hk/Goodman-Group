// @vitest-environment node
import { mkdtemp, mkdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { getPayload, type Payload } from "payload";
import { withCmsMutation } from "../../src/cms/mutation-gate";
import { withAdministratorMaintenance } from "../../src/cms/administrator-maintenance";
import type { Announcement } from "../../src/payload-types";
import { getAnnouncementImageURL, getBlogArticleMetadata, createBlogPostingJsonLd } from "../../src/lib/blog/metadata";

// Replace only Next's import-time environment sentinel; all CMS reads use real SQLite.
vi.mock("server-only", () => ({}));
import { getAuthenticatedDraft, getPublishedAnnouncement, getPublishedAnnouncementSlugs, getPublishedAnnouncementsPage } from "../../src/lib/blog/queries";

let payload: Payload;
let directory: string;
const body = (text: string): NonNullable<Announcement["body"]> => ({ root: { type: "root", version: 1, direction: null, format: "", indent: 0, children: [{ type: "paragraph", version: 1, children: [{ type: "text", version: 1, text, format: 0, detail: 0, mode: "normal", style: "" }] }] } });

beforeAll(async () => {
  directory = await mkdtemp(path.join(tmpdir(), "goodman-cms-queries-"));
  process.env.DATABASE_URL = `file:${directory}/blog.sqlite`;
  process.env.UPLOAD_DIR = `${directory}/uploads`;
  process.env.PAYLOAD_SECRET = "disposable-query-fixture-secret-of-at-least-32-characters";
  await mkdir(process.env.UPLOAD_DIR);
  // Config must load after isolated paths are assigned, not from the ambient deployment environment.
  const { default: config } = await import("../../payload.config");
  payload = await getPayload({ config });
  await payload.db.migrate();
  await withAdministratorMaintenance(() => payload.create({ collection: "administrators", data: { email: "queries@example.test", password: "Disposable-query-password-42!" }, overrideAccess: true }));
});
afterAll(async () => {
  await payload?.destroy();
  if (directory) await rm(directory, { recursive: true, force: true });
});

describe("public and preview query boundaries", () => {
  it("keeps listing, metadata, structured data and sitemap on the public snapshot until explicit publication", async () => {
    expect((await getPublishedAnnouncementsPage(1)).docs).toEqual([]);
    const created: Announcement[] = [];
    for (let index = 0; index < 11; index++) created.push(await withCmsMutation(() => payload.create({ collection: "announcements", data: { title: `Public article ${index}`, summary: `Public summary ${index}`, body: body(`Public content ${index}`), _status: "published" } })));
    const first = await getPublishedAnnouncementsPage(1);
    const second = await getPublishedAnnouncementsPage(2);
    expect(first.docs.map((doc) => doc.id)).toEqual(created.slice(1).reverse().map((doc) => doc.id));
    expect(second.docs.map((doc) => doc.id)).toEqual([created[0].id]);
    expect(first.hasNextPage).toBe(true);
    expect(second.hasNextPage).toBe(false);
    const article = created.at(-1)!;
    await withCmsMutation(() => payload.update({ collection: "announcements", id: article.id, draft: true, data: { title: "Secret pending headline", summary: "Private pending description", body: body("Private pending body"), _status: "draft" } }));
    const published = (await getPublishedAnnouncement(article.slug!))!;
    expect(published.title).toBe(article.title);
    expect(published.summary).toBe(article.summary);
    expect(published.body).toEqual(article.body);
    const canonical = `https://goodmangoc.com/blog/${article.slug}`;
    const metadata = getBlogArticleMetadata(published, canonical);
    expect(metadata.title).toBe(article.title);
    expect(metadata.description).toBe(article.summary);
    expect(metadata.alternates?.canonical).toBe(canonical);
    expect(JSON.stringify(metadata)).not.toContain("Secret pending");
    const structured = JSON.parse(createBlogPostingJsonLd(published, canonical));
    expect(structured.headline).toBe(article.title);
    expect(structured.datePublished).toBe(article.publishedAt);
    expect(structured.author).toMatchObject({ "@type": "Organization", name: "Goodman Group" });
    expect(await getPublishedAnnouncementSlugs()).toContain(article.slug);
    expect(await getPublishedAnnouncement("missing-announcement")).toBeNull();
    expect(await getAuthenticatedDraft(String(article.id), new Headers())).toEqual({ authenticated: false, announcement: null });
    const { token } = await payload.login({ collection: "administrators", data: { email: "queries@example.test", password: "Disposable-query-password-42!" } });
    const preview = await getAuthenticatedDraft(String(article.id), new Headers({ cookie: `${payload.config.cookiePrefix}-token=${token}`, "sec-fetch-site": "same-origin" }));
    expect(preview.authenticated).toBe(true);
    expect(preview.announcement?.title).toBe("Secret pending headline");
    await withCmsMutation(() => payload.update({ collection: "announcements", id: article.id, data: { _status: "draft" } }));
    expect(await getPublishedAnnouncement(article.slug!)).toBeNull();
    expect(await getPublishedAnnouncementSlugs()).not.toContain(article.slug);
  });

  it("escapes script-closing text in structured data and refuses remote social images", () => {
    const article: Announcement = { id: 999, title: "</script><script>unsafe</script>", summary: "Summary", createdAt: "2026-10-30T00:00:00.000Z", updatedAt: "2026-10-30T00:00:00.000Z", publishedAt: "2026-10-30T00:00:00.000Z", coverImage: { id: 999, alt: "Remote image", url: "https://external.example/photo.jpg", createdAt: "2026-10-30T00:00:00.000Z", updatedAt: "2026-10-30T00:00:00.000Z" } };
    const json = createBlogPostingJsonLd(article, "https://goodmangoc.com/blog/safe-url");
    expect(json).not.toContain("<");
    expect(JSON.parse(json).headline).toBe(article.title);
    expect(getAnnouncementImageURL(article)).toBeUndefined();
  });
});
