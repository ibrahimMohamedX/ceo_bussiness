# PROJEX — Static-to-Dynamic Migration Plan

## 1. Principle

Do not migrate everything at once.

Keep the current site visually stable while replacing only the content sources that benefit from dynamic management.

## 2. Migration Order

### Step 1 — Projects

Move project data from static JSON into Firestore.

Keep the current UI contract as much as possible.

Add multi-image galleries.

### Step 2 — Blog

Move blog article list/content into Firestore.

Only implement article detail routes once the content model and page design are ready.

### Step 3 — Inquiries

Connect Contact CTA/form submission to Firestore through a secure server path.

### Step 4 — Testimonials / FAQ

Move to Firestore when dashboard management is needed.

### Step 5 — Services

Move service descriptions and metadata to Firestore if the business wants non-developer editing.

### Step 6 — About / Company

Move operationally editable company information only; keep core UI labels in i18n.

## 3. Compatibility Layer

During migration, the UI may read from:

```text
Firestore → if configured/available
Static fallback → during rollout
```

The fallback should be temporary and documented.

## 4. Do Not Break SEO

Project and blog pages should remain server-rendered where practical.

Use stable URLs, metadata, and localized content.

## 5. Publish Model

Draft content should not appear publicly.

Public site queries should target:

```text
status == 'published'
```

and optionally:

```text
publishedAt <= now
```

## 6. Preview

Future improvement:

- admin preview
- draft preview links
- scheduled publish

Do not build preview mode before the basic CRUD workflow is stable.
