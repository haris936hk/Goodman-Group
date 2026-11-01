// @vitest-environment node
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { renderToStaticMarkup } from "react-dom/server";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { getPayload, type Payload } from "payload";
import sharp from "sharp";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { getURLFromRedirectError } from "next/dist/client/components/redirect";
import {
  isHTTPAccessFallbackError,
  getAccessFallbackHTTPStatus,
} from "next/dist/client/components/http-access-fallback/http-access-fallback";

// Replace only Next's import-time environment sentinel; all CMS reads use real SQLite.
vi.mock("server-only", () => ({}));

// Mock Next headers only to inject real authenticated cookie headers with sec-fetch-site same-origin.
let currentHeaders = new Headers();
vi.mock("next/headers", () => ({
  headers: vi.fn(async () => currentHeaders),
}));

import { withCmsMutation } from "../../src/cms/mutation-gate";
import { withAdministratorMaintenance } from "../../src/cms/administrator-maintenance";
import { SITE_ORIGIN } from "../../src/data/goodman-group";
import type { Announcement, Media } from "../../src/payload-types";
import BlogPage, {
  generateMetadata as generateBlogMetadata,
} from "../../src/app/(website)/blog/page";
import BlogArticlePage, {
  generateMetadata as generateArticleMetadata,
} from "../../src/app/(website)/blog/[slug]/page";
import AnnouncementPreviewPage from "../../src/app/(website)/blog/preview/[id]/page";

let payload: Payload;
let directory: string;
let adminToken: string;

const createBody = (text: string): NonNullable<Announcement["body"]> => ({
  root: {
    type: "root",
    version: 1,
    direction: null,
    format: "",
    indent: 0,
    children: [
      {
        type: "paragraph",
        version: 1,
        direction: null,
        format: "",
        indent: 0,
        children: [
          {
            type: "text",
            version: 1,
            text,
            format: 0,
            detail: 0,
            mode: "normal",
            style: "",
          },
        ],
      },
    ],
  },
});

async function addMedia(
  bytes: Buffer,
  extension = "png",
  alt = "Meaningful image description",
  caption?: string,
): Promise<Media> {
  const inputPath = path.join(directory, `upload-${randomUUID()}.${extension}`);
  await writeFile(inputPath, bytes);
  try {
    return await withCmsMutation(() =>
      payload.create({
        collection: "media",
        data: { alt, ...(caption !== undefined ? { caption } : {}) },
        filePath: inputPath,
      }),
    );
  } finally {
    await rm(inputPath, { force: true });
  }
}

function getErrorDigest(error: unknown): string | undefined {
  if (typeof error === "object" && error !== null && "digest" in error) {
    const candidate = error.digest;
    return typeof candidate === "string" ? candidate : undefined;
  }
  return undefined;
}

async function expectNotFound(action: () => Promise<unknown>) {
  try {
    await action();
    expect.fail("Expected notFound() to be thrown");
  } catch (error) {
    expect(isHTTPAccessFallbackError(error)).toBe(true);
    if (!isHTTPAccessFallbackError(error)) throw error;
    expect(getAccessFallbackHTTPStatus(error)).toBe(404);
    expect(getErrorDigest(error)).toBe("NEXT_HTTP_ERROR_FALLBACK;404");
  }
}

async function expectRedirect(action: () => Promise<unknown>, expectedDestination: string) {
  try {
    await action();
    expect.fail(`Expected redirect to ${expectedDestination}`);
  } catch (error) {
    expect(isRedirectError(error)).toBe(true);
    if (!isRedirectError(error)) throw error;
    expect(getURLFromRedirectError(error)).toBe(expectedDestination);
    expect(getErrorDigest(error)).toBe(
      `NEXT_REDIRECT;replace;${expectedDestination};307;`,
    );
  }
}

beforeAll(async () => {
  directory = await mkdtemp(path.join(tmpdir(), "goodman-cms-blog-rendering-"));
  process.env.DATABASE_URL = `file:${directory}/blog.sqlite`;
  process.env.UPLOAD_DIR = `${directory}/uploads`;
  process.env.PAYLOAD_SECRET = "disposable-blog-rendering-secret-of-at-least-32-chars";
  await mkdir(process.env.UPLOAD_DIR);

  // Load config lazily after isolated paths and secret are assigned to the environment.
  const { default: config } = await import("../../payload.config");
  payload = await getPayload({ config });
  await payload.db.migrate();

  await withAdministratorMaintenance(() =>
    payload.create({
      collection: "administrators",
      data: {
        email: "blog-renderer-admin@example.test",
        password: "Admin-password-42!",
      },
      overrideAccess: true,
    }),
  );

  const loginResult = await payload.login({
    collection: "administrators",
    data: {
      email: "blog-renderer-admin@example.test",
      password: "Admin-password-42!",
    },
  });
  adminToken = loginResult.token!;
});

afterAll(async () => {
  await payload?.destroy();
  if (directory) await rm(directory, { recursive: true, force: true });
});

beforeEach(() => {
  currentHeaders = new Headers();
});

describe("blog listing server rendering", () => {
  it("renders an accessible empty listing state when no announcements are published", async () => {
    const pageJsx = await BlogPage({ searchParams: Promise.resolve({}) });
    const html = renderToStaticMarkup(pageJsx);

    expect(html).toContain('class="blog-empty-state"');
    expect(html).toContain("No announcements yet");
    expect(html).toContain("Goodman Group news and announcements will appear here.");
    expect(html).not.toContain("blog-pagination");
    expect(html).not.toContain("blog-card");

    const metadata = await generateBlogMetadata({ searchParams: Promise.resolve({}) });
    expect(metadata.title).toBe("Blog");
    expect(metadata.alternates?.canonical).toBe("/blog");
  });

  it("normalizes invalid page parameters and page=1 via redirects", async () => {
    // Exact page 1 queries redirect to canonical /blog root
    await expectRedirect(() => BlogPage({ searchParams: Promise.resolve({ page: "1" }) }), "/blog");

    // Invalid non-positive, zero, or non-numeric page values redirect to /blog
    await expectRedirect(() => BlogPage({ searchParams: Promise.resolve({ page: "0" }) }), "/blog");
    await expectRedirect(() => BlogPage({ searchParams: Promise.resolve({ page: "-5" }) }), "/blog");
    await expectRedirect(() => BlogPage({ searchParams: Promise.resolve({ page: "abc" }) }), "/blog");

    // Array page parameter redirects to canonical /blog
    await expectRedirect(
      () => BlogPage({ searchParams: Promise.resolve({ page: ["1", "2"] }) }),
      "/blog",
    );

    // Non-canonical page formats (e.g. leading zero) redirect to normalized integer representation
    await expectRedirect(
      () => BlogPage({ searchParams: Promise.resolve({ page: "02" }) }),
      "/blog?page=2",
    );
  });

  it("renders 10 items per page with accessible pagination links and previous/next controls", async () => {
    // Seed 11 announcements so pagination splits across page 1 (10 items) and page 2 (1 item)
    const seeded: Announcement[] = [];
    for (let index = 1; index <= 11; index++) {
      const doc = await withCmsMutation(() =>
        payload.create({
          collection: "announcements",
          data: {
            title: `Seeded Announcement ${index.toString().padStart(2, "0")}`,
            summary: `Public summary for announcement ${index}`,
            body: createBody(`Paragraph content for announcement ${index}.`),
            relatedCompanies: ["goodman-laboratories"],
            _status: "published",
          },
        }),
      );
      seeded.push(doc);
    }

    // Render page 1
    const page1Jsx = await BlogPage({ searchParams: Promise.resolve({}) });
    const page1Html = renderToStaticMarkup(page1Jsx);

    const page1Cards = page1Html.match(/class="blog-card"/g) || [];
    expect(page1Cards).toHaveLength(10);
    expect(page1Html).toContain('class="blog-pagination"');
    expect(page1Html).toContain('aria-label="Blog pagination"');
    expect(page1Html).toContain('href="/blog?page=2"');
    expect(page1Html).toContain('aria-label="Next page"');
    expect(page1Html).toContain("Next →");
    expect(page1Html).toContain("Page 1 of 2");
    expect(page1Html).not.toContain('aria-label="Previous page"');

    // Page 1 contains newest doc (index 11) and does not contain oldest doc (index 1)
    expect(page1Html).toContain("Seeded Announcement 11");
    expect(page1Html).not.toContain("Seeded Announcement 01");

    const page1Metadata = await generateBlogMetadata({ searchParams: Promise.resolve({}) });
    expect(page1Metadata.alternates?.canonical).toBe("/blog");

    // Render page 2
    const page2Jsx = await BlogPage({ searchParams: Promise.resolve({ page: "2" }) });
    const page2Html = renderToStaticMarkup(page2Jsx);

    const page2Cards = page2Html.match(/class="blog-card"/g) || [];
    expect(page2Cards).toHaveLength(1);
    expect(page2Html).toContain('href="/blog"');
    expect(page2Html).toContain('aria-label="Previous page"');
    expect(page2Html).toContain("← Previous");
    expect(page2Html).toContain("Page 2 of 2");
    expect(page2Html).not.toContain('aria-label="Next page"');
    expect(page2Html).toContain("Seeded Announcement 01");

    const page2Metadata = await generateBlogMetadata({
      searchParams: Promise.resolve({ page: "2" }),
    });
    expect(page2Metadata.alternates?.canonical).toBe("/blog?page=2");
  });

  it("throws notFound for positive out-of-range pages and non-safe integers", async () => {
    // Current database has 2 total pages; page 3 is out of range
    await expectNotFound(() => BlogPage({ searchParams: Promise.resolve({ page: "3" }) }));
    await expectNotFound(() => BlogPage({ searchParams: Promise.resolve({ page: "999" }) }));

    // Unsafe integer page number triggers notFound
    await expectNotFound(() =>
      BlogPage({ searchParams: Promise.resolve({ page: "9007199254740992" }) }),
    );
  });
});

describe("blog article server rendering and metadata immutability", () => {
  it("renders full published article details and preserves public snapshot across draft edits", async () => {
    const imgBuffer = await sharp({
      create: {
        width: 64,
        height: 48,
        channels: 3,
        background: { r: 180, g: 35, b: 44 },
      },
    })
      .png()
      .toBuffer();

    const media = await addMedia(
      imgBuffer,
      "png",
      "Laboratory synthesis station",
      "Synthesis cleanroom facility",
    );

    const article = await withCmsMutation(() =>
      payload.create({
        collection: "announcements",
        data: {
          title: "Revolutionary Clinical Synthesis Platform",
          summary: "Summary of new synthesis platform release.",
          body: createBody("Goodman Laboratories announced general availability of the platform."),
          relatedCompanies: ["goodman-laboratories"],
          coverImage: media.id,
          _status: "published",
        },
      }),
    );

    const slug = article.slug!;
    const canonicalURL = `${SITE_ORIGIN}/blog/${encodeURIComponent(slug)}`;

    // Initial public render
    const initialJsx = await BlogArticlePage({ params: Promise.resolve({ slug }) });
    const initialHtml = renderToStaticMarkup(initialJsx);

    expect(initialHtml).toContain("Revolutionary Clinical Synthesis Platform");
    expect(initialHtml).toContain("Summary of new synthesis platform release.");
    expect(initialHtml).toContain("Goodman Laboratories announced general availability of the platform.");
    expect(initialHtml).toContain("/companies/goodman-laboratories");
    expect(initialHtml).toContain("Goodman Laboratories");
    expect(initialHtml).toContain("<time dateTime=");
    expect(initialHtml).toContain("Synthesis cleanroom facility");
    expect(initialHtml).toContain("Laboratory synthesis station");
    expect(initialHtml).toContain('href="/blog"');
    expect(initialHtml).not.toContain("PRIVATE PREVIEW");

    const jsonLdMatch = initialHtml.match(/<script type="application\/ld\+json">(.*?)<\/script>/);
    expect(jsonLdMatch).toBeTruthy();
    const jsonLd = JSON.parse(jsonLdMatch![1]);
    expect(jsonLd["@type"]).toBe("BlogPosting");
    expect(jsonLd.headline).toBe("Revolutionary Clinical Synthesis Platform");
    expect(jsonLd.description).toBe("Summary of new synthesis platform release.");
    expect(jsonLd.author?.name).toBe("Goodman Group");
    expect(jsonLd.datePublished).toBe(article.publishedAt);

    const initialMetadata = await generateArticleMetadata({ params: Promise.resolve({ slug }) });
    expect(initialMetadata.title).toBe("Revolutionary Clinical Synthesis Platform");
    expect(initialMetadata.description).toBe("Summary of new synthesis platform release.");
    expect(initialMetadata.alternates?.canonical).toBe(canonicalURL);

    // Save pending draft modifications without publishing
    await withCmsMutation(() =>
      payload.update({
        collection: "announcements",
        id: article.id,
        draft: true,
        data: {
          title: "CONFIDENTIAL UNPUBLISHED REVISION",
          summary: "Private unapproved revision summary.",
          body: createBody("Confidential unreleased clinical formula."),
          _status: "draft",
        },
      }),
    );

    // Re-render public article page; must remain locked to published version
    const publicJsx = await BlogArticlePage({ params: Promise.resolve({ slug }) });
    const publicHtml = renderToStaticMarkup(publicJsx);

    expect(publicHtml).toContain("Revolutionary Clinical Synthesis Platform");
    expect(publicHtml).toContain("Summary of new synthesis platform release.");
    expect(publicHtml).toContain("Goodman Laboratories announced general availability of the platform.");
    expect(publicHtml).toContain("Goodman Laboratories");
    expect(publicHtml).toContain("<time dateTime=");
    expect(publicHtml).not.toContain("CONFIDENTIAL UNPUBLISHED REVISION");
    expect(publicHtml).not.toContain("Private unapproved revision summary.");
    expect(publicHtml).not.toContain("Confidential unreleased clinical formula.");

    const publicMetadata = await generateArticleMetadata({ params: Promise.resolve({ slug }) });
    expect(publicMetadata.title).toBe("Revolutionary Clinical Synthesis Platform");
    expect(publicMetadata.description).toBe("Summary of new synthesis platform release.");
    expect(JSON.stringify(publicMetadata)).not.toContain("CONFIDENTIAL");
    expect(JSON.stringify(publicMetadata)).not.toContain("unapproved");

    const publicJsonLdMatch = publicHtml.match(
      /<script type="application\/ld\+json">(.*?)<\/script>/,
    );
    expect(publicJsonLdMatch).toBeTruthy();
    const publicJsonLd = JSON.parse(publicJsonLdMatch![1]);
    expect(publicJsonLd.headline).toBe("Revolutionary Clinical Synthesis Platform");
    expect(publicJsonLd.description).toBe("Summary of new synthesis platform release.");
  });

  it("throws notFound for missing article slug or draft-only article", async () => {
    // Missing slug throws notFound
    await expectNotFound(() =>
      BlogArticlePage({ params: Promise.resolve({ slug: "non-existent-article" }) }),
    );

    const missingMetadata = await generateArticleMetadata({
      params: Promise.resolve({ slug: "non-existent-article" }),
    });
    expect(missingMetadata.title).toBe("Announcement not found");
    expect(missingMetadata.robots).toEqual({ index: false, follow: false });

    // Draft-only announcement never published is inaccessible on public route
    const draftOnly = await withCmsMutation(() =>
      payload.create({
        collection: "announcements",
        draft: true,
        data: {
          title: "Never Published Announcement",
          summary: "Draft-only summary",
          body: createBody("Draft-only body"),
          _status: "draft",
        },
      }),
    );

    await expectNotFound(() =>
      BlogArticlePage({ params: Promise.resolve({ slug: draftOnly.slug! }) }),
    );
  });
});

describe("private preview server rendering and authentication", () => {
  it("renders login required view when unauthenticated or lacking same-origin security header", async () => {
    const article = await withCmsMutation(() =>
      payload.create({
        collection: "announcements",
        draft: true,
        data: {
          title: "Exclusive Private Preview Item",
          summary: "Private preview summary",
          body: createBody("Exclusive internal discussion."),
          _status: "draft",
        },
      }),
    );

    // Unauthenticated request without cookies renders login view without 404
    currentHeaders = new Headers();
    const unauthJsx = await AnnouncementPreviewPage({
      params: Promise.resolve({ id: String(article.id) }),
    });
    const unauthHtml = renderToStaticMarkup(unauthJsx);

    expect(unauthHtml).toContain("Administrator sign-in required");
    expect(unauthHtml).toContain(
      "Sign in to the Goodman Group administrator account to preview a saved announcement draft.",
    );
    expect(unauthHtml).toContain('href="/admin/login"');
    expect(unauthHtml).not.toContain("PRIVATE PREVIEW · SAVED DRAFT");
    expect(unauthHtml).not.toContain("Exclusive Private Preview Item");

    // Invalid cookie also renders login view
    currentHeaders = new Headers({
      cookie: "payload-token=invalid-spoofed-session-token",
      "sec-fetch-site": "same-origin",
    });
    const invalidJsx = await AnnouncementPreviewPage({
      params: Promise.resolve({ id: String(article.id) }),
    });
    const invalidHtml = renderToStaticMarkup(invalidJsx);
    expect(invalidHtml).toContain("Administrator sign-in required");
    expect(invalidHtml).not.toContain("Exclusive Private Preview Item");
  });

  it("renders saved-draft preview with draft content when authenticated with same-origin header", async () => {
    const article = await withCmsMutation(() =>
      payload.create({
        collection: "announcements",
        draft: true,
        data: {
          title: "Confidential Pending Release",
          summary: "Pending description for administrators only.",
          body: createBody("Detailed draft specifications."),
          relatedCompanies: ["goodman-laboratories"],
          _status: "draft",
        },
      }),
    );

    currentHeaders = new Headers({
      cookie: `${payload.config.cookiePrefix}-token=${adminToken}`,
      "sec-fetch-site": "same-origin",
    });

    const previewJsx = await AnnouncementPreviewPage({
      params: Promise.resolve({ id: String(article.id) }),
    });
    const previewHtml = renderToStaticMarkup(previewJsx);

    expect(previewHtml).toContain("PRIVATE PREVIEW · SAVED DRAFT");
    expect(previewHtml).toContain("Confidential Pending Release");
    expect(previewHtml).toContain("Pending description for administrators only.");
    expect(previewHtml).toContain("Detailed draft specifications.");
    expect(previewHtml).toContain("Goodman Laboratories");
    expect(previewHtml).toContain('href="/blog"');
    expect(previewHtml).not.toContain("Administrator sign-in required");
    expect(previewHtml).not.toContain('<script type="application/ld+json">');
  });

  it("throws notFound for non-existent or invalid announcement id when authenticated", async () => {
    currentHeaders = new Headers({
      cookie: `${payload.config.cookiePrefix}-token=${adminToken}`,
      "sec-fetch-site": "same-origin",
    });

    // Non-existent numeric ID throws notFound
    await expectNotFound(() =>
      AnnouncementPreviewPage({ params: Promise.resolve({ id: "999999" }) }),
    );

    // Non-numeric ID throws notFound
    await expectNotFound(() =>
      AnnouncementPreviewPage({ params: Promise.resolve({ id: "invalid-id" }) }),
    );
  });

  it("gracefully renders incomplete saved drafts with untitled fallback and omitted missing fields", async () => {
    // Draft without title, summary, date, cover image, or related companies
    const incompleteDraft = await withCmsMutation(() =>
      payload.create({
        collection: "announcements",
        draft: true,
        data: {
          title: "   ",
          _status: "draft",
        },
      }),
    );

    currentHeaders = new Headers({
      cookie: `${payload.config.cookiePrefix}-token=${adminToken}`,
      "sec-fetch-site": "same-origin",
    });

    const incompleteJsx = await AnnouncementPreviewPage({
      params: Promise.resolve({ id: String(incompleteDraft.id) }),
    });
    const incompleteHtml = renderToStaticMarkup(incompleteJsx);

    expect(incompleteHtml).toContain("PRIVATE PREVIEW · SAVED DRAFT");
    expect(incompleteHtml).toContain("Untitled announcement");
    expect(incompleteHtml).toContain("Goodman Group");
    expect(incompleteHtml).not.toContain("<time dateTime=");
    expect(incompleteHtml).not.toContain('class="blog-article-summary"');
    expect(incompleteHtml).not.toContain('class="blog-cover-figure"');
    expect(incompleteHtml).toContain('href="/blog"');
  });
});
