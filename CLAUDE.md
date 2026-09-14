# Repository Guidelines

## Project Structure & Module Organization

This repository is a Next.js 16 App Router site written in TypeScript. Application routes, layouts, styles, and colocated component tests live under `src/app/`; `src/app/page.tsx` is the home route and `globals.css` contains global styling. Static files belong in `public/`. Despite its name, `public/assets/logos/` currently contains Goodman logos, photographs, and other source imagery. Browser journeys live in `tests/e2e/`, while shared Vitest setup is in `tests/setup.ts`. Consult `DESIGN_DECISION.md` before changing information architecture, visual direction, or animation behavior.

## Product and Information Architecture

`DESIGN_DECISION.md` is the source of truth. The site presents Goodman Group as a parent holding organization with an endorsed portfolio of distinct operating companies, not as one pharmaceutical company with several product lines. Preserve both organizing models:

- Parent/child hierarchy communicates Group relationships and provides stable company URLs.
- Sector grouping supports portfolio discovery but must not replace or obscure individual companies.

“Our Companies” is a primary navigation destination. Every entity must appear exactly once in canonical structured portfolio data, remain present in semantic page content, and be reachable by a normal link at a permanent `/companies/[slug]` route. Filters, spatial panels, and animated exploration are progressive enhancements, never the only discovery mechanism. Clearly separate operating companies from partners, associates, joint ventures, and brands.

The homepage must explain the Group before promoting a subsidiary. Its intended narrative order is Group proposition, company constellation, sector exploration, scale, geographic presence, heritage and leadership, current activity, and audience-specific contact routing. Healthcare may be the strongest heritage story but must not be used to characterize the entire Group as a pharmaceutical manufacturer.

Company profiles share a parent shell while preserving each entity's logo, legal identity, content, leadership, evidence, contact route, and restrained identity accent. Required profile information includes identity and Group relationship, overview, facts, capabilities, leadership, presence, and contact. Add sector-specific modules only when supported by content; do not render empty pharmaceutical-oriented sections for unlike businesses.

## Content Accuracy and Data Modeling

Treat company records, filenames, logos, and asset folders as source material for the site. Legal names, relationship types, leadership, dates, locations, statistics, certifications, products, market presence, and endorsement wording belong in the structured company data.

- Scope and date every statistic, for example employee count as of a named month and year.
- Distinguish active operations, distribution or partner markets, signed agreements, and planned markets in both text and visuals.
- Keep claims such as “nationwide,” “global presence,” “affordable access,” or “life-saving” specific to the company information they describe.
- Do not create decorative forms. A form needs defined fields, submission handling, validation and error states, spam protection, privacy requirements, and an owner.
- Use a clear geographic or industry qualifier in SEO metadata where it helps distinguish the Group.

Represent companies as typed structured records rather than embedding facts in one-off JSX. The content source must support unique slugs, legal and display names, relationship type, sector, summary, logo, locations, leadership, capabilities, contacts, optional evidence and markets. Prefer reusable required modules plus optional sector-specific modules. Keep metadata, canonical URLs, structured data, sitemap entries, and internal links aligned with the same source of truth.

## Luminous Momentum Design Direction

The design direction is **Luminous Momentum**: an immersive, cinematic, digitally native Group experience balanced with institutional clarity and human warmth. Aim for dark atmospheric canvases, Goodman blue (`#174a87`) as the brand source, focused cyan and green (`#5fbf92`) illumination, modern oversized sans typography, layered real-world media, depth, and controlled motion.

- Treat gradients as environmental light, not indiscriminate rainbow text fills.
- Use glow to communicate focus, energy, or relationships; do not apply it to everything.
- Implement glass as named, tokenized materials with reliable contrast, limited foreground use, and opaque fallbacks. Avoid repetitive frosted-card grids.
- Prefer real facilities, manufacturing, equipment, employees, leadership, offices, and real activity over generic medical stock or synthetic technology imagery.
- Preserve logo clarity. Obtain vector masters where possible and do not invent arbitrary company icons.
- Use full-viewport chapters, asymmetric composition, deliberate overlap, and meaningful changes of scale. Dense facts, documents, certifications, and filters may use calmer high-contrast panels.
- Borrow the production quality of contemporary technology marketing, not its product vocabulary. Avoid dashboards, meaningless gradient blobs, invented software metaphors, and generic SaaS feature cards.

The immersive layer must enhance the information architecture rather than substitute for it. Core content and navigation must remain understandable without animation, smooth scrolling, hover, or precision-pointer interaction. Mobile is a recomposed experience with fewer simultaneous layers and shorter or removed pinned sequences, not a scaled-down desktop timeline.

## Motion Ownership

Every animated component must declare one owner, and two systems must never write the same property on the same element:

- **GSAP + ScrollTrigger:** cinematic narrative, pinned chapters, scrubbed timelines, parallax, masks, SVG or map paths, kinetic type, numeric sequences, and multi-element orchestration.
- **Lenis:** scroll interpolation and synchronization with ScrollTrigger only. It does not animate content or control React state.
- **Motion for React:** state-driven entry and exit, layout transitions, shared elements, gestures, menus, dialogs, filters, overlays, and disclosures. Import from `motion/react`.
- **CSS/Tailwind:** simple hover, focus, color, border, opacity, and short self-contained feedback.

Do not place independently scroll-driven Motion behavior inside a ScrollTrigger scene. If GSAP and Motion appear in one feature, assign them separate DOM nodes and properties. Scope and clean up GSAP on route changes. Synchronize Lenis and ScrollTrigger through the same animation frame, preserve anchors, keyboard and touch scrolling, browser history and restoration, and provide a native fallback. Load animation code by route or component so ordinary company pages do not download homepage storytelling code.

One shared reduced-motion decision must consistently simplify Lenis, GSAP, Motion, CSS, and ambient media. Reduced motion removes scrubbed and parallax behavior while preserving content order, hierarchy, and access.

## Accessibility, Media, and Performance

WCAG 2.2 AA is the minimum target. Maintain semantic headings and landmarks, keyboard-operable navigation, visible focus, meaningful alternative text, sufficient contrast through every translucent state, labelled controls, usable zoom, and content that is not communicated through color or motion alone.

Use `next/image` for suitable responsive raster media, `next/font` for controlled font delivery, crisp SVG for logos and animated diagrams, and optimized WebM or MP4 instead of large GIFs. Ambient video must be muted, non-essential, compressed, responsive where practical to reduced-motion and data-saving preferences, and backed by an effective poster.

Treat performance as part of the visual quality. Reserve media dimensions, route-load expensive code, and explicitly test blur radius, layer count, pinned duration, and simultaneous animation on mid-range mobile hardware and constrained networks. Prefer HTML, CSS, SVG, and GSAP for the initial visual system; add WebGL or custom 3D only when a specific visualization genuinely requires it.

## Build, Test, and Development Commands

Use Node 24 and npm 11 (see `.nvmrc` and `package.json`).

- `npm ci` installs the exact locked dependencies.
- `npm run dev` starts the local site at `http://localhost:3000`.
- `npm run lint` checks Next.js Core Web Vitals and TypeScript ESLint rules.
- `npm run typecheck` runs strict TypeScript validation without emitting files.
- `npm run test:run` executes Vitest once; `npm test` uses watch mode.
- `npm run test:coverage` enforces coverage thresholds.
- `npm run test:e2e` runs Playwright in Chromium and Firefox; `npm run test:e2e:all` also includes WebKit.
- `npm run build` creates a production build; `npm run check` runs all non-browser CI checks.

Install Playwright browsers once with `npx playwright install`.

## Coding Style & Naming Conventions

Use strict TypeScript, React function components, and two-space indentation. Follow the existing quote style within each file and let `npm run lint:fix` handle safe ESLint fixes. Name components and exported React types in PascalCase, functions and variables in camelCase, and route directories in lowercase. Prefer the `@/` alias for imports from `src/`. Keep Tailwind utility classes readable and group related layout, spacing, and visual utilities consistently. Use GSAP for complex scroll timelines, Motion for component interactions, and Lenis for smooth scrolling; do not make multiple libraries own the same effect.

Use Server Components for page content, metadata, structured company records, and non-interactive layout. Add narrowly scoped Client Components only for animation, state, gestures, or browser APIs. Centralize CSS tokens for color, typography, spacing, radii, glass opacity, blur, borders, glow, depth, easing, and duration; do not repeat arbitrary glass utility combinations.

## Testing Guidelines

Colocate unit/component tests as `*.test.ts` or `*.test.tsx` under `src/`. Put user-facing browser flows in `tests/e2e/*.spec.ts`. Vitest uses Testing Library and jsdom; Playwright includes automated axe accessibility checks. Query by role or label, and test observable behavior rather than component internals or animation timing. Maintain at least 80% branches, functions, lines, and statements coverage.

## Commit & Pull Request Guidelines

History is currently minimal; use concise, imperative commit subjects (for example, `Add company portfolio navigation`) and keep each commit focused. Pull requests should explain the user-visible change, link relevant issues or design decisions, and include screenshots or recordings for visual or motion changes. Note accessibility implications and test coverage. Before requesting review, run `npm run check` and `npm run test:e2e:all`; CI requires both.
