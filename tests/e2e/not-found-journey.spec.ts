import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('404 Page not found journeys', () => {
  test('returns HTTP 404 and renders recovery options for unmapped group routes', async ({ page }) => {
    const response = await page.goto('/unmapped-route-boundary');
    expect(response?.status()).toBe(404);

    await expect(page).toHaveTitle(/Page not found/);
    await expect(page.getByText('404 / Page not found')).toBeVisible();
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'This route has moved beyond the map.',
      }),
    ).toBeVisible();

    // Axe accessibility compliance
    const axeResults = await new AxeBuilder({ page }).analyze();
    expect(axeResults.violations).toEqual([]);

    // 1. Recover by returning home
    await page.getByRole('link', { name: /Return home/i }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('main')).toBeVisible();

    // 2. Recover by browsing companies
    await page.goto('/another-missing-route');
    await page.getByRole('link', { name: /Browse companies/i }).click();
    await expect(page).toHaveURL(/\/companies$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Our Companies' })).toBeVisible();
  });

  test('returns HTTP 404 for unknown company slugs under /companies/*', async ({ page }) => {
    const response = await page.goto('/companies/non-existent-company-slug');
    expect(response?.status()).toBe(404);

    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'This route has moved beyond the map.',
      }),
    ).toBeVisible();
  });
});
