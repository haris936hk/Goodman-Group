import { describe, expect, it } from 'vitest';

import { companies } from '@/data/companies';
import { SITE_ORIGIN } from '@/data/goodman-group';

import { GET } from './route';

const retiredCompanySlugs = [
  ['h', 'y', 'g', 'e', 'i', 'a', '-pharmaceuticals'].join(''),
  ['m', 'e', 'd', 'w', 'e', 'l', 'l', '-pharmaceuticals'].join(''),
] as const;

describe('sitemap.xml', () => {
  it('lists fixed-origin URLs and exactly home + directory + five company paths', async () => {
    const response = GET(new Request('https://example.test/sitemap.xml'));
    const xml = await response.text();

    expect(response.headers.get('content-type')).toContain('application/xml');
    expect(xml).toContain(`<loc>${SITE_ORIGIN}/</loc>`);
    expect(xml).toContain(`<loc>${SITE_ORIGIN}/companies</loc>`);
    for (const company of companies) {
      const route = `<loc>${SITE_ORIGIN}/companies/${company.slug}</loc>`;
      expect(xml).toContain(route);
    }
    for (const slug of retiredCompanySlugs) {
      expect(xml).not.toContain(`/companies/${slug}`);
    }
    expect(xml).not.toContain('&quot;');
  });
});
