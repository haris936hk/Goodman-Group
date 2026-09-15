## Why

The homepage hero currently divides attention between a large left-side copy and call-to-action column and the Goodman Group visual system. The requested direction is a more focused hero identity: the existing circular Goodman Group mark and portfolio motif should carry the composition while the current orbit treatment and scroll storytelling remain intact.

## What Changes

- Remove all left-side hero content, including the eyebrow, headline, supporting description, action links, and bottom-left “Scroll to explore” cue.
- Recenter the existing Goodman Group hero visual so the circular group mark is the focal point of the hero.
- Preserve the hero glow, orbit rings, sector nodes, orbit pips, circular Goodman Group mark, and system caption.
- Preserve all GSAP and ScrollTrigger code, animation ownership, and existing orbit animation behavior.
- Leave the fixed header, portfolio and subsequent homepage chapters, company routes, and navigation unchanged.

## Capabilities

### New Capabilities

- `homepage-hero`: Defines the focused homepage hero presentation with the Goodman Group visual system centered and all existing orbit relationships retained.

### Modified Capabilities

- None. There are no existing OpenSpec capabilities in this repository.

## Impact

- Affected presentation code: `src/app/page.tsx` and the related hero layout styles in `src/app/globals.css`.
- Existing homepage tests may need updates to reflect the removed hero content and centered visual presentation.
- No API, dependency, content-data, or animation-library changes are required.
