import { describe, expect, it } from "vitest";

import { SITE_ORIGIN } from "@/data/goodman-group";

import { GET } from "./route";

type RobotsRule = {
  type: "allow" | "disallow";
  pattern: string;
};

function parseRobotsDirectives(content: string): { rules: RobotsRule[]; sitemaps: string[] } {
  const rules: RobotsRule[] = [];
  const sitemaps: string[] = [];

  for (const rawLine of content.split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const colonIndex = line.indexOf(":");
    if (colonIndex === -1) continue;

    const key = line.slice(0, colonIndex).trim().toLowerCase();
    const value = line.slice(colonIndex + 1).trim();

    if (key === "allow") {
      rules.push({ type: "allow", pattern: value });
    } else if (key === "disallow") {
      if (value) {
        rules.push({ type: "disallow", pattern: value });
      }
    } else if (key === "sitemap") {
      sitemaps.push(value);
    }
  }

  return { rules, sitemaps };
}

function isCrawlerAllowed(path: string, rules: RobotsRule[]): boolean {
  // Standard Robots Exclusion Protocol (RFC 9309 § 2.2.2):
  // Find all matching path-prefix rules. The most specific match (longest octet length)
  // takes precedence. If an Allow and a Disallow rule have equal length, Allow takes precedence.
  let mostSpecificRule: RobotsRule | null = null;

  for (const rule of rules) {
    if (path.startsWith(rule.pattern)) {
      if (!mostSpecificRule || rule.pattern.length > mostSpecificRule.pattern.length) {
        mostSpecificRule = rule;
      } else if (rule.pattern.length === mostSpecificRule.pattern.length && rule.type === "allow") {
        mostSpecificRule = rule;
      }
    }
  }

  return mostSpecificRule ? mostSpecificRule.type === "allow" : true;
}

describe("robots.txt route handler", () => {
  it("serves text/plain responses with canonical sitemap metadata", async () => {
    const response = GET();
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("text/plain; charset=utf-8");

    const body = await response.text();
    const { sitemaps } = parseRobotsDirectives(body);
    expect(sitemaps).toContain(`${SITE_ORIGIN}/sitemap.xml`);
  });

  it("allows crawlers to access published announcements with preview-* slugs while blocking preview drafts", async () => {
    const response = GET();
    const body = await response.text();
    const { rules } = parseRobotsDirectives(body);

    // Published announcements that happen to have slugs beginning with 'preview'
    // must NOT be blocked by preview path restrictions.
    expect(isCrawlerAllowed("/blog/preview-announcement", rules)).toBe(true);
    expect(isCrawlerAllowed("/blog/preview-of-2027-innovations", rules)).toBe(true);
    expect(isCrawlerAllowed("/blog/previewing-breakthrough-devices", rules)).toBe(true);

    // The draft preview directory itself must remain blocked from crawlers.
    expect(isCrawlerAllowed("/blog/preview/", rules)).toBe(false);
    expect(isCrawlerAllowed("/blog/preview/123", rules)).toBe(false);
    expect(isCrawlerAllowed("/blog/preview/draft-announcement-id", rules)).toBe(false);
  });

  it("allows crawlers to access public media files while disallowing CMS APIs and administration", async () => {
    const response = GET();
    const body = await response.text();
    const { rules } = parseRobotsDirectives(body);

    // Public media file assets served under Payload upload route must be crawlable
    expect(isCrawlerAllowed("/api/cms/media/file/hero.webp", rules)).toBe(true);
    expect(isCrawlerAllowed("/api/cms/media/file/diagram-small.png", rules)).toBe(true);
    expect(isCrawlerAllowed("/api/cms/media/file/nested/asset.jpg", rules)).toBe(true);

    // CMS APIs, user accounts, mutations, and non-file media endpoints remain disallowed
    expect(isCrawlerAllowed("/api/cms/administrators", rules)).toBe(false);
    expect(isCrawlerAllowed("/api/cms/announcements", rules)).toBe(false);
    expect(isCrawlerAllowed("/api/cms/media", rules)).toBe(false);
    expect(isCrawlerAllowed("/api/cms/media/file", rules)).toBe(false);
    expect(isCrawlerAllowed("/api/enquiries", rules)).toBe(false);
    expect(isCrawlerAllowed("/api/", rules)).toBe(false);

    // Admin interface remains disallowed
    expect(isCrawlerAllowed("/admin", rules)).toBe(false);
    expect(isCrawlerAllowed("/admin/login", rules)).toBe(false);
    expect(isCrawlerAllowed("/admin/collections/media", rules)).toBe(false);
  });

  it("allows crawlers to access general public website journeys", async () => {
    const response = GET();
    const body = await response.text();
    const { rules } = parseRobotsDirectives(body);

    expect(isCrawlerAllowed("/", rules)).toBe(true);
    expect(isCrawlerAllowed("/companies", rules)).toBe(true);
    expect(isCrawlerAllowed("/companies/geron-pharma", rules)).toBe(true);
    expect(isCrawlerAllowed("/blog", rules)).toBe(true);
    expect(isCrawlerAllowed("/blog/first-published-article", rules)).toBe(true);
  });
});
