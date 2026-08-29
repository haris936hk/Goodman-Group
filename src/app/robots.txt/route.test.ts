import { describe, expect, it } from 'vitest';

import { GET } from './route';

describe('robots.txt', () => {
  it('uses the request host for the sitemap location', async () => {
    const response = GET(new Request('https://example.test/robots.txt'));

    expect(response.headers.get('content-type')).toContain('text/plain');
    await expect(response.text()).resolves.toContain(
      'Sitemap: https://example.test/sitemap.xml',
    );
  });
});
