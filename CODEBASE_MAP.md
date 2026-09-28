# Goodman Group — Codebase Map & Directory Architecture

This document provides a comprehensive structural, architectural, and file-by-file reference for the **Goodman Group** digital platform.

---

## 1. System Architecture & Engineering Principles

The platform is engineered as a modern corporate holding website built on **Next.js 16 (App Router)**, **React 19**, and **TypeScript 5**, styled with **Tailwind CSS v4**, and orchestrated using a strict multi-tier motion system (**GSAP 3**, **Lenis 1.3**, and **Motion for React**).

### Core Architectural Decisions:
1. **Endorsed Portfolio Architecture**:
   - Goodman Group sits at the apex as an umbrella holding organization providing governance, global reach, and institutional scale.
   - Operating companies (**Goodman Laboratories**, **Geron Pharma**, **Goodman Medical Equipment Trading**, **Wal Green Chemicals**, and **Goodman Billing**) maintain autonomous legal entities, distinct business models, unique visual palettes, and individual bespoke routes under `/companies/[slug]`.
2. **Ungrouped Flat Discovery**:
   - Company discovery is direct, flat, and ungrouped. No synthetic category buckets, tabs, or sector accordions obscure individual companies on either the homepage or `/companies`.
3. **Bespoke Route Strategy with Guarded Dynamic Fallback**:
   - Each operating entity has a dedicated route directory (`src/app/companies/<slug>/`) with custom CSS tokens, bespoke JSX typography, and dedicated unit test suites.
   - The dynamic catch-all route `src/app/companies/[slug]/page.tsx` executes Next.js `notFound()` to guard against unverified or retired slugs.
4. **Minimal Shared Holding Shell (`CompanyGroupFrame`)**:
   - Bespoke company routes are wrapped by `CompanyGroupFrame`, which provides accessible skip links, a compact Group brand mark, relationship disclosure (*"A Goodman Group company"*), and return navigation without dictating layout grids, fonts, or color themes.
5. **Strict Motion Ownership Contract**:
   - **GSAP + ScrollTrigger**: Cinematic storytelling, pinned chapters, scrubbed timelines, parallax, SVG paths.
   - **Lenis**: Smooth scroll interpolation synchronized with ScrollTrigger on the same animation frame.
   - **Motion for React (`motion/react`)**: Interactive layout transitions, menus, dialogs, disclosures, gesture feedback.
   - **CSS/Tailwind**: Lightweight hovers, borders, colors, and static transitions.
   - *Rule*: Two systems must never animate the same property on the same DOM element.
6. **Empirical Data Rigour**:
   - Data in `src/data/` mirrors primary archival source PDFs synthesized in `Verified Information/`. Operations, distribution agreements, signed targets, and prospective markets are strictly distinguished.

---

## 2. Complete File and Directory Tree

```
Goodman-Group/
├── .github/
│   └── workflows/
│       └── ci.yml                      # GitHub Actions automated CI workflow
├── .gitignore                          # Git file exclusion rules
├── .nvmrc                              # Node Version Manager pinned environment (Node 24)
├── AGENTS.md                           # Repository rules and agent operational guidelines
├── CLAUDE.md                           # Claude development and coding style guide
├── CODEBASE_MAP.md                     # Comprehensive codebase tree and architectural map (this file)
├── DESIGN_DECISION.md                  # Information architecture and Luminous Momentum design system
├── README.md                           # Project quick-start, scripts, and testing documentation
├── eslint.config.mjs                   # ESLint 9 flat configuration with Next.js Core Web Vitals
├── next.config.ts                      # Next.js 16 configuration (React Compiler enabled)
├── package-lock.json                   # Deterministic NPM dependency lockfile (v3)
├── package.json                        # Node manifest, dependencies, and development scripts
├── playwright.config.ts                # Playwright E2E browser and axe-core accessibility configuration
├── postcss.config.mjs                  # PostCSS configuration with Tailwind CSS v4
├── tsconfig.json                       # Strict TypeScript 5 compiler configuration with paths
├── vitest.config.mts                   # Vitest unit test runner config with V8 80% coverage enforcement
├── Verified Information/               # Verified primary documentation synthesized from corporate records
│   ├── F_Co_Pharmaceuticals_Company_Profile.md
│   ├── Geron_Pharma_Company_Profile.md
│   ├── Goodman_Billing_Company_Profile.md
│   ├── Goodman_Group_Company_Profile.md
│   ├── Goodman_Group_Consolidated_Company_Information.md
│   ├── Goodman_Laboratories_Company_Profile.md
│   ├── Goodman_Medical_Equipment_Company_Profile.md
│   └── Wal_Green_Chemicals_Company_Profile.md
├── public/                             # Static public web assets
│   ├── favicon.png                     # Browser favicon icon
│   ├── file.svg                        # Default document icon (boilerplate)
│   ├── globe.svg                       # Default globe icon (boilerplate)
│   ├── next.svg                        # Next.js vector wordmark (boilerplate)
│   ├── vercel.svg                      # Vercel logo mark (boilerplate)
│   ├── window.svg                      # Browser window icon (boilerplate)
│   └── assets/
│       └── logos/                      # Primary brand identities, photography, and media
│           ├── DarkLogo.png            # Goodman Group dark logo variant
│           ├── GG-1.png                # Secondary brand mark variant 1
│           ├── GG-2.png                # Secondary brand mark variant 2
│           ├── GG-white.png            # Master white horizontal Goodman Group logo (Header/Footer/Hero)
│           ├── GG1.png                 # Monogram mark variant 1
│           ├── GG2.png                 # Monogram mark variant 2
│           ├── GG3.png                 # Active logo for Goodman Medical Equipment Trading LLC
│           ├── Gcar.png                # Legacy sector badge (Automotive)
│           ├── Gestate.png             # Legacy sector badge (Real Estate)
│           ├── Ggear.png               # Legacy sector badge (Engineering & Equipment)
│           ├── GoodmanLabLogo.png      # Active logo for Goodman Laboratories (Pvt.) Ltd.
│           ├── Gplus.png               # Legacy brand badge (Goodman Plus)
│           ├── Logo.png                # Standard Goodman Group brand mark
│           ├── LogoWhite.png           # White monochrome Goodman Group brand mark
│           ├── LogoWhiteGreen.png      # Bi-color Goodman Group brand mark
│           ├── ceo.png                 # Executive portrait of CEO Syed Talib Hussain Hashmi
│           ├── geronlogo.png           # Active logo for Geron Pharma (Pvt.) Ltd.
│           ├── gilgit.jpg              # Regional distribution photography: Gilgit-Baltistan
│           ├── hero1.png               # Legacy hero composition graphic
│           ├── hero2.png               # Active homepage operational manufacturing photo
│           ├── islamabad.jpg           # Regional operations photography: Islamabad Capital Territory
│           ├── karachi.jpg             # Regional sourcing photography: Karachi, Sindh
│           ├── kashmir.jpg             # Regional distribution photography: Azad Kashmir
│           ├── kpk.jpg                 # Regional distribution photography: Khyber Pakhtunkhwa
│           ├── lahore.jpg              # Regional distribution photography: Lahore, Punjab
│           ├── locator.png             # Legacy map pinpoint icon graphic
│           ├── mission.png             # Legacy mission badge graphic
│           ├── missioni.png            # Legacy alternate mission badge graphic
│           ├── quetta.jpg              # Regional distribution photography: Quetta, Balochistan
│           ├── values.png              # Legacy core values badge graphic
│           ├── vision.png              # Legacy vision badge graphic
│           └── walgreenLogo.png        # Active logo for Wal Green Chemicals (Pvt.) Ltd.
├── src/                                # Application source code
│   ├── app/                            # Next.js 16 App Router tree
│   │   ├── favicon.ico                 # Standard root favicon
│   │   ├── globals.css                 # Global CSS tokens, Luminous Momentum theme, utility classes
│   │   ├── layout.tsx                  # Root HTML layout, Geist font definitions, dark colorScheme
│   │   ├── not-found.tsx               # Accessible 404 page with navigation fallbacks
│   │   ├── page.tsx                    # Goodman Group homepage (7-chapter cinematic narrative)
│   │   ├── page.test.tsx               # Homepage unit test suite (headings, landmarks, cards)
│   │   ├── companies/                  # Company directory and routes
│   │   │   ├── page.tsx                # Flat, ungrouped portfolio directory
│   │   │   ├── page.test.tsx           # Directory unit test suite
│   │   │   ├── [slug]/                 # Dynamic route fallback guard
│   │   │   │   ├── page.tsx            # Strictly invokes notFound()
│   │   │   │   └── page.test.tsx       # Fallback guard unit test suite
│   │   │   ├── geron-pharma/           # Bespoke route: Geron Pharma (Pvt.) Ltd.
│   │   │   │   ├── geron.css           # Violet atmospheric canvas & orbit styling
│   │   │   │   ├── page.tsx            # Bespoke Geron page implementation
│   │   │   │   └── page.test.tsx       # Geron route unit test suite
│   │   │   ├── goodman-billing/        # Bespoke route: Goodman Billing (Pvt.) Ltd.
│   │   │   │   ├── billing.css         # Deep navy/cyan data tables & counter steps
│   │   │   │   ├── page.tsx            # Bespoke Goodman Billing page implementation
│   │   │   │   └── page.test.tsx       # Goodman Billing route unit test suite
│   │   │   ├── goodman-laboratories/   # Bespoke route: Goodman Laboratories (Pvt.) Ltd.
│   │   │   │   ├── laboratories.css    # Editorial crimson/charcoal typography & table styles
│   │   │   │   ├── page.tsx            # Bespoke Goodman Laboratories page implementation
│   │   │   │   └── page.test.tsx       # Goodman Laboratories route unit test suite
│   │   │   ├── goodman-medical-equipment/ # Bespoke route: Goodman Medical Equipment Trading LLC
│   │   │   │   ├── medical.css         # Ice/navy technical blueprint styling
│   │   │   │   ├── page.tsx            # Bespoke Goodman Medical Equipment page implementation
│   │   │   │   └── page.test.tsx       # Goodman Medical Equipment route unit test suite
│   │   │   └── wal-green-chemicals/    # Bespoke route: Wal Green Chemicals (Pvt.) Ltd.
│   │   │       ├── page.tsx            # Bespoke Wal Green Chemicals page implementation
│   │   │       ├── page.test.tsx       # Wal Green Chemicals route unit test suite
│   │   │       └── walgreen.css        # Ivory/charcoal/forest green theme styling
│   │   ├── robots.txt/                 # Dynamic robots.txt route
│   │   │   ├── route.ts                # Route handler computing Allow and sitemap URLs
│   │   │   └── route.test.ts           # Robots route handler unit test suite
│   │   └── sitemap.xml/                # Dynamic sitemap.xml route
│   │       ├── route.ts                # Route handler computing canonical XML entries
│   │       └── route.test.ts           # Sitemap route handler unit test suite
│   ├── components/                     # Reusable React components
│   │   ├── company-card.tsx            # Interactive subsidiary preview card with mouse glow
│   │   ├── company-group-frame.tsx     # Holding group header/footer frame for subsidiary routes
│   │   ├── mouse-glow-card.tsx         # Cursor-following radial light container
│   │   ├── mouse-glow-card.test.tsx    # Mouse glow pointer event unit tests
│   │   ├── scroll-experience.tsx       # Lenis + GSAP ScrollTrigger client orchestrator
│   │   ├── site-footer.tsx             # Global Goodman Group corporate footer
│   │   ├── site-header.tsx             # Global glassmorphic header with accessible mobile drawer
│   │   └── site-header.test.tsx        # Header focus trap and drawer keyboard navigation tests
│   └── data/                           # Strongly typed domain records and data models
│       ├── companies.ts                # Canonical portfolio companies registry & CompanyProfile type
│       ├── goodman-billing.ts          # Goodman Billing workflow, services, platforms, targets
│       ├── goodman-laboratories.ts     # Goodman Laboratories manufacturing, products, CSR, ISO
│       ├── goodman-medical-equipment.ts# Medical equipment leadership, STERIS pipeline, markets
│       └── wal-green-chemicals.ts      # Wal Green chemical categories, functions, sourcing hubs
└── tests/                              # Global test setups and browser integration journeys
    ├── setup.ts                        # Vitest testing-library/jest-dom environment setup
    └── e2e/                            # Playwright end-to-end integration specifications
        ├── company-routes.spec.ts      # Multi-company routing, 404 boundaries, sitemap tests
        └── home.spec.ts                # Homepage storytelling, accessibility, reduced-motion tests
```

---

## 3. Exhaustive File-by-File Documentation

### 3.1 Root Configuration, Tooling, and Policy Files

#### `.github/workflows/ci.yml`
- **Role:** Continuous Integration Pipeline.
- **Trigger:** Runs on `push` and `pull_request` to `main`.
- **Steps:** Checks out repo, configures Node.js 24 using caching, executes `npm ci`, runs `npm run lint`, `npm run typecheck`, `npm run test:coverage` (enforcing 80% coverage across lines, statements, functions, and branches), builds production artifacts via `npm run build`, installs Playwright browsers with dependencies, and executes `npm run test:e2e:all` (Chromium, Firefox, and WebKit) under a 30-minute timeout.

#### `.gitignore`
- **Role:** Version Control Exclusions.
- **Content:** Ignores dependencies (`node_modules`), Next.js build output (`.next`, `out`), environment files (`.env*`), test artifacts (`playwright-report`, `test-results`, `coverage`), and OS metadata (`.DS_Store`).

#### `.nvmrc`
- **Role:** Node Runtime Specification.
- **Content:** Pins Node.js environment to version `24`.

#### `package.json` & `package-lock.json`
- **Role:** Package Manifest & Dependency Lockfile.
- **Engines:** Requires `node: ">=24 <25"` and `npm@11.17.0`.
- **Scripts:**
  - `dev`: `next dev`
  - `build`: `next build`
  - `start`: `next start`
  - `lint`: `eslint`
  - `lint:fix`: `eslint --fix`
  - `typecheck`: `tsc --noEmit`
  - `test`: `vitest`
  - `test:run`: `vitest run`
  - `test:coverage`: `vitest run --coverage`
  - `test:e2e`: `playwright test --project=chromium --project=firefox`
  - `test:e2e:all`: `playwright test`
  - `test:e2e:headed`: `playwright test --project=chromium --headed`
  - `test:e2e:ui`: `playwright test --ui`
  - `check`: `npm run lint && npm run typecheck && npm run test:coverage && npm run build`
- **Core Dependencies:** Next.js `16.3.3`, React `19.2.8`, GSAP `^3.15.0`, `@gsap/react` `^2.1.2`, Lenis `^1.3.26`, Motion for React `^13.1.1`, Lucide React `^1.34.0`.
- **Dev Dependencies:** Tailwind CSS `^4`, `@tailwindcss/postcss` `^4`, Vitest `^4.1.11`, `@testing-library/react` `^16.3.2`, Playwright `^1.62.1`, `@axe-core/playwright` `^4.13.0`, ESLint `^9`, TypeScript `^5`.

#### `tsconfig.json`
- **Role:** TypeScript Compiler Configuration.
- **Settings:** Target `ES2017`, `strict: true`, `noEmit: true`, `isolatedModules: true`, `moduleResolution: "bundler"`, `jsx: "react-jsx"`, path alias `@/*` mapping to `./src/*`, Next.js type plugin integration.

#### `next.config.ts`
- **Role:** Next.js Application Configuration.
- **Settings:** Enables React Compiler experimental feature (`reactCompiler: true`).

#### `postcss.config.mjs`
- **Role:** PostCSS Build Pipeline.
- **Settings:** Configures `@tailwindcss/postcss` plugin for Tailwind CSS v4 compilation.

#### `eslint.config.mjs`
- **Role:** Code Linting & Quality Assurance.
- **Settings:** ESLint 9 Flat Config extending `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`. Configures global ignore patterns for `.next/`, `coverage/`, and test report folders.

#### `vitest.config.mts`
- **Role:** Unit & Component Testing Runner.
- **Settings:** Uses `jsdom` environment, `@vitejs/plugin-react`, and resolves `@/*` aliases. Automatically loads `tests/setup.ts`. Enforces an 80% coverage threshold across lines, functions, branches, and statements, excluding system route files and scroll orchestrator animations.

#### `playwright.config.ts`
- **Role:** End-to-End Browser Testing Configuration.
- **Settings:** Configures projects for Chromium, Firefox, and WebKit (Safari). Manages automatic local web server execution via `npm run dev` (or `npm run start` in CI) on port 3000, collects traces on failure, and sets 30s test timeouts.

#### `DESIGN_DECISION.md`
- **Role:** Design System & Information Architecture Source of Truth.
- **Content:** Formulates the *Luminous Momentum* design direction, dark atmospheric canvases, Goodman blue (`#174a87`) and luminous cyan/green (`#5fbf92`) lighting, holding company governance, flat direct company discovery, bespoke subsidiary route rules, and strict motion ownership boundaries.

#### `AGENTS.md`
- **Role:** Agent & Contributor Repository Guidelines.
- **Content:** Defines project conventions, coding standards, strict motion system boundaries, WCAG 2.2 AA accessibility requirements, Vitest/Playwright expectations, and data accuracy rules.

#### `CLAUDE.md`
- **Role:** Development Standards & Rules.
- **Content:** Outlines architectural constraints, linting/typechecking/test commands, and two-space indentation conventions.

#### `README.md`
- **Role:** Project Documentation.
- **Content:** Getting started guide, environment prerequisites (Node 24, npm 11), build and verification command workflows.

---

### 3.2 Verified Corporate Information (`Verified Information/`)

Primary source documentation synthesized from archival corporate records and legal filings:

- **`Goodman_Group_Consolidated_Company_Information.md`**: Master consolidation synthesis cross-referencing five primary source PDFs, reconciling dates, employee figures, product catalogues, certifications, and explicit source conflicts.
- **`Goodman_Group_Company_Profile.md`**: Parent group profile detailing conglomerate positioning, 7 sectors, 8 business interests, leadership profile of Group CEO Syed Talib Hussain Hashmi, workforce claim reconciliation, and site routes.
- **`Goodman_Laboratories_Company_Profile.md`**: Verified profile of Goodman Laboratories (Pvt.) Ltd. covering manufacturing operations, 5 sections, 385 departmental employees, national reach, international markets (Afghanistan, Cambodia, Ghana, Tajikistan, Yemen), ISO 9001/14001/45001 certificates, and full drug formulary.
- **`Goodman_Medical_Equipment_Company_Profile.md`**: Verified profile of Goodman Medical Equipment Trading LLC, consolidating Dubai LLC and Pakistan presence, founders, board members, STERIS reprocessing pipeline, and target international markets.
- **`Wal_Green_Chemicals_Company_Profile.md`**: Verified profile of Wal Green Chemicals (Pvt.) Ltd., documenting indenting operations, dual-channel procurement, nationwide customer coverage across 8 industrial cities, and 19 chemical classes.
- **`Goodman_Billing_Company_Profile.md`**: Verified profile of Goodman Billing (Pvt.) Ltd., detailing US RCM services, HIPAA compliance claim, 6-step workflow, 40 specialties, 12 compatible EHR/PM platforms, and operational performance targets.
- **`Geron_Pharma_Company_Profile.md`**: Verified profile boundary document for Geron Pharma (Pvt.) Ltd., noting legal identity, pharmaceutical sector, and CEO Syed Talib Hussain Hashmi (since 2019), documenting absence of standalone marketing collateral.
- **`F_Co_Pharmaceuticals_Company_Profile.md`**: Verified record for F Co Pharmaceuticals (Pvt.) Ltd., documenting Syed Talib Hussain Hashmi's directorship (effective 2024), nutraceutical focus, and distribution expansion.

---

### 3.3 Data Layer (`src/data/`)

#### `src/data/companies.ts`
- **Role:** Canonical Master Registry of Operating Companies.
- **Exports:**
  - `interface CompanyLogo`: `{ type: "image" | "text", src?: string, text?: string, mark?: string, alt?: string, lightBg?: boolean }`
  - `interface CompanyProfile`: Strongly typed record with `slug`, `legalName`, `displayName`, `businessType`, `relationship`, `summary`, `accentColor`, `accentColorLight`, `logo`, `href`, `tagline`, `stats`, `governance`, `locations`, `capabilities`, `certifications`, `notes`.
  - `const companies: readonly CompanyProfile[]`: Array containing 5 canonical portfolio entities:
    1. `goodman-laboratories` (Goodman Laboratories (Pvt.) Ltd.)
    2. `geron-pharma` (Geron Pharma (Pvt.) Ltd.)
    3. `goodman-medical-equipment` (Goodman Medical Equipment Trading LLC)
    4. `wal-green-chemicals` (Wal Green Chemicals (Pvt.) Ltd.)
    5. `goodman-billing` (Goodman Billing (Pvt.) Ltd.)
  - `getCompanyBySlug(slug: string)`: Type-safe lookup selector.

#### `src/data/goodman-billing.ts`
- **Role:** Domain Data Model for Goodman Billing (US Medical Billing & RCM).
- **Exports:**
  - `billingWorkflow`: 6-step operational lifecycle (Patient Registration → Coding → Claims Submission → Payment Posting → Denial & AR Management → Reporting).
  - `billingServiceGroups`: 5 service clusters (Front Desk Management, Medical Coding, Claims Processing, Denial Resolution, Financial Analytics).
  - `billingSpecialties`: 40 distinct clinical specialties supported.
  - `billingPlatforms`: 12 compatible EHR/Practice Management platforms (Epic, Cerner, eClinicalWorks, AthenaHealth, Kareo, AdvancedMD, etc.).
  - `billingTargets`: 8 verified operational performance metrics.

#### `src/data/goodman-laboratories.ts`
- **Role:** Pharmaceutical Manufacturing Data Model for Goodman Laboratories.
- **Exports:**
  - `laboratoriesSections`: 5 approved production sections (Oral Solid Dosage/Tablets, Capsules, Dry Powder Suspensions, Liquid Syrups, Cephalosporins).
  - `registeredProducts`: 64+ formulations with generic salts, strengths, dosages, and DRAP registration numbers across 20 therapeutic areas.
  - `internationalMarkets`: Active and target export destinations.
  - `laboratoriesCertifications`: ISO 9001, ISO 14001, ISO 45001, and cGMP compliance data.
  - `laboratoriesCsr`: Educational and humanitarian outreach programs.

#### `src/data/goodman-medical-equipment.ts`
- **Role:** Medical Devices & Trading Model for Goodman Medical Equipment Trading LLC.
- **Exports:**
  - `medicalFounders`: 4 founding partners.
  - `medicalBoard`: Executive board leadership across Dubai and Islamabad offices.
  - `sterisReprocessingWorkflow`: 7-step sterile processing and infection prevention lifecycle.
  - `supplyChainSteps`: 5-step procurement, inspection, warehousing, logistics, and installation workflow.
  - `medicalMarkets`: Active operations (UAE & Pakistan) and signed/prospective expansion corridors.

#### `src/data/wal-green-chemicals.ts`
- **Role:** Chemical Indenting & Trading Model for Wal Green Chemicals (Pvt.) Ltd.
- **Exports:**
  - `chemicalDepartments`: 4 functional units (Indenting, Local Trading, Quality Assurance, Regulatory Affairs).
  - `chemicalCategories`: 19 commercial chemical categories (Active Pharmaceutical Ingredients, Excipients, Solvents, Minerals, Polymers, etc.).
  - `distributionHubs`: 8 nationwide industrial delivery centres across Pakistan.
  - `sourcingChannels`: Dual-channel procurement pipelines (International indenting from China, India, Europe; local stock in Karachi).

---

### 3.4 Shared Components & Layout (`src/components/` & Root `src/app/`)

#### `src/components/company-group-frame.tsx`
- **Role:** Minimal parent holding wrapper for bespoke company routes (`/companies/[slug]`).
- **Features:** Skip link (`#main-content`), landmark header with Goodman Group monogram and relationship badge (`"A Goodman Group company"`), navigation back-link to `/companies`, `<main id="main-content" tabIndex={-1}>`, and corporate return footer.
- **Styling:** Controlled through CSS custom properties (`--frame-border`, `--frame-bg`, `--frame-fg`, `--frame-badge-bg`, `--frame-badge-fg`) easily customizable by bespoke stylesheets.

#### `src/components/company-card.tsx`
- **Role:** Interactive subsidiary preview card rendered on homepage and directory.
- **Features:** Displays company legal/display name, business line, accent highlight, summary, and action link. Wraps `MouseGlowCard` to cast a radial accent illumination tracking the pointer.

#### `src/components/mouse-glow-card.tsx` & `src/components/mouse-glow-card.test.tsx`
- **Role:** Client-side spotlight interaction container.
- **Features:** Listens to pointer movement, sets `--glow-x` and `--glow-y` directly on element styles without triggering React re-renders, and safely ignores touch devices.
- **Tests:** Verifies mouse coordinate tracking, reset on pointer leave, and exclusion of touch inputs.

#### `src/components/scroll-experience.tsx`
- **Role:** Master Smooth-Scroll & Scroll Animation Orchestrator.
- **Features:** Initializes Lenis smooth scrolling and synchronizes it with GSAP's `ScrollTrigger.update` via `requestAnimationFrame`. Orchestrates homepage chapter transitions, pinned scrubbers, and gracefully reverts all tweens when `prefers-reduced-motion: reduce` is detected.

#### `src/components/site-header.tsx` & `src/components/site-header.test.tsx`
- **Role:** Global Fixed Navigation Header.
- **Features:** Glassmorphic bar displaying the Goodman Group logo, desktop navigation links with active pathname indicator, and a fully accessible mobile drawer using React Portal, focus trap, Escape key listener, background `inert` toggling, and `<noscript>` fallback.
- **Tests:** Verifies Escape dismissal, focus lock, inert attribute management, reduced motion, and route tracking.

#### `src/components/site-footer.tsx`
- **Role:** Global Holding Corporate Footer.
- **Features:** Goodman Group brand signoff, holding summary, categorized navigation columns, partnership notice, copyright statement, and smooth back-to-top shortcut.

#### `src/app/layout.tsx`
- **Role:** Root Application Shell.
- **Features:** Loads Google fonts `Geist` and `Geist Mono`, sets dark colorScheme, metadata base templates, theme color (`#06111f`), and mounts the global stylesheet.

#### `src/app/globals.css`
- **Role:** Global Design System & Token Stylesheet.
- **Features:** Imports Tailwind CSS v4, declares design tokens (`--ink-base`, `--ink-surface`, `--color-accent-cyan`, `--color-accent-green`, `--glass-bg`, `--glow-base`), glassmorphism materials, accessible focus styles, skip-links, and high-contrast fallbacks.

#### `src/app/not-found.tsx`
- **Role:** Custom Accessible 404 Error Page.
- **Features:** Search engine `noindex` metadata, holding header, semantic content area, and dual return pathways to Home and Companies directory.

---

### 3.5 App Routes & Pages (`src/app/`)

#### `src/app/page.tsx` & `src/app/page.test.tsx`
- **Role:** Goodman Group Homepage.
- **Narrative Chapters:**
  1. *Hero Chapter:* Proposition, Goodman white emblem, dynamic badge, call to actions.
  2. *Company Constellation:* Direct interactive preview grid of all 5 operating subsidiaries.
  3. *Scale & Capability:* Quantitative metrics (production sections, product portfolio, geographic reach).
  4. *Geographic Presence:* Sourcing, manufacturing, and distribution infrastructure map across Pakistan and the Middle East.
  5. *Heritage & Governance:* Operational history and leadership under CEO Syed Talib Hussain Hashmi.
  6. *Operations in Action:* Manufacturing facility photography and standards compliance.
  7. *Audience Routing / Contact:* Specific inquiry routing for institutional partners, buyers, and vendors.
- **Tests:** Verifies headings, ARIA landmarks, company card links, reduced-motion fallbacks, and mobile navigation.

#### `src/app/companies/page.tsx` & `src/app/companies/page.test.tsx`
- **Role:** Ungrouped Direct Company Directory.
- **Features:** Renders all canonical operating companies in a flat, high-clarity grid without category or sector silos.
- **Tests:** Asserts all canonical companies are present with accurate URLs, descriptions, and accessible badges.

#### `src/app/companies/[slug]/page.tsx` & `src/app/companies/[slug]/page.test.tsx`
- **Role:** Dynamic Fallback Route Gatekeeper.
- **Implementation:** Explicitly executes `notFound()`. Enforces that any company must have a dedicated bespoke route.
- **Tests:** Verifies `notFound()` invocation for arbitrary or unverified slugs.

#### `src/app/companies/wal-green-chemicals/`
- **Files:** `page.tsx`, `walgreen.css`, `page.test.tsx`.
- **Identity:** Ivory/charcoal/forest green palette (`#2d7a4f`), fluid swoosh accents.
- **Sections:** Enterprise overview, 4 core organizational functions, dual-channel procurement (International Indenting & Local Stock), 8 nationwide customer distribution hubs, and chemical categories catalog.
- **Tests:** Asserts metadata, legal name, governance facts, organizational functions, and nationwide distribution hubs.

#### `src/app/companies/goodman-medical-equipment/`
- **Files:** `page.tsx`, `medical.css`, `page.test.tsx`.
- **Identity:** Ice white/navy technical blueprint theme (`#0284c7`), surgical precision lines.
- **Sections:** Dual-jurisdiction identity (Dubai LLC & Islamabad), 4 founders and executive board, STERIS 7-step reprocessing pipeline, equipment supply chain, and current vs target international markets.
- **Tests:** Asserts metadata, founders, STERIS workflow distinction, and geographic markets.

#### `src/app/companies/goodman-laboratories/`
- **Files:** `page.tsx`, `laboratories.css`, `page.test.tsx`.
- **Identity:** High-contrast editorial crimson/charcoal aesthetic (`#a11d2e`), hairline grids.
- **Sections:** Manufacturing plant history (est. 2008), 5 approved production sections, 64+ DRAP registered products organized across 20 therapeutic areas, ISO 9001/14001/45001 certifications, and CSR outreach.
- **Tests:** Asserts canonical metadata, production sections, registered products, and certification disclosures.

#### `src/app/companies/goodman-billing/`
- **Files:** `page.tsx`, `billing.css`, `page.test.tsx`.
- **Identity:** High-contrast deep navy/cyan theme (`#0891b2`), numbered step counters, tabular rows.
- **Sections:** US Healthcare RCM specialization, HIPAA compliance claim, 6-step billing workflow, 5 service groups, 40 supported medical specialties, 12 EHR platforms, and 8 performance targets.
- **Tests:** Asserts metadata, 6 ordered workflow stages, service accordion disclosures, and evidence boundary notes.

#### `src/app/companies/geron-pharma/`
- **Files:** `page.tsx`, `geron.css`, `page.test.tsx`.
- **Identity:** Atmospheric dark violet theme (`#8b5cf6`), circular orbital layout.
- **Sections:** Legal corporate status, leadership under Syed Talib Hussain Hashmi (since 2019), pharmaceutical distribution focus, and explicit profile boundary notes.
- **Tests:** Asserts canonical metadata, legal entity identity, CEO appointment, and profile disclosures.

#### `src/app/sitemap.xml/route.ts` & `src/app/sitemap.xml/route.test.ts`
- **Role:** Dynamic XML Sitemap Route Handler.
- **Implementation:** Dynamically computes request origin, generates valid XML `<urlset>` containing `/`, `/companies`, and all canonical `/companies/[slug]` URLs.
- **Tests:** Validates `application/xml` content-type, correct URL schema, and dynamic host interpolation.

#### `src/app/robots.txt/route.ts` & `src/app/robots.txt/route.test.ts`
- **Role:** Dynamic Robots Route Handler.
- **Implementation:** Serves `text/plain` instructions allowing all user agents (`User-agent: *`, `Allow: /`) and pointing to the dynamically resolved sitemap URL.
- **Tests:** Validates content type, allow rules, and origin-based sitemap reference.

---

### 3.6 Static Assets (`public/`)

#### Root Assets (`public/`)
| File | Type | Description |
|---|---|---|
| `favicon.png` | PNG | Site favicon icon served at `/favicon.png` |
| `file.svg` | SVG | Default file icon from framework template |
| `globe.svg` | SVG | Default globe icon from framework template |
| `next.svg` | SVG | Next.js vector wordmark logo |
| `vercel.svg` | SVG | Vercel triangle vector mark |
| `window.svg` | SVG | Default browser window icon |

#### Brand Identities & Photography (`public/assets/logos/`)
| File | Status | Role / Resolution | Context & Usage |
|---|---|---|---|
| `walgreenLogo.png` | **Active** | Primary Brand Logo (528x259) | Logo for Wal Green Chemicals (Pvt.) Ltd. |
| `GoodmanLabLogo.png` | **Active** | Primary Brand Logo (575x279) | Logo for Goodman Laboratories (Pvt.) Ltd. |
| `geronlogo.png` | **Active** | Primary Brand Logo (684x357) | Logo for Geron Pharma (Pvt.) Ltd. |
| `GG3.png` | **Active** | Primary Brand Logo (2450x1961) | Logo for Goodman Medical Equipment Trading LLC |
| `GG-white.png` | **Active** | Master Brand Logo (5555x2368) | Primary Goodman Group white wordmark (Header/Hero/Footer) |
| `hero2.png` | **Active** | Editorial Photography | Homepage manufacturing operations photo |
| `ceo.png` | Source | Executive Portrait | Photograph of CEO Syed Talib Hussain Hashmi |
| `hero1.png` | Historical | Composite Graphic | Former hero marketing visual |
| `islamabad.jpg` | Regional | Photography | Islamabad operations & headquarters |
| `lahore.jpg` | Regional | Photography | Lahore / Punjab distribution hub |
| `karachi.jpg` | Regional | Photography | Karachi / Sindh port and sourcing center |
| `quetta.jpg` | Regional | Photography | Quetta / Balochistan distribution hub |
| `kpk.jpg` | Regional | Photography | Khyber Pakhtunkhwa distribution reach |
| `gilgit.jpg` | Regional | Photography | Gilgit-Baltistan distribution reach |
| `kashmir.jpg` | Regional | Photography | Azad Kashmir distribution reach |
| `Logo.png` | Brand Master | Master Logo Mark | Standard dark-themed Goodman Group brand logo |
| `LogoWhite.png` | Brand Master | Master Logo Mark | Monochrome white Goodman Group logo |
| `LogoWhiteGreen.png` | Brand Master | Master Logo Mark | Bi-color Goodman Group logo |
| `DarkLogo.png` | Brand Master | Master Logo Mark | Dark logo for light backgrounds |
| `GG1.png`, `GG2.png` | Monograms | Vector Monograms | Goodman Group corporate monograms |
| `GG-1.png`, `GG-2.png`| Secondary | Vector Marks | Goodman Group secondary logo variants |
| `Gplus.png` | Legacy | Subsidiary Badge | Goodman Plus consumer brand icon |
| `Gestate.png` | Legacy | Sector Badge | Real Estate sector icon |
| `Gcar.png` | Legacy | Sector Badge | Automotive sector icon |
| `Ggear.png` | Legacy | Sector Badge | Engineering & Equipment icon |
| `locator.png` | Legacy | UI Graphic | Map pinpoint icon |
| `mission.png`, `missioni.png` | Legacy | Content Badge | Corporate mission statement badges |
| `vision.png` | Legacy | Content Badge | Corporate vision statement badge |
| `values.png` | Legacy | Content Badge | Corporate core values badge |

---

### 3.7 Testing Infrastructure (`tests/`)

#### `tests/setup.ts`
- **Role:** Vitest Global Environment Setup.
- **Implementation:** Imports `@testing-library/jest-dom/vitest` custom matchers and registers automatic DOM cleanup (`afterEach(cleanup)`) across all unit and component tests.

#### `tests/e2e/home.spec.ts`
- **Role:** Playwright E2E Suite: Homepage Experience.
- **Coverage:**
  - Validates document title, metadata, and core brand hero presentation.
  - Tests 7 narrative chapters, semantic landmarks, and skip link mechanics.
  - Runs automated `@axe-core/playwright` accessibility audits (zero critical/serious violations).
  - Tests mobile header drawer modal: trigger, focus trap, Escape key handling, and background inertness.
  - Tests reduced-motion accessibility preference (`prefers-reduced-motion: reduce`).
  - Verifies non-JavaScript resilience and noscript elements.

#### `tests/e2e/company-routes.spec.ts`
- **Role:** Playwright E2E Suite: Company Portfolio & Bespoke Routes.
- **Coverage:**
  - Validates flat discovery on `/companies` directory.
  - Tests every bespoke company page (`/companies/wal-green-chemicals`, `/companies/goodman-medical-equipment`, `/companies/goodman-laboratories`, `/companies/goodman-billing`, `/companies/geron-pharma`).
  - Verifies `CompanyGroupFrame` integration (holding badge, relationship disclaimer, return navigation).
  - Verifies that unmapped slugs trigger a proper 404 response.
  - Runs automated axe accessibility audits across all company pages.
  - Tests `/sitemap.xml` and `/robots.txt` dynamic generation.

---

## 4. Cross-Reference Index by Technology and File Type

| Category | File Count | Paths |
|---|---|---|
| **Build & Tooling** | 10 | `package.json`, `package-lock.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `vitest.config.mts`, `playwright.config.ts`, `.nvmrc`, `.gitignore` |
| **CI/CD** | 1 | `.github/workflows/ci.yml` |
| **Documentation** | 12 | `README.md`, `DESIGN_DECISION.md`, `AGENTS.md`, `CLAUDE.md`, `CODEBASE_MAP.md`, `Verified Information/*.md` (8 files) |
| **Domain Data Models**| 5 | `src/data/companies.ts`, `src/data/goodman-billing.ts`, `src/data/goodman-laboratories.ts`, `src/data/goodman-medical-equipment.ts`, `src/data/wal-green-chemicals.ts` |
| **React Components** | 6 | `src/components/company-group-frame.tsx`, `src/components/company-card.tsx`, `src/components/mouse-glow-card.tsx`, `src/components/scroll-experience.tsx`, `src/components/site-header.tsx`, `src/components/site-footer.tsx` |
| **App Routes & Pages**| 10 | `src/app/layout.tsx`, `src/app/not-found.tsx`, `src/app/page.tsx`, `src/app/companies/page.tsx`, `src/app/companies/[slug]/page.tsx`, `src/app/companies/*/page.tsx` (5 company routes) |
| **Route Handlers** | 2 | `src/app/sitemap.xml/route.ts`, `src/app/robots.txt/route.ts` |
| **Stylesheets (CSS)** | 6 | `src/app/globals.css`, `src/app/companies/geron-pharma/geron.css`, `src/app/companies/goodman-billing/billing.css`, `src/app/companies/goodman-laboratories/laboratories.css`, `src/app/companies/goodman-medical-equipment/medical.css`, `src/app/companies/wal-green-chemicals/walgreen.css` |
| **Unit / Component Tests** | 11 | `src/components/*.test.tsx` (2), `src/app/page.test.tsx`, `src/app/companies/page.test.tsx`, `src/app/companies/[slug]/page.test.tsx`, `src/app/companies/*/page.test.tsx` (5), `src/app/*/*.test.ts` (2) |
| **E2E Tests & Setup** | 3 | `tests/setup.ts`, `tests/e2e/home.spec.ts`, `tests/e2e/company-routes.spec.ts` |
| **Public Media Assets**| 38 | `public/*.svg` (5), `public/favicon.png`, `public/assets/logos/*` (32 brand and photography files) |
| **Total Tracked Files**| **102** | Entire repository repository inventory |
