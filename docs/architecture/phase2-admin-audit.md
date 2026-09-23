# Phase 2 Admin Dashboard — Code/Layout/Runtime Audit

Audit date: 2026-09-01. Scope: read-only audit of the completed Phase 2 admin dashboard
(authentication + dashboard shell + the CRUD/media surfaces that shipped with it). This is **not**
new feature work. No commits, no deploys, no Phase 12.

Every finding is placed into one of three buckets:

- **Statically verified** — proven by reading the code and tracing the call paths.
- **Manually / runtime verified** — confirmed by actually running the app or a build.
- **Unable to verify (blocked)** — could not be confirmed at audit time; stated honestly, not guessed.

---

## Bucket 1 — Statically verified

Confirmed by reading the source and tracing every reference. Confidence is high, but these have
**not** been re-confirmed against a running build (see Bucket 3).

### 1.1 Media architecture — blog cross-wiring bug (defect)

The three blog media API routes import the **project** media DAL and pass the blog post id as
`projectId`:

- `app/admin/api/blog/[id]/media/route.ts` — imports `createProjectMedia`
- `app/admin/api/blog/[id]/media/[mediaId]/route.ts` — imports `deleteProjectMedia`
- `app/admin/api/blog/[id]/media/reorder/route.ts` — imports `reorderProjectMedia`

`src/lib/admin/media.ts` exports only project-scoped functions (`createProjectMedia`,
`updateProjectMedia`, `reorderProjectMedia`, `deleteProjectMedia`) plus the global library
functions (`listMediaLibrary`, `deleteMediaLibrary`). **No** blog-specific media functions exist.
Consequence: any media operation performed against a blog post writes/deletes against a project
with that same id — the wrong owner. Because blog and project ids are Firestore auto-ids and do not
overlap deterministically, the write either targets a nonexistent project (silently creating a
media record under the wrong owner) or a real but unrelated project.

Severity: **High**. This is a data-integrity bug, not cosmetic.

### 1.2 Dead media handlers in the blog and project edit pages (defect)

In both `app/admin/(shell)/blog/[id]/page.tsx` and `app/admin/(shell)/projects/[id]/page.tsx`:

- `handleMediaDelete` (targets `/admin/api/{blog|projects}/${id}/media/${mediaId}` DELETE) is
  defined but **never invoked**.
- `handleReorder` (targets `/admin/api/{blog|projects}/${id}/media/reorder` POST) is defined but
  **never invoked**.
- `deletingMediaId` and `busyMedia` state are declared but `deletingMediaId` is **never set**, so
  the `ConfirmDialog` that renders media-delete confirmation can **never open**.

The `<MediaUploader>` is rendered with only `projectId`, `media`, and `onChanged={handleMediaChange}`.
The delete/reorder handlers are fully disconnected from the UI.

Severity: **Medium**. Delete and reorder are surfaced nowhere in these two edit pages. Per the audit
constraint ("do NOT remove functionality just because it appears unused"), the fix is to **wire**
these handlers, not delete them.

### 1.3 MediaUploader is hardcoded to projects and lacks reorder/confirm (defect)

`components/admin/MediaUploader.tsx`:

- Props are only `{ projectId, media, onChanged }` — there is **no `onReorder` callback** and **no
  reorder UI**.
- The storage path is hardcoded: `media/projects/${projectId}/…` and the metadata POST targets
  `/admin/api/projects/${projectId}/media`. When reused for a blog post, the component still writes
  to the projects namespace (compounds 1.1).
- `remove(mediaId)` issues a DELETE with **no confirmation dialog** — the only path by which media
  can actually be deleted from these pages, and it is instant/irreversible.
- The file input is `accept="image/*" multiple`, but only `files[0]` is uploaded — the `multiple`
  attribute is misleading.
- There is **no real image preview**; a 🖼 emoji placeholder is rendered instead of a thumbnail /
  `getDownloadURL`-based preview.
- There is no empty-media state beyond the implicit "no items" list; no duplicate-upload guard; no
  client-side validation of file type/size before `uploadBytesResumable`.

Severity: **Medium–High** (the hardcoded namespace combined with 1.1 makes blog media effectively
non-functional; the missing confirm is a UX/data-loss risk).

### 1.4 MediaLibraryClient is orphaned (dead code)

`app/admin/(shell)/media/MediaLibraryClient.tsx` is a complete, working media grid (uses
`getDownloadURL` for real `<img>` previews, `OWNER_FILTERS`, `handleDelete` → DELETE
`/admin/api/media/${id}`, empty state, `ConfirmDialog`). But it is **not imported anywhere**: the
`/admin/media` page is a placeholder ("No media uploaded"). The global library routes
(`app/admin/api/media/route.ts` and `[mediaId]/route.ts`) are correct and call
`listMediaLibrary`/`deleteMediaLibrary` — so the backend exists; only the front-end wiring to it is
missing.

Severity: **Low–Medium** (functional gap, not a data bug). Per the constraint, do not delete the
orphaned client — wire it into `/admin/media`.

### 1.5 ServiceFormClient is orphaned / triplicated (dead code + duplication)

Three near-identical service-form implementations exist:

1. `app/admin/(shell)/services/[id]/ServiceFormClient.tsx` — a proper reusable `isNew`/`serviceId`
   component. **Nothing imports it** (dead).
2. `app/admin/(shell)/services/[id]/page.tsx` — self-contained `ServiceFormPage`.
3. `app/admin/(shell)/services/new/page.tsx` — a second self-contained `ServiceFormPage`.

Only (2) and (3) are routed. `ServiceFormClient` (1) is dead code. Testimonials have the same
duplication pattern (`[id]/page.tsx` and `new/page.tsx` both define standalone `TestimonialFormPage`).

Severity: **Low** (maintainability — three copies of the same form drift apart).

### 1.6 Blog / project "new" pages likely broken via dynamic-import pattern (defect, high confidence)

`app/admin/(shell)/blog/new/NewBlogPostClient.tsx` and
`app/admin/(shell)/projects/new/NewProjectClient.tsx` both `dynamic()`-import the sibling
`[id]/page.tsx` default export and render it. At `/admin/blog/new` the **static** `new/page.tsx`
route wins, so the dynamic `[id]` component's `useParams().id` is `undefined` (it does not read the
`new` segment). In `[id]/page.tsx`, `isNew = postId === 'new'` therefore evaluates to `false`:

- The heading renders "Edit blog post" instead of "New blog post".
- `loadPost()` runs with `postId === undefined` → `fetch('/admin/api/blog/undefined')` → 404/error.
- The MediaUploader field renders in an inconsistent state.

This is a **static finding with high confidence but warrants runtime confirmation** — it depends on
the exact `useParams()` behavior under a static-route shadow, which I could not execute against
(see Bucket 3).

Severity: **High** (the "new" flows for the two most important content types are likely unusable).

### 1.7 Verified correct (no defect found)

- **All six table clients** — `ProjectsTableClient`, `BlogPostsTableClient`,
  `ServicesTableClient`, `FaqTableClient`, `InquiryTableClient`, `TestimonialsTableClient` — correct
  column rendering, correct `ConfirmDialog`-gated delete flow, correct API targets.
- **Global media library routes** — `app/admin/api/media/route.ts` (GET → `listMediaLibrary`, owner
  filter validated against `MediaOwnerType`) and `[mediaId]/route.ts` (DELETE →
  `deleteMediaLibrary` + storage blob delete) — correct.
- **Project media routes** — `app/admin/api/projects/[id]/media/*` — correct (project id → project
  DAL, no cross-wiring).
- **SettingsEditorClient** — correct singleton settings editor; validation on company name + email
  regex; PATCH to `/admin/api/settings`.
- **Standalone edit/new forms** — `services/[id]`, `services/new`, `faq/[id]`, `faq/new`,
  `testimonials/[id]`, `testimonials/new`, `inquiries/[id]` — each is a self-contained
  `'use client'` page that fetches/POSTs/PATCHes its correct endpoint. (Note: services and
  testimonials `[id]` pages carry a redundant `isNew` branch shadowed by their `new/page.tsx` — see
  1.5 — but the edit path is correct.)

---

## Bucket 2 — Manually / runtime verified

**None.** No command executed successfully this session, and no running app was observed. This
bucket is intentionally empty rather than padded with claims that "the code looks correct so it
probably works."

---

## Bucket 3 — Unable to verify (blocked)

- **`npx tsc --noEmit`** — blocked. Both the Bash and PowerShell execution paths returned the same
  classifier error: *"claude-opus-5[1m] is temporarily unavailable (timed out), so auto mode cannot
  determine the safety of Bash/PowerShell right now."* No exit code captured.
- **`npx next build`** — blocked for the same reason; never ran.
- **Runtime behavior of the blog/project "new" pages** (finding 1.6) — blocked; depends on a live
  `next dev`/`next build` to observe `useParams()` under the static-route shadow.
- **Any true runtime behavior** across `/admin/*` — the login redirect, session cookie
  mint/verify, theme toggle scoping, responsive breakpoints — could not be exercised.

These remain blocked by the environment (classifier timeout), not by the code. They should be
re-run once the classifier recovers.

---

## Summary table

| # | Finding | Severity | Bucket |
|---|---------|----------|--------|
| 1.1 | Blog media routes call project DAL (cross-wiring) | High | Static |
| 1.2 | Dead `handleMediaDelete` / `handleReorder` in blog+project edit pages | Medium | Static |
| 1.3 | MediaUploader hardcoded to projects; no reorder; no-confirm delete; `files[0]` only; no preview | Med–High | Static |
| 1.4 | MediaLibraryClient orphaned (not wired to `/admin/media`) | Low–Med | Static |
| 1.5 | ServiceFormClient orphaned; service/testimonial forms triplicated | Low | Static |
| 1.6 | Blog/project "new" pages likely broken (dynamic-import → `isNew` false) | High | Static |
| 1.7 | Table clients, global+project media routes, settings editor, standalone forms — correct | — | Static |
| — | `tsc --noEmit` / `next build` exit codes | — | **Blocked** |
| — | Runtime behavior of `/admin/*` + "new" pages | — | **Blocked** |