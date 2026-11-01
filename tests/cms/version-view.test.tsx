// @vitest-environment node
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { renderToStaticMarkup } from "react-dom/server";
import { JSDOM } from "jsdom";
import { RichText } from "../../src/lib/blog/rich-text";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import {
  createLocalReq,
  getPayload,
  type DocumentViewServerProps,
  type Payload,
  type SanitizedCollectionConfig,
  type TypedUser,
} from "payload";
import { withAdministratorMaintenance } from "../../src/cms/administrator-maintenance";
import { withCmsMutation } from "../../src/cms/mutation-gate";
import type { Administrator, Announcement, Media } from "../../src/payload-types";

// Replace only Next's import-time environment sentinel; all CMS reads use real SQLite.
vi.mock("server-only", () => ({}));

// Mock only the client RestoreAsDraftButton framework boundary; no version/content query mocks.
vi.mock("../../src/cms/admin/restore-as-draft-button", () => ({
  RestoreAsDraftButton: ({ documentId, versionId }: { documentId: string; versionId: string }) => (
    <div data-testid="restore-as-draft-button" data-document-id={documentId} data-version-id={versionId}>
      <button type="button">Restore as draft</button>
    </div>
  ),
}));

import { RestoreAsDraftView } from "../../src/cms/admin/restore-as-draft";

let payload: Payload;
let directory: string;
type TestAdminUser = Administrator & { collection: "administrators" };
let user: TestAdminUser;

const body = (text: string): NonNullable<Announcement["body"]> => ({
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

async function makePngBytes(r = 30, g = 60, b = 90): Promise<Buffer> {
  return sharp({
    create: {
      width: 32,
      height: 32,
      channels: 3,
      background: { r, g, b },
    },
  })
    .png()
    .toBuffer();
}

async function addMedia(
  bytes: Buffer,
  alt = "Test cover image",
  extension = "png",
): Promise<Media> {
  const inputPath = path.join(directory, `upload-${randomUUID()}.${extension}`);
  await writeFile(inputPath, bytes);
  try {
    return await withCmsMutation(() =>
      payload.create({
        collection: "media",
        data: { alt },
        filePath: inputPath,
      })
    );
  } finally {
    await rm(inputPath, { force: true });
  }
}

async function createViewProps(options: {
  docID: number | string;
  versionId: number | string;
  user?: TypedUser | null;
  collectionConfig?: SanitizedCollectionConfig | { slug: string; [key: string]: unknown };
  searchParams?: Record<string, string | string[] | undefined>;
}): Promise<DocumentViewServerProps> {
  const req = await createLocalReq(
    {
      user: options.user ?? undefined,
      req: {
        url: `http://localhost:3000/admin/collections/announcements/${options.docID}/versions/${options.versionId}`,
        headers: new Headers({ origin: "http://localhost:3000" }),
      },
    },
    payload,
  );

  return {
    initPageResult: {
      collectionConfig: (options.collectionConfig !== undefined
        ? options.collectionConfig
        : payload.collections["announcements"].config) as unknown as SanitizedCollectionConfig,
      docID: options.docID,
      req,
    },
    routeSegments: [
      "admin",
      "collections",
      "announcements",
      String(options.docID),
      "versions",
      String(options.versionId),
    ],
    searchParams: options.searchParams ?? {},
    i18n: req.i18n ?? { language: "en" },
  } as unknown as DocumentViewServerProps;
}

beforeAll(async () => {
  directory = await mkdtemp(path.join(tmpdir(), "goodman-cms-version-view-"));
  process.env.DATABASE_URL = `file:${directory}/blog.sqlite`;
  process.env.UPLOAD_DIR = `${directory}/uploads`;
  process.env.PAYLOAD_SECRET = "disposable-version-view-fixture-secret-of-32-chars";
  await mkdir(process.env.UPLOAD_DIR);
  // Dynamic import exception: payload.config must load only after temporary DATABASE_URL and UPLOAD_DIR are set in the isolated environment.
  const { default: config } = await import("../../payload.config");
  payload = await getPayload({ config });
  await payload.db.migrate();
  await withAdministratorMaintenance(() =>
    payload.create({
      collection: "administrators",
      data: {
        email: "version-view@example.test",
        password: "Disposable-version-password-42!",
      },
      overrideAccess: true,
    })
  );
  const account = (
    await payload.find({ collection: "administrators", overrideAccess: true })
  ).docs[0];
  user = { ...account, collection: "administrators" as const };
});

afterAll(async () => {
  await payload?.destroy();
  if (directory) await rm(directory, { recursive: true, force: true });
});

describe("RestoreAsDraftView custom admin version comparison", () => {
  it("matches numeric SQLite IDs from string query param versionFrom rather than falling back to adjacent revision", async () => {
    const article = await withCmsMutation(() =>
      payload.create({
        collection: "announcements",
        data: {
          title: "Revision 1 Title",
          summary: "Revision 1 Summary",
          body: body("Revision 1 Body Text"),
          _status: "published",
        },
      })
    );

    await withCmsMutation(() =>
      payload.update({
        collection: "announcements",
        id: article.id,
        draft: true,
        data: {
          title: "Revision 2 Title",
          summary: "Revision 2 Summary",
          body: body("Revision 2 Body Text"),
          _status: "draft",
        },
      })
    );

    await withCmsMutation(() =>
      payload.update({
        collection: "announcements",
        id: article.id,
        draft: true,
        data: {
          title: "Revision 3 Title",
          summary: "Revision 3 Summary",
          body: body("Revision 3 Body Text"),
          _status: "draft",
        },
      })
    );

    const versionResult = await payload.findVersions({
      collection: "announcements",
      where: { parent: { equals: article.id } },
      sort: "-updatedAt",
    });

    expect(versionResult.docs.length).toBeGreaterThanOrEqual(3);
    const [v3, v2, v1] = versionResult.docs;
    expect(typeof v1.id).toBe("number");
    expect(typeof v2.id).toBe("number");
    expect(typeof v3.id).toBe("number");

    // 1. Without versionFrom param: defaults to adjacent previous revision (v2)
    const defaultProps = await createViewProps({
      docID: article.id,
      versionId: v3.id,
      user,
    });
    const defaultHtml = renderToStaticMarkup(await RestoreAsDraftView(defaultProps));

    expect(defaultHtml).toContain("Revision 2 Title");
    expect(defaultHtml).toContain("Revision 3 Title");
    expect(defaultHtml).not.toContain("Revision 1 Title");

    // 2. With string query param versionFrom: matches numeric SQLite ID for v1 rather than adjacent v2
    const explicitProps = await createViewProps({
      docID: article.id,
      versionId: v3.id,
      user,
      searchParams: { versionFrom: String(v1.id) },
    });
    const explicitHtml = renderToStaticMarkup(await RestoreAsDraftView(explicitProps));

    expect(explicitHtml).toContain("Revision 1 Title");
    expect(explicitHtml).toContain("Revision 3 Title");
    expect(explicitHtml).not.toContain("Revision 2 Title");
  });

  it("supports current-main and empty source comparison choices", async () => {
    const article = await withCmsMutation(() =>
      payload.create({
        collection: "announcements",
        data: {
          title: "Live Main Headline",
          summary: "Live Main Summary",
          body: body("Live Main Body Content"),
          _status: "published",
        },
      })
    );

    await withCmsMutation(() =>
      payload.update({
        collection: "announcements",
        id: article.id,
        draft: true,
        data: {
          title: "Draft Revised Headline",
          summary: "Draft Revised Summary",
          body: body("Draft Revised Body Content"),
          _status: "draft",
        },
      })
    );

    const versionResult = await payload.findVersions({
      collection: "announcements",
      where: { parent: { equals: article.id } },
      sort: "-updatedAt",
    });
    const latestDraft = versionResult.docs[0];

    // Choice A: versionFrom="main"
    const mainProps = await createViewProps({
      docID: article.id,
      versionId: latestDraft.id,
      user,
      searchParams: { versionFrom: "main" },
    });
    const mainHtml = renderToStaticMarkup(await RestoreAsDraftView(mainProps));

    expect(mainHtml).toContain("Live Main Headline");
    expect(mainHtml).toContain("Draft Revised Headline");

    // Choice B: versionFrom="empty"
    const emptyProps = await createViewProps({
      docID: article.id,
      versionId: latestDraft.id,
      user,
      searchParams: { versionFrom: "empty" },
    });
    const emptyHtml = renderToStaticMarkup(await RestoreAsDraftView(emptyProps));

    expect(emptyHtml).toContain("Draft Revised Headline");
  });

  it("renders only differing fields by default and renders all fields when showAll is true", async () => {
    const article = await withCmsMutation(() =>
      payload.create({
        collection: "announcements",
        data: {
          title: "Shared Fixed Title",
          summary: "Shared Fixed Summary",
          body: body("Original Distinct Body"),
          relatedCompanies: ["goodman-billing"],
          _status: "published",
        },
      })
    );

    await withCmsMutation(() =>
      payload.update({
        collection: "announcements",
        id: article.id,
        draft: true,
        data: {
          title: "Shared Fixed Title",
          summary: "Shared Fixed Summary",
          body: body("Modified Distinct Body"),
          relatedCompanies: ["goodman-billing"],
          _status: "draft",
        },
      })
    );

    const versionResult = await payload.findVersions({
      collection: "announcements",
      where: { parent: { equals: article.id } },
      sort: "-updatedAt",
    });
    const [v2, v1] = versionResult.docs;

    // Default: only differing fields (Body differs, Title / Summary / Related companies are identical)
    const diffOnlyProps = await createViewProps({
      docID: article.id,
      versionId: v2.id,
      user,
      searchParams: { versionFrom: String(v1.id) },
    });
    const diffOnlyHtml = renderToStaticMarkup(await RestoreAsDraftView(diffOnlyProps));

    expect(diffOnlyHtml).toContain('<th scope="row">Body</th>');
    expect(diffOnlyHtml).toContain("Original Distinct Body");
    expect(diffOnlyHtml).toContain("Modified Distinct Body");
    expect(diffOnlyHtml).not.toContain('<th scope="row">Title</th>');
    expect(diffOnlyHtml).not.toContain('<th scope="row">Summary</th>');
    expect(diffOnlyHtml).not.toContain('<th scope="row">Related companies</th>');
    expect(diffOnlyHtml).not.toContain('<th scope="row">Cover image</th>');

    // With showAll="true": all editable content fields are rendered
    const showAllProps = await createViewProps({
      docID: article.id,
      versionId: v2.id,
      user,
      searchParams: { versionFrom: String(v1.id), showAll: "true" },
    });
    const showAllHtml = renderToStaticMarkup(await RestoreAsDraftView(showAllProps));

    expect(showAllHtml).toContain('<th scope="row">Title</th>');
    expect(showAllHtml).toContain('<th scope="row">Summary</th>');
    expect(showAllHtml).toContain('<th scope="row">Body</th>');
    expect(showAllHtml).toContain('<th scope="row">Cover image</th>');
    expect(showAllHtml).toContain('<th scope="row">Related companies</th>');
    expect(showAllHtml).toContain("Shared Fixed Title");
    expect(showAllHtml).toContain("Shared Fixed Summary");
    expect(showAllHtml).toMatch(/name="showAll"[^>]*checked/);

    // A distinct saved revision can contain the same editable content.
    await withCmsMutation(() => payload.update({
      collection: "announcements", id: article.id, draft: true,
      data: { body: body("Original Distinct Body"), _status: "draft" },
    }));
    const matching = await payload.findVersions({ collection: "announcements", where: { parent: { equals: article.id } }, sort: "-id", limit: 1 });
    const identicalProps = await createViewProps({
      docID: article.id, versionId: matching.docs[0].id, user,
      searchParams: { versionFrom: String(v1.id) },
    });
    const identicalHtml = renderToStaticMarkup(await RestoreAsDraftView(identicalProps));
    expect(identicalHtml).not.toContain("<table>");
  });

  it("displays rich body text and cover image identity across differing revisions", async () => {
    const imgA = await makePngBytes(15, 25, 35);
    const imgB = await makePngBytes(45, 55, 65);
    const mediaA = await addMedia(imgA, "Cover artwork Alpha");
    const mediaB = await addMedia(imgB, "Cover artwork Beta");

    const article = await withCmsMutation(() =>
      payload.create({
        collection: "announcements",
        data: {
          title: "Media Visual Article",
          summary: "Summary for visual comparison",
          body: body("Body text for revision Alpha with details"),
          coverImage: mediaA.id,
          _status: "published",
        },
      })
    );

    await withCmsMutation(() =>
      payload.update({
        collection: "announcements",
        id: article.id,
        draft: true,
        data: {
          title: "Media Visual Article",
          summary: "Summary for visual comparison",
          body: body("Body text for revision Beta with updated insights"),
          coverImage: mediaB.id,
          _status: "draft",
        },
      })
    );

    const versionResult = await payload.findVersions({
      collection: "announcements",
      where: { parent: { equals: article.id } },
      sort: "-updatedAt",
    });
    const [vBeta, vAlpha] = versionResult.docs;

    const props = await createViewProps({
      docID: article.id,
      versionId: vBeta.id,
      user,
      searchParams: { versionFrom: String(vAlpha.id) },
    });
    const html = renderToStaticMarkup(await RestoreAsDraftView(props));

    // Body text visible across revisions
    expect(html).toContain("Body text for revision Alpha with details");
    expect(html).toContain("Body text for revision Beta with updated insights");

    // Cover image identity visible across revisions (rendered via describeCoverImage)
    expect(html).toContain(`Media #${mediaA.id}`);
    expect(html).toContain(`Media #${mediaB.id}`);

    // Cover image transition from none to attached
    await withCmsMutation(() =>
      payload.update({
        collection: "announcements",
        id: article.id,
        draft: true,
        data: {
          title: "Media Visual Article",
          summary: "Summary for visual comparison",
          body: body("Body text for revision Gamma"),
          coverImage: null,
          _status: "draft",
        },
      })
    );

    const updatedVersions = await payload.findVersions({
      collection: "announcements",
      where: { parent: { equals: article.id } },
      sort: "-updatedAt",
    });
    const vGamma = updatedVersions.docs[0];

    const noCoverProps = await createViewProps({
      docID: article.id,
      versionId: vGamma.id,
      user,
      searchParams: { versionFrom: String(vBeta.id) },
    });
    const noCoverHtml = renderToStaticMarkup(await RestoreAsDraftView(noCoverProps));

    expect(noCoverHtml).toContain(`Media #${mediaB.id}`);
    expect(noCoverHtml).toContain("No cover image");
  });

  it("calls notFound for anonymous user, mismatched parent document, or missing resources", async () => {
    const article = await withCmsMutation(() =>
      payload.create({
        collection: "announcements",
        data: {
          title: "Security Test Article",
          summary: "Security Summary",
          body: body("Security Body Text"),
          _status: "published",
        },
      })
    );

    const otherArticle = await withCmsMutation(() =>
      payload.create({
        collection: "announcements",
        data: {
          title: "Other Parent Article",
          summary: "Other Summary",
          body: body("Other Body Text"),
          _status: "published",
        },
      })
    );

    const articleVersions = await payload.findVersions({
      collection: "announcements",
      where: { parent: { equals: article.id } },
    });
    const otherVersions = await payload.findVersions({
      collection: "announcements",
      where: { parent: { equals: otherArticle.id } },
    });

    const vArticle = articleVersions.docs[0];
    const vOther = otherVersions.docs[0];

    // Anonymous request (no administrator user)
    const anonProps = await createViewProps({
      docID: article.id,
      versionId: vArticle.id,
      user: null,
    });
    await expect(RestoreAsDraftView(anonProps)).rejects.toThrow();

    // Mismatched parent document (version belongs to otherArticle, requested with article.id)
    const mismatchProps = await createViewProps({
      docID: article.id,
      versionId: vOther.id,
      user,
    });
    await expect(RestoreAsDraftView(mismatchProps)).rejects.toThrow();

    // Wrong collectionConfig
    const wrongConfigProps = await createViewProps({
      docID: article.id,
      versionId: vArticle.id,
      user,
      collectionConfig: { slug: "administrators" },
    });
    await expect(RestoreAsDraftView(wrongConfigProps)).rejects.toThrow();

    // Missing / non-existent document ID
    const missingDocProps = await createViewProps({
      docID: 99999999,
      versionId: vArticle.id,
      user,
    });
    await expect(RestoreAsDraftView(missingDocProps)).rejects.toThrow();

    // Missing / non-existent version ID
    const missingVersionProps = await createViewProps({
      docID: article.id,
      versionId: 99999999,
      user,
    });
    await expect(RestoreAsDraftView(missingVersionProps)).rejects.toThrow();
  });
});

it("preserves supported rich text and inline image identity in revision comparison and preview rendering", async () => {
  const media = await addMedia(await makePngBytes(), "Equipment demonstration");
  const content = (format: number): NonNullable<Announcement["body"]> => {
    const document = body("Introductory text");
    document.root.children.push(
      { type: "heading", version: 1, tag: "h2", children: [{ type: "text", version: 1, text: "Main section", format: 0 }] },
      { type: "heading", version: 1, tag: "h3", children: [{ type: "text", version: 1, text: "Subsection", format: 0 }] },
      { type: "paragraph", version: 1, children: [{ type: "text", version: 1, text: "Emphasis", format }, { type: "linebreak", version: 1 }] },
      { type: "list", version: 1, tag: "ul", start: 1, listType: "bullet", children: [{ type: "listitem", version: 1, value: 1, children: [{ type: "text", version: 1, text: "List detail", format: 0 }] }] },
      { type: "quote", version: 1, children: [{ type: "text", version: 1, text: "Quoted detail", format: 0 }] },
      { type: "upload", version: 3, id: randomUUID(), relationTo: "media", value: media.id, fields: {} },
    );
    return document;
  };
  const article = await withCmsMutation(() => payload.create({ collection: "announcements", data: {
    title: "Rich content comparison", summary: "An announcement with inline media", body: content(0), _status: "published",
  } }));
  await withCmsMutation(() => payload.update({ collection: "announcements", id: article.id, draft: true, data: { body: content(3), _status: "draft" } }));
  const versions = await payload.findVersions({ collection: "announcements", where: { parent: { equals: article.id } }, sort: "-id", limit: 1 });
  const props = await createViewProps({ docID: article.id, versionId: versions.docs[0].id, user, searchParams: { versionFrom: "main" } });
  const html = renderToStaticMarkup(await RestoreAsDraftView(props));
  const document = new JSDOM(html).window.document;
  const row = [...document.querySelectorAll("tr")].find((entry) => entry.querySelector("th")?.textContent === "Body")!;
  const cells = [...row.querySelectorAll("td")].map((cell) => cell.textContent);
  expect(cells[0]).not.toBe(cells[1]);
  for (const value of ["Main section", "Subsection", "Emphasis", "List detail", "Quoted detail", `Image #${media.id}`]) {
    expect(cells[1]).toContain(value);
  }
  const saved = await payload.findByID({ collection: "announcements", id: article.id, draft: true, depth: 2, user, overrideAccess: false });
  const preview = new JSDOM(renderToStaticMarkup(<RichText value={saved.body} />)).window.document;
  const image = preview.querySelector("img")!;
  expect(image.alt).toBe("Equipment demonstration");
  expect(image.getAttribute("width")).toBe(String(media.width));
  expect(preview.querySelector("em strong")?.textContent).toBe("Emphasis");
  expect(preview.querySelector("blockquote")?.textContent).toBe("Quoted detail");
});
