# PROJEX — Firebase + Admin Implementation Roadmap

## Phase 0 — Preparation

- Create Firebase project
- Create dev and production Firebase environments where appropriate
- Enable Authentication
- Create Firestore database
- Create Storage bucket
- configure environment variables

## Phase 1 — Foundation

- Firebase client initialization
- Firebase Admin initialization
- auth guard
- admin profile/role model
- base Security Rules
- base Storage Rules
- dashboard layout

Deliverable: protected `/admin` shell.

## Phase 2 — Projects

- Projects collection
- project CRUD
- publish/archive
- technologies
- categories
- featured toggle
- cover image
- multi-image gallery
- media reordering

Deliverable: `/portfolio` reads published projects.

## Phase 3 — Blog

- Blog collection
- post CRUD
- draft/published
- categories
- tags
- cover image
- bilingual content

Deliverable: `/blog` reads published posts.

## Phase 4 — Inquiries

- public contact form
- secure submission endpoint/function
- Firestore inquiry creation
- admin inquiry list
- detail view
- status
- priority
- assignment
- notes

Deliverable: working lead inbox.

## Phase 5 — Media Library

- upload
- preview
- metadata
- relationship references
- delete safety

Deliverable: reusable media management.

## Phase 6 — Remaining Content

- testimonials
- FAQ
- services
- company/about editable content

Only move data that genuinely benefits from dashboard management.

## Phase 7 — Notifications

- admin email on new inquiry
- optional user confirmation
- optional Telegram/Slack later

## Phase 8 — Hardening

- security rules audit
- App Check evaluation
- rate limiting/anti-spam review
- storage validation
- error logging
- backups/export strategy

## Phase 9 — Production

- production Firebase environment
- production env variables
- security review
- smoke test all routes
- verify EN/AR
- verify admin authorization
- verify media permissions
- verify inquiries
