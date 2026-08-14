# PROJEX Design Tokens
Version: 1.0

---

# Purpose

Design Tokens are the single source of truth for all visual decisions.

Every component, page, animation and section must reference these tokens instead of defining custom values.

Never hardcode colors, spacing, shadows or typography outside the token system.

---

# Token Categories

- Color
- Typography
- Spacing
- Radius
- Border
- Shadow
- Blur
- Opacity
- Motion
- Duration
- Easing
- Grid
- Container
- Breakpoints
- Z-Index
- Effects

---

# Color Tokens

## Primary

Primary / 50
Primary / 100
Primary / 200
Primary / 300
Primary / 400
Primary / 500 (Engineering Cyan)
Primary / 600
Primary / 700
Primary / 800
Primary / 900
Primary / 950

---

## Secondary

Secondary / 50 → 950

Main Accent

AI Purple (500)

---

## Neutral

Neutral / 0

Neutral / 50

Neutral / 100

...

Neutral / 950

---

## Semantic

Success

Warning

Error

Info

Disabled

---

## Surface

Background

Background Elevated

Glass

Card

Overlay

Modal

Navbar

Footer

---

## Border

Default

Muted

Strong

Interactive

Focus

---

## Typography Tokens

Display

H1

H2

H3

H4

H5

H6

Body Large

Body

Small

Caption

Button

Label

---

## Font Weights

Regular

Medium

SemiBold

Bold

---

## Spacing Tokens

0

4

8

12

16

24

32

40

48

64

80

96

120

140

180

---

## Radius Tokens

None

Small

Medium

Large

XL

2XL

Full

---

## Shadow Tokens

Soft

Medium

Large

Glow Small

Glow Medium

Glow Large

Hero Glow

---

## Blur Tokens

Glass

Overlay

Navbar

Modal

Hero

---

## Motion Tokens

Hover

Reveal

Fade

Float

Rotate

Pulse

Parallax

---

## Duration Tokens

Fast

Normal

Slow

Very Slow

Hero

Ambient

---

## Easing Tokens

Ease Out

Ease In Out

Linear

---

## Container Tokens

Small

Medium

Large

Wide

Hero

---

## Grid Tokens

Desktop

12 Columns

Tablet

8 Columns

Mobile

4 Columns

---

## Breakpoints

Mobile

Tablet

Laptop

Desktop

Ultra Wide

---

## Z-Index

Background

Effects

Content

Navigation

Overlay

Modal

Toast

---

# Token Rules

Never create duplicate tokens.

Never hardcode values.

Always reuse existing tokens.

Extend before replacing.

---

# Future Expansion

This document will later be converted into:

- JSON Design Tokens
- CSS Variables
- Tailwind Theme
- Figma Tokens

without changing the naming structure.

---

# Acceptance Criteria

✓ One source of truth

✓ Consistent naming

✓ Easy to scale

✓ Framework agnostic

✓ Ready for automation