import { describe, expect, it } from "vitest";
import { tryToParsePath } from "next/dist/lib/try-to-parse-path";

import nextConfig from "../../next.config";

type HeaderRule = {
  source: string;
  headers: Array<{ key: string; value: string }>;
};

function resolveHeadersForPath(path: string, rules: HeaderRule[]): Map<string, string> {
  const resolved = new Map<string, string>();
  for (const rule of rules) {
    const parsed = tryToParsePath(rule.source);
    if (!parsed.regexStr) continue;
    const regex = new RegExp(parsed.regexStr, "i");
    if (regex.test(path)) {
      for (const { key, value } of rule.headers) {
        resolved.set(key.toLowerCase(), value);
      }
    }
  }
  return resolved;
}

describe("Next.js response headers configuration", () => {
  it("removes private and noindex headers from public media file downloads under /api/cms/media/file/*", async () => {
    expect(nextConfig.headers).toBeTypeOf("function");
    const rules = (await nextConfig.headers!()) as HeaderRule[];

    const singleSegmentMedia = resolveHeadersForPath("/api/cms/media/file/hero-device.webp", rules);
    expect(singleSegmentMedia.get("x-robots-tag")).toBeUndefined();
    expect(singleSegmentMedia.get("cache-control")).not.toBe("private, no-store");

    const multiSegmentMedia = resolveHeadersForPath("/api/cms/media/file/variants/large-1600.png", rules);
    expect(multiSegmentMedia.get("x-robots-tag")).toBeUndefined();
    expect(multiSegmentMedia.get("cache-control")).not.toBe("private, no-store");
  });

  it("enforces private, no-store and noindex on CMS API routes outside the public media file route", async () => {
    const rules = (await nextConfig.headers!()) as HeaderRule[];

    const pathsToProtect = [
      "/api/cms",
      "/api/cms/",
      "/api/cms/administrators",
      "/api/cms/administrators?limit=1",
      "/api/cms/announcements",
      "/api/cms/announcements/42/restore-as-draft",
      "/api/cms/media",
      "/api/cms/media/file",
    ];

    for (const path of pathsToProtect) {
      const pathname = path.split("?")[0];
      const headers = resolveHeadersForPath(pathname, rules);
      expect(headers.get("x-robots-tag"), `expected noindex for ${path}`).toBe("noindex, nofollow");
      expect(headers.get("cache-control"), `expected private, no-store for ${path}`).toBe("private, no-store");
    }
  });

  it("enforces private, no-store and noindex on admin and preview route families", async () => {
    const rules = (await nextConfig.headers!()) as HeaderRule[];

    const privatePaths = [
      "/admin",
      "/admin/login",
      "/admin/collections/announcements",
      "/blog/preview",
      "/blog/preview/42",
      "/blog/preview/draft-announcement-uuid",
    ];

    for (const path of privatePaths) {
      const headers = resolveHeadersForPath(path, rules);
      expect(headers.get("x-robots-tag"), `expected noindex on ${path}`).toBe("noindex, nofollow");
      expect(headers.get("cache-control"), `expected private, no-store on ${path}`).toBe("private, no-store");
    }
  });

  it("does not apply preview restrictions or noindex to published announcements with preview-* slugs", async () => {
    const rules = (await nextConfig.headers!()) as HeaderRule[];

    const publishedPreviewPaths = [
      "/blog/preview-announcement",
      "/blog/preview-of-2027-innovations",
      "/blog/previewing-breakthrough-devices",
    ];

    for (const path of publishedPreviewPaths) {
      const headers = resolveHeadersForPath(path, rules);
      expect(headers.get("x-robots-tag"), `expected no x-robots-tag on ${path}`).toBeUndefined();
      expect(headers.get("cache-control"), `expected public blog no-store on ${path}`).toBe("no-store");
    }
  });

  it("preserves caching headers on static assets and freshness headers on the blog and sitemap", async () => {
    const rules = (await nextConfig.headers!()) as HeaderRule[];

    const assetHeaders = resolveHeadersForPath("/assets/brand/goodman-logo.svg", rules);
    expect(assetHeaders.get("cache-control")).toBe("public, max-age=86400, stale-while-revalidate=604800");

    const blogHeaders = resolveHeadersForPath("/blog", rules);
    expect(blogHeaders.get("cache-control")).toBe("no-store");

    const sitemapHeaders = resolveHeadersForPath("/sitemap.xml", rules);
    expect(sitemapHeaders.get("cache-control")).toBe("no-store");
  });
});
