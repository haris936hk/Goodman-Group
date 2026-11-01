import { notFound } from "next/navigation";
import type { DocumentViewServerProps } from "payload";
import { isDeepStrictEqual } from "node:util";
import { RestoreAsDraftButton } from "./restore-as-draft-button";

type AnnouncementContent = {
  title?: unknown;
  summary?: unknown;
  body?: unknown;
  coverImage?: unknown;
  relatedCompanies?: unknown;
  _status?: unknown;
};

type AnnouncementVersion = {
  id: string;
  parent: number | string;
  updatedAt: string;
  version: AnnouncementContent;
};

type ContentField = "title" | "summary" | "body" | "coverImage" | "relatedCompanies";

const contentFields: { key: ContentField; label: string }[] = [
  { key: "title", label: "Title" },
  { key: "summary", label: "Summary" },
  { key: "body", label: "Body" },
  { key: "coverImage", label: "Cover image" },
  { key: "relatedCompanies", label: "Related companies" },
];


function richTextToText(value: unknown): string {
  if (Array.isArray(value)) return value.map(richTextToText).filter(Boolean).join("\n");
  if (!value || typeof value !== "object") return "";

  const node = value as Record<string, unknown>;
  if ("root" in node) return richTextToText(node.root);
  const nodeType = typeof node.type === "string" ? node.type : "";
  if (nodeType === "upload") {
    const relation = node.value && typeof node.value === "object"
      ? node.value as Record<string, unknown>
      : node;
    const alt = typeof relation.alt === "string" ? relation.alt : "";
    const caption = typeof relation.caption === "string" ? relation.caption : "";
    const label = [alt, caption].filter(Boolean).join(" — ");
    return `[Image${label ? `: ${label}` : node.value != null ? ` #${String(node.value)}` : ""}]`;
  }
  if (typeof node.text === "string") {
    let text = node.text;
    const format = typeof node.format === "number" ? node.format : 0;
    if (format & 1) text = `**${text}**`;
    if (format & 2) text = `_${text}_`;
    return text;
  }

  if (nodeType === "linebreak") return "\n";
  const children = Array.isArray(node.children) ? node.children : [];
  const text = children.map(richTextToText).filter(Boolean).join("");
  if (nodeType === "listitem") return `• ${text}\n`;
  if (nodeType === "heading") {
    const tag = typeof node.tag === "string" ? node.tag : "";
    const prefix = tag === "h2" ? "## " : tag === "h3" ? "### " : "# ";
    return `${prefix}${text}\n`;
  }
  if (nodeType === "quote") return `> ${text}\n`;
  return ["root", "paragraph", "list"].includes(nodeType) ? `${text}\n` : text;
}

function describeCoverImage(value: unknown): string {
  if (value == null || value === "") return "No cover image";
  if (typeof value !== "object") return `Media #${String(value)}`;

  const image = value as Record<string, unknown>;
  const alt = typeof image.alt === "string" ? image.alt : "";
  const filename = typeof image.filename === "string" ? image.filename : "";
  return [alt, filename].filter(Boolean).join(" — ") || ("id" in image ? `Media #${String(image.id)}` : "Cover image attached");
}

function displayValue(field: ContentField, value: unknown): string {
  if (field === "body") {
    const text = richTextToText(value).trim();
    return text || (value == null ? "—" : "Non-text rich content");
  }
  if (field === "coverImage") return describeCoverImage(value);
  if (field === "relatedCompanies") {
    if (!Array.isArray(value) || value.length === 0) return "—";
    return value.map((company) => typeof company === "string" ? company : "Company reference").join(", ");
  }
  return typeof value === "string" && value.length > 0 ? value : "—";
}

function formatVersionDate(value: string, locale: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Unknown date" : date.toLocaleString(locale);
}

export async function RestoreAsDraftView(props: DocumentViewServerProps) {
  const { initPageResult, routeSegments, searchParams = {}, i18n } = props;
  const { collectionConfig, docID, req } = initPageResult;
  const documentId = docID;
  const versionId = routeSegments.at(-1);

  if (
    collectionConfig?.slug !== "announcements" ||
    documentId === undefined ||
    !versionId ||
    req.user?.collection !== "administrators"
  ) {
    notFound();
  }

  const selectedVersion = await req.payload.findVersionByID({
    collection: "announcements",
    id: versionId,
    depth: 0,
    disableErrors: true,
    overrideAccess: false,
    req,
    user: req.user,
  }) as unknown as AnnouncementVersion | null;

  if (!selectedVersion || String(selectedVersion.parent) !== String(documentId)) notFound();

  const [main, versionResult] = await Promise.all([
    req.payload.findByID({
      collection: "announcements",
      id: documentId,
      draft: false,
      depth: 0,
      disableErrors: true,
      overrideAccess: false,
      req,
      user: req.user,
    }),
    req.payload.findVersions({
      collection: "announcements",
      depth: 0,
      draft: true,
      limit: 20,
      locale: "all",
      pagination: false,
      overrideAccess: false,
      req,
      sort: ["-updatedAt", "-id"],
      user: req.user,
      where: { parent: { equals: documentId } },
    }),
  ]);

  if (!main) notFound();

  const versions = versionResult.docs as unknown as AnnouncementVersion[];
  const selectedIndex = versions.findIndex((version) => String(version.id) === String(selectedVersion.id));
  const previousVersion = selectedIndex >= 0 ? versions[selectedIndex + 1] : undefined;
  const requestedSourceId = Array.isArray(searchParams.versionFrom) ? searchParams.versionFrom[0] : searchParams.versionFrom;
  const requestedEmpty = requestedSourceId === "empty";
  const sourceVersion = requestedSourceId === "main" || requestedEmpty
    ? undefined
    : versions.find((version) => String(version.id) === requestedSourceId && String(version.id) !== String(selectedVersion.id)) ?? previousVersion;
  const selectedSourceId = requestedSourceId === "main" ? "main" : requestedEmpty ? "empty" : sourceVersion?.id ?? "empty";
  const source: AnnouncementContent = selectedSourceId === "main" ? main : selectedSourceId === "empty" ? {} : sourceVersion?.version ?? {};
  const sourceLabel = requestedSourceId === "main"
    ? "Current main document"
    : sourceVersion
      ? `Version from ${formatVersionDate(sourceVersion.updatedAt, i18n.language)}`
      : "No earlier version";
  const showAll = (Array.isArray(searchParams.showAll) ? searchParams.showAll[0] : searchParams.showAll) === "true";
  const differences = contentFields.filter(({ key }) => !isDeepStrictEqual(source[key], selectedVersion.version[key]));
  const fieldsToRender = showAll ? contentFields : differences;

  return (
    <main className="gutter restore-as-draft-view">
      <header>
        <h2>Version comparison</h2>
        <p>Selected version saved {formatVersionDate(selectedVersion.updatedAt, i18n.language)}.</p>
        <p>Restoring saves this content as a draft. It does not publish or unpublish the announcement.</p>
        <RestoreAsDraftButton documentId={String(documentId)} versionId={selectedVersion.id} />
      </header>

      <form action={req.pathname} method="get" aria-label="Version comparison options">
        <label htmlFor="version-from">Compare with</label>{" "}
        <select id="version-from" name="versionFrom" defaultValue={selectedSourceId}>
          <option value="empty">No earlier version</option>
          <option value="main">Current main document</option>
          {versions.filter((version) => version.id !== selectedVersion.id).map((version) => (
            <option key={version.id} value={version.id}>
              Version from {formatVersionDate(version.updatedAt, i18n.language)}
            </option>
          ))}
        </select>{" "}
        <label>
          <input type="checkbox" name="showAll" value="true" defaultChecked={showAll} />
          Show unchanged content fields
        </label>{" "}
        <button type="submit">Compare</button>
      </form>

      <section aria-label="Announcement content comparison">
        <h3>Content changes</h3>
        <p>{sourceLabel} compared with selected version.</p>
        {fieldsToRender.length === 0 ? (
          <p>No differences in the editable content fields.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th scope="col">Content field</th>
                <th scope="col">{sourceLabel}</th>
                <th scope="col">Selected version</th>
              </tr>
            </thead>
            <tbody>
              {fieldsToRender.map(({ key, label }) => (
                <tr key={key}>
                  <th scope="row">{label}</th>
                  <td><pre style={{ fontFamily: "inherit", margin: 0, whiteSpace: "pre-wrap" }}>{displayValue(key, source[key])}</pre></td>
                  <td><pre style={{ fontFamily: "inherit", margin: 0, whiteSpace: "pre-wrap" }}>{displayValue(key, selectedVersion.version[key])}</pre></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}
