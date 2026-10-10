# Comprehensive Test Audit & Expansion Strategy

## 1. Executive Summary & Current Metrics

The Goodman Group test suite consists of two complementary layers: a **Vitest + React Testing Library** unit/integration harness in jsdom, and a **Playwright** Chromium end-to-end suite. A deployment smoke script (`scripts/smoke-deployment.mjs`) validates production builds against static expectations.

### Current Test Health

| Metric | Measured | Enforced Floor | Headroom / Risk |
|---|---|---|---|
| **Statements** | **94.70%** (626 / 661) | 80.00% | +14.70% (Protected) |
| **Branches** | **89.05%** (407 / 457) | **80.00%** | **+9.05% (Protected — was 80.30%)** |
| **Functions** | **95.71%** (201 / 210) | 80.00% | +15.71% (Protected) |
| **Lines** | **95.32%** (591 / 620) | 80.00% | +15.32% (Protected) |
| **Unit Test Files / Tests** | 28 files / 185 tests | N/A | All passing (was 15 files / 77 tests) |
| **E2E Specs / Tests** | 9 specs / 98 tests | All passing (Chromium pinned by design; Firefox & WebKit intentionally omitted) |

### Current Health Status
Through execution of Phases 1 & 2, the branch coverage margin has risen from **0.30% to 9.05%** (+8.75% lift). 108 new unit tests across 13 new test files have closed all component, page fallback, and domain contract gaps.

---

## 2. Test Configuration Architecture Audit

### 2.1 Vitest Configuration (`vitest.config.mts`)

```typescript
// Current Configuration Analysis
environment: 'jsdom',
setupFiles: ['./tests/setup.ts'],
include: ['src/**/*.{test,spec}.{ts,tsx}'],
exclude: ['tests/e2e/**', 'node_modules/**', '.next/**'],
coverage: {
  provider: 'v8',
  thresholds: { branches: 80, functions: 80, lines: 80, statements: 80 },
  exclude: [
    ...coverageConfigDefaults.exclude,
    'src/app/**/{layout,loading,error,global-error,not-found,template}.tsx',
    'src/components/scroll-experience.tsx',
  ]
}
```

#### Observations & Risks
1. **Overly Broad Exclusions**:
   - `src/app/not-found.tsx` is excluded by the generic glob `'src/app/**/{layout,loading,error,global-error,not-found,template}.tsx'`. Unlike `layout.tsx` or `error.tsx` (which interface with Next.js streaming runtime), `not-found.tsx` is a pure server component containing critical links to home and `/companies`, an accessible heading, and metadata. It can and should be unit-tested.
   - `src/components/scroll-experience.tsx` is completely excluded from unit coverage because GSAP and Lenis choreography is verified in browser journeys. While sensible for frame-by-frame ticker loops, hash-anchor routing logic (`restoreHashTarget`) and motion media-query listeners inside the component remain without unit isolation.
2. **Missing Test Utilities**:
   - Unit tests currently repeat boilerplate mocks across files for `matchMedia`, `ResizeObserver`, and `Storage`. There is no shared `tests/test-utils.tsx` or centralized setup for mock management.
3. **Branch Coverage Threshold**:
   - Branch threshold is globally pinned at 80%. Several files are dragging the average down (`theme-toggle.tsx` at 54.54%, `enquiry-section.tsx` at 70.31%, company page templates at 50–75%).

### 2.2 Playwright Configuration (`playwright.config.ts`)

```typescript
// Current Configuration Analysis
projects: [
  { name: 'chromium', use: { ...devices['Desktop Chrome'] } }
]
```

#### Observations & Risks
1. **Intentional Single Browser Engine (Chromium)**:
   - Chromium is the canonical target engine for the project across local dev and CI. Firefox and WebKit are intentionally omitted to avoid unnecessary runner and binary installation overhead for this static corporate portfolio.
2. **Device Emulation Deficit**:
   - Mobile tests in `tests/e2e/home.spec.ts` use `page.setViewportSize({ width: 390, height: 844 })`. This resizes the browser window but does **not** emulate touch events (`hasTouch: true`), mobile user-agents, device pixel ratios, or mobile gestures.
   - `mouse-glow-card.tsx` has logic explicitly ignoring touch events (`pointerType === 'touch'`), which is currently only unit-tested via synthetic jsdom pointer events, never validated against real mobile browser input emulation.
3. **Missing E2E User Journeys**:
   - The enquiry form has **zero end-to-end submission tests** in Playwright. `tests/e2e/home.spec.ts` tests only the country code combobox dropdown scroll containment, omitting form completion, input validation tooltips, network errors, honeypot defense, and submission receipt rendering.

### 2.3 CI Pipeline (`.github/workflows/ci.yml`)

```yaml
# Step Sequence in CI:
1. npm ci
2. npm run lint
3. npm run typecheck
4. npm run test:coverage
5. npm run build (standalone)
6. Smoke production routes (scripts/smoke-deployment.mjs against port 4173)
7. npx playwright install chromium --with-deps
8. npm run test:e2e:all
```

#### Observations & Risks
1. **Sequential Execution**: All stages run in a single job. Unit tests, build, smoke tests, and Playwright runs execute sequentially. A failure in unit coverage terminates the pipeline before production build validation.
2. **Browser Installation**: CI explicitly installs only Chromium (`npx playwright install chromium`), which matches the project's intentional single-engine strategy.

---

## 3. File-by-File Coverage & Gap Analysis

### 3.1 Components (`src/components/`)

| File | Current Lines | Current Branches | Dedicated Unit Test? | Specific Untested Paths & Gaps |
|---|---|---|---|---|
| `theme-toggle.tsx` | 91.89% | **54.54%** | ❌ (Indirectly via `site-header`) | **Lines 10, 45–46:** When `<meta name="theme-color">` is present in DOM head, mutations via `headObserver` are not triggered in unit tests. Button click vs MutationObserver race branches are untested. |
| `enquiry-section.tsx` | 82.50% | **70.31%** | ⚠️ Partial (`enquiry-section.test.tsx`) | **Lines 833–834, 866–867:** `EnquiryOrgField` `onChange` and `EnquiryPhoneField` `onCountryChange` are never executed in unit tests. Honeypot typing, message character countdown warning, and combobox option selection keyboard navigation are untested. |
| `company-card.tsx` | 100% | **71.42%** | ❌ (Indirectly via `companies/page`) | **Lines 17, 43:** `compact={true}` prop variant is never rendered in tests. Fallback rendering when `company.logo` is null (`span.company-text-identity`) is untested. |
| `company-theme-sync.tsx` | 95.23% | **66.66%** | ❌ (Indirectly via company pages) | **Line 25:** Updating multiple `<meta name="theme-color">` elements. Disconnected shell guard (`!shell.isConnected`) and unrecognized shell class fallback are untested. |
| `company-group-frame.tsx` | 100% | 100% | ❌ (Indirectly via company pages) | No dedicated test verifying default `relationship` fallback (`"A Goodman Group company"`), custom relationship string propagation, skip link targeting (`#main-content`), and footer return links. |
| `site-footer.tsx` | 100% | 100% | ❌ (Indirectly via `page.test.tsx`) | No dedicated test verifying all three physical office addresses (Pakistan head office, factory, US liaison office), external contact links, and back-to-top anchor. |
| `site-header.tsx` | 97.61% | 92.98% | ✅ (`site-header.test.tsx`) | **Lines 185–186:** Native dialog `onCancel` handler is not covered because `Escape` is simulated via window `keydown`, not native dialog `cancel` event. |
| `mouse-glow-card.tsx` | 100% | 100% | ✅ (`mouse-glow-card.test.tsx`) | Completely covered. |
| `scroll-experience.tsx` | Excluded | Excluded | ❌ (E2E only) | Hash target jumping and motion preference transition cleanup have no isolated unit checks. |

---

### 3.2 Routes & Pages (`src/app/`)

| File | Current Lines | Current Branches | Current Status | Specific Gaps & Fallbacks |
|---|---|---|---|---|
| `page.tsx` (Home) | 100% | 100% | ✅ Covered | All chapters and sections tested. |
| `companies/page.tsx` (Directory) | 100% | **83.33%** | ⚠️ Low branch | **Line 83:** `{company.legalName ? ... : null}`. All 5 companies currently define `legalName`, so the null branch is untaken. |
| `companies/[slug]/page.tsx` (Catch-all) | 100% | 100% | ✅ Covered | Calls `notFound()`, static params disabled. |
| `companies/geron-pharma/page.tsx` | 100% | **50.00%** | ⚠️ Critical branch deficit | **Lines 46–111:** Fallback `company.legalName ?? company.displayName`, `company.logo ? ... : null`, and `leader ? ... : null` are untaken because static record always contains all fields. |
| `companies/goodman-laboratories/page.tsx` | 100% | **50.00%** | ⚠️ Critical branch deficit | **Lines 50–78:** Same defensive fallback branch deficit as Geron Pharma. |
| `companies/wal-green-chemicals/page.tsx` | 100% | **50.00%** | ⚠️ Critical branch deficit | **Line 59:** Same defensive fallback branch deficit. |
| `companies/goodman-medical-equipment/page.tsx` | 100% | **75.00%** | ⚠️ Branch deficit | **Lines 48–62:** Same defensive fallback branch deficit. |
| `companies/goodman-billing/page.tsx` | 100% | 100% | ✅ Covered | Subcomponents rendered and verified. |
| `companies/goodman-billing/billing-directory.tsx` | 100% | 100% | ⚠️ No unit isolation | Tested only via page integration; edge cases (empty search results, items rendering, clear button accessibility) lack dedicated unit spec. |
| `not-found.tsx` | Excluded | Excluded | ❌ Untested | 404 page headings, return home button, company directory link, and metadata are excluded from coverage. |
| `layout.tsx` | Excluded | Excluded | ❌ Untested | Inline pre-hydration theme script (`initializeGroupTheme`) is untested in unit isolation. |
| `api/enquiries/route.ts` | 92.98% | **88.13%** | ⚠️ Untested error paths | **Line 28:** Non-JSON Content-Type returns 415.<br>**Line 48:** Stream read failure returns 400.<br>**Line 57:** Malformed JSON syntax returns 400.<br>**Line 88:** Malformed Redis response returns 502. |
| `sitemap.xml/route.ts` | 88.88% | **0.00%** | ⚠️ Untested XML escape | **Line 7 (0% branch):** `escapeXml` character replacement function is never triggered because canonical URLs do not contain XML special characters (`<`, `>`, `&`, `'`, `"`). |
| `robots.txt/route.ts` | 100% | 100% | ✅ Covered | Verified text content and sitemap reference. |

---

### 3.3 Data & Shared Libraries (`src/data/`, `src/lib/`)

| File | Current Lines | Current Branches | Dedicated Unit Test? | Specific Gaps & Invariant Risks |
|---|---|---|---|---|
| `data/enquiry.ts` | 88.31% | **87.77%** | ⚠️ Partial (via route test) | **Line 93:** Name > 120 chars error.<br>**Line 201:** Invalid phone number format parse failure.<br>**Line 208:** Valid country supplied without phone number.<br>**Line 224:** Defensive required fields check fallback. |
| `data/companies.ts` | 100% | 100% | ⚠️ Only route match test | `getCompanyBySlug` tested only for happy paths; no test for unknown slug returning `undefined`. No invariant tests validating slugs, logo aspect ratios, color hex format, locations, or leadership array non-emptiness. |
| `data/goodman-group.ts` | 100% | 100% | ❌ No invariant test | No test validating `SITE_ORIGIN` format, phone number formats, executive contact consistency, or sector list integrity. |
| `data/goodman-billing.ts` | 100% | 100% | ❌ No invariant test | 604 lines of data records with zero contract validation (step numbering 1..N, valid SVG icon references, non-empty specialties). |
| `data/goodman-laboratories.ts` | 100% | 100% | ❌ No invariant test | Zero contract validation for product categories, drug registration codes, dosage forms, or packaging strings. |
| `data/goodman-medical-equipment.ts`| 100% | 100% | ❌ No invariant test | Zero contract validation for equipment categories, workflow steps, or distribution partners. |
| `data/wal-green-chemicals.ts` | 100% | 100% | ❌ No invariant test | Zero contract validation for API categories, excipients, and trade credentials. |
| `lib/site-theme.ts` | 93.75% | **83.33%** | ❌ No dedicated test | **Line 18:** `catch` block when `window.matchMedia` throws. Behavior when `document` is undefined (SSR environment) is untested. |
| `lib/structured-data.tsx` | 100% | **83.33%** | ❌ No dedicated test | **Line 37:** Branch where company has no `legalName`. Escaping of `<` characters in JSON-LD output (`\u003c`) is untested. |

---

## 4. End-to-End (Playwright) Journey Gaps

### 4.1 Missing User Journeys

1. **Enquiry Form End-to-End Lifecycle**:
   - Happy path: User fills Name, Email, Organization, selects Company from Combobox, selects Purpose from Select, picks Country code, inputs Phone, types Message, submits form, and observes confirmation card with 24-hour SLA badge.
   - Validation failures: User submits empty form; real browser focus moves to first invalid field; error messages appear with `aria-describedby` links.
   - Rate limiting: Mock 429 response from `/api/enquiries`; verify alert badge displaying retry wait guidance.
   - Spam protection: Emulate bot populating invisible honeypot field (`#enquiry-website`); verify submission rejection without false positive success.
   - In-flight debounce: User double-clicks submit button; verify button enters disabled state (`"Sending enquiry..."`) and only one network request fires.
2. **Interactive 404 Experience**:
   - User navigates to unknown route (e.g. `/unknown-slug`).
   - Browser displays 404 page inside Goodman Group shell.
   - User clicks `"Return home"` → URL transitions to `/`.
   - User clicks `"Browse companies"` → URL transitions to `/companies`.
3. **Company Navigation & Deep Links**:
   - User starts at Home constellation → clicks company node → lands on bespoke company route.
   - User clicks header `"All companies"` link → lands on Directory.
   - User clicks `"Skip to main content"` keyboard shortcut → focus shifts to `#main-content`.

### 4.2 Device Emulation & Input Architecture

```
Configured: [ Chromium Desktop (1440x900) ]
Intentionally Omitted: [ WebKit (Safari), Firefox ]
Pending Opportunity:   [ Mobile Chrome / Pixel 7 (hasTouch: true) ]
```

- Chromium is intentionally the sole target engine. Firefox and WebKit are deliberately omitted from the project test architecture.
- Mobile gestures and touch tracking: Playwright allows defining devices with `hasTouch: true` (e.g. `devices['Pixel 7']`). In `MouseGlowCard`, touch events explicitly bypass hover glow calculations. Dedicated mobile device testing verifies this behavior in real mobile Chromium emulation.
---

## 5. Deployment Smoke Test Audit (`scripts/smoke-deployment.mjs`)

### Strengths
- Runs against standalone production server (`.next/standalone/server.js`) on port 4173 in CI.
- Enforces HTTP 200, Content-Type, single canonical URL, and exact title/h1 matches for every route in `scripts/deployment-routes.json`.
- Detects stale bundle references (`legacyAssetReferences`).
- Checks static asset cache headers (`max-age=`, `immutable`, `max-age=86400`) and gzip compression.

### Expansion Opportunities
1. **404 Route Verification**: Currently tests only valid routes. Should verify that an unmapped path (e.g. `/does-not-exist`) returns HTTP 404, contains the Goodman shell, and renders the 404 h1.
2. **Sitemap & Robots Validation**: Smoke test does not inspect XML validity or HTTP headers of `/sitemap.xml` and `/robots.txt`.
3. **Security Headers Check**: Verify presence of security headers (e.g. `X-Content-Type-Options: nosniff`, `Referrer-Policy`) on production responses.

---

## 6. Concrete Upgrade Blueprint

### 6.1 Phase 1: Harden Unit/Integration Suite & Lift Branch Coverage (Target: ≥92% Branch)

#### 1. Expand `src/app/api/enquiries/route.test.ts`
Add test cases targeting uncovered error paths:
- Content-Type not `application/json` returns HTTP 415.
- Request body stream reading error returns HTTP 400.
- Malformed JSON string (e.g. `"{invalid-json"`) returns HTTP 400.
- Redis response missing `result` or containing non-integer returns HTTP 502.
- Rate limiter returning count > 5 verifies `Retry-After: 600`.

#### 2. Create `src/data/enquiry.test.ts`
Isolate schema validation from HTTP routing:
- Name exceeding 120 characters returns `errors.name`.
- Country code provided with unparseable or impossible phone number returns `errors.phone`.
- Country code provided with empty phone number succeeds and retains `validCountry`.
- Email containing CRLF or invalid structure returns `errors.email`.
- Message exceeding 5000 characters returns `errors.message`.
- Honeypot `website` populated returns `errors.website`.

#### 3. Create `src/lib/site-theme.test.ts`
Test all branches of theme resolution:
- Reads from `document.documentElement.dataset.theme` when valid.
- Falls back to `localStorage` when dataset is unset.
- Falls back to `matchMedia('(prefers-color-scheme: dark)')` when storage is empty.
- Handles `localStorage.getItem` throwing security error.
- Handles `matchMedia` throwing error (triggers line 18 fallback).
- Returns `'dark'` default in SSR environment where `document` and `window` are undefined.
- `setSiteTheme` sets dataset attributes and catches storage write errors gracefully.

#### 4. Create `src/lib/structured-data.test.tsx`
Verify JSON-LD schema generation:
- Group schema output matches `Organization` schema and valid address.
- Company schema output includes `legalName` when present.
- Company schema output omits `legalName` when null (covers line 37 branch).
- Company schema includes logo URL when logo is present; omits when null.
- HTML angle brackets `<` and `>` in strings are safely escaped as `\u003c` and `\u003e`.

#### 5. Patch Route Template Branch Deficits
In `src/app/companies/*/page.test.tsx`:
- Use `vi.mock('@/data/companies')` to supply a company record with `legalName: null` and `logo: null` to exercise the fallback branches (`company.legalName ?? company.displayName` and fallback text identity).
- In `src/app/sitemap.xml/route.test.ts`, test `escapeXml` directly with characters `<`, `>`, `&`, `'`, `"` to cover line 7 and 14 branches.
- In `src/components/site-header.test.tsx`, dispatch a native `cancel` event on `<dialog>` to cover lines 185–186.

---

### 6.2 Phase 2: Add Missing Component & Invariant Unit Tests

#### 1. Create `src/components/company-card.test.tsx`
- Renders standard company card with logo, business category, display name, and summary.
- Renders `compact={true}` variant: verifies absence of summary paragraph and addition of `.company-card-compact` class.
- Renders company without logo: verifies `.company-text-identity` fallback span.

#### 2. Create `src/components/theme-toggle.test.tsx`
- Renders initial state matching current theme.
- Toggles theme between dark and light on click.
- Updates `<meta name="theme-color">` elements in `document.head` to `#ffffff` (light) and `#06111f` (dark).
- Responds to external `data-theme` attribute changes on `document.documentElement` via MutationObserver.
- Responds to child changes in `document.head` via `headObserver`.

#### 3. Create `src/components/company-theme-sync.test.tsx`
- Synchronizes `.company-group-frame` theme attribute with site theme.
- Updates `<meta name="theme-color">` according to company palette.
- Disconnects observers on unmount.
- Safely handles unmapped company frame classes.

#### 4. Create `src/components/company-group-frame.test.tsx`
- Renders skip link pointing to `#main-content`.
- Renders default relationship text `"A Goodman Group company"` when `relationship` is null.
- Renders bespoke relationship text when provided.
- Renders brand navigation link to `/` and back link to `/companies`.
- Renders return links in footer (`All companies`, `Group home`, `Contact Group`).

#### 5. Create `src/components/site-footer.test.tsx`
- Renders Goodman Group brand mark and description.
- Renders all navigation links (`About the Group`, `Our Presence`).
- Renders all three physical office addresses (Pakistan head office, factory, US liaison office).
- Renders telephone link, email link, and back-to-top anchor.

#### 6. Create `src/app/not-found.test.tsx`
- Remove `not-found.tsx` from coverage exclusion in `vitest.config.mts`.
- Verifies level-one heading `"This route has moved beyond the map."`.
- Verifies eyebrow `"404 / Page not found"`.
- Verifies primary link to `/` and secondary link to `/companies`.
- Verifies exported metadata contains `title: "Page not found"` and `robots: { index: false, follow: false }`.

#### 7. Create `src/app/companies/goodman-billing/billing-directory.test.tsx`
- Renders catalogue entries with icons, names, and descriptions.
- Filters entries by keyword in title, description, or sub-items.
- Displays dynamic status string (`"X of Y services"`).
- Displays `"Clear search"` button when search query is non-empty; resets query on click.
- Displays `"No matching [kind]"` empty state with reset button when no items match.

#### 8. Create Data Invariant Tests (`src/data/*.invariant.test.ts`)
- **`companies.invariant.test.ts`**:
  - Exactly 5 companies.
  - Slugs are lowercase kebab-case and unique.
  - Accent colors are valid 7-character hex strings (`^#[0-9a-fA-F]{6}$`).
  - Logos (when present) have positive integer widths and heights.
  - Every company has at least one location, capability, and contact.
  - `getCompanyBySlug` returns the exact record for known slugs, `undefined` for unknown slugs.
- **`goodman-group.invariant.test.ts`**:
  - `SITE_ORIGIN` is valid HTTPS URL without trailing slash.
  - Executive phones are valid international phone numbers.
  - Contacts email is syntactically valid.
- **`company-profiles.invariant.test.ts`**:
  - Validates `goodmanBillingProfile`, `goodmanLaboratoriesProfile`, `goodmanMedicalEquipmentProfile`, and `walGreenChemicalsProfile` against their TypeScript interfaces.
  - Ensures step numbers in workflows are sequential 1..N.

---

### 6.3 Phase 3: Expand Playwright E2E Scenarios

#### 1. Create `tests/e2e/enquiry-journey.spec.ts`
Implement end-to-end form verification:
```typescript
test.describe('Enquiry form user journeys', () => {
  test('successfully submits an enquiry and renders confirmation', async ({ page }) => {
    // 1. Intercept /api/enquiries with mock success
    await page.route('/api/enquiries', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) })
    );
    // 2. Fill form fields
    await page.goto('/#contact');
    await page.getByLabel(/Full name/).fill('Jane Partner');
    await page.getByLabel(/Email address/).fill('jane@example.com');
    await page.getByLabel(/Organisation/).fill('Healthcare Global');
    // Select company and purpose via React Aria combobox
    await page.getByRole('button', { name: /Choose a company/ }).click();
    await page.getByRole('option', { name: 'Goodman Group / Not sure' }).click();
    await page.getByRole('button', { name: /Select enquiry purpose/ }).click();
    await page.getByRole('option', { name: 'Partnership' }).click();
    await page.getByLabel(/^Message/).fill('Inquiry regarding medical device distribution.');
    // 3. Submit
    await page.getByRole('button', { name: 'Send enquiry' }).click();
    // 4. Assert success state
    await expect(page.getByRole('status')).toContainText('Enquiry Received');
    await expect(page.getByText('We’ll respond within 24 hours')).toBeVisible();
  });

  test('enforces client-side validation and focuses first invalid field', async ({ page }) => {
    await page.goto('/#contact');
    await page.getByRole('button', { name: 'Send enquiry' }).click();
    await expect(page.getByLabel(/Full name/)).toBeFocused();
    await expect(page.getByText('Please enter your name.')).toBeVisible();
  });

  test('displays rate-limit error banner on HTTP 429', async ({ page }) => {
    await page.route('/api/enquiries', (route) =>
      route.fulfill({
        status: 429,
        contentType: 'application/json',
        body: JSON.stringify({ ok: false, message: 'You’ve sent several enquiries. Please wait 10 minutes.' })
      })
    );
    // Fill and submit -> verify error banner visible
  });
});
```

#### 2. Create `tests/e2e/not-found-journey.spec.ts`
- Navigates to `/random-missing-url`.
- Verifies HTTP 404 response status.
- Verifies level-one heading `"This route has moved beyond the map."`.
- Clicks `"Return home"` and asserts URL is `/`.
- Navigates back, clicks `"Browse companies"` and asserts URL is `/companies`.
- Runs Axe accessibility check on 404 page (0 violations).

#### 3. Real Mobile Touch Verification
In `tests/e2e/home.spec.ts` or a new mobile spec:
- Configure project with `{ ...devices['Pixel 7'] }`.
- Verify pointer-glow effect does not set `--glow-x` / `--glow-y` on touch scroll.
- Verify mobile burger menu open/close gestures and background inertness.

---

### 6.4 Phase 4: Test Infrastructure & Shared Utilities

#### 1. Mobile Chromium Device Project in `playwright.config.ts`
Firefox and WebKit are intentionally omitted from this project. To validate touch interaction (`hasTouch: true`) in mobile Chromium, a dedicated mobile device descriptor can be configured:
```typescript
projects: [
  {
    name: 'chromium',
    use: { ...devices['Desktop Chrome'] },
  },
  {
    name: 'mobile-chrome',
    use: { ...devices['Pixel 7'] },
  },
]
```
#### 2. Centralized Test Utilities (`tests/test-utils.tsx`)
Create shared helpers to eliminate mock duplication:
```typescript
export function mockMatchMedia(matches = false) {
  const mql = {
    matches,
    media: '',
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  };
  vi.stubGlobal('matchMedia', vi.fn(() => mql));
  return mql;
}

export function mockResizeObserver() {
  const observer = {
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  };
  vi.stubGlobal('ResizeObserver', vi.fn(() => observer));
  return observer;
}
```

#### 3. CI Optimization
In `.github/workflows/ci.yml`:
- Playwright continues using Chromium (`npx playwright install chromium`).
- Add deployment smoke check for 404 route and robots/sitemap status.

---

## 7. Implementation Roadmap & Priority Matrix

| Phase | Task / Target | File(s) Created or Modified | Target Metric / Result | Effort | Priority |
|---|---|---|---|---|---|
| **P1.1** | Branch coverage lift for API & Enquiry validation | `src/app/api/enquiries/route.test.ts`<br>`src/data/enquiry.test.ts` | Enquiry API: **96.61%** branch<br>Enquiry data: **98.88%** branch | Low | ✅ **Completed** |
| **P1.2** | XML escape & Dialog event coverage | `src/app/sitemap.xml/route.test.ts`<br>`src/components/site-header.test.tsx` | Sitemap route: **100%** stmts/lines<br>Header: **100%** stmts/lines | Low | ✅ **Completed** |
| **P1.3** | Dedicated theme & structured data tests | `src/lib/site-theme.test.ts`<br>`src/lib/structured-data.test.tsx` | `site-theme.ts`: **100%** lines<br>`structured-data.tsx`: **100%** lines/branches | Low | ✅ **Completed** |
| **P1.4** | Company page fallback branch coverage | `src/app/companies/*/page.test.tsx` | All 5 company pages: **100%** lines/branches | Medium | ✅ **Completed** |
| **P2.1** | Missing component unit tests | `src/components/company-card.test.tsx`<br>`src/components/theme-toggle.test.tsx`<br>`src/components/company-theme-sync.test.tsx`<br>`src/components/company-group-frame.test.tsx`<br>`src/components/site-footer.test.tsx` | 100% dedicated unit coverage across shared UI components | Medium | ✅ **Completed** |
| **P2.2** | 404 Page unit test | `src/app/not-found.test.tsx`<br>`vitest.config.mts` (unexcluded) | `not-found.tsx`: **100%** lines/branches | Low | ✅ **Completed** |
| **P2.3** | Billing directory component test | `src/app/companies/goodman-billing/billing-directory.test.tsx` | `billing-directory.tsx`: **100%** lines/branches | Low | ✅ **Completed** |
| **P2.4** | Data invariant contracts | `src/data/*.invariant.test.ts` (3 suites) | 100% domain contract verification | Medium | ✅ **Completed** |
| **P3.1** | E2E Enquiry form journey | `tests/e2e/enquiry-journey.spec.ts` | 5 user journeys: happy path, validation, rate limit 429, retry 503, debounce | Medium | ✅ **Completed** |
| **P3.2** | E2E 404 journey | `tests/e2e/not-found-journey.spec.ts` | 404 HTTP status, recovery to home & directory, Axe compliance (0 violations) | Low | ✅ **Completed** |
| **P3.3** | Deployment smoke expansion | `scripts/smoke-deployment.mjs` | Standalone script validates 404 route, sitemap.xml, robots.txt, 7 pages, 22 assets | Low | ✅ **Completed** |
| **P4.1** | Mobile Chromium & Touch device project | `playwright.config.ts` | Dedicated Mobile Chrome (`Pixel 7`, `hasTouch: true`) project (Firefox & WebKit intentionally omitted) | Low | ✅ **Completed** |
| **P4.2** | Shared test utilities | `tests/test-utils.ts`<br>Adopted across 6 test suites | Clean DRY mock setups across all unit tests | Low | ✅ **Completed** |

---

## 8. Final Verified Post-Upgrade Metrics

All four phases of test upgrades have been implemented and verified:

| Metric | Pre-Audit Baseline | Final Verified Metric | Enforced CI Floor | Net Change / Safety Margin |
|---|---|---|---|---|
| **Statements** | 90.89% (599 / 659) | **94.70%** (626 / 661) | 80.00% | **+3.81%** (+14.70% buffer) |
| **Branches** | **80.30%** (367 / 457) | **89.05%** (407 / 457) | 80.00% | **+8.75%** (+9.05% buffer — was +0.30%) |
| **Functions** | 93.30% (195 / 209) | **95.71%** (201 / 210) | 80.00% | **+2.41%** (+15.71% buffer) |
| **Lines** | 92.07% (569 / 618) | **95.32%** (591 / 620) | 80.00% | **+3.25%** (+15.32% buffer) |
| **Unit Test Files** | 15 files | **28 files** | — | **+13 files** |
| **Unit Tests** | 77 tests | **185 tests** | — | **+108 tests** |
| **E2E Specs / Tests** | 7 specs / 91 tests | **9 specs / 151 runs** (98 desktop + 53 mobile) | — | **All Passing** |
| **Untested Shared UI Components** | 5 components | **0 components** | 0 | **100% Dedicated Unit Coverage** |
| **Untested Domain Records** | 4 profile modules | **0 modules** | 0 | **100% Invariant Contract Coverage** |
| **Form User Journeys** | 0 E2E tests | **5 comprehensive E2E journeys** | — | **100% Verified** |
