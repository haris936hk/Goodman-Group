import "server-only";

import { cache } from "react";
import { getPayload } from "payload";

import type { Announcement } from "@/payload-types";

const PAGE_SIZE = 10;
const SITEMAP_PAGE_SIZE = 100;

async function getCmsPayload() {
  // Keep environment validation and database initialization lazy for website routes.
  const { default: config } = await import("@payload-config");
  return getPayload({ config });
}

export const getPublishedAnnouncementsPage = cache(async (page: number) => {
  const payload = await getCmsPayload();
  return payload.find({
    collection: "announcements",
    where: {
      and: [
        { _status: { equals: "published" } },
        { publishedAt: { exists: true } },
      ],
    },
    sort: ["-publishedAt", "-id"],
    page,
    limit: PAGE_SIZE,
    depth: 2,
    draft: false,
    overrideAccess: false,
  });
});

export const getPublishedAnnouncement = cache(async (slug: string) => {
  const payload = await getCmsPayload();
  const result = await payload.find({
    collection: "announcements",
    where: {
      and: [
        { slug: { equals: slug } },
        { _status: { equals: "published" } },
        { publishedAt: { exists: true } },
      ],
    },
    limit: 1,
    depth: 2,
    draft: false,
    overrideAccess: false,
  });
  return result.docs[0] ?? null;
});

export const getPublishedAnnouncementSlugs = cache(async () => {
  const payload = await getCmsPayload();
  const slugs: string[] = [];
  let page = 1;
  let totalPages = 1;

  do {
    const result = await payload.find({
      collection: "announcements",
      where: {
        and: [
          { _status: { equals: "published" } },
          { publishedAt: { exists: true } },
        ],
      },
      select: { slug: true },
      sort: ["-publishedAt", "-id"],
      page,
      limit: SITEMAP_PAGE_SIZE,
      depth: 0,
      draft: false,
      overrideAccess: false,
    });

    for (const announcement of result.docs) {
      if (typeof announcement.slug === "string" && announcement.slug.length > 0) {
        slugs.push(announcement.slug);
      }
    }
    totalPages = result.totalPages;
    page += 1;
  } while (page <= totalPages);

  return slugs;
});

export type PreviewAnnouncementResult =
  | { authenticated: false; announcement: null }
  | { authenticated: true; announcement: Announcement | null };

export async function getAuthenticatedDraft(
  id: string,
  requestHeaders: Headers,
): Promise<PreviewAnnouncementResult> {
  const payload = await getCmsPayload();
  const { user } = await payload.auth({ headers: requestHeaders });

  if (!user || user.collection !== "administrators") {
    return { authenticated: false, announcement: null };
  }

  const numericID = Number(id);
  if (!/^\d+$/.test(id) || !Number.isSafeInteger(numericID) || numericID < 1) {
    return { authenticated: true, announcement: null };
  }

  const result = await payload.find({
    collection: "announcements",
    where: { id: { equals: numericID } },
    limit: 1,
    depth: 2,
    draft: true,
    overrideAccess: false,
    user,
  });

  return { authenticated: true, announcement: result.docs[0] ?? null };
}
