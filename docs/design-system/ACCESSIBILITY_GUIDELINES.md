# PROJEX Accessibility Guidelines
Version: 1.0

---

# Purpose

Accessibility is not an optional feature.

Every interface, interaction and animation must be usable by the widest possible audience.

Accessibility should be considered during design, development and testing.

---

# Goal

Target WCAG 2.2 AA compliance.

Whenever possible, exceed AA requirements.

---

# Accessibility Principles

Perceivable

Operable

Understandable

Robust

Every component must satisfy these four principles.

---

# Color Contrast

Never rely on color alone.

Minimum contrast ratio

Normal Text

4.5 : 1

Large Text

3 : 1

Interactive Components

Minimum 3 : 1

Prefer higher contrast whenever possible.

---

# Typography

Minimum Body Size

16px

Never use text below

14px

Maximum Line Length

75 characters

Line Height

1.5–1.8

Avoid fully justified text.

---

# Keyboard Navigation

Every interactive element must be reachable.

Tab Order

Logical

Predictable

Visible

Never trap keyboard focus.

Escape must always close dialogs.

---

# Focus States

Every interactive element requires:

Visible focus ring

High contrast

Consistent style

Focus should never be removed.

Never use:

outline: none;

unless replaced with an accessible alternative.

---

# Interactive Targets

Minimum Touch Target

48 × 48 px

Clickable area should exceed visible area whenever possible.

Spacing between adjacent controls should prevent accidental taps.

---

# Forms

Every input requires:

Visible label

Helper text (when needed)

Error message

Success state

Accessible name

Placeholder text must never replace labels.

---

# Buttons

Every button must clearly indicate:

Default

Hover

Focus

Pressed

Disabled

Loading

Success (when applicable)

---

# Links

Links must be distinguishable from normal text.

Hover and focus states are required.

Never rely on color only.

---

# Icons

Decorative icons

aria-hidden="true"

Functional icons

Accessible label required.

Never use icon-only buttons without labels.

---

# Images

Every informative image requires:

Meaningful alt text.

Decorative assets

Empty alt.

Hero decorative graphics

Should never interfere with screen readers.

---

# Motion

Respect:

prefers-reduced-motion

Disable:

Parallax

Continuous rotation

Background drift

Particle animations

Replace with subtle fades.

---

# Screen Readers

Use semantic HTML.

Landmarks

header

main

section

article

footer

Use ARIA only when semantic HTML is insufficient.

---

# Headings

Only one H1 per page.

Never skip heading levels.

Correct hierarchy

H1

↓

H2

↓

H3

↓

H4

---

# Navigation

Navigation must include:

Accessible labels

Current page indication

Keyboard support

Logical order

---

# Modals

Trap focus

Restore focus after closing

Escape closes modal

Overlay should not trap screen readers

---

# Toasts

Announce dynamically.

Avoid disappearing too quickly.

Minimum display time

5 seconds

---

# Tables

Provide headers.

Support keyboard navigation.

Avoid horizontal scrolling where possible.

---

# Loading States

Skeletons preferred.

Avoid layout shifts.

Communicate loading status to assistive technologies.

---

# Error Handling

Errors should:

Explain the problem.

Explain the solution.

Avoid technical language.

Example

Unable to submit your request.

Please check the highlighted fields and try again.

---

# Empty States

Should explain:

Why nothing is displayed.

What the user can do next.

---

# Language

Declare page language.

Support future localization.

Avoid embedding text inside images.

---

# Performance

Accessibility should never significantly reduce performance.

Use native HTML before custom widgets.

---

# Testing

Test with:

Keyboard only

Screen Reader

High Contrast Mode

Zoom 200%

Mobile devices

Reduced Motion

Dark mode

---

# Accessibility Checklist

✓ WCAG AA

✓ Keyboard Friendly

✓ Screen Reader Friendly

✓ Touch Friendly

✓ High Contrast

✓ Reduced Motion

✓ Semantic HTML

✓ Accessible Forms

✓ Visible Focus

✓ Production Ready

---

# Final Goal

Every visitor should be able to navigate, understand and interact with the PROJEX website regardless of ability, device or input method.

Accessibility is a core quality attribute of the product.

End of Document