# PROJEX Animation Presets
Version: 1.0

---

# Purpose

This document defines every animation used throughout the PROJEX website.

Animations should communicate engineering precision, not entertainment.

Every animation must have a purpose.

---

# Motion Philosophy

Motion should feel:

• Calm

• Smooth

• Intentional

• Premium

• Predictable

Never feel:

• Bouncy

• Playful

• Aggressive

• Fast

• Distracting

---

# Core Principles

Animation should support usability.

Never compete with content.

Never reduce readability.

Never slow navigation.

Less motion is better than unnecessary motion.

---

# Animation Categories

Micro Interactions

↓

Hover States

↓

Scroll Reveals

↓

Hero Ambient Motion

↓

Page Transitions

↓

Loading

↓

Feedback

---

# Timing Scale

Ultra Fast

100ms

Fast

150ms

Normal

250ms

Medium

350ms

Slow

500ms

Ambient

4000ms

Continuous

30000ms+

---

# Easing

Default

ease-out

Hover

ease-in-out

Continuous

linear

Never use:

Bounce

Elastic

Overshoot

Spring-like motion unless specifically required.

---

# Hover Presets

## Button Hover

Duration

150ms

Effects

Slight Lift

Glow Increase

Border Brightness

Scale

1.02

---

## Card Hover

Duration

250ms

Effects

Translate Y

-6px

Glow

+10%

Border Brightness

+15%

Shadow Increase

Subtle

---

## Icon Hover

Rotate

3°

Scale

1.05

Glow

Minimal

---

# Scroll Reveal

Preset

Fade Up

Distance

24px

Opacity

0 → 100%

Duration

500ms

Trigger

Once

Viewport

20%

---

Preset

Fade Left

Same timing

Horizontal movement

---

Preset

Fade Right

Same timing

---

Preset

Fade Scale

Opacity

Scale

0.96 → 1

Duration

400ms

---

# Hero Animations

## Core Float

Movement

Vertical

Amplitude

6px

Duration

6 seconds

Loop

Infinite

---

## Ring Rotation

Speed

30–45 seconds

Direction

Clockwise

Second Ring

Reverse Direction

Speed

40–60 seconds

---

## Glow Pulse

Opacity

80%

↓

100%

↓

80%

Duration

4 seconds

---

## Particle Drift

Very slow

Random

No sudden direction changes.

---

## Neural Network Pulse

Nodes

Glow sequentially.

Connections

Light travels gently.

Loop

Continuous.

---

## Data Stream

Movement

Bottom

↓

Top

Speed

Very Slow

Opacity

40–70%

---

## Background Grid

Very slow movement.

Almost imperceptible.

Creates depth only.

---

# Navigation

Navbar

Fade Down

200ms

Glass Blur

Already visible

Never slide dramatically.

---

# Mobile Menu

Fade

Scale

0.98 → 1

Duration

250ms

Backdrop Blur

Enabled

---

# Section Transition

Fade Up

Opacity

Translate

Only once.

---

# Modal

Fade

Scale

95%

↓

100%

Duration

200ms

Overlay Fade

150ms

---

# Toast

Slide Up

Fade

Duration

200ms

Exit

Fade Out

---

# Loading

Skeleton

Soft shimmer

Duration

1.5s

Loop

Infinite

Never flash.

---

# Form Feedback

Input Focus

Border Glow

150ms

Success

Soft Green Glow

Error

Soft Red Glow

Shake

Never.

---

# CTA

Primary Button

Glow Pulse

Only when idle.

Pause during hover.

---

# Hero Mouse Parallax

Maximum Offset

20px

Movement

Slow

Smooth

No lag.

---

# Reduced Motion

Respect

prefers-reduced-motion

Disable

Parallax

Continuous Rotation

Particles

Background Drift

Replace with

Fade

Opacity

Static Layers

---

# Performance Rules

Animate only:

Transform

Opacity

Filter

Never animate:

Width

Height

Top

Left

Right

Bottom

Box Shadow continuously

---

# Framer Motion Mapping

Every preset should later map to reusable variants.

Examples

fadeUp

fadeLeft

fadeRight

heroFloat

heroRotate

heroGlow

cardHover

buttonHover

modalOpen

toastShow

---

# Animation Quality Checklist

✓ Smooth

✓ Purposeful

✓ Accessible

✓ GPU Accelerated

✓ Performance Friendly

✓ Consistent

✓ Engineering Style

---

# Final Goal

Visitors should notice the interface feels alive, but never notice the animations themselves.

Motion should communicate engineering quality through subtlety and precision.

End of Document