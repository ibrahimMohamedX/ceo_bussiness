# PROJEX Component System
Version: 1.0

---

# Purpose

This document defines every reusable UI component used throughout the PROJEX website.

Every component must follow the same engineering design language.

Consistency is mandatory.

---

# Design Philosophy

Components should feel:

• Premium
• Minimal
• Precise
• Intelligent
• Spacious
• Modern
• Engineering-first

Avoid visual noise.

Every component must have one clear purpose.

---

# Global Rules

Every component should share:

• Same border style
• Same border radius family
• Same spacing scale
• Same animation language
• Same color palette
• Same typography system

Never create a component with a different personality.

---

# Navbar

Height

88px

Desktop Layout

-------------------------------------------------

Logo

Navigation

CTA Button

-------------------------------------------------

Behavior

Transparent at page top.

After scrolling:

Glass background appears.

Background blur increases.

Border fades in.

Never use a solid opaque navbar.

Desktop only:

Smooth underline animation for active links.

Mobile:

Full-screen overlay menu.

No slide-from-left drawer.

Use a premium centered overlay.

---

# Buttons

## Primary Button

Purpose

Main actions.

Appearance

Filled.

Engineering Cyan gradient.

Rounded 16px.

Medium shadow.

Hover

Lift 2px.

Brightness +8%.

Glow increases slightly.

Active

Returns smoothly.

Never bounce.

---

## Secondary Button

Transparent.

Glass surface.

Thin border.

Hover

Border glows.

Background becomes slightly brighter.

No scale.

---

## Ghost Button

Transparent.

No background.

Text only.

Underline appears on hover.

---

# Cards

Purpose

Reusable information containers.

Radius

24px.

Padding

32px.

Background

Glass Surface.

Border

1px subtle border.

Hover

TranslateY(-6px).

Shadow increases.

Glow increases slightly.

Never rotate.

---

# Service Cards

Grid

3 columns desktop.

2 tablet.

1 mobile.

Content

Icon

↓

Title

↓

Description

↓

Technology Tags

↓

Learn More Button

Hover

Card lifts.

Icon rotates 4°.

Border becomes cyan.

---

# Technology Tags

Rounded pill.

Height

36px.

Glass background.

Subtle border.

No glow.

---

# Feature Cards

Minimal.

Large icon.

Short title.

One sentence only.

No paragraphs.

---

# Statistics Cards

Large number.

Small description.

Animated counter.

Fade-in on scroll.

No charts.

---

# Timeline

Vertical on desktop.

Stacked on mobile.

Each item contains

Date

↓

Title

↓

Description

↓

Technology

Connected by a thin glowing line.

---

# Process Section

Five Steps

Discover

↓

Plan

↓

Build

↓

Test

↓

Deploy

Each step connected visually.

Use minimal line animations.

---

# Tech Stack

Grid layout.

Logo

↓

Technology Name

↓

Category

Hover

Small lift.

Border glow.

No logo rotation.

---

# Project Cards

Large thumbnail.

Glass overlay.

Project title.

Technology chips.

Short summary.

Hover

Image zoom 1.03.

Overlay darkens slightly.

Button fades in.

---

# Testimonial Cards

Large quote.

Client name.

Company.

Optional avatar.

Minimal style.

No speech bubbles.

---

# Contact Form

Fields

Name

Email

Company

Project Type

Budget

Message

Inputs

Glass background.

Focus

Border glows cyan.

Placeholder fades slightly.

Button

Primary style.

---

# Footer

Four Columns

Company

Services

Resources

Contact

Bottom Row

Copyright

Social Links

Minimal divider.

No heavy decorations.

---

# Icons

Use one icon family only.

Outline style.

2px stroke.

No colorful icons.

No mixed styles.

---

# Dividers

Very subtle.

Opacity

8%.

Use generous spacing.

---

# Empty States

Simple illustration.

One sentence.

One action button.

No large graphics.

---

# Loading States

Skeleton UI.

Soft shimmer.

No spinning loaders unless absolutely necessary.

---

# Error States

Minimal.

Red border.

Short message.

Recovery button.

No alert popups.

---

# Responsive Rules

Desktop

1440px+

Large spacing.

Tablet

768px–1439px

Reduce spacing proportionally.

Mobile

<768px

Single column.

Buttons become full width where appropriate.

Navigation becomes overlay.

Cards stack vertically.

---

# Accessibility

Minimum touch target

48px.

Focus states visible.

High color contrast.

Keyboard navigation supported.

ARIA labels where applicable.

---

# Do

✓ Keep components reusable.

✓ Maintain visual consistency.

✓ Respect spacing.

✓ Keep interactions subtle.

✓ Prioritize readability.

---

# Don't

✗ Don't redesign components per page.

✗ Don't mix border styles.

✗ Don't overuse glow.

✗ Don't create decorative UI.

✗ Don't use multiple icon libraries.

---

# Acceptance Criteria

✓ Every component feels part of one unified design system.

✓ Reusable across all pages.

✓ Responsive by default.

✓ Accessible.

✓ Premium engineering aesthetic preserved.

✓ Consistent interaction behavior across the website.