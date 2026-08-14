# PROJEX CSS Variables Specification
Version: 1.0

---

# Purpose

This document defines the global CSS Custom Properties (CSS Variables) used throughout the PROJEX Design System.

CSS Variables act as the runtime implementation of the Design Tokens.

Every visual value should reference a CSS Variable whenever possible.

Never hardcode colors, spacing, shadows or effects inside components.

---

# Philosophy

Single Source of Truth

↓

Design Tokens

↓

CSS Variables

↓

Tailwind Theme

↓

Components

↓

Pages

This guarantees consistency across the entire project.

---

# Root Variables

All variables must be declared inside:

:root

Dark mode is the default theme.

Future themes should override only variable values, never component styles.

---

# Color Variables

Primary

--color-primary-50

...

--color-primary-950

Secondary

--color-secondary-50

...

--color-secondary-950

Neutral

--color-neutral-0

...

--color-neutral-950

Semantic

--color-success

--color-warning

--color-error

--color-info

Surface

--color-background

--color-surface

--color-surface-elevated

--color-glass

--color-overlay

Text

--color-text-primary

--color-text-secondary

--color-text-muted

Border

--color-border

--color-border-muted

--color-border-strong

--color-border-focus

---

# Typography Variables

--font-primary

--font-mono

--font-display

Font Sizes

--text-display

--text-h1

--text-h2

--text-h3

--text-h4

--text-body

--text-small

--text-caption

Font Weights

--font-regular

--font-medium

--font-semibold

--font-bold

Line Heights

--leading-tight

--leading-normal

--leading-relaxed

Letter Spacing

--tracking-tight

--tracking-normal

--tracking-wide

---

# Spacing Variables

--space-0

--space-4

--space-8

--space-12

--space-16

--space-24

--space-32

--space-40

--space-48

--space-64

--space-80

--space-96

--space-120

--space-140

--space-180

---

# Radius Variables

--radius-none

--radius-sm

--radius-md

--radius-lg

--radius-xl

--radius-2xl

--radius-full

---

# Border Variables

--border-thin

--border-default

--border-strong

---

# Shadow Variables

--shadow-soft

--shadow-medium

--shadow-large

--shadow-glow-sm

--shadow-glow-md

--shadow-glow-lg

--shadow-hero

---

# Blur Variables

--blur-glass

--blur-navbar

--blur-overlay

--blur-modal

--blur-hero

---

# Opacity Variables

--opacity-disabled

--opacity-muted

--opacity-glass

--opacity-overlay

--opacity-particles

---

# Motion Variables

Duration

--duration-fast

--duration-normal

--duration-slow

--duration-hero

Easing

--ease-default

--ease-out

--ease-in-out

--ease-linear

---

# Layer Variables

--z-background

--z-grid

--z-effects

--z-particles

--z-content

--z-navbar

--z-overlay

--z-modal

--z-toast

---

# Container Variables

--container-sm

--container-md

--container-lg

--container-xl

--container-hero

---

# Hero Variables

--hero-core-size

--hero-glow-size

--hero-ring-speed

--hero-network-opacity

--hero-particle-density

--hero-grid-opacity

---

# Glass Variables

--glass-opacity

--glass-border-opacity

--glass-blur

--glass-shadow

---

# Glow Variables

--glow-primary

--glow-secondary

--glow-hero

--glow-button

--glow-card

---

# Grid Variables

--grid-size

--grid-opacity

--grid-perspective

---

# Component Rules

Components must consume CSS Variables.

Never reference HEX values directly.

Never duplicate variable definitions.

All reusable components should inherit values from the root.

---

# Theme Support

Future themes should override only variable values.

Example

Dark Theme

↓

Change colors

↓

Keep components identical

This allows multiple themes without rewriting UI.

---

# Naming Convention

Always use

--category-name-value

Examples

--color-primary-500

--space-32

--radius-xl

--shadow-glow-md

Avoid ambiguous names.

Bad

--blue

--big-shadow

--main-color

---

# Performance

Variables should be declared once.

Avoid local overrides.

Use inheritance whenever possible.

---

# Accessibility

Ensure sufficient contrast.

Do not rely on opacity alone to communicate state.

Support prefers-reduced-motion where applicable.

---

# Future Expansion

This specification can later generate:

• CSS Variables

• SCSS Variables

• Tailwind Theme

• React Theme

• React Native Theme

• Flutter Theme

• Design Tokens JSON

without changing the naming structure.

---

# Acceptance Criteria

✓ Consistent naming

✓ Token-driven implementation

✓ Easy theme switching

✓ No duplicated values

✓ Production ready

End of Document