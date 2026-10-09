# Goodman Group Website Redesign Decision

**Status:** Design direction
**Design direction:** Luminous Momentum  
**Architecture:** Parent holding-company site with an ungrouped, bespoke company portfolio  
**Last updated:** 27 August 2026

## Executive Summary

The redesigned website will present Goodman Group as a parent holding organization, not as a single pharmaceutical company with several product lines. Its primary purpose is to establish the Group's identity, history, leadership, scale, values, and direction, then route visitors clearly to the relevant operating company.

Every subsidiary will retain its own name, logo, legal identity, leadership, locations, capabilities, and operational credentials. At the same time, all company profiles will live within a consistent Goodman Group experience. The resulting brand architecture is an **endorsed portfolio system**: Goodman Group supplies the common structure and authority, while each operating company remains recognizable.

The visual expression will follow **Luminous Momentum**: a cinematic, digitally native presentation built from deep atmospheric color, translucent glass surfaces, controlled glow, oversized modern typography, layered media, and scroll-driven narrative transitions. It should feel closer to an award-caliber technology marketing experience than a traditional corporate or pharmaceutical website. Institutional trust will come from precise marketing content, operational credentials, and disciplined execution—not from conservative styling.

### Group footer

The group footer uses separate brand, navigation, and contact columns with small uppercase section labels. The contact area stacks the inquiry description, prominent email link, US contact address, Pakistan office address, and Pakistan factory address rather than placing them in a single row. Pakistan addresses reuse the canonical Goodman Laboratories contact record. On smaller screens the contact area moves below the other columns; mobile stacks the main sections and retains a compact two-column navigation layout. Light and dark themes share the same hierarchy, with visible keyboard focus outlines.
Each address includes its designated Google Maps place link. Links open in a new tab, announce that behavior to assistive technology, and do not load an embedded map or require an API key.
The Laboratories contact section uses the same office and factory map links, and the Billing contact section uses the same US contact map link, styled within each company's existing contact layout.
Footer navigation links directly to every company page using the canonical company registry, rather than routing visitors through an “Our Companies” directory link.

### Shared site mode

The Goodman Group header is the sole light/dark control. Its `goodman-group-theme` preference governs the Group and all five bespoke company pages; company pages contain no theme buttons and ignore historical company preferences. Missing, malformed, or unreadable preferences default to the device preference (dark fallback only if media API fails). The document root retains the current choice through client navigation when storage is unavailable; without JavaScript the site uses dark.

`layout.tsx` applies the shared preference before hydration. The nonvisual `CompanyThemeSync` preserves each company's scoped `light-dark()` palette and browser theme colors on route entry and metadata replacement. Company routes remain server-rendered and retain their distinct visual identities: Wal Green's ivory/green and green-charcoal, Geron's lavender-white and deep violet, Laboratories' warm ivory and graphite/crimson, Billing's paper-green and forest tones, and Medical Equipment's pearl/slate and ink-slate/cool-blue palettes.

Company tokens continue to theme the shared Group frame. Original company logos retain their white brand plates, contact actions retain dedicated contrast tokens, and pointer-glow and reduced-motion behavior are unchanged.



### Homepage enquiries

The enquiry section sits after “04 / Remember” and before the footer. A split desktop layout pairs introductory copy and “We’ll respond within 24 hours” with a compact form; mobile stacks the content. The response promise covers elapsed hours, including weekends and holidays, and requires an accountable receiving team.

The form collects full name, email, optional organisation, company of interest, enquiry type, message, and optional phone. Company and enquiry selectors use accessible custom controls. The phone field includes a searchable country and dialling-code picker, with no inferred country default. Existing company records supply company options, including a Group / Not sure option.
Form popovers opt out of Lenis interception with `data-lenis-prevent` and use `overscroll-behavior: contain`. Wheel and touch scrolling remain native inside each dropdown, including at list boundaries, without scrolling the underlying page or dismissing the picker.

The interface has no dedicated privacy or security panels, marketing opt-in, attachments, or visible CAPTCHA. Required-field feedback, sending status, and delivery errors remain visible. Failed submissions preserve entered values; confirmation appears only after the email provider accepts delivery. Hidden spam protection and server-side validation remain mandatory. Any legally required disclosure must be settled before public launch.

Submission uses `POST /api/enquiries`, Resend email delivery, and an atomic Upstash Redis limit of five valid submission attempts per network per ten minutes. The endpoint checks origin, bounds request bodies to 16 KiB, validates company/enquiry choices against the shared options, and normalizes optional phone numbers to E.164. Redis keys hash the client IP; the application does not persist enquiry content. Email-provider and receiving-inbox retention must be set by the operator.

Configure these server-only deployment variables:

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Resend credential with email-send permission. |
| `ENQUIRY_FROM_EMAIL` | Sender address on a Resend-verified domain. |
| `ENQUIRY_TO_EMAIL` | Owned inbox whose team honours the 24-hour response promise. |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis HTTPS REST endpoint. |
| `UPSTASH_REDIS_REST_TOKEN` | Redis credential permitting the limiter's EVAL/INCR/EXPIRE/TTL commands. |
| `ENQUIRY_TRUST_PROXY` | Set to `true` only on non-Vercel deployments behind a trusted proxy that overwrites `x-forwarded-for` and prevents direct access to the application. Vercel supplies `VERCEL=1` automatically. |

The proxy must preserve the public request origin so it matches the browser's Origin header. Missing delivery/limiter configuration or a missing trusted client IP returns a user-friendly unavailable response, never a success. Before launch, configure a verified sender and recipient, send an actual enquiry through the deployed form, confirm inbox receipt and Reply-To, and assign weekend/holiday coverage. Provider acceptance confirms handoff, not final inbox delivery.

## Context and Problem

The current experience reduces the organization to four sector choices: Pharmaceuticals, Medical Equipment, Automotive, and Real Estate. That model hides an important organizational reality. The pharmaceutical and healthcare portfolio alone includes several distinct entities, including Goodman Laboratories and Geron Pharma. Wal Green Chemicals sits under Chemicals, not Pharmaceuticals. Goodman Medical Equipment Trading is another distinct operating company, alongside the Automotive and Real Estate business areas.

Some companies currently appear only as logos in an “Our Partners” strip or as long content blocks on the About page. This creates several problems:

- Visitors cannot understand which organizations are subsidiaries, associates, joint ventures, or external partners.
- Important company names are hidden behind broad sectors.
- Individual companies have no stable destination for leadership, capabilities, compliance information, documents, or contact details.
- Search engines cannot build a clear relationship between Goodman Group and its operating entities.
- Adding a new company requires another one-off section instead of a repeatable content model.

The redesign must correct this information gap rather than simply reskinning the existing sector buttons.

## Decision Drivers

The design and architecture must serve several audiences with different information needs:

- Government and private hospital procurement teams
- National distributors and commercial partners
- International partners in current or prospective markets
- Regulators and institutional stakeholders
- Prospective employees, press, and the general public

These users need a combination of group-level confidence and company-level specificity. They should be able to answer, without contacting Goodman first:

1. What is Goodman Group?
2. Which companies belong to it?
3. What does each company do?
4. Where does each company operate?
5. What credentials and capabilities support its business operations?
6. Who should be contacted for a specific need?

## Core Architecture Decision

The site will use a **parent holding-company architecture with an ungrouped company portfolio** and a **bespoke page per company** rule.

- The parent site communicates holding identity, governance, scale, geographic reach, and global stewardship.
- The company portfolio is presented directly as an ungrouped index of distinct operating entities, without sector grouping or category archetypes.
- Every company owns its information hierarchy, composition, typography, palette, media, interactions, and motion. Business category is descriptive content only and MUST NOT select a component, layout, theme, or module set.

The portfolio structure is:

```text
Goodman Group
├── Goodman Laboratories (/companies/goodman-laboratories)
├── Geron Pharma (/companies/geron-pharma)
├── Goodman Medical Equipment Trading (/companies/goodman-medical-equipment)
└── Wal Green Chemicals (/companies/wal-green-chemicals)
```

This flat canonical company structure defines portfolio relationships throughout the site.
## Information Architecture

The recommended primary navigation is:

```text
Home
About the Group
Our Companies
Our Presence
News
Careers
Contact
```

“Our Companies” is a top-level destination, not a subsection of About. The company area contains the direct portfolio index and canonical company routes:

```text
/companies
/companies/goodman-laboratories
/companies/geron-pharma
/companies/goodman-medical-equipment
/companies/wal-green-chemicals
```

Every company remains visible in semantic page content, reachable through a normal link, and addressable through a permanent URL. No sector tabs, sector pages, or archetype-based grouping are used.

The homepage includes an unnumbered “Who we serve” client interlude between “02 / Explore” and “03 / Expand”. Four non-interactive, icon-led glass tiles present government hospitals, private hospitals, retailers, and national distributors from `goodmanGroup.customerTypes`. The grid uses four columns at 1100px and above, two at 600–1099px, and one below 600px, with shared dark/light theme tokens and the existing reduced-motion-aware reveal system. Chapter numbering, primary navigation, and the Procurement destination remain unchanged.

## Portfolio Hub

The portfolio hub will provide a direct, complete view of the Group's companies. It should include:

- A concise explanation of the holding structure
- An ungrouped, direct presentation of every canonical operating company
- A company entry for every entity with normal, direct links
- A clear distinction between operating companies and strategic partners
- Links to stable company pages and, where relevant, official external websites

Each company entry presents the company logo, display name, legal or relationship label, descriptive business summary, primary locations, and a direct link. Rather than forcing entities into a uniform card grid, directory entries are individually composed rows or panels reflecting each entity's brand identity while remaining equally discoverable, semantic, and keyboard accessible. Visitors must never have to manipulate an animation to discover a company.
## Bespoke Company Pages

Rather than using a shared profile template or generic shell, each operating company has a dedicated, bespoke page. Every company owns its information hierarchy, composition, typography, palette, media, interactions, and motion. Business category is descriptive content only and MUST NOT select a component, layout, theme, or module set.

Operating companies retain only a minimal shared Goodman Group frame (`CompanyGroupFrame`): an accessible skip link, compact Group return/navigation treatment, relationship disclosure (`A Goodman Group company`), `<main id="main-content" tabIndex={-1}>`, and a compact Group footer/return path. The frame must not supply content sections, grids, colors, typography, motion, or company-page layout.

### Company-Owned Direction

Each page is designed around verified source records and authentic brand identity:

1. **Goodman Laboratories:** A warm ivory, graphite, and muted-crimson pharmaceutical identity derived from `GoodmanLabLogo.png`. Its bespoke composition follows Goodman Billing’s restrained design language: compact editorial headings, generous whitespace, thin rules, soft surfaces, selective dark panels, and useful native disclosures. Leads with purpose and manufacturing capability, followed by products, management systems, leadership, community responsibility, and direct contact.
2. **Geron Pharma:** A purple, circular healthcare-network composition derived from `geronlogo.png`—deep violet field, round stages, bold condensed display treatment, and decorative orbit/radial geometry that simplifies under reduced motion.
3. **Goodman Medical Equipment Trading:** A pearl, slate, and muted-blue healthcare-supply identity derived from `GG3.png`. Follows Billing and Laboratories’ calm operational design language: spacious compact headings, soft surfaces, thin rules, selective dark panels, numbered supply detail, native disclosures, and restrained CSS micro-interactions. UAE/Pakistan operations remain distinct from future target markets.
4. **Wal Green Chemicals:** An ivory, charcoal, and restrained green composition derived from `walgreenLogo.png`—generous whitespace, soft outlined regions, flowing line work echoing the logo swoosh, and a clean sans system centered on the script wordmark. Green is brand visual identity, not a sustainability claim.

### Common Standards Across Bespoke Pages

While visually and structurally bespoke, every company page adheres to common standards:
- Derives all factual assertions strictly from verified canonical company data; no invented certifications, facilities, or claims.
- Retains permanent `/companies/[slug]` route and unique SEO metadata.
- Complies with WCAG 2.2 AA accessibility, skip navigation, and keyboard operability.
- Strictly respects `prefers-reduced-motion` by disabling decorative transforms and ambient motion while preserving document order and readability.
- Follows single motion ownership rules (GSAP, Motion, CSS) with zero horizontal overflow at 320px.
## Parent Homepage Narrative

The parent homepage must explain the Group before promoting any one subsidiary. It will behave as a sequence of connected visual chapters rather than a stack of ordinary corporate sections:

1. **Arrival — the Group proposition:** an immediate, full-viewport statement with kinetic type, atmospheric light, and a living portfolio motif. The animation establishes energy quickly without delaying access to navigation or the primary call to action.
2. **Reveal — the company constellation:** the Group mark or central visual system expands into named companies. Scroll progress reveals parent/child relationships while semantic links remain directly usable.
3. **Explore — direct company discovery:** introduces the four canonical companies directly from canonical data without category headings or sector-based grouping, providing direct routes to each bespoke company page.
4. **Measure — scale:** large luminous numbers, spatial transitions, and supporting labels communicate dated facts about people, companies, facilities, and markets.
5. **Expand — geographic momentum:** a dark, dimensional map traces operations, partnerships, agreements, and planned markets using visibly different states.
6. **Remember — heritage and leadership:** a scroll-led timeline moves from the family-business origin through key company milestones and the current generation of leadership.
7. **Advance — current activity:** selected milestones, launches, partnerships, or investments appear as a dynamic editorial feed.
8. **Connect — audience routing:** the final chapter resolves into clear pathways for partnerships, procurement, careers, press, and general contact.

The homepage must not describe the entire holding company as a pharmaceutical manufacturer. Healthcare can remain the Group's heritage and strongest proof point without misrepresenting Medical Equipment, Chemicals, Automotive, or Real Estate.

## Brand Architecture

The chosen model is an **endorsed portfolio**, positioned between two rejected extremes:
- A fully monolithic identity would erase valuable company names and operating credibility.
- Completely independent microsites would fragment the Group story, duplicate maintenance, and obscure ownership.

Goodman Group owns the global navigation, parent site design system, accessibility behavior, and the minimal Group frame (`CompanyGroupFrame`) enclosing bespoke company pages. Each operating company retains:

- Complete ownership of its page structure, palette, typography, visual rhythm, and media
- Its logo, legal name, and authentic brand identity
- An explicit Group relationship disclosure (`A Goodman Group company`)
- Its verified leadership, capabilities, locations, and direct contact route

## Design Philosophy: Luminous Momentum

Luminous Momentum presents Goodman Group as an active network of companies moving into the future. It intentionally rejects the visual language of traditional institutional websites: beige editorial restraint, conservative serif-led layouts, static centered sections, repetitive white cards, and minimal motion are not the desired expression.

The experience should feel engineered, fluid, premium, and alive. It borrows the confidence and production quality of modern SaaS and technology marketing sites—glassmorphism, depth, blur, light, responsive motion, and concise oversized copy—without pretending that Goodman is a software company. The visual language communicates modern leadership; the content continues to communicate real operating businesses.

The name expresses two qualities:

- **Luminous:** transparent layers, illuminated edges, optimism, clarity, discovery, and the sense that the portfolio is being revealed through light.
- **Momentum:** business growth, new entities, geographic expansion, generational leadership, and continuous forward movement through the page.

Six principles govern the design:

1. **Presentation is part of credibility.** Goodman should look as ambitious and contemporary as it claims to be. High production value is a strategic signal, not decoration.
2. **The portfolio is a living system.** Companies should appear as connected but independent nodes, not a flat logo strip or four generic sector buttons.
3. **Depth creates hierarchy.** Glass, blur, scale, light, and layering separate parent, company, and evidence without relying on boxed layouts.
4. **Scrolling directs the story.** Each scroll chapter intentionally reveals a relationship, milestone, capability, or change in scale. Motion supplies pacing and continuity.
5. **Proof remains sharp.** Futuristic presentation must never blur legal names, certifications, locations, market status, documents, or contact routes.
6. **Spectacle remains usable.** The default experience can be immersive, but it must retain semantic structure, reduced-motion behavior, readable contrast, natural input, and a complete mobile adaptation.

The target balance is approximately **70% immersive modern presentation, 20% institutional clarity, and 10% human warmth**. This is deliberately more expressive than the earlier Grounded Momentum direction.

## Visual Language

### Typography

The typography will be modern, sans-led, oversized, and strongly contrasted. The current Poppins usage is too generic, while an editorial-serif system would move the experience back toward the traditional character this direction rejects.

The preferred approach is one high-quality variable grotesk for display and interface work, optionally paired with a neutral text sans. Candidates include Geist, General Sans, Manrope, or a licensed contemporary grotesk with wide and condensed capabilities. Headlines may use very large responsive sizing, tight tracking, short line lengths, selective outlines, gradient masks, or restrained variable-font animation. Body copy must remain calm and highly legible. Long legal company names, numeric data, uppercase labels, and small mobile screens are mandatory type tests.

### Color

The established Goodman blue, currently represented by `#174a87`, will remain the recognizable brand source but will expand into a deeper luminous spectrum. The preferred foundation is dark rather than cream or conventional white:

- Near-black navy and midnight blue for immersive canvases
- Goodman blue as the central brand wavelength
- Electric cyan and the existing green (`#5fbf92`) for light, focus, and growth
- Soft blue-violet only where it enriches atmospheric gradients without making the brand feel like a generic crypto product
- Clean white and cool gray for readable type
- Subsidiary colors as localized glows, edge lights, and data accents

Gradients should behave like environmental light rather than rainbow fills applied to text indiscriminately. Bright color must be concentrated around important moments so the page has rhythm and dark areas can breathe.

### Glass, Blur, and Glow

Glassmorphism is a primary material in the system, but it must have rules. Glass surfaces should use translucent dark fills, backdrop blur, one-pixel light borders, subtle inner highlights, controlled shadow, and enough opacity to preserve contrast. They are appropriate for the floating navigation, portfolio panels, data overlays, company identity blocks, map labels, and key calls to action.

Not every surface should be glass. Repeating identical frosted cards removes depth and makes the effect look like a template. Each scene needs a clear background plane, midground content, and limited foreground glass. Glow should indicate energy, relationship, or focus; it should not surround every icon and line of text. Large animated blur filters must be avoided when they threaten frame rate.

### Imagery

Real photography and video remain central, but they will be art-directed as cinematic source material rather than placed in conventional rectangles. Priority subjects are:

- Manufacturing and quality-control environments
- Facilities, laboratories, equipment, and distribution activity
- Employees performing real work with appropriate safety practices
- Leadership interacting with teams
- Offices and operating locations
- International activity where usage rights and partner consent exist

Media may be masked, layered behind glass, revealed through scroll, treated with blue/cyan color grades, or combined with technical overlays and live typography. Short ambient video loops can establish scale and movement when they are muted, optimized, non-essential, and accompanied by a static poster. Generic medical stock imagery and synthetic “doctor with tablet” scenes should still be avoided.

The current low-resolution portraits, large raster images, duplicated logos, and animated GIFs require an asset audit. Obtain vector logo masters, define standard lockups, convert suitable photography to modern formats, and replace heavy GIFs with efficient video or purposeful static media.

### Layout and Components

The layout will use full-viewport scenes, layered composition, deliberate overlap, asymmetric grids, large changes of scale, and transitions between dense and quiet moments. Sections should feel like chapters in one continuous presentation rather than independent Bootstrap rows. Numbers can occupy the viewport as typographic events instead of small icon-stat cards.

The generic “everything in a bordered card” treatment will be removed. Where containers are necessary, they should participate in the glass-material and depth system. Some scenes should deliberately contain no card at all: type, image, light, and motion can define the composition. Documents, certifications, filters, and dense company facts may use calmer high-contrast panels so visual spectacle never compromises scanning.

## Motion and Scrolling

Scroll-based storytelling is a defining feature of the experience, not an occasional embellishment. Lenis and GSAP ScrollTrigger will coordinate a smooth visual rhythm across the parent site. The homepage may use pinned chapters, scrubbed timelines, layered parallax, mask reveals, kinetic typography, number transitions, progressive map drawing, and portfolio-node movement.

The motion system must still distinguish between three levels:

- **Ambient:** slowly shifting gradient fields, light movement, grain, or depth that makes the page feel alive without requesting attention.
- **Responsive:** hover, pointer, focus, magnetic emphasis, and glass-light reactions that support interaction.
- **Narrative:** scroll-controlled sequences that reveal portfolio structure, scale, geography, or history.

Motion must never delay navigation, trap the user, alter the meaning of browser scrolling, or require precision pointer input. Lenis must preserve anchors, keyboard use, touch, browser history, and reduced-motion preferences. GSAP components must clean up during route changes and animate transforms or opacity wherever possible.

Desktop receives the complete cinematic treatment. Mobile receives a recomposed experience—not a shrunken desktop timeline—with shorter pins, fewer simultaneous layers, simpler parallax, static alternatives for expensive effects, and native-feeling touch behavior. Reduced-motion mode removes scrubbed and parallax movement while preserving the same content order and visual hierarchy.

Custom WebGL or 3D is not required for the initial system. It should be added only if a specific portfolio visualization cannot be expressed convincingly with HTML, CSS, SVG, and GSAP. This keeps the initial experience lighter and easier to maintain.

## Content and Proof Strategy

The site should use short parent-level narrative copy and deeper company-level marketing detail and operational credentials. Claims such as “affordable access,” “life-saving products,” “nationwide,” or “global presence” should remain specific to the business information they describe.

Operational credentials should include statutory licences, certifications, product or service categories, facilities, dated milestones, named locations, and verified business contacts. Statistics must never be displayed without scope. Planned activity must not be styled as an accomplished result. Marketing copy presents owner-approved business facts directly without public document attribution, source citations, or audit caveats.
The CEO's story is a valuable differentiator, but it should support institutional trust rather than dominate every route. The homepage receives a concise leadership passage; the full origin story belongs in a dedicated history or leadership experience.

## SEO and Findability

The name “Goodman Group” competes internationally with a much larger listed property organization. Without changing the legal brand, the website should consistently use a clear geographic or industry qualifier in titles, descriptions, structured data, and explanatory copy—for example, “Goodman Group Pakistan” or “Goodman Healthcare Group,” where useful.

Every company profile requires unique metadata, canonical URLs, descriptive headings, Organization structured data where appropriate, and internal links connecting parent and company. The site should also provide a sitemap, robots configuration, Open Graph imagery, and redirects from any replaced Angular routes.

## Technical Stack and Ownership

The redesign will be implemented as a new application rather than a progressive restyling of the Angular codebase. The stack intentionally includes more than one motion tool, but each has a non-overlapping responsibility. This division is an architectural rule, not a developer preference.

### Core application

- A currently supported Next.js App Router release, rather than starting a new build on the maintenance-only Next.js 15 line
- The React version supported and selected by that Next.js release
- TypeScript in strict mode
- Server Components by default
- Narrowly scoped Client Components for animation, state, gestures, browser APIs, and interactive UI
- ESLint and consistent formatting as required checks

Page content, metadata, company records, and non-interactive layouts should remain server-rendered. Animation libraries must not cause an entire route to become a Client Component when only one scene needs browser behavior.

### Styling and visual system

- Tailwind CSS v4 for layout, responsive styling, and utilities
- Central CSS design tokens for color, typography, spacing, radius, glass opacity, blur, borders, glow, depth, easing, and duration
- CSS transitions for simple self-contained effects such as color, border, opacity, and basic hover/focus feedback
- CSS custom properties as the common bridge between Tailwind, Motion, and GSAP

Glassmorphism must be implemented as a tokenized material system rather than repeated arbitrary utility combinations. Named materials such as `glass-nav`, `glass-panel`, `glass-overlay`, and `glass-opaque` should produce predictable contrast and performance.

### Animation and interaction architecture

The selected animation stack is:

| Layer | Technology | Exclusive responsibility |
| --- | --- | --- |
| Cinematic narrative | GSAP + ScrollTrigger | Pinned chapters, scrubbed timelines, parallax, masks, SVG/map paths, kinetic type, portfolio-node sequences, and complex orchestration |
| Scroll coordination | Lenis | Smooth-scroll interpolation and synchronization with ScrollTrigger; never content animation |
| React interface motion | Motion for React | Component entry/exit, layout transitions, shared elements, state-driven animation, gestures, menus, dialogs, filters, and overlays |
| Basic feedback | CSS/Tailwind | Simple hover, focus, color, border, opacity, and short transform transitions that do not require JavaScript |

Motion is the current package previously known as Framer Motion. Use the `motion` package and React entry point:

```bash
npm install motion
```

```tsx
import { AnimatePresence, motion } from 'motion/react';
```

#### GSAP and ScrollTrigger ownership

GSAP is the cinematic director. It owns the homepage hero sequence, company constellation, direct company discovery chapter, geographic map, numerical transitions, heritage timeline, scroll pinning, and any animation that coordinates multiple elements against one timeline. Scene components should use the supported React integration and scope animations so they revert cleanly during App Router navigation.

#### Lenis ownership

Lenis owns only the feel and timing of scrolling. It must feed ScrollTrigger from the same animation frame rather than create an independent competing loop. It must preserve anchors, keyboard scrolling, browser restoration, touch input, and a native fallback. Lenis does not decide when an element appears, how a component lays out, or how React state changes.

#### Motion ownership

Motion owns animations caused by React state and layout changes. Uses include:

- Mobile navigation, sheets, dialogs, and overlays entering or leaving
- `AnimatePresence` for mounted and unmounted interface elements
- `layout` and `layoutId` for company-filter reflow and shared-element transitions
- Company panels expanding into a detail overlay where the navigation model supports it
- Accordions, disclosures, tabs, and interactive portfolio controls
- Cross-device hover, tap, focus, press, and drag gestures
- Small spring-based interface responses that do not belong to a scroll narrative
- Page or shared-element transitions only when they work reliably with the App Router and preserve navigation semantics

Motion should not be used to recreate the ScrollTrigger scenes through `useScroll`, `whileInView`, or separate scroll-linked values. Those APIs may be used only in an isolated route with no GSAP scroll ownership and after an explicit architecture review.

#### Non-competition rules

1. GSAP and Motion must never animate the same CSS property on the same DOM element.
2. A ScrollTrigger scene cannot contain independently scroll-driven Motion behavior.
3. When both systems appear in one feature, they must own different DOM nodes—for example, GSAP may move a scene wrapper while Motion handles state inside a child control.
4. Every animated component must have one declared owner: CSS, Motion, or GSAP.
5. Simple effects remain CSS; a JavaScript library is not justified for a basic color or opacity hover.
6. A shared reduced-motion setting must disable or simplify behavior consistently across Lenis, GSAP, Motion, CSS, and ambient media.
7. Transform ownership requires particular care because both libraries commonly compose translation and scale into the same `transform` value.
8. Animation code must be route- or component-loaded so the company directory does not download homepage storytelling code unnecessarily.

Recommended component boundaries include `ScrollScene` for GSAP-owned narrative chapters, `MotionDialog` for state-driven overlays, `AnimatedCompanyGrid` for Motion-owned layout reflow, and normal styled components for CSS-only feedback. `LazyMotion` or equivalent feature loading should be considered if Motion usage expands significantly.

### UI primitives and icons

- Selected shadcn/ui or Radix primitives for accessible navigation, dialogs, dropdowns, accordions, sheets, and disclosures
- Lucide React for generic interface icons
- SVG assets for Goodman Group and company marks

Only the primitives the experience needs should be added. Their default styling is not the visual system; components must adopt the Luminous Momentum tokens and interaction language.

### Media and typography delivery

- `next/image` for appropriate responsive raster images
- `next/font` for controlled, self-hosted font delivery
- Optimized WebM or MP4 for ambient motion rather than carrying large GIFs forward
- Static posters and reduced-motion alternatives for every non-essential video
- Inline or componentized SVG for maps and diagrams that require GSAP path animation

SVG logos should remain crisp and should not be routed through raster effects that weaken brand recognition. Remote image origins must be explicitly allowed rather than configured with broad patterns.

### Forms and validation

React Hook Form and Zod will be added only when a real form, field specification, submission endpoint, success state, error contract, spam protection, privacy requirement, and content owner are defined. Search boxes, contact forms, newsletter signup, careers inquiries, and partnership inquiries must not be implemented as non-functional presentation elements.

### Content layer

The content layer should represent companies as structured records rather than embedded JSX. A conceptual schema is:

```ts
type CompanyProfile = {
  slug: string;
  displayName: string;
  legalName: string;
  relationship: 'subsidiary' | 'associate' | 'joint-venture' | 'brand';
  business: string;
  summary: string;
  logo: ImageAsset;
  accent?: string;
  founded?: string;
  locations: Location[];
  leadership: Person[];
  capabilities: Capability[];
  certifications?: Document[];
  markets?: MarketPresence[];
  contacts: ContactRoute[];
};
```

The production implementation may use local typed content, MDX, or a CMS. A CMS is preferred if non-developers need to update company facts, news, leadership, documents, or market status regularly. The source of truth must support structured company content and safe content updates.

### Testing and quality tooling

- Vitest for fast unit tests
- React Testing Library for behavior-focused component tests
- Playwright for navigation, company discovery, responsive behavior, forms, reduced motion, and critical journeys
- Automated accessibility checks supplemented by keyboard and screen-reader review
- Production build, type checking, linting, and tests as continuous-integration requirements
- Performance profiling on mid-range mobile hardware, not only desktop development machines

Animation tests should verify end states and user access rather than fragile frame-by-frame implementation details. Playwright must exercise both normal and reduced-motion modes.

### Deployment

The deployment model must be chosen before implementation. A Node-compatible deployment is preferred because it supports the complete Next.js feature set, runtime image optimization, metadata behavior, and future server functionality. A static export is possible for mostly static content but restricts server capabilities and changes image-handling requirements. Hosting must also support long-lived caching for versioned media and appropriate security headers.

## Accessibility and Performance Requirements

The design must meet WCAG 2.2 AA as a minimum target. Required behaviors include keyboard-operable navigation, visible focus, semantic headings, meaningful alt text, sufficient color contrast through translucent surfaces, reduced-motion support, labelled forms, usable zoom, and no information conveyed through color or animation alone.

Performance is part of the premium experience. The implementation should define Core Web Vitals targets, reserve media dimensions to prevent layout shift, load only the animation code required by each route, and test on mid-range mobile hardware and constrained networks. Ambient video must be muted, compressed, non-essential, responsive to reduced-motion and data-saving preferences where practical, and supported by an effective poster image. Blur radius, layer count, pinned duration, and simultaneous animations require explicit performance testing rather than visual inspection on a high-end development machine alone.

## Alternatives Rejected

### Preserve the flat sector-button homepage

Rejected because it hides individual companies, obscures ownership, and does not scale.

### Present Goodman as one pharmaceutical organization

Rejected because it misrepresents the holding structure and non-pharmaceutical businesses.

### Force every subsidiary into one blue-and-green identity

Rejected because it removes established company recognition and makes distinct legal entities appear to be product lines.

### Build unrelated standalone microsites only

Rejected as the default because it fragments navigation, weakens the Group narrative, duplicates design and maintenance, and makes the portfolio difficult to understand. External company sites may coexist with a canonical Group profile.

### Use a conservative traditional-corporate visual language

Rejected because restrained white pages, serif-led heritage styling, static grids, and minimal motion would not express the desired ambition or differentiate Goodman from ordinary institutional websites.

### Copy a generic SaaS template literally

Rejected because dashboard mockups, meaningless gradient blobs, invented software metaphors, and interchangeable feature cards would misrepresent Goodman. The project adopts the production quality, depth, motion, and visual confidence of modern SaaS marketing—not its product vocabulary.

### Allow spectacle to replace structure

Rejected because an award-oriented presentation still has to expose every company, claim, document, and contact route. The cinematic layer enhances the structured parent/child information architecture; it does not substitute for it.

## Risks and Mitigations

- **Portfolio ownership:** maintain the entity and relationship register alongside the site content.
- **Inconsistent subsidiary branding:** obtain source logos and define endorsement and accent rules.
- **Insufficient photography:** budget and schedule a real photo shoot before locking image-dependent layouts.
- **Inflated expansion claims:** add explicit market-status labels and supporting context.
- **Template rigidity:** provide bespoke company pages where each entity owns its layout and hierarchy rather than forcing all businesses into one generic profile template.
- **Animation overreach:** define a motion hierarchy, storyboard every pinned sequence, and reject effects that communicate no information or emotional beat.
- **Animation-library conflict:** enforce declared CSS/Motion/GSAP ownership at component boundaries and prohibit two systems from writing the same property on the same element.
- **Glass readability:** test real content over every translucent state and supply opaque fallbacks where contrast is unreliable.
- **Performance degradation:** establish device-tier tests, cap simultaneous effects, and simplify scenes responsively.
- **Trend imitation:** maintain Goodman-specific imagery, portfolio relationships, facts, and company identities so the result cannot be mistaken for a purchased SaaS template.
- **Content decay:** assign an owner to every company record.
- **Name confusion in search:** use clear geographic/industry qualifiers and structured data consistently.

## Delivery Sequence

1. Establish the legal entity and relationship register.
2. Complete a content, document, and asset inventory.
3. Define navigation, routes, and company-profile schema.
4. Define parent and subsidiary brand rules and obtain vector assets.
5. Commission photography and rewrite priority content.
6. Produce low-fidelity homepage, portfolio-hub, and company-profile wireframes.
7. Validate the structure with representatives of procurement, partners, leadership, and recruitment.
8. Create the luminous visual system, glass-material rules, responsive scenes, and static fallback states.
9. Build motion studies for the hero, company constellation, direct company discovery, map, and heritage timeline; set their pacing as one connected story.
10. Implement the Next.js application and structured content layer.
11. Migrate company content, metadata, documents, and redirects.
12. Test accessibility, performance, analytics, forms, devices, and browsers before launch.

## Acceptance Criteria

The decision is successfully implemented when:

- “Our Companies” is available from primary navigation.
- Every entity appears exactly once in the canonical portfolio data and has a stable profile URL.
- Portfolio browsing presents all canonical companies directly without sector grouping or category archetypes.
- Every company page identifies the legal company, Group relationship, business capability, location, and contact route.
- Subsidiary logos remain recognizable within a consistent parent framework.
- Group and market statistics are scoped and dated.
- Active, partner, agreement-stage, and planned markets are visually and textually distinct.
- The homepage explains the Group and routes visitors before focusing on any one company.
- The homepage reads as a connected cinematic presentation rather than a stack of conventional corporate sections.
- Dark atmospheric canvases, glass surfaces, blur, and glow follow a repeatable tokenized material system rather than one-off effects.
- The company constellation and company discovery chapter communicate real portfolio relationships and link directly to every entity.
- Scroll storytelling covers portfolio, scale, geography, and heritage without blocking navigation or hiding content.
- GSAP exclusively owns cinematic scroll scenes, Motion exclusively owns React state/layout transitions, Lenis exclusively coordinates scrolling, and simple feedback remains CSS.
- No element or animated property is controlled by more than one animation system.
- Subsidiary pages feature bespoke art direction and layout while remaining grounded by the minimal Goodman Group frame.
- Core content remains usable without JavaScript animation or smooth scrolling.
- Reduced-motion, keyboard, screen-reader, responsive, and contrast requirements pass testing.
- Performance budgets and agreed Core Web Vitals targets pass on production-like infrastructure.
- Content owners can update company facts within their verified records and bespoke company page implementations.

## Reference Pattern

Tata Group remains a useful **structural** reference because it presents a parent narrative while organizing independently operated companies across business verticals. It is not the visual target. The visual benchmark should be assembled separately from high-production technology and award-presentation experiences, evaluated for composition, motion, material, navigation, and performance rather than copied as a single reference site. Meta and Goldman Sachs are not direct structural analogues to this multi-company portfolio.

- [Tata Group company index](https://www.tata.com/investors/companies)
- [Goldman Sachs businesses](https://www.goldmansachs.com/what-we-do/our-businesses)
- [DRAP drug manufacturing licensing](https://www.dra.gov.pk/licensing-and-inspections/drug-manufacturing-license/)
- [Next.js deployment options](https://nextjs.org/docs/app/getting-started/deploying)
- [Lenis documentation](https://github.com/darkroomengineering/lenis)
- [Motion for React](https://motion.dev/docs/react)
- [Motion layout animations](https://motion.dev/docs/react-layout-animations)

## Goodman Billing Page

- Goodman Billing uses a bespoke sage-and-deep-green card system inside the shared Goodman Group frame.
- The page presents 18 services with their complete benefits, 40 specialty descriptions, 12 software integrations, and three attributed testimonials.
- Service and specialty directories search names and descriptive content independently, announce result counts, and provide clear/reset actions for empty results.
- Full directory content renders before client hydration; search is a small client boundary, while the route remains a server component.
- Revenue-cycle workflow uses a numbered vertical rail with downward arrows, a desktop split layout, and a stacked mobile layout. All six stages and their descriptions remain visible without interaction.
- Supporting operational tasks remain permanently visible in separate Front-Desk and Billing & RCM groups; task columns stack on narrow screens. The section adds no client-side state or animation.
- Contact actions use the company email and retain the US address and leadership details. No unconnected inquiry form or empty social links are rendered.
- Layouts collapse to one-column directory cards on narrow screens; reduced motion disables card movement.
- Service and specialty cards use the existing Goodman Billing site's artwork, copied unchanged into `public/assets/billing/services/` and `public/assets/billing/specialties/`. Explicit record mappings preserve the existing site's asset reuse: 14 service SVGs cover 18 cards, and 40 specialty PNGs cover 40 cards.
- Service icons display at 52px in deep-green tiles using the existing site's white CSS filter. Specialty icons display at 60px in white circles using its red CSS filter. `object-fit: contain` preserves aspect ratios; unoptimized delivery preserves the original image files without raster tracing or lossy recompression.
- Card illustrations are decorative alongside the visible titles, reserve their dimensions, and replace the redundant category labels and noninteractive arrows.
- Benefit cards use the original site's Bootstrap Icons 1.13.1 shapes (`clipboard-check`, `speedometer2`, and `shield-lock`) as unchanged local SVGs in `public/assets/billing/benefits/`, with the upstream MIT license retained. Decorative 32px CSS masks inherit deep green within 64px sage tiles, replacing benefit numbering without loading an icon font.
- Software cards use all 12 original integration logos, copied unchanged into `public/assets/billing/platforms/`. Typed records retain each logo's source dimensions; white cards preserve brand colors, and centered 88px logo areas contain artwork within 180px by 64px without enlarging small raster originals. Visible platform names and descriptions remain; images have empty alternative text to avoid repeating those names and use unoptimized local delivery.
- Billing micro-interactions remain CSS-only: action lift/press feedback and arrow movement, animated navigation underlines, search-focus icon emphasis, subtle directory/benefit/platform/workflow/testimonial hover accents, and a short fade/translation for newly mounted directory cards and empty results. Hover motion is restricted to fine pointers; reduced motion removes entry animations, transitions, and decorative transforms without changing search behavior.
- Billing search focus uses a green outline around the complete rounded field, including the icon. The inner input outline is replaced by this container-level focus indicator for both service and specialty searches.

## Goodman Laboratories — October 2026 redesign

- Rebuilt the page around calm operational competence rather than a uniform corporate-profile card grid. Billing supplies the design philosophy, not its green palette, service copy, or revenue-cycle content.
- Warm ivory and clay backgrounds support graphite text and a muted-crimson accent. The split hero combines company purpose and direct actions with the authentic logo, production capabilities, and 2008 founding. The shared Group frame adopts the company palette.
- Manufacturing uses a numbered production-section list and a sticky desktop introduction; numbering identifies production sections, not a sequential manufacturing process. Departments use a bordered matrix. National distribution and international activity remain distinct, preserving each market’s specific agreement or supply status.
- Product categories remain native, independently expandable disclosures with full formulations, strengths, packs, and registration details. Governance, organizational roles, and shared certification registration details also use native disclosures; individual ISO certificates remain immediately visible.
- Leadership, growth, values, mission, vision, facilities, therapeutic areas, customer segments, and community initiatives retain their typed content. Contact provides working email and telephone links plus office and factory addresses; the company website link is omitted from the closing section.
- Removed pointer-glow wrappers and animated conic borders. The route remains a server component with CSS-only interaction feedback, visible keyboard focus, reduced-motion support, and stacked small-screen layouts.
- Therapeutic areas has a dedicated clay-tinted editorial panel: a prominent heading, introductory copy, a data-derived portfolio count, and a two-column numbered directory with fine horizontal rules. The introduction stacks above the directory on tablets; the directory becomes one column on small phones. All 21 typed therapeutic areas retain their original names and remain non-interactive.
- Laboratories micro-interactions use CSS-only transform and opacity motion: primary actions lift and advance their arrows, navigation underlines grow on hover or keyboard focus, disclosure indicators collapse from plus to minus, and expanded content enters with a short fade/translation. Certification cards and selected numbered details receive small hover accents. Fine-pointer hover effects do not run on touch devices; reduced motion disables animations, transitions, and decorative movement while preserving disclosure state and keyboard focus.

## Goodman Medical Equipment Trading — October 2026 redesign

- Rebuilt the company route and stylesheet, replacing blueprint backgrounds and large circular logo-stage geometry with a restrained pearl/slate/muted-blue composition. The authentic logo remains inside the dark hero summary panel; direct actions lead to solutions and supplier contact.
- Product categories, service strengths, customer commitments, mission, vision, values, founders, board membership, governance functions, organizational roles, and contact channels retain their company-specific typed records. Company messaging is integrated into the narrative rather than presented as a separate messaging rail.
- A five-stage numbered supply-chain list provides immediately visible operational detail. The seven-stage instrument workflow remains an independent native disclosure explicitly naming STERIS Offsite Reprocessing Center (ORC); it does not represent Goodman-owned facilities.
- Dubai and Islamabad have separate presence panels. Current operating-market descriptions remain intact, while future targets use dashed surfaces and explicit target-market labels.
- CSS-only micro-interactions include action lift/press feedback, arrow movement, navigation underlines, product and numbered-detail hover accents, and disclosure indicator/content animation. Hover movement is restricted to fine pointers; reduced motion removes decorative transforms, transitions, and animations.
- The page remains a server component. Responsive stacks preserve all content at 320px, and keyboard focus remains visible. Muted text was darkened after the accessibility check identified insufficient contrast on tinted surfaces.
- Supply-chain connectors reserve a minimum 44px gap after each numbered circle. Arrows are centered in the available gap using the responsive marker-size token, rather than positioned at a fixed bottom offset; circles cannot flex-shrink. The final stage reserves no connector gap.
- The closing equipment contact section omits the Website label and company-website link; office, telephone, email, Group routing, and back-to-top links remain.
- Both modes use scoped `light-dark()` custom properties, including an ink-slate `#101c26` dark canvas with layered blue-gray surfaces and high-contrast visible focus indicators. Mode selection now follows the sole Group preference described under Shared site mode; the company header contains no individual control.
