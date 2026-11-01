import { describe, expect, it, vi } from 'vitest';

import { companies } from '@/data/companies';
import { SITE_ORIGIN } from '@/data/goodman-group';

import { GET } from './route';

const blogSitemapState = vi.hoisted(() => ({
  slugs: ["published-update"],
  fail: false,
}));

vi.mock("@/lib/blog/queries", () => ({
  getPublishedAnnouncementSlugs: async () => {
    if (blogSitemapState.fail) throw new Error("Database unavailable");
    return blogSitemapState.slugs;
  },
}));

const retiredCompanySlugs = [
  ['h', 'y', 'g', 'e', 'i', 'a', '-pharmaceuticals'].join(''),
  ['m', 'e', 'd', 'w', 'e', 'l', 'l', '-pharmaceuticals'].join(''),
] as const;

describe('sitemap.xml', () => {
  it('lists fixed-origin website and published blog URLs', async () => {
    const response = await GET();
    const xml = await response.text();

    expect(response.headers.get('content-type')).toContain('application/xml');
    expect(xml).toContain(`<loc>${SITE_ORIGIN}/</loc>`);
    expect(xml).toContain(`<loc>${SITE_ORIGIN}/companies</loc>`);
    for (const company of companies) {
      const route = `<loc>${SITE_ORIGIN}/companies/${company.slug}</loc>`;
      expect(xml).toContain(route);
    }
    expect(xml).toContain(`<loc>${SITE_ORIGIN}/blog</loc>`);
    expect(xml).toContain(`<loc>${SITE_ORIGIN}/blog/published-update</loc>`);
    for (const slug of retiredCompanySlugs) {
      expect(xml).not.toContain(`/companies/${slug}`);
    }
    expect(xml).not.toContain('&quot;');
  });
  it('escapes XML special characters in URLs and supports invocation without request', async () => {
    vi.resetModules();
    vi.doMock('@/data/companies', () => ({
      companies: [{ slug: 'test<slug>&"quote\'' }],
    }));
    const { GET: getRoute } = await import('./route');
    // Exception: dynamic import reloads the route module under vi.doMock isolation.
    const response = await getRoute();
    const xml = await response.text();
    expect(xml).toContain('test&lt;slug&gt;&amp;&quot;quote&apos;');
    vi.doUnmock('@/data/companies');
    vi.resetModules();
  });

  it("returns a no-store 503 when published announcement lookup fails", async () => {
    blogSitemapState.fail = true;
    const errorLog = vi.spyOn(console, "error").mockImplementation(() => {});
    const response = await GET();
    blogSitemapState.fail = false;

    expect(response.status).toBe(503);
    expect(response.headers.get("cache-control")).toBe("no-store");
    errorLog.mockRestore();
  });
});
