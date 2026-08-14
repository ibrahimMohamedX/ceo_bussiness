# PROJEX Motion System
Version: 1.0

---

# Purpose

This document defines every motion, animation and interaction used throughout the PROJEX website.

Motion must communicate precision, engineering and intelligence.

Animation is never decorative.

Animation must always have purpose.

---

# Motion Philosophy

Every movement should feel:

• Smooth
• Precise
• Intentional
• Scientific
• Premium
• Calm

Never:

Chaotic

Fast

Bouncy

Playful

Game-like

Cartoonish

---

# Global Motion Rules

Animation should never distract from content.

Motion should support usability.

Motion should always feel lightweight.

Everything should be GPU accelerated.

Prefer:

transform

opacity

filter

Avoid:

top

left

width

height

for animations.

---

# Performance Target

Desktop:

60 FPS minimum

Mobile:

55 FPS minimum

Avoid animations that block scrolling.

Avoid unnecessary JavaScript animation loops.

Prefer CSS transforms whenever possible.

---

# Easing

Primary

easeOutCubic

Secondary

easeInOutCubic

Never use:

Bounce

Elastic

Back

Rubber

---

# Animation Duration

Micro Interaction

120ms

Hover

180ms

Card Hover

220ms

Section Reveal

500ms

Hero Floating

6000ms

Glow Pulse

4000ms

Particle Drift

10000ms

Ring Rotation

30000–45000ms

---

# Hero Floating Motion

The Engineering Core should float continuously.

Movement:

Vertical only

Range:

8px–12px

Loop:

Infinite

Ease:

easeInOut

No sudden movement.

---

# Ring Motion

Each ring rotates independently.

Ring 01

Clockwise

40 seconds

Ring 02

Counter Clockwise

32 seconds

Ring 03

Clockwise

26 seconds

Ring 04

Counter Clockwise

36 seconds

Ring 05

Clockwise

48 seconds

Rotation speed must be extremely slow.

---

# Neural Network

Nodes remain static.

Only the light pulses move.

Pulse speed:

2.5 seconds

Pulse direction:

Randomized between connected nodes.

---

# Data Streams

Energy travels upward.

Never downward.

Signal speed:

Very slow.

Opacity fluctuates slightly.

Maximum brightness:

75%

---

# Glow Pulse

Glow should breathe.

Scale:

100% → 106%

Opacity:

70% → 100%

Duration:

4 seconds

Infinite

Alternate

---

# Background Nebula

Static.

No visible movement.

Only slight opacity shift.

Duration:

12 seconds

---

# Particles

Particles drift slowly.

Random direction.

Maximum movement:

20px

Lifetime:

Infinite

Opacity changes gently.

Never blink.

Never flash.

---

# Mouse Parallax

Desktop only.

Disabled on touch devices.

Maximum translation:

15px

Different layers move at different speeds.

Foreground:

100%

Core:

70%

Glow:

50%

Grid:

30%

Background:

15%

---

# Scroll Reveal

Every section enters only once.

Animation:

Fade

TranslateY

20px

Duration:

500ms

Delay:

40ms between sibling elements.

---

# Cards

Default:

Static

Hover:

TranslateY(-6px)

Scale(1.02)

Shadow increases slightly.

Glow increases subtly.

Duration:

220ms

---

# Buttons

Primary Button

Hover:

TranslateY(-2px)

Brightness +8%

Shadow increases.

Secondary Button

Hover:

Border glow only.

No scaling.

---

# Navigation

Transparent at top.

On scroll:

Glass background appears.

Blur increases.

Border fades in.

Transition:

300ms

---

# Service Cards

Hover:

Lift slightly.

Icon rotates 4 degrees.

Glow increases.

Border becomes brighter.

Never rotate the entire card dramatically.

---

# Project Cards

Image:

Zoom 1.03

Overlay opacity increases.

Content slides upward 8px.

---

# Forms

Inputs:

Border glow on focus.

No shake.

No bounce.

Buttons:

Small brightness increase.

---

# Footer

Minimal fade-in.

No large animations.

---

# Motion Restrictions

Never animate:

Large layout changes

Typography scaling

Paragraph movement

Rapid flashing

Color cycling

Rainbow effects

Aggressive neon

---

# Accessibility

Respect prefers-reduced-motion.

If reduced motion is enabled:

Disable floating.

Disable parallax.

Disable particle movement.

Disable ring rotation.

Keep only fade transitions.

---

# Acceptance Criteria

✓ Motion feels premium.

✓ Motion never distracts.

✓ Hero feels alive.

✓ Performance remains smooth.

✓ Every animation has purpose.

✓ Engineering aesthetic is preserved.

✓ Motion remains subtle.

✓ Mobile performance stays excellent.
