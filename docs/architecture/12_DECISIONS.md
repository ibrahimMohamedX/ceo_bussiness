# PROJEX — Architecture Decisions

## Decision 001 — Firebase as Backend Platform

Chosen because there is currently no existing backend and the project benefits from a managed Auth + Firestore + Storage + Functions stack.

## Decision 002 — Next.js Hosts Public Site and Admin UI

Keep one repository and one deployment surface initially.

## Decision 003 — Firestore for Business Content

Use Firestore for projects, blog posts, inquiries, testimonials, FAQ, services, and editable company data.

## Decision 004 — Firebase Storage for Binary Media

Do not store images in Firestore documents.

## Decision 005 — Projects Support Multiple Images

A project has one optional cover plus an arbitrary number of gallery/media items.

## Decision 006 — i18n Split

UI/system text stays in next-intl.
Business content stores `en` and `ar` values in Firestore.

## Decision 007 — Secure Inquiry Submission

Do not allow anonymous direct unrestricted writes to the inquiry collection.

## Decision 008 — Incremental Migration

Projects → Blog → Inquiries → Media → remaining content.

## Decision 009 — Do Not Overbuild

Avoid a full CRM/ERP or microservice architecture until business requirements justify it.
