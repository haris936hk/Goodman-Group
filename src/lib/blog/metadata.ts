import type { Metadata } from "next";

import { SITE_ORIGIN } from "@/data/goodman-group";
import type { Announcement } from "@/payload-types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function publicImageURL(value: unknown): string | undefined {
  if (!isRecord(value) || typeof value.url !== "string" || !value.url) return undefined;
  try {
    const url = new URL(value.url, SITE_ORIGIN);
    if (url.origin !== SITE_ORIGIN || url.username || url.password) return undefined;
    return url.href;
  } catch {
    return undefined;
  }
}

export function getAnnouncementImageURL(announcement: Announcement): string | undefined {
  const media = announcement.coverImage;
  if (!isRecord(media)) return undefined;
  const sizes = isRecord(media.sizes) ? media.sizes : undefined;
  const large = sizes && isRecord(sizes.large) ? sizes.large : undefined;
  return publicImageURL(large) ?? publicImageURL(media);
}

export function getBlogArticleMetadata(
  announcement: Announcement,
  canonicalURL: string,
): Metadata {
  const title = announcement.title?.trim() || "Goodman Group announcement";
  const description = announcement.summary?.trim() || "News and announcements from Goodman Group.";
  const image = getAnnouncementImageURL(announcement);
  const socialImage = image ?? `${SITE_ORIGIN}/assets/logos/GG-1.png`;

  return {
    title,
    description,
    alternates: { canonical: canonicalURL },
    openGraph: {
      type: "article",
      url: canonicalURL,
      title,
      description,
      ...(announcement.publishedAt ? { publishedTime: announcement.publishedAt } : {}),
      images: [{ url: socialImage, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [socialImage],
    },
  };
}

export function createBlogPostingJsonLd(
  announcement: Announcement,
  canonicalURL: string,
): string {
  const image = getAnnouncementImageURL(announcement);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalURL },
    headline: announcement.title?.trim() || "Goodman Group announcement",
    description: announcement.summary?.trim() || "News and announcements from Goodman Group.",
    inLanguage: "en",
    ...(announcement.publishedAt ? { datePublished: announcement.publishedAt } : {}),
    ...(image ? { image: [image] } : {}),
    author: {
      "@type": "Organization",
      name: "Goodman Group",
      url: SITE_ORIGIN,
    },
    publisher: {
      "@type": "Organization",
      name: "Goodman Group",
      url: SITE_ORIGIN,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_ORIGIN}/assets/logos/GG-1.png`,
      },
    },
  };
  return JSON.stringify(structuredData).replace(/</g, "\\u003c");
}
