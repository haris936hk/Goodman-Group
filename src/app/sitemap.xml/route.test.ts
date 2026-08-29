import { describe, expect, it } from 'vitest';

import { companies, isCompanyPublished } from '@/data/companies';

import { GET } from './route';

describe('sitemap.xml', () => {
  it('lists only indexable routes and preserves XML escaping', async () => {
    const response = GET(new Request('https://example.test/sitemap.xml'));
    const xml = await response.text();

    expect(response.headers.get('content-type')).toContain('application/xml');
    expect(xml).toContain('<loc>https://example.test/</loc>');
    expect(xml).toContain('<loc>https://example.test/companies</loc>');
    for (const company of companies) {
      const route = `<loc>https://example.test/companies/${company.slug}</loc>`;
      expect(xml.includes(route)).toBe(isCompanyPublished(company));
    }
    expect(xml).not.toContain('&quot;');
  });
});
