## 1. Simplify the hero markup

- [x] 1.1 Remove the visible `.hero-copy` subtree and `.hero-scroll-cue` from `src/app/page.tsx`, retain a visually hidden meaningful `h1`, and verify the homepage still exposes exactly one primary heading
- [x] 1.2 Preserve the complete `.hero-system` subtree, including its Goodman Group mark, glow, orbit rings, sector nodes, pips, caption, and existing animation data attributes; verify the relevant elements remain present in the rendered homepage DOM

## 2. Center the existing visual system

- [x] 2.1 Change the hero layout to a single centered composition across desktop, tablet, and mobile breakpoints while preserving the existing hero-system aspect ratio and width constraints; verify with responsive browser checks at representative viewport sizes
- [x] 2.2 Remove or consolidate only orphaned left-copy, scroll-cue, and two-column-divider styles; verify orbit, node, pip, group-core, caption, and glow styles remain unchanged and no unintended horizontal offset remains

## 3. Update focused coverage

- [x] 3.1 Update `src/app/page.test.tsx` to assert the removed hero copy and scroll cue are absent while the accessible heading, Goodman Group mark, orbit rings, sector nodes, pips, and caption remain; verify with `npm run test:run -- src/app/page.test.tsx`
- [x] 3.2 Extend the homepage browser coverage to verify the centered hero composition and preserved orbit content at desktop and narrow viewports; verify with `npm run test:e2e:all -- tests/e2e/home.spec.ts` (Chromium and Firefox pass; WebKit is blocked by missing host libraries)
- [x] 3.3 Verify reduced-motion rendering retains the same hero content without adding motion-specific regressions; verify with `npm run test:e2e:all -- tests/e2e/home.spec.ts -g "home page with reduced motion"`

## 4. Preserve animation and release quality

- [x] 4.1 Confirm `src/components/scroll-experience.tsx` and all GSAP/ScrollTrigger logic remain unchanged, and verify the preserved `data-orbit-node` and `data-orbit-ring` hooks are still available with `git diff -- src/components/scroll-experience.tsx` and targeted DOM assertions
- [x] 4.2 Run `npm run lint`, `npm run typecheck`, and `npm run test:coverage` and resolve only regressions caused by this hero presentation change
- [x] 4.3 Run `npm run build` and verify the production homepage renders with the centered hero and preserved visual system
