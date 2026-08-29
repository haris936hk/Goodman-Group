# Goodman Group Website

Next.js App Router application for the Goodman Group website redesign.

## Requirements

- Node.js 24 (see `.nvmrc`)
- npm 11

## Getting Started

Install the locked dependencies and start the development server:

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Quality Checks

```bash
npm run lint           # ESLint and Next.js Core Web Vitals rules
npm run typecheck      # Strict TypeScript validation
npm run test:run       # Unit and component tests once
npm run test:coverage  # Unit tests with enforced coverage thresholds
npm run build          # Optimized production build
npm run check          # All non-browser checks above
```

`npm test` runs Vitest in watch mode during development.

## End-to-End Tests

Install the managed Chromium, Firefox, and WebKit binaries once:

```bash
npx playwright install
```

Then run the browser suite:

```bash
npm run test:e2e
npm run test:e2e:all
npm run test:e2e:headed
npm run test:e2e:ui
```

The default end-to-end command runs Chromium and Firefox for fast local feedback. `npm run test:e2e:all` adds WebKit and is enforced in CI, where Playwright installs the required browser system dependencies.

Playwright starts the development server locally. In CI it runs against the previously built production server. The suite covers Chromium, Firefox, WebKit, reduced-motion behavior, and automated accessibility checks.

## Testing Conventions

- Colocate unit and component tests as `*.test.ts` or `*.test.tsx` under `src/`.
- Put browser journeys in `tests/e2e/`.
- Prefer role- and label-based queries over implementation selectors.
- Test observable behavior, not animation frames or component internals.
- Use Playwright for async Server Components and full App Router behavior.
