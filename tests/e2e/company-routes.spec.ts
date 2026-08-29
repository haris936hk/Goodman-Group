import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

import { companies } from '../../src/data/companies';

test.describe('company directory', () => {
  test('exposes every provisional record as one normal link', async ({ page }) => {
    await page.goto('/companies');

    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    for (const company of companies) {
      await expect(
        page.getByRole('link', { name: `View ${company.displayName}` }),
      ).toHaveCount(1);
    }

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test('has no horizontal overflow at desktop and mobile widths', async ({
    page,
  }) => {
    for (const viewport of [
      { width: 1440, height: 900 },
      { width: 390, height: 844 },
    ]) {
      await page.setViewportSize(viewport);
      await page.goto('/companies');

      const widths = await page.evaluate(() => ({
        viewport: window.innerWidth,
        content: document.documentElement.scrollWidth,
      }));
      expect(widths.content).toBeLessThanOrEqual(widths.viewport);
    }
  });

  test('uses the audited directory grid states', async ({ page }) => {
    for (const state of [
      { width: 641, columns: 1 },
      { width: 768, columns: 2 },
      { width: 1440, columns: 4 },
    ]) {
      await page.setViewportSize({ width: state.width, height: 900 });
      await page.goto('/companies');

      const columns = await page
        .locator('.company-grid-directory')
        .first()
        .evaluate((element) =>
          getComputedStyle(element).gridTemplateColumns.split(' ').length,
        );
      expect(columns).toBe(state.columns);
    }
  });
});

for (const company of companies) {
  test(`renders the ${company.displayName} preview record`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const response = await page.goto(`/companies/${company.slug}`);

    expect(response?.status()).toBe(200);
    await expect(
      page.getByRole('heading', { level: 1, name: company.displayName }),
    ).toBeVisible();
    await expect(
      page.getByRole('img', { name: `${company.displayName} logo` }),
    ).toBeVisible();
    await expect(page.getByText(company.relationshipLabel)).toBeVisible();
    await expect(page.getByText(company.lastReviewed)).toBeVisible();
    await expect(
      page.getByText('Preview record — not publication-ready'),
    ).toBeVisible();
    for (const heading of [
      'Capabilities',
      'Leadership',
      'Evidence',
      'Contact route',
    ]) {
      await expect(page.getByRole('heading', { name: heading })).toBeVisible();
    }
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      'content',
      'noindex, follow',
    );

    const widths = await page.evaluate(() => ({
      viewport: window.innerWidth,
      content: document.documentElement.scrollWidth,
    }));
    expect(widths.content).toBeLessThanOrEqual(widths.viewport);

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
}

test('keeps a profile usable across the required viewport sizes', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });

  for (const viewport of [
    { width: 320, height: 568 },
    { width: 641, height: 900 },
    { width: 768, height: 1024 },
    { width: 1081, height: 800 },
    { width: 1180, height: 900 },
    { width: 1440, height: 900 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto('/companies/goodman-laboratories');

    const layout = await page.evaluate(() => {
      const selectors = [
        '.company-profile-logo',
        '.company-masthead h1',
        '.company-publication-status',
        '.company-summary',
        '.record-panel',
        '.profile-modules',
      ];
      const elements = selectors.flatMap((selector) =>
        Array.from(document.querySelectorAll(selector)),
      );
      const bounds = elements.map((element) => {
        const rect = element.getBoundingClientRect();
        return { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom };
      });

      return { bounds, viewport: window.innerWidth };
    });

    expect(
      layout.bounds.every(
        (bound) =>
          bound.left >= -1 &&
          bound.right <= layout.viewport + 1 &&
          bound.top >= 0 &&
          bound.bottom > bound.top,
      ),
    ).toBe(true);
  }
});

test('supports keyboard skip and directory navigation', async ({ page }) => {
  await page.goto('/companies/goodman-laboratories');

  const skipLink = page.getByRole('link', { name: 'Skip to main content' });
  await skipLink.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();

  const allCompanies = page.getByRole('link', { name: 'All companies' });
  await allCompanies.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/companies$/);
});

test('returns the branded 404 for an unknown company slug', async ({ page }) => {
  const response = await page.goto('/companies/not-a-real-company');

  expect(response?.status()).toBe(404);
  await expect(page.getByRole('main')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Return home' })).toBeVisible();
});

test('keeps provisional profiles out of the sitemap', async ({ request }) => {
  const response = await request.get('/sitemap.xml');
  const xml = await response.text();

  for (const company of companies) {
    expect(xml).not.toContain(`/companies/${company.slug}`);
  }
});
