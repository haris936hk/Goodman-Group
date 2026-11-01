import { APIError, type CollectionBeforeChangeHook } from "payload";
import { validateAnnouncementMedia } from "./media-references";
import { assertCmsMutationScope } from "./mutation-gate";
import { companies } from "../data/companies";
import { validateRichText } from "./rich-text-validation";

function meaningfulText(value: unknown): string {
  if (!value || typeof value !== "object") return "";
  const node = value as { text?: unknown; children?: unknown[]; root?: unknown };
  return [typeof node.text === "string" ? node.text : "", node.root ? meaningfulText(node.root) : "", ...(node.children ?? []).map(meaningfulText)].join(" ").trim();
}

export const enforceAnnouncementLifecycle: CollectionBeforeChangeHook = async ({ data, originalDoc, req, operation }) => {
  assertCmsMutationScope();
  // Never infer publication from retained versions: pruning must not erase identity.
  const main = operation === "update" && originalDoc?.id
    ? await req.payload.findByID({ collection: "announcements", id: originalDoc.id, draft: false, depth: 0, overrideAccess: true, req })
    : null;
  const merged = { ...originalDoc, ...data };
  for (const name of ["title", "summary"] as const) {
    if (typeof merged[name] === "string") data[name] = merged[name].trim();
  }
  if (main?.publishedAt) {
    if (data.slug !== undefined && data.slug !== main.slug) throw new APIError("The URL is locked after first publication.", 400);
    if (data.publishedAt && data.publishedAt !== main.publishedAt) throw new APIError("The publication date cannot be changed.", 400);
    data.slug = main.slug;
    data.publishedAt = main.publishedAt;
  } else {
    if (data.publishedAt) throw new APIError("The first publication date is assigned by the server.", 400);
    data.publishedAt = null;
    data.slug = merged.slug || (typeof merged.title === "string" ? merged.title.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 180) : undefined);
    if (data._status === "published") data.publishedAt = new Date().toISOString();
  }
  if (data.slug && (data.slug === "preview" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug))) throw new APIError("Use a lowercase hyphenated URL; preview is reserved.", 400);
  if (data.slug) {
    for (const draft of [false, true]) {
      const duplicates = await req.payload.find({
        collection: "announcements", draft, depth: 0, overrideAccess: true, req, limit: 1,
        where: { and: [{ slug: { equals: data.slug } }, ...(originalDoc?.id ? [{ id: { not_equals: originalDoc.id } }] : [])] },
      });
      if (duplicates.docs.length) throw new APIError("An announcement already uses this URL.", 400);
    }
  }
  const result = { ...merged, ...data };
  validateRichText(result.body);
  if (result.relatedCompanies) {
    if (!Array.isArray(result.relatedCompanies)) throw new APIError("Related companies must be a list.", 400);
    const choices = result.relatedCompanies;
    if (new Set(choices).size !== choices.length || choices.some((slug: unknown) => !companies.some((company) => company.slug === slug))) {
      throw new APIError("Choose each related company at most once from the company list.", 400);
    }
  }
  await validateAnnouncementMedia(req.payload, result, req);
  if (data._status === "published") {
    if (typeof result.title !== "string" || !result.title.trim() || typeof result.summary !== "string" || !result.summary.trim() || !result.slug || !meaningfulText(result.body)) {
      throw new APIError("Publication requires a title, URL, summary and meaningful body text.", 400);
    }
  }
  return data;
};
