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
    await expect(
      page.getByRole('heading', { level: 1, name: 'Goodman Group' }),
    ).toHaveCount(1);
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
        name: 'Our presence across regional and global markets.',
      }),
    ).toBeInViewport();
  });

  test('matches the audited responsive company grid and stays within the viewport', async ({
    page,
  }) => {
    const states = [
      { width: 320, companyColumns: 1 },
      { width: 390, companyColumns: 1 },
      { width: 641, companyColumns: 1 },
      { width: 768, companyColumns: 2 },
      { width: 1080, companyColumns: 2 },
      { width: 1081, companyColumns: 2 },
      { width: 1180, companyColumns: 2 },
      { width: 1280, companyColumns: 3 },
      { width: 1440, companyColumns: 3 },
    ];

    for (const state of states) {
      await page.setViewportSize({ width: state.width, height: 900 });
      await page.goto('/');

      const layout = await page.evaluate(() => {
        const bounds = Array.from(
          document.querySelectorAll(
            '.site-header, .hero-system, .company-grid, .presence-ledger-grid',
          ),
        ).map((element) => {
          const rect = element.getBoundingClientRect();
          return { left: rect.left, right: rect.right };
        });
        const hero = document.querySelector('.hero')?.getBoundingClientRect();
        const system = document.querySelector('.hero-system')?.getBoundingClientRect();

        return {
          companyColumns: getComputedStyle(
            document.querySelector('.company-grid') as Element,
          ).gridTemplateColumns.split(' ').length,
          bounds,
          heroCenter: hero ? hero.left + hero.width / 2 : null,
          systemCenter: system ? system.left + system.width / 2 : null,
          viewport: window.innerWidth,
        };
      });

      expect(layout.companyColumns).toBe(state.companyColumns);
      expect(
        layout.bounds.every(
          (bound) => bound.left >= -1 && bound.right <= layout.viewport + 1,
        ),
      ).toBe(true);
      expect(layout.heroCenter).not.toBeNull();
      expect(layout.systemCenter).not.toBeNull();
      expect(Math.abs(layout.heroCenter! - layout.systemCenter!)).toBeLessThanOrEqual(1);
    }
  });
});

test('Group theme persists across routes and synchronizes bespoke company pages', async ({ page }) => {
  const scriptWarnings: string[] = [];
  page.on('console', (message) => {
    if (message.text().includes('Encountered a script tag while rendering React component')) {
      scriptWarnings.push(message.text());
    }
  });
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  const shell = page.locator('.site-shell');
  await expect(shell).toHaveAttribute('data-theme', 'dark');
  const toggle = page.getByRole('button', { name: 'Switch to light mode' });
  await toggle.click();
  await expect(shell).toHaveAttribute('data-theme', 'light');
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#ffffff');
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme)).toBe('light');
  await expect(page.getByRole('button', { name: 'Switch to dark mode' })).toHaveAttribute('aria-pressed', 'true');
  expect(await shell.evaluate((element) => getComputedStyle(element).colorScheme)).toBe('light');
  const lightColors = await shell.evaluate((element) => {
    const style = getComputedStyle(element);
    return { background: style.backgroundColor, foreground: style.color };
  });
  expect(lightColors.background).not.toBe(lightColors.foreground);
  await page.reload();
  await expect(shell).toHaveAttribute('data-theme', 'light');
  await page.getByRole('link', { name: 'Our Companies' }).first().click();
  await expect(page.locator('.site-shell')).toHaveAttribute('data-theme', 'light');
  await expect(page).toHaveTitle(/Our Companies/);
  await expect.poll(() => page.locator('meta[name="theme-color"]').evaluateAll((metas) => metas.every((meta) => meta.getAttribute('content') === '#ffffff'))).toBe(true);
  await expect(page.locator('.directory-panel-business').first()).toHaveCSS('color', 'rgb(23, 74, 135)');
  await page.emulateMedia({ colorScheme: 'light' });
  await page.getByRole('link', { name: 'View Goodman Laboratories' }).last().click();
  await expect(page.locator('.company-group-frame')).toBeVisible();
  await expect(page.locator('.laboratories-page')).toHaveAttribute('data-theme', 'light');
  await expect.poll(() => page.locator('meta[name="theme-color"]').evaluateAll((metas) => metas.every((meta) => meta.getAttribute('content') === '#fcfaf7'))).toBe(true);
  await page.goBack();
  await expect(page.locator('.site-shell')).toHaveAttribute('data-theme', 'light');
  await expect.poll(() => page.locator('meta[name="theme-color"]').evaluateAll((metas) => metas.every((meta) => meta.getAttribute('content') === '#ffffff'))).toBe(true);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.goto('/not-a-page');
  await expect(page.locator('.site-shell')).toHaveAttribute('data-theme', 'light');
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/companies/goodman-medical-equipment');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.locator('.medical-equipment-page')).toHaveAttribute('data-theme', 'light');
  await expect(page.locator('.medical-equipment-page')).toHaveCSS('background-color', 'rgb(250, 251, 252)');
  await expect.poll(() => page.locator('meta[name="theme-color"]').evaluateAll((metas) => metas.every((meta) => meta.getAttribute('content') === '#fafbfc'))).toBe(true);
  await expect(page.getByRole('button', { name: /Switch to .* mode|Change color theme/ })).toHaveCount(0);
  await expect(page.locator('.site-shell')).toHaveCount(0);
  expect(await page.evaluate(() => localStorage.getItem('goodman-group-theme'))).toBe('light');
  expect(await page.evaluate(() => localStorage.getItem('goodman-medical-equipment-theme'))).toBeNull();
  await page.goto('/');
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'Switch to dark mode' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.site-shell')).toHaveAttribute('data-theme', 'dark');
  await expect.poll(() => page.locator('meta[name="theme-color"]').evaluateAll((metas) => metas.every((meta) => meta.getAttribute('content') === '#06111f'))).toBe(true);
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await expect(page.getByRole('dialog', { name: 'Site navigation' })).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('.mobile-nav')).toHaveCSS('overscroll-behavior', 'contain');
  await page.keyboard.press('Escape');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(scriptWarnings).toEqual([]);
});

test('follows device light/dark preference by default and updates live without saved selection', async ({ page }) => {
  // 1. Light device, empty storage -> defaults to light
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  const shell = page.locator('.site-shell');
  await expect(shell).toHaveAttribute('data-theme', 'light');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme)).toBe('light');
  await expect.poll(() =>
    page.locator('meta[name="theme-color"]').evaluateAll((metas) => metas.every((m) => m.getAttribute('content') === '#ffffff'))
  ).toBe(true);
  await expect(page.getByRole('button', { name: 'Switch to dark mode' })).toHaveAttribute('aria-pressed', 'true');
  expect(await page.evaluate(() => localStorage.getItem('goodman-group-theme'))).toBeNull();

  // 2. Emulate dark while open without manual toggle -> updates Group shell, root, button, meta
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(shell).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme)).toBe('dark');
  await expect.poll(() =>
    page.locator('meta[name="theme-color"]').evaluateAll((metas) => metas.every((m) => m.getAttribute('content') === '#06111f'))
  ).toBe(true);
  await expect(page.getByRole('button', { name: 'Switch to light mode' })).toHaveAttribute('aria-pressed', 'false');
  expect(await page.evaluate(() => localStorage.getItem('goodman-group-theme'))).toBeNull();

  // 3. Navigate to company route without override -> company follows dark device
  await page.goto('/companies/goodman-laboratories');
  const labPage = page.locator('.laboratories-page');
  await expect(labPage).toHaveAttribute('data-theme', 'dark');
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme)).toBe('dark');
  await expect.poll(() =>
    page.locator('meta[name="theme-color"]').evaluateAll((metas) => metas.every((m) => m.getAttribute('content') === '#191416'))
  ).toBe(true);

  // 4. Emulate light while on company route without override -> company updates live
  await page.emulateMedia({ colorScheme: 'light' });
  await expect(labPage).toHaveAttribute('data-theme', 'light');
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme)).toBe('light');
  await expect.poll(() =>
    page.locator('meta[name="theme-color"]').evaluateAll((metas) => metas.every((m) => m.getAttribute('content') === '#fcfaf7'))
  ).toBe(true);
  expect(await page.evaluate(() => localStorage.getItem('goodman-group-theme'))).toBeNull();

  // 5. Navigate back to Home, manual toggle to dark -> creates manual override
  await page.goto('/');
  await expect(shell).toHaveAttribute('data-theme', 'light');
  await page.getByRole('button', { name: 'Switch to dark mode' }).click();
  await expect(shell).toHaveAttribute('data-theme', 'dark');
  expect(await page.evaluate(() => localStorage.getItem('goodman-group-theme'))).toBe('dark');

  // 6. Emulate light live -> manual dark override persists and defeats live device change
  await page.emulateMedia({ colorScheme: 'light' });
  await expect(shell).toHaveAttribute('data-theme', 'dark');
  await page.goto('/companies/geron-pharma');
  const geronPage = page.locator('.geron-page');
  await expect(geronPage).toHaveAttribute('data-theme', 'dark');
  expect(await page.evaluate(() => localStorage.getItem('goodman-group-theme'))).toBe('dark');
});

const companyThemeRoutes = [
  {
    name: 'Wal Green Chemicals',
    slug: 'wal-green-chemicals',
    path: '/companies/wal-green-chemicals',
    pageSelector: '.wal-green-page',
    viewLinkName: 'View Wal Green Chemicals',
    lightBg: 'rgb(250, 248, 245)',
    darkBg: 'rgb(17, 27, 22)',
    lightThemeColor: '#faf8f5',
    darkThemeColor: '#111b16',
    historicalKey: 'wal-green-chemicals-theme',
  },
  {
    name: 'Geron Pharma',
    slug: 'geron-pharma',
    path: '/companies/geron-pharma',
    pageSelector: '.geron-page',
    viewLinkName: 'View Geron Pharma',
    lightBg: 'rgb(248, 245, 255)',
    darkBg: 'rgb(12, 8, 23)',
    lightThemeColor: '#f8f5ff',
    darkThemeColor: '#0c0817',
    historicalKey: 'geron-pharma-theme',
  },
  {
    name: 'Goodman Laboratories',
    slug: 'goodman-laboratories',
    path: '/companies/goodman-laboratories',
    pageSelector: '.laboratories-page',
    viewLinkName: 'View Goodman Laboratories',
    lightBg: 'rgb(252, 250, 247)',
    darkBg: 'rgb(25, 20, 22)',
    lightThemeColor: '#fcfaf7',
    darkThemeColor: '#191416',
    historicalKey: 'goodman-laboratories-theme',
  },
  {
    name: 'Goodman Billing',
    slug: 'goodman-billing',
    path: '/companies/goodman-billing',
    pageSelector: '.billing-page',
    viewLinkName: 'View Goodman Billing',
    lightBg: 'rgb(250, 251, 248)',
    darkBg: 'rgb(16, 28, 25)',
    lightThemeColor: '#fafbf8',
    darkThemeColor: '#101c19',
    historicalKey: 'goodman-billing-theme',
  },
  {
    name: 'Goodman Medical Equipment Trading',
    slug: 'goodman-medical-equipment',
    path: '/companies/goodman-medical-equipment',
    pageSelector: '.medical-equipment-page',
    viewLinkName: 'View Goodman Medical Equipment Trading',
    lightBg: 'rgb(250, 251, 252)',
    darkBg: 'rgb(16, 28, 38)',
    lightThemeColor: '#fafbfc',
    darkThemeColor: '#101c26',
    historicalKey: 'goodman-medical-equipment-theme',
  },
] as const;

test.describe('Group theme shared-ownership across bespoke company routes', () => {
  for (const company of companyThemeRoutes) {
    test.describe(company.name, () => {
      test('synchronizes Group light and dark preference through directory navigation despite opposite OS and conflicting keys', async ({ page }) => {
        await page.emulateMedia({ colorScheme: 'dark' });
        await page.addInitScript(() => {
          localStorage.setItem('wal-green-chemicals-theme', 'dark');
          localStorage.setItem('geron-pharma-theme', 'dark');
          localStorage.setItem('goodman-laboratories-theme', 'dark');
          localStorage.setItem('goodman-billing-theme', 'dark');
          localStorage.setItem('goodman-medical-equipment-theme', 'dark');
        });

        await page.goto('/');
        const shell = page.locator('.site-shell');
        await expect(shell).toHaveAttribute('data-theme', 'dark');
        await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

        const toggleToLight = page.getByRole('button', { name: 'Switch to light mode' });
        await toggleToLight.click();
        await expect(shell).toHaveAttribute('data-theme', 'light');
        await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
        expect(await page.evaluate(() => localStorage.getItem('goodman-group-theme'))).toBe('light');

        await page.getByRole('link', { name: 'Our Companies' }).first().click();
        await expect(page).toHaveURL(/\/companies$/);
        await expect(page.locator('.site-shell')).toHaveAttribute('data-theme', 'light');

        const companyLink = page.getByRole('link', { name: company.viewLinkName }).first();
        await companyLink.click();
        await expect(page).toHaveURL(new RegExp(company.path));

        const companyFrame = page.locator(company.pageSelector);
        await expect(companyFrame).toBeVisible();
        await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
        await expect(companyFrame).toHaveAttribute('data-theme', 'light');
        await expect(companyFrame).toHaveCSS('background-color', company.lightBg);
        expect(await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme)).toBe('light');
        await expect.poll(() =>
          page.locator('meta[name="theme-color"]').evaluateAll((metas, color) => metas.every((meta) => meta.getAttribute('content') === color), company.lightThemeColor)
        ).toBe(true);
        await expect(page.getByRole('button', { name: /Switch to .* mode|Change color theme/ })).toHaveCount(0);

        await page.reload();
        await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
        await expect(companyFrame).toHaveAttribute('data-theme', 'light');
        await expect(companyFrame).toHaveCSS('background-color', company.lightBg);
        expect(await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme)).toBe('light');
        await expect.poll(() =>
          page.locator('meta[name="theme-color"]').evaluateAll((metas, color) => metas.every((meta) => meta.getAttribute('content') === color), company.lightThemeColor)
        ).toBe(true);
        await expect(page.getByRole('button', { name: /Switch to .* mode|Change color theme/ })).toHaveCount(0);

        await page.locator('.group-frame-brand').click();
        await expect(page).toHaveURL(/\/$/);
        await expect(page.locator('.site-shell')).toHaveAttribute('data-theme', 'light');

        await page.emulateMedia({ colorScheme: 'light' });
        await page.evaluate(() => {
          localStorage.setItem('wal-green-chemicals-theme', 'light');
          localStorage.setItem('geron-pharma-theme', 'light');
          localStorage.setItem('goodman-laboratories-theme', 'light');
          localStorage.setItem('goodman-billing-theme', 'light');
          localStorage.setItem('goodman-medical-equipment-theme', 'light');
        });

        const toggleToDark = page.getByRole('button', { name: 'Switch to dark mode' });
        await toggleToDark.click();
        await expect(page.locator('.site-shell')).toHaveAttribute('data-theme', 'dark');
        await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
        expect(await page.evaluate(() => localStorage.getItem('goodman-group-theme'))).toBe('dark');

        await page.getByRole('link', { name: 'Our Companies' }).first().click();
        await page.getByRole('link', { name: company.viewLinkName }).first().click();
        await expect(page).toHaveURL(new RegExp(company.path));
        await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
        await expect(companyFrame).toHaveAttribute('data-theme', 'dark');
        await expect(companyFrame).toHaveCSS('background-color', company.darkBg);
        expect(await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme)).toBe('dark');
        await expect.poll(() =>
          page.locator('meta[name="theme-color"]').evaluateAll((metas, color) => metas.every((meta) => meta.getAttribute('content') === color), company.darkThemeColor)
        ).toBe(true);
        await expect(page.getByRole('button', { name: /Switch to .* mode|Change color theme/ })).toHaveCount(0);
      });

      test('defaults to device preference on direct visit when Group preference is absent', async ({ page }) => {
        await page.emulateMedia({ colorScheme: 'light' });
        await page.addInitScript(() => {
          localStorage.removeItem('goodman-group-theme');
          localStorage.setItem('wal-green-chemicals-theme', 'light');
          localStorage.setItem('geron-pharma-theme', 'light');
          localStorage.setItem('goodman-laboratories-theme', 'light');
          localStorage.setItem('goodman-billing-theme', 'light');
          localStorage.setItem('goodman-medical-equipment-theme', 'light');
        });

        await page.goto(company.path);
        const companyFrame = page.locator(company.pageSelector);
        await expect(companyFrame).toBeVisible();
        await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
        await expect(companyFrame).toHaveAttribute('data-theme', 'light');
        await expect(companyFrame).toHaveCSS('background-color', company.lightBg);
        expect(await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme)).toBe('light');
        await expect.poll(() =>
          page.locator('meta[name="theme-color"]').evaluateAll((metas, color) => metas.every((meta) => meta.getAttribute('content') === color), company.lightThemeColor)
        ).toBe(true);
        expect(await page.evaluate(() => localStorage.getItem('goodman-group-theme'))).toBeNull();
        await expect(page.getByRole('button', { name: /Switch to .* mode|Change color theme/ })).toHaveCount(0);
      });

      test('defaults to dark device preference on direct visit when Group preference is absent and device is dark', async ({ page }) => {
        await page.emulateMedia({ colorScheme: 'dark' });
        await page.addInitScript(() => {
          localStorage.removeItem('goodman-group-theme');
          localStorage.setItem('wal-green-chemicals-theme', 'light');
          localStorage.setItem('geron-pharma-theme', 'light');
          localStorage.setItem('goodman-laboratories-theme', 'light');
          localStorage.setItem('goodman-billing-theme', 'light');
          localStorage.setItem('goodman-medical-equipment-theme', 'light');
        });

        await page.goto(company.path);
        const companyFrame = page.locator(company.pageSelector);
        await expect(companyFrame).toBeVisible();
        await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
        await expect(companyFrame).toHaveAttribute('data-theme', 'dark');
        await expect(companyFrame).toHaveCSS('background-color', company.darkBg);
        expect(await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme)).toBe('dark');
        await expect.poll(() =>
          page.locator('meta[name="theme-color"]').evaluateAll((metas, color) => metas.every((meta) => meta.getAttribute('content') === color), company.darkThemeColor)
        ).toBe(true);
        expect(await page.evaluate(() => localStorage.getItem('goodman-group-theme'))).toBeNull();
        await expect(page.getByRole('button', { name: /Switch to .* mode|Change color theme/ })).toHaveCount(0);
      });

      test('defaults to device preference on direct visit when Group preference is malformed', async ({ page }) => {
        await page.emulateMedia({ colorScheme: 'light' });
        await page.addInitScript(() => {
          localStorage.setItem('goodman-group-theme', 'unexpected-value');
          localStorage.setItem('wal-green-chemicals-theme', 'light');
          localStorage.setItem('geron-pharma-theme', 'light');
          localStorage.setItem('goodman-laboratories-theme', 'light');
          localStorage.setItem('goodman-billing-theme', 'light');
          localStorage.setItem('goodman-medical-equipment-theme', 'light');
        });

        await page.goto(company.path);
        const companyFrame = page.locator(company.pageSelector);
        await expect(companyFrame).toBeVisible();
        await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
        await expect(companyFrame).toHaveAttribute('data-theme', 'light');
        await expect(companyFrame).toHaveCSS('background-color', company.lightBg);
        expect(await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme)).toBe('light');
        await expect.poll(() =>
          page.locator('meta[name="theme-color"]').evaluateAll((metas, color) => metas.every((meta) => meta.getAttribute('content') === color), company.lightThemeColor)
        ).toBe(true);
        expect(await page.evaluate(() => localStorage.getItem('goodman-group-theme'))).toBe('unexpected-value');
        await expect(page.getByRole('button', { name: /Switch to .* mode|Change color theme/ })).toHaveCount(0);
      });

      test('preserves in-session selection during storage-denied client navigation and falls back to dark on reload', async ({ page }) => {
        await page.emulateMedia({ colorScheme: 'dark' });
        await page.addInitScript(() => {
          Storage.prototype.getItem = () => { throw new Error('blocked'); };
          Storage.prototype.setItem = () => { throw new Error('blocked'); };
        });

        await page.goto('/');
        const shell = page.locator('.site-shell');
        await expect(shell).toHaveAttribute('data-theme', 'dark');
        await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

        await page.getByRole('button', { name: 'Switch to light mode' }).click();
        await expect(shell).toHaveAttribute('data-theme', 'light');
        await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

        await page.getByRole('link', { name: 'Our Companies' }).first().click();
        await page.getByRole('link', { name: company.viewLinkName }).first().click();

        const companyFrame = page.locator(company.pageSelector);
        await expect(companyFrame).toBeVisible();
        await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
        await expect(companyFrame).toHaveAttribute('data-theme', 'light');
        await expect(companyFrame).toHaveCSS('background-color', company.lightBg);
        await expect.poll(() =>
          page.locator('meta[name="theme-color"]').evaluateAll((metas, color) => metas.every((meta) => meta.getAttribute('content') === color), company.lightThemeColor)
        ).toBe(true);
        await expect(page.getByRole('button', { name: /Switch to .* mode|Change color theme/ })).toHaveCount(0);

        await page.reload();
        await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
        await expect(companyFrame).toHaveAttribute('data-theme', 'dark');
        await expect(companyFrame).toHaveCSS('background-color', company.darkBg);
        await expect.poll(() =>
          page.locator('meta[name="theme-color"]').evaluateAll((metas, color) => metas.every((meta) => meta.getAttribute('content') === color), company.darkThemeColor)
        ).toBe(true);
      });
    });
  }
});

test.describe('home page with reduced motion', () => {
  test('keeps its content available', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    await expect(page.locator('main')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1, name: 'Goodman Group' })).toHaveCount(1);
    await expect(page.locator('[data-hero] .hero-system')).toBeVisible();
    await expect(page.locator('[data-hero] [data-orbit-ring]')).toHaveCount(2);
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
      name: 'Our presence across regional and global markets.',
    });
    await heading.scrollIntoViewIfNeeded();

    await expect(heading).toBeVisible();
    const presenceGrid = page.locator('.presence-ledger-grid');
    await expect(presenceGrid).toBeVisible();
    await expect(
      presenceGrid.getByText('Goodman Laboratories').first(),
    ).toBeVisible();
    await expect(
      presenceGrid.getByText('Goodman Medical Equipment Trading').first(),
    ).toBeVisible();
    await expect(
      presenceGrid.getByText('Wal Green Chemicals').first(),
    ).toBeVisible();
    await expect(
      presenceGrid.getByText('Goodman Billing').first(),
    ).toBeVisible();

    for (const label of [
      'Active',
      'Target market',
      'Sourcing import',
      'Partner distribution',
    ]) {
      await expect(page.getByText(label).first()).toBeVisible();
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

  test('shows the remaining destinations in short mobile navigation', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 360 });
    await page.reload();
    await page.locator('.menu-toggle').click();

    const navigation = page.getByRole('navigation', { name: 'Mobile navigation' });
    const links = navigation.getByRole('link');
    await expect(links).toHaveCount(3);
    await expect(links.nth(0)).toHaveAttribute('href', '/#about');
    await expect(links.nth(1)).toHaveAttribute('href', '/companies');
    await expect(links.nth(2)).toHaveAttribute('href', '/#presence');
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
  await expect(page.locator('.noscript-nav a')).toHaveCount(3);
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
  expect(await robots.text()).toContain('Sitemap: https://goodmangoc.com/sitemap.xml');
  expect(sitemap.status()).toBe(200);
  const sitemapText = await sitemap.text();
  expect(sitemapText).toContain('<loc>https://goodmangoc.com/</loc>');
  expect(sitemapText).toContain('<loc>https://goodmangoc.com/companies</loc>');
  expect(sitemapText).toContain('<loc>https://goodmangoc.com/companies/goodman-laboratories</loc>');
});

test('exposes valid Organization JSON-LD and canonical metadata on home', async ({ page }) => {
  await page.goto('/');
  const canonical = page.locator('link[rel="canonical"]');
  await expect(canonical).toHaveAttribute('href', /^https:\/\/goodmangoc\.com\/?$/);

  const jsonLdScript = page.locator('script[type="application/ld+json"]');
  await expect(jsonLdScript).toHaveCount(1);
  const content = await jsonLdScript.textContent();
  expect(content).toBeTruthy();
  const parsed = JSON.parse(content!);
  expect(parsed['@type']).toBe('Organization');
  expect(parsed.name).toBe('Goodman Group');
  expect(parsed.url).toBe('https://goodmangoc.com/');
  expect(parsed).not.toHaveProperty('parentOrganization');
  expect(parsed).not.toHaveProperty('subOrganization');
});

test('provides functional audience routes and executive contact links', async ({ page }) => {
  await page.goto('/');
  const generalInquiry = page.getByRole('link', { name: 'goodman@goodmangoc.com' });
  await expect(generalInquiry).toHaveAttribute('href', /mailto:goodman@goodmangoc.com/);

  const execPhone = page.getByRole('link', { name: '+92 336 777 0770' });
  await expect(execPhone).toHaveAttribute('href', 'tel:+923367770770');
});

test('country picker scrolls independently and contains wheel scrolling at its boundaries', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.goto('/');
  await expect(page.locator('html')).toHaveClass(/lenis/);
  await page.getByRole('combobox', { name: 'Country calling code' }).scrollIntoViewIfNeeded();
  await page.getByRole('button', { name: 'Open country code selection', exact: true }).click();

  const picker = page.locator('.enquiry-popover-country');
  await expect(picker).toBeVisible();
  const box = await picker.boundingBox();
  if (!box) throw new Error('Country picker has no visible bounds');
  // hover() scrolls its target into view, which would itself dismiss this overlay.
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  const pageScroll = await page.evaluate(() => window.scrollY);

  await page.mouse.wheel(0, 400);
  await expect.poll(() => picker.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
  await expect(picker).toBeVisible();
  expect(await page.evaluate(() => window.scrollY)).toBe(pageScroll);

  for (const edge of ['bottom', 'top'] as const) {
    await picker.evaluate((element, boundary) => {
      element.scrollTop = boundary === 'bottom' ? element.scrollHeight : 0;
    }, edge);
    await page.mouse.wheel(0, edge === 'bottom' ? 600 : -600);
    await page.evaluate(() => new Promise<void>((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    }));
    await expect(picker).toBeVisible();
    expect(await page.evaluate(() => window.scrollY)).toBe(pageScroll);
  }
});
