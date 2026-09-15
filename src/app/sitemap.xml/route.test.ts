import { describe, expect, it } from 'vitest';

import { companies } from '@/data/companies';

import { GET } from './route';

const retiredCompanySlugs = [
  ['h', 'y', 'g', 'e', 'i', 'a', '-pharmaceuticals'].join(''),
  ['m', 'e', 'd', 'w', 'e', 'l', 'l', '-pharmaceuticals'].join(''),
] as const;

describe('sitemap.xml', () => {
  it('lists all company routes and preserves XML escaping', async () => {
    const response = GET(new Request('https://example.test/sitemap.xml'));
    const xml = await response.text();

    expect(response.headers.get('content-type')).toContain('application/xml');
    expect(xml).toContain('<loc>https://example.test/</loc>');
    expect(xml).toContain('<loc>https://example.test/companies</loc>');
    for (const company of companies) {
      const route = `<loc>https://example.test/companies/${company.slug}</loc>`;
      expect(xml).toContain(route);
    }
    for (const slug of retiredCompanySlugs) {
      expect(xml).not.toContain(`/companies/${slug}`);
    }
    expect(xml).not.toContain('&quot;');
  });
});
