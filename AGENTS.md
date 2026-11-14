# Repository Guidelines

## Project Overview

Goodman Group's corporate website: group landing page, directory, six bespoke company profiles, enquiry handling, and a CMS-backed newsroom. Built with Next.js 16 App Router, React 19, strict TypeScript, and Payload CMS 3. Company content is static typed data; blog announcements and media live in SQLite and local uploads.

## Architecture & Data Flow

- **Separate document roots:** `src/app/(website)/layout.tsx` owns public styles, fonts, metadata, and pre-hydration theme initialization. `src/app/(payload)/layout.tsx` owns Payload styles and admin server functions. Keep public CSS and theme behavior outside the admin document.
- **Company content:** `src/data/companies.ts` is the canonical registry; `src/data/goodman-group.ts` supplies group facts and `SITE_ORIGIN`. Home, directory, metadata, JSON-LD, and sitemap consume these records. Dedicated company routes combine them with company-specific data inside `CompanyGroupFrame`; there is no generic profile renderer. `companies/[slug]/page.tsx` rejects unknown slugs with `notFound()`.
- **Newsroom:** `src/lib/blog/queries.ts` provides server-only, request-cached Payload queries and lazily imports `@payload-config`. Public queries expose published announcements; `/blog/preview/[id]` authenticates the administrator before reading drafts. Preserve this boundary rather than eagerly initializing CMS storage from shared public modules.
- **CMS writes:** `payload.config.ts` configures announcements, media, administrators, Lexical, and SQLite with schema push disabled. `src/cms/mutation-gate.ts` serializes in-process writes through `withCmsMutation`; collection hooks assert mutation scope. Keep REST, server functions, scripts, and tests inside the appropriate mutation/administrator-maintenance scope.
- **Enquiries:** the deferred client form uses `src/data/enquiry.ts` validation and POSTs to `src/app/api/enquiries/route.ts`. The server checks origin, bounds the body to 16 KiB, validates inputs/honeypot, rate-limits hashed IPs through Upstash Redis, and sends through Resend. Preserve fail-closed behavior and explicit validation/delivery errors.
- **Client state:** local React state/effects and DOM/CSS properties, not an application store or dependency-injection container. Keep interactive client boundaries small; Lenis/GSAP and the enquiry form load lazily.

## Key Directories

- `src/app/(website)/`: public routes, bespoke company compositions/styles, blog, previews, and 404 UI.
- `src/app/(payload)/`: admin UI and `/api/cms` REST integration; `src/app/api/enquiries/`: separate public submission endpoint.
- `src/cms/`: collections, lifecycle/access guards, serialized mutations, media-reference protection, and custom admin components. `src/migrations/`: committed SQLite schema history.
- `src/data/`: typed company/group records and enquiry validation. `src/lib/`: blog queries/rendering, theme helpers, and structured data. `src/components/`: shared public UI and client interactions.
- `tests/cms/`: real SQLite integration tests; `tests/e2e/`: browser journeys. Unit/component tests are also colocated with source.
- `scripts/`: offline CMS maintenance, deployment packaging/smoke checks, and performance audits. `Verified Information/`: business reference records; `public/assets/`: public media.

## Development Commands

Use `npm ci` to install dependencies.

| Command | Purpose |
|---|---|
| `npm run dev` | Start Next.js development server |
| `npm run build` | Build production standalone server and copy public/static assets into it |
| `npm run start` | Run `.next/standalone/server.js` after building |
| `npm run lint` / `npm run lint:fix` | ESLint / autofix |
| `npm run typecheck` | TypeScript without emitting files |
| `npm test` / `npm run test:run` | Vitest watch / single run |
| `npm run test:coverage` | Vitest with enforced V8 coverage thresholds |
| `npm run test:cms` | Dedicated serial CMS integration suite |
| `npm run test:e2e` | Playwright desktop and selected mobile journeys |
| `npm run test:e2e:headed` / `npm run test:e2e:ui` | Headed Chromium / interactive browser testing |
| `npm run check` | Lint, typecheck, coverage, build; excludes E2E and deployment smoke |
| `npm run smoke:deployment -- http://127.0.0.1:4173` | Verify a running production deployment |
| `npm run package:operations` | Package a separate offline CMS maintenance bundle |

Payload CLI commands need the intended CMS environment explicitly loaded; do not assume Next's `.env.local` loading applies to standalone CLI execution. Example migration command:

```sh
node --env-file=/absolute/path/to/cms.env ./node_modules/payload/bin.js migrate
```

Administrator creation/reset use `scripts/cms-create-admin.ts` and `scripts/cms-reset-password.ts` through Payload's `run` command. Backup/restore use `scripts/cms-backup.mjs` and `scripts/cms-restore.mjs`; follow the README's offline maintenance procedure, not ad hoc database copies.

## Code Conventions & Common Patterns

- Use `@/` for `src` imports and `@payload-config` for the CMS config. Match nearby two-space indentation, semicolons, double quotes, and trailing commas; no dedicated formatter is configured. Filenames are kebab-case, components/types PascalCase, variables/hooks camelCase. Domain records use explicit types, readonly fields, and `as const satisfies`.
- Routes are Server Components by default. Next route `params` and `searchParams` are Promises: await them before access. Keep server-only storage/auth/query code out of client bundles. Unknown content uses `notFound()`; CMS loading errors use the blog error boundary, not fabricated empty results.
- Preserve effect cleanup, animation-generation guards, reduced-motion support, and guarded storage access. Theme helpers synchronize storage, document/shell attributes, and theme-color metadata; company and not-found synchronizers manage route transitions.
- Styling is Tailwind v4 plus ordinary stylesheets, not CSS modules. Preserve shared tokens and company-prefixed selectors/custom properties beneath company root classes. Do not leak bespoke company styles into other routes or Payload.
- Preserve mobile navigation focus trapping/restoration, Escape dismissal, scroll locking, and background inertness. Use semantic controls, labels, and native `<details>` for dense disclosures. Pointer glow ignores touch and updates CSS properties directly.
- CMS invariants: published slugs/dates are locked; historical versions restore **as drafts**, not through native version publishing. Keep Lexical validation/rendering aligned, unsafe link protocols blocked, upload limits enforced, and referenced media protected from deletion. Account provisioning/recovery stays offline; do not enable web registration/reset flows.
- **Content policy:** company copy is owner-approved. Keep facts in typed records; align links, metadata, JSON-LD, sitemap, and `scripts/deployment-routes.json`. Scope/date statistics and distinguish active operations, partner/distribution markets, signed agreements, and targets. Never expose document filenames/citations, provenance panels, verification disclaimers, missing-information commentary, or ownership caveats in public content, metadata, data, comments, or tests. Do not invent facts or broaden claims; the STERIS workflow does not imply Goodman-owned sterilization facilities. New forms require a real owner, submission handling, validation/error states, spam protection, and privacy requirements.

## Important Files

- `src/app/(website)/page.tsx`, `src/app/(website)/companies/*/page.tsx`, and `src/app/(website)/blog/`: public entry points.
- `src/components/site-header.tsx`, `theme-toggle.tsx`, `company-theme-sync.tsx`, `scroll-experience.tsx`, and `deferred-enquiry.tsx`: navigation, theme, animation, and lazy-form lifecycle.
- `src/cms/environment.ts`, `administrator-maintenance.ts`, `announcement-lifecycle.ts`, `media-references.ts`, and `restore-draft.ts`: storage safety and CMS lifecycle/security contracts.
- `src/lib/structured-data.tsx`, `src/app/robots.txt/route.ts`, and `src/app/sitemap.xml/route.ts`: metadata and discovery; use `SITE_ORIGIN`, never an incoming Host header, for canonical identity.
- `package.json`, `tsconfig.json`, `next.config.ts`, `payload.config.ts`, `eslint.config.mjs`, `vitest*.config.mts`, `playwright.config.ts`, and `.github/workflows/ci.yml`: executable tooling contracts. Prefer current source/configuration over stale inventories or counts in README/audit documents.

## Runtime/Tooling Preferences

- `.nvmrc` pins **Node 24.22.1**; `package.json` requires `>=24.22.1 <25` and pins **npm 11.17.0**. Use npm and `package-lock.json`, not Bun or another lockfile. The project is ESM; TypeScript uses strict mode and bundler resolution. Next enables React Compiler and standalone output.
- CMS requires `DATABASE_URL=file:/absolute/path/...`, an absolute `UPLOAD_DIR`, and a `PAYLOAD_SECRET` of at least 32 characters. Persistent data must live outside the checkout/release directory. Use one web process per SQLite database: the write gate is process-local, not a distributed lock. Schema changes require committed migrations (`push: false`).
- Stop the web server for offline CMS maintenance. Before using `--env-file`, clear inherited CMS path/secret/config variables: existing shell variables take precedence and can target the wrong database. Backups pair database and uploads; preserve secrets separately. `CMS_TEST_ROOT` is temporary-test-only, never production configuration.
- Enquiries require `RESEND_API_KEY`, `ENQUIRY_FROM_EMAIL`, `ENQUIRY_TO_EMAIL`, `UPSTASH_REDIS_REST_URL`, and `UPSTASH_REDIS_REST_TOKEN`. Trust forwarded IP headers only behind a controlled proxy (`ENQUIRY_TRUST_PROXY=true` or the supported Vercel environment).
- Regenerate `src/payload-types.ts` and `src/app/(payload)/admin/importMap.js` through Payload tooling; do not hand-edit them. Do not edit `.next/`, Next-generated types, coverage, browser reports/results, or packaged `dist/` artifacts as source.

## Testing & QA

- **Vitest + Testing Library:** `vitest.config.mts` includes colocated `src/**/*.{test,spec}.{ts,tsx}` and `tests/cms/**/*.test.{ts,tsx}`. Default environment is jsdom; CMS files select Node. `tests/setup.ts` installs jest-dom and cleanup; `tests/test-utils.ts` supplies media-query/resize mocks. Prefer semantic role/name queries and behavioral interactions. Mocks, globals, and environment stubs reset by configuration.
- **Coverage:** 80% minimum for branches, functions, lines, and statements. Exclusions include Next layout/loading/error conventions, generated Payload types, migrations, and `scroll-experience.tsx`; browser journeys exercise scroll choreography.
- **CMS integration:** `vitest.cms.config.mts` runs serially with Node and 60-second timeouts. Fixtures create/migrate isolated temporary databases/uploads and destroy them afterward. Preserve mutation scopes and never point tests at live storage.
- **Playwright + Axe:** Desktop Chromium runs the full suite; Pixel 7 `mobile-chrome` runs selected company, enquiry, blog, 404, and theme journeys. Tests cover accessibility, themes, keyboard/mobile navigation, responsive overflow, reduced motion, no-JavaScript navigation, disclosures, and enquiry/blog behavior. Axe is not full accessibility certification.
- Install browsers with `npx playwright install --with-deps chromium`. Local Playwright starts/reuses the dev server; CI uses the production server. `PORT` and `PLAYWRIGHT_BASE_URL` override the default port 3000 target.
- Target examples: `npm run test:run -- src/components/site-header.test.tsx`; `npm run test:cms -- tests/cms/lifecycle.test.ts`; `npm run test:e2e -- tests/e2e/company-routes.spec.ts --project=chromium`.
- Authenticated blog E2E requires disposable CMS setup via `scripts/cms-test-setup.ts`, a fresh `CMS_TEST_ROOT` under OS temp, and `CMS_TEST_ADMIN_EMAIL`/`CMS_TEST_ADMIN_PASSWORD`. Without credentials, the editor journey skips; anonymous checks still run. Follow `.github/workflows/ci.yml` for complete setup.
- CI runs CMS integration, lint, typecheck, coverage, build, production smoke, and both Playwright projects; focused tests are forbidden, with two retries and one browser worker. For UI changes, verify the affected real browser surface as well as relevant unit behavior.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
