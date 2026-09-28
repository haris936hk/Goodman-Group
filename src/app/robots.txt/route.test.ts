import { describe, expect, it } from 'vitest';
import { SITE_ORIGIN } from '@/data/goodman-group';

import { GET } from './route';

describe('robots.txt', () => {
  it('uses the fixed site origin for the sitemap location', async () => {
    const response = GET(new Request('https://example.test/robots.txt'));

    expect(response.headers.get('content-type')).toContain('text/plain');
    await expect(response.text()).resolves.toContain(
      `Sitemap: ${SITE_ORIGIN}/sitemap.xml`,
    );
  });
});
