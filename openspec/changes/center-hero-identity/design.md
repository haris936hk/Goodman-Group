## Context

The homepage hero currently uses a two-column grid: `.hero-copy` occupies the left column while `.hero-system` contains the Goodman Group mark, glow, orbit rings, sector nodes, pips, and caption. A separate bottom-left scroll cue is also rendered. The existing `ScrollExperience` component targets the hero's data attributes for its reveal timeline and uses the orbit-ring attributes for desktop scroll motion.

See `proposal.md` and `specs/homepage-hero/spec.md` for the motivation and observable requirements. The implementation must preserve the existing visual-system markup and animation ownership while making the hero visual the sole visible focal point.

## Goals / Non-Goals

**Goals:**

- Remove the visible left-side hero copy and bottom-left scroll cue.
- Center the existing `.hero-system` across desktop and narrow layouts.
- Preserve the glow, orbit rings, sector nodes, pips, circular group mark, and system caption without changing their geometry or content.
- Keep a meaningful accessible primary heading available without reintroducing visible left-side copy.
- Keep the existing animation selectors and scroll behavior valid for the preserved visual elements.

**Non-Goals:**

- Do not remove or redesign any orbit, node, pip, glow, caption, or Goodman Group logo element.
- Do not edit `src/components/scroll-experience.tsx` or change GSAP, ScrollTrigger, Lenis, reduced-motion, or animation ownership behavior.
- Do not change the fixed header, portfolio content, company data, routes, navigation, or later homepage chapters.
- Do not add a new dependency or introduce a new hero interaction.

## Decisions

### Preserve the visual-system subtree

Keep the existing hero-system subtree and its `data-orbit-node` and `data-orbit-ring` attributes intact. Remove only the `.hero-copy` subtree and `.hero-scroll-cue` from the hero markup. This ensures the current orbit reveal and ring ScrollTrigger selectors continue to resolve without changing the animation implementation.

Alternative considered: rebuild the hero visual as a new centered component. This would increase the risk of changing orbit timing, content, or visual identity for a request that only removes the competing left-side presentation.

### Use a single centered hero layout

Change the hero layout from a copy-plus-visual two-column grid to a single centered layout. Keep `.hero-system` as the centered, aspect-ratio-preserving visual container and retain its existing width constraints at each responsive tier. Remove or neutralize the old column-divider styling because it only communicates the boundary between the two-column composition.

Alternative considered: keep the two-column grid and hide the copy column. This would preserve an unused layout gap and make the visual appear offset rather than intentionally centered.

### Preserve accessibility without visible copy

Retain one meaningful `h1` in the homepage document using the existing visually-hidden utility or an equivalent accessible presentation. The heading must not occupy visible space or recreate the removed left-side content, while allowing keyboard and assistive-technology users to identify the page.

Alternative considered: remove the heading entirely. This would satisfy the visual request but regress the page's semantic heading structure and existing accessibility expectations.

### Limit cleanup to orphaned hero presentation styles

Remove or consolidate CSS rules that become unused when the left-side copy and scroll cue are removed, while leaving all styles that serve the preserved hero-system elements unchanged. Do not alter animation-related CSS or the selectors consumed by the existing scroll experience.

## Risks / Trade-offs

- [Loss of immediate textual context] -> Keep the accessible page heading, fixed navigation, and the existing portfolio chapter directly after the hero; validate that the visual system remains clearly identified by its logo and caption.
- [Desktop visual becomes too small or too large after column removal] -> Preserve the existing `.hero-system` aspect ratio and breakpoint width constraints, then verify at desktop, tablet, and mobile viewport sizes.
- [Removing data-targeted markup could affect the reveal timeline] -> Keep every preserved `data-orbit-node` and `data-orbit-ring` attribute unchanged; leave `ScrollExperience` untouched.
- [Hidden heading becomes visually exposed or affects layout] -> Use the established visually-hidden pattern and verify both rendered layout and accessibility-tree behavior.
- [Unused two-column styles create inconsistent responsive behavior] -> Check the full hero-related media-query cascade and remove only rules that reference the deleted copy or cue.

## Migration Plan

No data, API, dependency, or route migration is required. Deploy the page/CSS/test changes together; rollback consists of reverting those presentation changes while leaving the existing animation component unchanged.
