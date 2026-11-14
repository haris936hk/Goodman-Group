import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

import { goodmanGroup } from '../../src/data/goodman-group';

const route = '/companies/goodman-technologies';
const sections = [
  ['Services', 'services'],
  ['Technology', 'technology'],
  ['Our approach', 'approach'],
  ['Why Goodman', 'why-goodman'],
  ['The director', 'director'],
  ["Let's talk", 'contact'],
] as const;

async function expectTheme(page: Page, theme: 'light' | 'dark') {
  const colors = theme === 'light'
    ? { background: 'rgb(247, 247, 252)', meta: '#f7f7fc' }
    : { background: 'rgb(8, 13, 28)', meta: '#080d1c' };
  await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
  await expect(page.locator('.technologies-page')).toHaveAttribute('data-theme', theme);
  await expect(page.locator('.technologies-page')).toHaveCSS('background-color', colors.background);
  await expect.poll(() => page.locator('meta[name="theme-color"]').evaluateAll(
    (metas, color) => metas.length > 0 && metas.every((meta) => meta.getAttribute('content') === color), colors.meta,
  )).toBe(true);
}

async function expectSectionLinks(page: Page) {
  const nav = page.getByRole('navigation', { name: 'On this page' });
  for (const [label, id] of sections) {
    await nav.getByRole('link', { name: label, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`#${id}$`));
    await expect(page.locator(`#${id}`)).toBeInViewport();
    await expect(page.locator(`#${id} h2`)).toBeVisible();
  }
}

test('retains the shared Group theme through navigation and passes accessibility in both themes', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
  await page.addInitScript(() => {
    if (!localStorage.getItem('goodman-group-theme')) localStorage.setItem('goodman-group-theme', 'light');
  });
  await page.goto(route);
  await expectTheme(page, 'light');
  const showcase = page.locator('.technologies-showcase');
  await expect(showcase).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  const surfaces = showcase.locator('.technologies-plane-surface stop');
  const lightColors = await surfaces.evaluateAll((stops) => stops.map((stop) => getComputedStyle(stop).stopColor));
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);

  await page.locator('.site-header').getByRole('button', { name: 'Switch to dark mode' }).click();
  await expectTheme(page, 'dark');
  await expect(showcase).toHaveCSS('background-color', 'rgb(11, 17, 33)');
  const darkColors = await surfaces.evaluateAll((stops) => stops.map((stop) => getComputedStyle(stop).stopColor));
  expect(darkColors).not.toEqual(lightColors);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.reload();
  await expectTheme(page, 'dark');
  await page.goto('/companies');
  await page.getByRole('link', { name: 'View Goodman Technologies' }).click();
  await expect(page).toHaveURL(new RegExp(`${route}$`));
  await expectTheme(page, 'dark');
});

test('explores architecture layers by keyboard and assembles them with reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(route);
  const application = page.getByRole('button', { name: '02 Application', exact: true });
  await application.focus();
  await page.keyboard.press('Enter');
  await expect(application).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('button', { name: '01 Interface', exact: true })).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('#technologies-layer-detail')).toContainText('Node.js / Python / FastAPI');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const assembly = page.getByRole('button', { name: 'Separate architecture layers' });
  await assembly.click();
  await expect(assembly).toHaveAttribute('aria-pressed', 'false');
  await page.getByRole('button', { name: '03 Data & delivery', exact: true }).click();
  await expect(page.locator('#technologies-layer-detail')).toContainText('PostgreSQL / Docker');
  await assembly.click();
  await expect(assembly).toHaveAttribute('aria-pressed', 'true');
});

test('responds to live reduced-motion changes and keeps native navigation operable', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(route);
  await page.locator('#technology').scrollIntoViewIfNeeded();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect.poll(() => page.locator('.technologies-page').evaluate((element) =>
    element.getAnimations({ subtree: true }).filter((animation) => animation.playState === 'running' || animation.pending).length,
  )).toBe(0);
  await expect(page.getByRole('heading', { name: 'The right tools. Built around your needs.' })).toBeVisible();
  await expectSectionLinks(page);
  await expect(page.locator('#contact').getByRole('link', { name: 'Start a project' })).toBeVisible();
  await page.goto('/companies');
  await page.getByRole('link', { name: 'View Goodman Technologies' }).click();
  await expectSectionLinks(page);
  await expect.poll(() => page.locator('.technologies-page').evaluate((element) =>
    element.getAnimations({ subtree: true }).filter((animation) => animation.playState === 'running' || animation.pending).length,
  )).toBe(0);
  expect(errors).toEqual([]);

  await page.goto(route);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expectSectionLinks(page);
});

test('remains readable and navigable without JavaScript under both system themes', async ({ browser }) => {
  for (const colorScheme of ['light', 'dark'] as const) {
    const context = await browser.newContext({ javaScriptEnabled: false, colorScheme, reducedMotion: 'reduce' });
    try {
      const page = await context.newPage();
      await page.goto(route);
      await expect(page.locator('.technologies-page')).toHaveCSS('background-color', 'rgb(8, 13, 28)');
      await expectSectionLinks(page);
      for (const id of ['services', 'technology', 'approach']) {
        await expect(page.locator(`#${id} h2`)).toBeVisible();
      }
      const stages = page.getByRole('navigation', { name: 'Explore our approach' });
      await stages.getByRole('link', { name: 'Testing & QA', exact: true }).click();
      await expect(page).toHaveURL(/#technologies-approach-panel-3$/);
      await expect(page.locator('#technologies-approach-panel-3')).toBeInViewport();
      await expect(page.getByRole('heading', { name: 'Support', exact: true })).toBeVisible();
      await expect(page.getByText('Maintain, support, and improve after launch.', { exact: true })).toBeVisible();
      await page.locator('#contact').getByRole('link', { name: 'Start a project' }).click();
      await expect(page).toHaveURL(/\/#contact$/);
      await expect(page.locator('#contact').getByRole('link', { name: goodmanGroup.contacts.email }).first()).toBeVisible();
    } finally {
      await context.close();
    }
  }
});

test('fits narrow and enlarged text layouts and captures both themes at desktop and mobile', async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const theme of ['light', 'dark'] as const) {
    await page.goto(route);
    await page.evaluate((value) => localStorage.setItem('goodman-group-theme', value), theme);
    await page.reload();
    for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
      await page.setViewportSize(viewport);
      await expectTheme(page, theme);
      await page.screenshot({ path: testInfo.outputPath(`${theme}-${viewport.width}.png`), fullPage: true });
    }
  }

  for (const layout of [
    { width: 320, height: 568, enlarged: false },
    { width: 390, height: 844, enlarged: false },
    { width: 390, height: 844, enlarged: true },
  ]) {
    await page.setViewportSize({ width: layout.width, height: layout.height });
    await page.goto(route);
    if (layout.enlarged) await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    for (const name of ['Web development', 'Mobile app development', 'Desktop applications', 'UI/UX design', 'Testing & QA', 'Performance optimization', 'Maintenance & support']) {
      await expect(page.locator('#services').getByText(name, { exact: true }).first()).toBeVisible();
    }
    for (const name of [
      'C++', 'Python', 'Java', 'JavaScript', 'TypeScript', 'HTML', 'CSS',
      'React.js', 'Next.js', 'Node.js', 'Express.js', 'FastAPI', 'Tailwind CSS', 'AngularJS',
      'MongoDB', 'MySQL', 'PostgreSQL', 'Supabase', 'SQLite', 'Prisma',
      'Git', 'GitHub', 'Vercel', 'Docker', 'GitHub Actions',
    ]) {
      await expect(page.locator('#technology').getByText(name, { exact: true })).toBeVisible();
    }
    const targets = page.locator('nav[aria-label="On this page"] a, .technologies-page a[href="/#contact"]');
    for (const target of await targets.all()) {
      const box = await target.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.height).toBeGreaterThanOrEqual(44);
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(layout.width + 1);
    }
    const clipped = await page.locator('#services, #technology, #approach, #contact').evaluateAll((sections) =>
      sections.flatMap((section) => Array.from(section.querySelectorAll('*'))).filter((element) => {
        const style = getComputedStyle(element);
        return (style.overflowX === 'hidden' && element.scrollWidth > element.clientWidth + 1)
          || (style.overflowY === 'hidden' && element.scrollHeight > element.clientHeight + 1);
      }).map((element) => element.outerHTML.slice(0, 150)),
    );
    expect(clipped).toEqual([]);
    await page.getByRole('navigation', { name: 'On this page' }).getByRole('link', { name: "Let's talk" }).click();
    await expect(page.locator('#contact h2')).toBeInViewport();
    await page.locator('#contact').getByRole('link', { name: 'Start a project' }).click();
    await expect(page).toHaveURL(/\/#contact$/);
  }
});

test('pins technology cards through forward and reverse scrolling, then releases to the next section', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'Pinning is a wide-screen enhancement.');
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(route);
  const workbench = page.locator('.technologies-workbench');
  await expect(workbench).toHaveAttribute('data-pinned', 'true');
  const { start, distance } = await workbench.evaluate((element) => {
    const centeredTop = Math.round(120 + (innerHeight - 120 - 40 - element.getBoundingClientRect().height) / 2);
    const stage = element.querySelector<HTMLElement>('.technologies-card-stage')!;
    const transitions = element.querySelectorAll('.technologies-stack-card').length - 1;
    return { start: element.getBoundingClientRect().top + scrollY - centeredTop, distance: stage.offsetHeight * transitions };
  });
  await page.evaluate((y) => scrollTo(0, y), start + distance * 0.05);

  const titles = ['Languages & foundations', 'Frameworks & runtimes', 'Data & persistence', 'Tools & delivery'];
  const rail = page.getByRole('list', { name: 'Technology layers' }).getByRole('listitem');
  let previous = 0.05;
  for (const [index, progress] of [[0, 0.05], [1, 0.35], [2, 0.63], [3, 0.92], [2, 0.63], [1, 0.35], [0, 0.05]]) {
    const delta = distance * (progress - previous);
    if (delta) await page.mouse.wheel(0, delta);
    previous = progress;
    await expect(rail.nth(index)).toHaveAttribute('aria-current', 'step');
    await expect.poll(() => workbench.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return Math.abs((rect.top - 120) - (innerHeight - 40 - rect.bottom));
    })).toBeLessThanOrEqual(2);
    const card = page.getByRole('article', { name: titles[index], exact: true });
    await expect(card).toHaveCSS('opacity', '1');
    await expect.poll(() => card.getByRole('listitem').first().evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return element.contains(document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2));
    })).toBe(true);
  }
  await page.getByRole('navigation', { name: 'On this page' }).getByRole('link', { name: 'Our approach' }).click();
  await expect(page.locator('#approach h2')).toBeInViewport();
  await expect.poll(() => workbench.evaluate((element) => element.getBoundingClientRect().bottom)).toBeLessThan(120);
  await page.locator('.site-header').getByRole('link', { name: 'Our Companies', exact: true }).click();
  await page.getByRole('link', { name: 'View Goodman Technologies', exact: true }).click();
  await expect(workbench).toHaveAttribute('data-pinned', 'true');
  await expect(rail.first()).toHaveAttribute('aria-current', 'step');
  expect(errors).toEqual([]);
});

test('restores readable technology cards when enlarged text, reduced motion, or a short viewport prevents pinning', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'Exercises the desktop pin-to-flow transition.');
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(route);
  const workbench = page.locator('.technologies-workbench');
  await expect(workbench).toHaveAttribute('data-pinned', 'true');
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
  await expect(workbench).not.toHaveAttribute('data-pinned', 'true');
  const cards = page.locator('.technologies-stack-card');
  const enlargedBounds = await cards.evaluateAll((elements) => elements.map((element) => {
    const rect = element.getBoundingClientRect();
    return { top: rect.top, bottom: rect.bottom };
  }));
  for (let index = 1; index < enlargedBounds.length; index++) {
    expect(enlargedBounds[index].top).toBeGreaterThanOrEqual(enlargedBounds[index - 1].bottom);
  }
  for (const name of ['React.js', 'PostgreSQL', 'Docker']) await expect(workbench.getByText(name, { exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);

  await page.evaluate(() => { document.documentElement.style.fontSize = ''; });
  await expect(workbench).toHaveAttribute('data-pinned', 'true');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(workbench).not.toHaveAttribute('data-pinned', 'true');
  await expect(cards.first()).toHaveCSS('position', 'relative');
  await page.setViewportSize({ width: 1440, height: 650 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(workbench).not.toHaveAttribute('data-pinned', 'true');
  await expect(cards.last()).toHaveCSS('position', 'relative');
  await page.getByRole('navigation', { name: 'On this page' }).getByRole('link', { name: 'Our approach' }).click();
  await expect(page.locator('#approach h2')).toBeInViewport();
});

test('explores the delivery lifecycle with click and roving keyboard focus', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(route);
  const stages = page.getByRole('tablist', { name: 'Explore our approach' });
  await expect(stages.getByRole('tab')).toHaveCount(6);
  await stages.getByRole('tab', { name: 'Design', exact: true }).click();
  await expect(page.getByRole('tabpanel')).toHaveCount(1);
  await expect(page.getByRole('tabpanel', { name: 'Design', exact: true })).toContainText('Shape the user experience and interface.');
  await page.keyboard.press('ArrowRight');
  await expect(stages.getByRole('tab', { name: 'Development', exact: true })).toBeFocused();
  await expect(page.getByRole('tabpanel', { name: 'Development', exact: true })).toBeVisible();
  await page.keyboard.press('End');
  await expect(stages.getByRole('tab', { name: 'Support', exact: true })).toBeFocused();
  await expect(page.getByRole('tabpanel', { name: 'Support', exact: true })).toContainText('Maintain, support, and improve after launch.');
  await page.keyboard.press('ArrowRight');
  await expect(stages.getByRole('tab', { name: 'Discovery', exact: true })).toBeFocused();
  await stages.getByRole('tab', { name: 'Testing & QA', exact: true }).click();
  const panel = page.getByRole('tabpanel', { name: 'Testing & QA', exact: true });
  await expect(panel).toContainText('Test the application and review its quality.');
  await page.keyboard.press('Tab');
  await expect(panel).toBeFocused();
  expect((await new AxeBuilder({ page }).include('.technologies-approach').analyze()).violations).toEqual([]);
});

test('opens linked delivery stages and keeps selection usable through motion changes and client navigation', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(`${route}#technologies-approach-panel-3`);
  const stages = page.getByRole('tablist', { name: 'Explore our approach' });
  await expect(stages.getByRole('tab', { name: 'Testing & QA', exact: true })).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('tabpanel', { name: 'Testing & QA', exact: true })).toBeInViewport();
  await stages.getByRole('tab', { name: 'Support', exact: true }).click();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect.poll(() => page.locator('.technologies-approach').evaluate((element) =>
    element.getAnimations({ subtree: true }).filter((animation) => animation.playState === 'running' || animation.pending).length,
  )).toBe(0);
  await stages.getByRole('tab', { name: 'Deployment', exact: true }).click();
  await expect(page.getByRole('tabpanel', { name: 'Deployment', exact: true })).toContainText('Prepare and release the software to production.');
  await page.getByRole('link', { name: 'Goodman Group home', exact: true }).click();
  await page.getByRole('link', { name: 'Goodman Technologies', exact: true }).last().click();
  await stages.getByRole('tab', { name: 'Design', exact: true }).click();
  await expect(page.getByRole('tabpanel', { name: 'Design', exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});

test('keeps every delivery-stage control usable on narrow screens and with enlarged text', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(route);
  const stages = page.getByRole('tablist', { name: 'Explore our approach' });
  for (const [width, fontSize] of [[320, '100%'], [390, '200%']]) {
    await page.setViewportSize({ width: Number(width), height: 844 });
    await page.evaluate((size) => { document.documentElement.style.fontSize = String(size); }, fontSize);
    for (const tab of await stages.getByRole('tab').all()) {
      await expect(tab).toBeVisible();
      const bounds = await tab.boundingBox();
      expect(bounds!.height).toBeGreaterThanOrEqual(44);
      expect(await tab.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
    }
    await stages.getByRole('tab', { name: 'Support', exact: true }).click();
    await expect(page.getByRole('tabpanel', { name: 'Support', exact: true })).toContainText('Maintain, support, and improve after launch.');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test('keeps every commitment readable and takes keyboard users to the existing contact section', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(route);
  await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
  const board = page.locator('#why-goodman');
  for (const name of ['Full code ownership', 'Direct communication', 'Fixed pricing & timelines', '30 days of post-launch support']) {
    await expect(board.getByRole('heading', { name, exact: true })).toBeVisible();
  }
  await expect(board.getByText('Keep ownership of the code created for your project.', { exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const contact = board.getByRole('link', { name: "Let's talk", exact: true });
  await contact.focus();
  expect((await contact.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#contact$/);
  await expect(page.locator('#contact h2')).toBeInViewport();
  await expect(page.locator('#contact').getByText('Choose Goodman Technologies in the company-of-interest field.', { exact: true })).toBeVisible();
});

test('keeps director motion brief and responds to live reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(`${route}#director`);
  const director = page.locator('#director');
  const tracks = director.locator('.technologies-director-track');
  await director.scrollIntoViewIfNeeded();
  await expect.poll(() => tracks.evaluateAll((elements) => elements.flatMap(
    (element) => element.getAnimations().filter((animation) => animation.playState === 'running'),
  ).length)).toBe(3);
  await expect.poll(() => tracks.evaluateAll((elements) => elements.flatMap(
    (element) => element.getAnimations().filter((animation) => animation.playState === 'running'),
  ).length), { timeout: 6000 }).toBe(0);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect.poll(() => tracks.evaluateAll((elements) => elements.flatMap(
    (element) => element.getAnimations().filter((animation) => animation.playState === 'running'),
  ).length)).toBe(0);
  await expect(director.getByRole('link', { name: 'Explore his portfolio' })).toBeVisible();
});

test('keeps director expertise and profile links readable with narrow screens and enlarged text', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(`${route}#director`);
  const director = page.locator('#director');
  for (const [width, fontSize] of [[1440, '100%'], [320, '100%'], [390, '200%'], [1440, '200%']] as const) {
    await page.setViewportSize({ width, height: 900 });
    await page.evaluate((size) => { document.documentElement.style.fontSize = size; }, fontSize);
    const orbitBounds = await director.locator('.technologies-director-orbit').boundingBox();
    const orbitCenter = orbitBounds!.x + orbitBounds!.width / 2;
    for (const text of await director.locator('.technologies-director-heading > *').all()) {
      const bounds = await text.boundingBox();
      expect(Math.abs(bounds!.x + bounds!.width / 2 - orbitCenter)).toBeLessThan(1);
      await expect(text).toHaveCSS('text-align', 'center');
    }
    for (const name of ['Full-stack engineering', 'Applied AI', 'Data & systems', 'Software delivery']) {
      const heading = director.getByRole('heading', { name, exact: true });
      await expect(heading).toBeVisible();
      expect(await heading.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    for (const link of await director.getByRole('link').all()) {
      await link.focus();
      await expect(link).toBeFocused();
      expect((await link.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    }
  }
});
