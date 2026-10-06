# Repository Guidelines

## Project Overview

Goodman Group's corporate portfolio website: a group landing page, company directory, and five bespoke company profiles. Built with Next.js 16 App Router, React 19, and strict TypeScript; content comes from static typed records, not a backend API.

## Architecture & Data Flow

- `src/app/layout.tsx` supplies global styles, fonts, metadata, and pre-hydration theme initialization. Routes are server components by default.
- `src/data/companies.ts` is the canonical company registry and slug lookup. Home, directory, and sitemap consume it; dedicated company pages combine its records with company-specific profile data. `src/data/goodman-group.ts` holds group facts and `SITE_ORIGIN`; `src/lib/structured-data.tsx` emits Organization JSON-LD.
- Company routes compose bespoke markup inside `CompanyGroupFrame`; they are not instances of a generic profile renderer. `src/app/companies/[slug]/page.tsx` calls `notFound()` for unknown slugs.
- Client boundaries are `SiteHeader`, `ThemeToggle`, `MouseGlowCard`, and `ScrollExperience`. State is local React state/effects and DOM/CSS properties; there is no application-wide store, dependency-injection container, or fetching layer.
- Group theme synchronizes local storage, shell attributes, and theme-color metadata; bespoke company pages remain outside that theme. Home scroll choreography lazily loads Lenis/GSAP/ScrollTrigger and respects reduced motion.

## Key Directories

- `src/app/`: routes, route handlers, global CSS, and company-scoped stylesheets.
- `src/components/`: shared shell, company framing/cards, and client interactions.
- `src/data/`: readonly group/company domain records and operational credentials.
- `src/lib/`: structured metadata helpers.
- `tests/e2e/`: browser journeys; unit/component tests are colocated with source.
- `Verified Information/`: factual source records. `public/assets/`: site media.

## Development Commands

Use Node 24 and npm; install with `npm ci`.

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve an existing production build |
| `npm run lint` / `npm run lint:fix` | ESLint / autofix |
| `npm run typecheck` | TypeScript without emitting files |
| `npm test` / `npm run test:run` | Vitest watch / single run |
| `npm run test:coverage` | Unit tests with enforced coverage |
| `npm run test:e2e` | Chromium and Firefox journeys |
| `npm run test:e2e:all` | All projects, including WebKit |
| `npm run test:e2e:headed` / `npm run test:e2e:ui` | Interactive browser debugging |
| `npm run check` | Lint, typecheck, coverage, build; **excludes E2E** |

Install browser dependencies with `npx playwright install --with-deps`. Target a unit spec with `npm run test:run -- src/components/site-header.test.tsx`; target a browser spec with `npm run test:e2e -- tests/e2e/company-routes.spec.ts`.

## Code Conventions & Common Patterns

- Use `@/` imports for `src`, explicit domain types, readonly profile fields, and `as const satisfies` for canonical records. Filenames are kebab-case; components/types PascalCase; variables/hooks camelCase. Match nearby formatting: generally two spaces, semicolons, double quotes, and trailing commas. No dedicated formatter is configured.
- Keep browser APIs and interactive state inside client boundaries rather than converting route trees to client components. Preserve effect cleanup, animation generation guards, reduced-motion handling, and guarded storage access. Unknown routes use Next's `notFound()`; no general async/error-handling service exists.
- CSS uses Tailwind v4 plus ordinary global stylesheets, not CSS modules. Preserve shared tokens in `globals.css` and company-prefixed selectors/custom properties beneath page-specific root classes; avoid cross-page leakage.
- Preserve header focus trapping/restoration, Escape dismissal, scroll locking, and background inertness. Pointer glow updates CSS properties directly and ignores touch. Dense profile content uses native `<details>` disclosures.

## Content Accuracy and Data Modeling

Represent companies as typed structured records rather than embedding facts in one-off JSX. The content source supports unique slugs, legal and display names, relationship type, business description, summary, logo, locations, leadership, capabilities, contacts, and markets. Bespoke company pages render approved company content through route-specific implementations. Keep metadata, canonical URLs, structured data, sitemap entries, and internal links aligned with the same source of truth.

- Scope and date business statistics where applicable.
- Distinguish active operations, distribution or partner markets, signed agreements, and planned markets in both text and visuals.
- Keep claims such as “nationwide,” “global presence,” “affordable access,” or “life-saving” specific to the company information they describe.
- Do not create decorative forms. A form needs defined fields, submission handling, validation and error states, spam protection, privacy requirements, and an owner.
- Use a clear geographic or industry qualifier in SEO metadata where it helps distinguish the Group.

### Marketing Copy Policy

All supplied company content is owner-approved; UI, metadata, JSON-LD, application data, comments, and tests must not explain document origins or verification status.
- Prohibit PDF filenames/citations, source/provenance/evidence panels, supplied-profile notices, missing-information commentary, audit/independent-verification disclaimers, alternate-source comparisons, and ownership-proof caveats.
- Keep genuine business facts, named testimonial attribution, actual audit services, certification names, statutory/safety information, dates, market stages, and target labels.
- Do not invent missing facts or upgrade scope; omit a claim that cannot be stated accurately without editorial caveats.
- Optional evidence requirements are removed from the public content model; content presents direct operational capabilities and credentials.
- Distinguish active markets, targets, agreements, sourcing, and historical facts without editorial caveats. The STERIS instrument workflow does not imply Goodman-owned sterilization facilities.

## Important Files

- `src/app/page.tsx`, `src/app/companies/page.tsx`, `src/app/companies/*/page.tsx`: main route compositions.
- `src/data/companies.ts`, `src/data/goodman-group.ts`, company-specific `src/data/*.ts`: canonical content and relationships.
- `src/components/site-header.tsx`, `theme-toggle.tsx`, `scroll-experience.tsx`: navigation, theme, and animation lifecycle.
- `src/lib/structured-data.tsx`, `src/app/robots.txt/route.ts`, `src/app/sitemap.xml/route.ts`: metadata and discovery endpoints.
- `package.json`, `tsconfig.json`, `next.config.ts`, `eslint.config.mjs`, `vitest.config.mts`, `playwright.config.ts`, `.github/workflows/ci.yml`: executable tooling contracts.
- `Verified Information/Goodman_Group_Consolidated_Company_Information.md`: cross-company evidence synthesis. `CODEBASE_MAP.md` provides orientation but contains stale inventories/types; prefer current source/configuration.

## Runtime/Tooling Preferences

- `.nvmrc` pins Node 24; `package.json` requires `>=24 <25` and pins `npm@11.17.0`. Use npm and `package-lock.json`, not Bun or an alternative lockfile.
- TypeScript is strict with bundler resolution and the `@/*` alias. Next enables React Compiler; ESLint uses Next core-web-vitals and TypeScript presets. Tailwind v4 runs through PostCSS.
- Playwright defaults to port 3000; `PORT` and `PLAYWRIGHT_BASE_URL` override its target. It starts the dev server locally and the production server in CI; local runs may reuse a running server.
- Do not edit generated Next types, `.next/`, coverage, or browser reports/results as source.

## Testing & QA

- Vitest + React Testing Library run `src/**/*.{test,spec}.{ts,tsx}` in jsdom. `tests/setup.ts` supplies jest-dom and cleanup; mocks/globals/env stubs are reset by configuration. Prefer semantic role/name queries and behavioral interactions; existing mocks target Next navigation, motion preferences, storage, and element geometry.
- V8 coverage requires **80% each for branches, functions, lines, and statements**. Next system files and `scroll-experience.tsx` are excluded; scroll choreography is exercised in browser journeys.
- Playwright + Axe cover company routes, metadata/JSON-LD, sitemap/robots, disclosures, theme persistence, keyboard/mobile navigation, responsive overflow, reduced motion, no-JavaScript navigation, and 200% text sizing. Automated Axe checks are not full accessibility certification.
- CI on `main` pushes/PRs runs install, lint, typecheck, unit coverage, production build, browser installation, and all three E2E projects. CI forbids focused tests, retries twice, and uses one worker. For UI changes, exercise the affected real browser surface in addition to relevant unit checks.
