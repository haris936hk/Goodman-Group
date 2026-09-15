## Purpose

Provides a focused homepage entry point that centers the Goodman Group identity while preserving the existing portfolio visualization and its animated relationships.

## ADDED Requirements

### Requirement: Centered hero identity

The homepage hero SHALL present the circular Goodman Group mark as the visual focal point, centered within the existing hero visual system across supported viewport sizes.

#### Scenario: Desktop hero presents a centered group identity

- **WHEN** a visitor loads the homepage on a desktop viewport
- **THEN** the circular Goodman Group mark is centered in the hero visual system and is not accompanied by visible left-side hero copy

#### Scenario: Responsive hero preserves the centered focal point

- **WHEN** a visitor loads the homepage on a supported narrow viewport
- **THEN** the circular Goodman Group mark remains the centered focal point without introducing a visible left-side hero column

### Requirement: Left-side hero content is absent

The homepage hero SHALL NOT visibly display the existing left-side eyebrow, headline, supporting description, action links, or bottom-left scroll cue.

#### Scenario: Hero opens without the removed presentation content

- **WHEN** a visitor loads the homepage
- **THEN** the hero contains no visible “Health · Wellness · Progress”, “Distinct strengths.”, “Shared momentum.”, descriptive hero paragraph, hero action links, or “Scroll to explore” cue

#### Scenario: Primary page heading remains accessible

- **WHEN** an assistive technology user navigates the homepage
- **THEN** the page still exposes one meaningful primary heading even though the removed hero copy is not visibly rendered

### Requirement: Existing portfolio visual system remains available

The homepage hero SHALL continue to display the existing hero glow, outer and inner orbit rings, Healthcare, Equipment, and Chemicals sector nodes, orbit pips, circular Goodman Group mark, and system caption.

#### Scenario: Existing orbit composition is preserved

- **WHEN** a visitor loads the homepage
- **THEN** the hero shows the orbit rings, sector nodes, orbit pips, centered group mark, and the “One clear structure” caption with its supporting text

### Requirement: Existing hero motion remains intact

The homepage hero SHALL retain its existing reveal and scroll-driven orbit motion behavior, including the current reduced-motion behavior.

#### Scenario: Standard motion preference retains hero animation

- **WHEN** a visitor with standard motion preferences loads and scrolls through the hero
- **THEN** the existing hero reveal behavior and scroll-driven orbit ring motion continue to operate

#### Scenario: Reduced-motion preference remains respected

- **WHEN** a visitor has enabled reduced motion
- **THEN** the hero does not introduce new motion and retains the existing reduced-motion presentation behavior
