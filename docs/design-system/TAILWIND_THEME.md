# PROJEX Tailwind Theme Specification
Version: 1.0

---

# Purpose

This document defines how the PROJEX Design Tokens should be implemented inside Tailwind CSS.

The Tailwind theme must never introduce values that are not defined in the Design Token System.

Tailwind should reflect the Design System, not replace it.

---

# Philosophy

The Tailwind configuration should be:

• Clean

• Minimal

• Predictable

• Scalable

• Token Driven

Every color, radius, spacing and shadow should reference the Design Tokens.

Never hardcode UI values inside components.

---

# Theme Structure

theme

↓

colors

↓

fontFamily

↓

fontSize

↓

spacing

↓

borderRadius

↓

boxShadow

↓

blur

↓

animation

↓

keyframes

↓

zIndex

↓

screens

↓

container

---

# Colors

Expose only semantic colors.

Avoid using raw HEX values inside components.

Preferred Examples

bg-background

bg-surface

bg-glass

text-primary

text-secondary

text-muted

border-default

border-interactive

shadow-glow

---

# Typography

Primary Font

Geist

Fallback

Inter

Monospace

Geist Mono

---

# Font Sizes

Display

H1

H2

H3

H4

H5

Body

Small

Caption

Button

Use semantic naming.

Avoid numeric font classes inside custom components.

---

# Spacing

Spacing should map directly to the Design Tokens.

Never invent custom spacing.

Preferred

p-section

gap-content

px-container

py-section

space-stack

---

# Radius

Use semantic radius values.

Small

Medium

Large

Extra Large

Full

Avoid arbitrary values.

---

# Shadows

Supported Shadows

Soft

Medium

Large

Glow

Hero Glow

Never create custom shadows inside components.

---

# Blur

Supported Blur Levels

Glass

Overlay

Hero

Modal

Navigation

---

# Animations

Available Animation Presets

Fade

Fade Up

Fade Left

Fade Right

Float

Pulse

Rotate Slow

Rotate Reverse

Glow Pulse

Reveal

Hover Lift

Button Hover

Card Hover

Page Transition

Animations should reference Framer Motion presets whenever possible.

---

# Container

Centered

Responsive

Maximum Width

1440px

Content Width

1280px

Hero Width

1600px

---

# Breakpoints

Mobile

Tablet

Laptop

Desktop

Ultra Wide

Never create inconsistent breakpoints.

---

# Z-Index

Background

Decorations

Content

Navigation

Overlay

Modal

Toast

Tooltip

---

# Glass Utilities

Provide reusable utility classes.

Glass Card

Glass Panel

Glass Navigation

Glass Dialog

All should share the same opacity, blur and border values.

---

# Glow Utilities

Primary Glow

Secondary Glow

Hero Glow

Interactive Glow

Glow should never overpower readability.

---

# Engineering Utilities

Create reusable helper utilities.

Examples

Grid Background

Noise Overlay

Gradient Border

Section Divider

Floating Layer

Core Glow

Data Stream

Neural Line

Particle Layer

---

# Component Rules

Components should consume semantic utility classes.

Avoid repeated Tailwind utility chains.

Extract reusable patterns whenever appropriate.

---

# Performance

Avoid excessive utility nesting.

Avoid duplicate styles.

Prefer reusable abstractions.

Keep generated CSS as small as possible.

---

# Future Expansion

The Tailwind Theme should eventually be generated automatically from the Design Tokens.

Manual synchronization should be avoided.

---

# Acceptance Criteria

✓ Fully aligned with Design Tokens

✓ No hardcoded visual values

✓ Easy to maintain

✓ Consistent utility naming

✓ Scalable for future products

✓ Production ready

End of Document