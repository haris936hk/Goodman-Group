import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

function captureClientDiagnostics(page: Page) {
  const diagnostics = {
    pageErrors: [] as string[],
    consoleErrors: [] as string[],
    failedNextRequests: [] as string[],
  };
  const onPageError = (error: Error) => diagnostics.pageErrors.push(error.message);
  const onConsole = (message: { type(): string; text(): string }) => {
    if (message.type() === 'error') diagnostics.consoleErrors.push(message.text());
  };
  const onRequestFailed = (request: { url(): string }) => {
    if (request.url().includes('/_next/')) diagnostics.failedNextRequests.push(request.url());
  };
  page.on('pageerror', onPageError);
  page.on('console', onConsole);
  page.on('requestfailed', onRequestFailed);

  return {
    diagnostics,
    stop() {
      page.off('pageerror', onPageError);
      page.off('console', onConsole);
      page.off('requestfailed', onRequestFailed);
    },
  };
}

function expectNoClientErrors(diagnostics: ReturnType<typeof captureClientDiagnostics>['diagnostics']) {
  expect(diagnostics.pageErrors, diagnostics.pageErrors.join('\n')).toEqual([]);
  expect(diagnostics.consoleErrors, diagnostics.consoleErrors.join('\n')).toEqual([]);
  expect(diagnostics.failedNextRequests, diagnostics.failedNextRequests.join('\n')).toEqual([]);
}

test.describe('home page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('renders its primary content', async ({ page }) => {
    await expect(page.locator('main')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    await expect(page).toHaveTitle(/.+/);
  });

  test('has no automatically detectable accessibility violations', async ({
    page,
  }) => {
    const results = await new AxeBuilder({ page }).analyze();

    expect(results.violations).toEqual([]);
  });

  test('preserves anchor navigation to a story chapter', async ({ page }) => {
    await page.getByRole('link', { name: 'Our Presence' }).first().click();

    await expect(page).toHaveURL(/#presence$/);
    await expect(
      page.getByRole('heading', {
        name: 'Every point on the map says what it means.',
      }),
    ).toBeInViewport();
  });

  test('matches the audited responsive grid states and stays within the viewport', async ({
    page,
  }) => {
    const states = [
      { width: 320, companyColumns: 1, proofColumns: 1, proofLayoutColumns: 1 },
      { width: 390, companyColumns: 1, proofColumns: 1, proofLayoutColumns: 1 },
      { width: 641, companyColumns: 1, proofColumns: 1, proofLayoutColumns: 1 },
      { width: 768, companyColumns: 2, proofColumns: 3, proofLayoutColumns: 1 },
      { width: 1080, companyColumns: 2, proofColumns: 3, proofLayoutColumns: 1 },
      { width: 1081, companyColumns: 2, proofColumns: 3, proofLayoutColumns: 1 },
      { width: 1180, companyColumns: 2, proofColumns: 3, proofLayoutColumns: 1 },
      { width: 1280, companyColumns: 3, proofColumns: 3, proofLayoutColumns: 2 },
      { width: 1440, companyColumns: 3, proofColumns: 3, proofLayoutColumns: 2 },
    ];

    for (const state of states) {
      await page.setViewportSize({ width: state.width, height: 900 });
      await page.goto('/');

      const layout = await page.evaluate(() => {
        const gridColumns = (selector: string) =>
          getComputedStyle(document.querySelector(selector) as Element)
            .gridTemplateColumns.split(' ').length;
        const bounds = Array.from(
          document.querySelectorAll(
            '.site-header, .hero-copy, .hero-system, .company-grid, .proof-layout, .presence-layout, .audience-grid',
          ),
        ).map((element) => {
          const rect = element.getBoundingClientRect();
          return { left: rect.left, right: rect.right };
        });

        return {
          companyColumns: gridColumns('.company-grid'),
          proofColumns: gridColumns('.proof-rules'),
          proofLayoutColumns: gridColumns('.proof-layout'),
          bounds,
          viewport: window.innerWidth,
        };
      });

      expect(layout.companyColumns).toBe(state.companyColumns);
      expect(layout.proofColumns).toBe(state.proofColumns);
      expect(layout.proofLayoutColumns).toBe(state.proofLayoutColumns);
      expect(
        layout.bounds.every(
          (bound) => bound.left >= -1 && bound.right <= layout.viewport + 1,
        ),
      ).toBe(true);
    }
  });
});

test.describe('home page with reduced motion', () => {
  test('keeps its content available', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    await expect(page.locator('main')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('stops smooth scrolling when the preference changes at runtime', async ({
    page,
  }) => {
    const { diagnostics, stop } = captureClientDiagnostics(page);
    await page.goto('/');
    await expect(page.locator('html')).toHaveClass(/lenis/);

    await page.emulateMedia({ reducedMotion: 'reduce' });

    await expect(page.locator('html')).not.toHaveClass(/lenis/);
    await expect(page.locator('.scroll-progress')).toBeHidden();
    expectNoClientErrors(diagnostics);
    stop();
  });
});

test('adapts the header when text is resized to 200 percent', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('/');
  await page.evaluate(() => {
    document.documentElement.style.fontSize = '32px';
  });

  await expect(page.getByRole('button', { name: 'Open navigation' })).toBeVisible();
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await page.evaluate(() => window.dispatchEvent(new Event('resize')));
  await expect(
    page.getByRole('navigation', { name: 'Mobile navigation' }),
  ).toBeVisible();

  const widths = await page.locator('.site-header').evaluate((header) => ({
    client: header.clientWidth,
    scroll: header.scrollWidth,
  }));
  expect(widths.scroll).toBeLessThanOrEqual(widths.client);

  await page.evaluate(() => {
    document.documentElement.style.fontSize = '';
    window.dispatchEvent(new Event('resize'));
  });
  await expect(
    page.getByRole('navigation', { name: 'Mobile navigation' }),
  ).not.toBeVisible();
});

test.describe('home page on mobile', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
  });

  test('recomposes without horizontal overflow', async ({ page }) => {
    const layoutWidth = await page.evaluate(() => ({
      viewport: window.innerWidth,
      content: document.documentElement.scrollWidth,
    }));

    expect(layoutWidth.content).toBeLessThanOrEqual(layoutWidth.viewport);
  });

  test('provides an operable mobile navigation', async ({ page }) => {
    const { diagnostics, stop } = captureClientDiagnostics(page);

    const toggle = page.locator('.menu-toggle');
    await toggle.click();

    await expect(
      page.getByRole('navigation', { name: 'Mobile navigation' }),
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: /Our Companies/ }).last(),
    ).toHaveAttribute('href', '/companies');
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByRole('banner')).toHaveAttribute('inert', '');
    await expect(page.locator('main')).toHaveAttribute('inert', '');
    await expect(page.locator('footer')).toHaveAttribute('inert', '');

    expectNoClientErrors(diagnostics);
    stop();
  });

  test('keeps presence content complete without scroll choreography', async ({
    page,
  }) => {
    const heading = page.getByRole('heading', {
      name: 'Every point on the map says what it means.',
    });
    await heading.scrollIntoViewIfNeeded();

    await expect(heading).toBeVisible();
    await expect(page.locator('[data-presence-map] > svg[role="img"]')).toBeVisible();
    await expect(
      page.getByText('Active, partner, agreement-stage, and planned markets', {
        exact: true,
      }),
    ).toBeVisible();

    for (const label of [
      'Active operation',
      'Partner market',
      'Agreement stage',
      'Planned market',
    ]) {
      await expect(page.getByRole('heading', { name: label })).toBeVisible();
    }
  });

  test('contains focus in the open navigation and restores it on Escape', async ({
    page,
  }) => {
    const toggle = page.locator('.menu-toggle');
    await toggle.focus();
    await page.keyboard.press('Enter');

    const dialog = page.getByRole('dialog', { name: 'Site navigation' });
    const navigation = dialog.getByRole('navigation', {
      name: 'Mobile navigation',
    });
    const closeButton = dialog.getByRole('button', { name: 'Close navigation' });
    const links = navigation.getByRole('link');
    await expect(closeButton).toBeFocused();

    await links.last().focus();
    await page.keyboard.press('Tab');
    await expect(closeButton).toBeFocused();

    await page.keyboard.press('Shift+Tab');
    await expect(links.last()).toBeFocused();

    await page.keyboard.press('Escape');
    await expect(toggle).toBeFocused();
    await expect(dialog).not.toBeVisible();
  });

  test('keeps the dialog scrollable on short mobile viewports', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 360 });
    await page.reload();
    await page.locator('.menu-toggle').click();

    const navigation = page.getByRole('navigation', { name: 'Mobile navigation' });
    const dimensions = await navigation.evaluate((element) => ({
      clientHeight: element.clientHeight,
      scrollHeight: element.scrollHeight,
    }));
    expect(dimensions.scrollHeight).toBeGreaterThan(dimensions.clientHeight);
    await navigation.getByRole('link', { name: /Careers/ }).scrollIntoViewIfNeeded();
    await expect(navigation.getByRole('link', { name: /Careers/ })).toBeVisible();
  });
});

test('keeps normal-link navigation available without JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto('/');

  await expect(page.locator('.noscript-nav')).toBeVisible();
  await expect(page.locator('.menu-toggle')).toBeHidden();
  await expect(page.locator('.noscript-nav a')).toHaveCount(6);
  await context.close();
});

test('uses the Goodman shell for missing pages', async ({ page }) => {
  const response = await page.goto('/does-not-exist');

  expect(response?.status()).toBe(404);
  await expect(page.getByRole('main')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Return home' })).toBeVisible();

  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test('publishes crawl and sitemap endpoints', async ({ request }) => {
  const robots = await request.get('/robots.txt');
  const sitemap = await request.get('/sitemap.xml');

  expect(robots.status()).toBe(200);
  expect(await robots.text()).toContain('Sitemap:');
  expect(sitemap.status()).toBe(200);
  const sitemapText = await sitemap.text();
  const origin = new URL(sitemap.url()).origin;
  expect(sitemapText).toContain(`<loc>${origin}/</loc>`);
  expect(sitemapText).toContain(`<loc>${origin}/companies</loc>`);
  expect(sitemapText).toContain('/companies/goodman-laboratories');
});
