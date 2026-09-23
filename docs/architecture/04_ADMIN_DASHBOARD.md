# PROJEX — Admin Dashboard Specification

## 1. Route Structure

```text
/admin/login
/admin
/admin/inquiries
/admin/projects
/admin/blog
/admin/services
/admin/testimonials
/admin/faq
/admin/media
/admin/settings
```

The actual route names may evolve, but the feature boundaries should remain stable.

## 2. Authentication Flow

```text
/admin/login
    ↓
Firebase Auth
    ↓
verify user
    ↓
load admin profile / role
    ↓
allow dashboard
```

Unauthenticated users must be redirected to login.

## 3. Dashboard Shell

Layout:

```text
┌────────────────────────────────────────────────────┐
│ Topbar: brand | search | theme | account           │
├───────────────┬────────────────────────────────────┤
│ Sidebar       │ Main content                       │
│               │                                    │
│ Overview      │                                    │
│ Inquiries     │                                    │
│ Projects      │                                    │
│ Blog          │                                    │
│ Services      │                                    │
│ Testimonials  │                                    │
│ FAQ           │                                    │
│ Media         │                                    │
│ Settings      │                                    │
└───────────────┴────────────────────────────────────┘
```

## 4. Overview

Initial dashboard cards:

- New inquiries
- Open inquiries
- Published projects
- Published posts
- Draft posts

Optional later:

- inquiry trend
- top requested service
- recently edited content

Do not add fake analytics when no event data exists.

## 5. Projects CRUD

Features:

- list/search/filter
- create
- edit
- draft/publish/archive
- featured toggle
- sort order
- cover selection
- multi-image gallery
- gallery reordering
- bilingual fields
- technology tags

## 6. Blog CRUD

Features:

- list/search/filter
- create
- edit
- draft/publish/archive
- slug
- bilingual content
- category
- tags
- author
- cover image
- publication date

## 7. Inquiry Management

List columns:

- status
- priority
- name
- company
- service
- created date
- assignee

Detail panel/page:

- full inquiry data
- attachments
- internal notes
- activity
- status actions
- assignment

## 8. Services

Manage:

- title EN/AR
- summary EN/AR
- description EN/AR
- tags
- icon identifier
- featured
- sort order
- status

## 9. Testimonials

Manage:

- quote EN/AR
- person
- role
- company
- avatar
- featured
- status
- sort order

## 10. FAQ

Manage:

- question EN/AR
- answer EN/AR
- category
- status
- sort order

## 11. Media Library

Manage all uploaded assets with filters:

- project
- blog
- type
- date

Actions:

- upload
- preview
- copy reference
- rename metadata
- delete

Do not delete a media record if it is still referenced without a confirmation/reference check.

## 12. Settings

Admin-accessible configuration should remain small initially:

- company contact info
- social links
- operational email
- optional feature flags

Do not put security-critical secrets into normal Firestore settings.
