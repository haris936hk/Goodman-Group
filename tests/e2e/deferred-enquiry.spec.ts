import { expect, test } from "@playwright/test";

test("keyboard users can open the deferred form without viewport observation", async ({ page }) => {
  await page.addInitScript(() => {
    window.IntersectionObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords() { return []; }
      root = null;
      rootMargin = "";
      thresholds = [];
    } as unknown as typeof IntersectionObserver;
  });
  await page.goto("/#contact");
  const open = page.getByRole("button", { name: "Open enquiry form" });
  await open.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByLabel(/Full name/)).toBeFocused();
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(page.getByText("Please enter your name.")).toBeVisible();
});

test("a failed form download can be retried without losing the email fallback", async ({ page }) => {
  await page.addInitScript(() => {
    window.IntersectionObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords() { return []; }
      root = null;
      rootMargin = "";
      thresholds = [];
    } as unknown as typeof IntersectionObserver;
  });
  await page.goto("/");
  await page.route("**/_next/static/chunks/**", (route) => route.abort());
  await page.getByRole("button", { name: "Open enquiry form" }).click();
  await expect(page.getByText("The enquiry form could not be loaded.", { exact: false })).toBeVisible();
  await expect(page.locator("#contact").getByRole("link", { name: "goodman@goodmangoc.com" })).toBeVisible();
  await page.unroute("**/_next/static/chunks/**");
  await page.getByRole("button", { name: "Try loading the enquiry form again" }).click();
  await expect(page.getByLabel(/Full name/)).toBeFocused();
});

test("direct contact links remain positioned at the form after it loads", async ({ page }) => {
  await page.goto("/#contact");
  await expect(page.getByLabel(/Full name/)).toBeVisible();
  await expect.poll(async () =>
    Math.abs(await page.locator("#contact").evaluate((node) => node.getBoundingClientRect().top)),
  ).toBeLessThan(250);
});

test("contact email remains available without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/#contact");
  await expect(page.locator("#contact").getByRole("link", { name: "goodman@goodmangoc.com" })).toHaveAttribute("href", "mailto:goodman@goodmangoc.com");
  await context.close();
});
