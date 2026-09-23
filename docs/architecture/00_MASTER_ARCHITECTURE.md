# PROJEX — Dynamic Website + Firebase Admin System

## 1. Purpose

This documentation defines the target architecture for converting PROJEX from a mostly static Next.js marketing site into a dynamic platform backed by Firebase, with a protected Admin Dashboard for content management and inbound lead/inquiry management.

The public website remains Next.js. Firebase becomes the backend platform for authentication, database, file storage, server-side business logic, and notifications.

## 2. Goals

- Keep the existing PROJEX visual identity and i18n architecture.
- Make business content editable without changing source code.
- Manage projects and their galleries from the dashboard.
- Manage blog posts and future article content from the dashboard.
- Receive and manage inquiries submitted from the public site.
- Provide protected admin authentication.
- Store media centrally and safely.
- Preserve English/Arabic content and RTL behavior.
- Keep public reads limited to published content.
- Keep admin mutations protected by authentication/authorization.

## 3. High-Level Architecture

```text
                         ┌──────────────────────┐
                         │   Public Next.js     │
                         │   Website            │
                         └──────────┬───────────┘
                                    │
                         public reads / form submit
                                    │
                  ┌─────────────────▼─────────────────┐
                  │              Firebase             │
                  │                                   │
                  │  Auth      Firestore   Storage    │
                  │    │          │          │        │
                  │    └──────────┼──────────┘        │
                  │               │                   │
                  │        Cloud Functions            │
                  └───────────────┬───────────────────┘
                                  │
                         protected admin access
                                  │
                         ┌────────▼────────┐
                         │ Next.js Admin   │
                         │ Dashboard       │
                         └─────────────────┘
```

## 4. Firebase Products

### Firebase Authentication

Used for dashboard users only.

Recommended first roles:

- `super_admin`
- `admin`
- `editor`
- `support`

### Cloud Firestore

Primary database for dynamic business content and inquiries.

### Firebase Storage

Central media library for project images, blog images, team/company media, and future case-study galleries.

### Cloud Functions

Server-side operations that should not trust a browser client, including inquiry processing, notification dispatch, cleanup, and privileged workflows.

## 5. Static vs Dynamic Content

Not everything should move into Firestore.

### Keep static in code/i18n

- UI labels
- navigation labels
- generic buttons
- validation messages
- theme labels
- accessibility labels
- system messages
- fixed legal/technical UI strings

### Move to Firestore

- Projects
- Project galleries
- Blog posts
- Services content when business-managed
- Testimonials
- FAQs
- Company/about content that changes operationally
- Contact inquiries
- Dashboard users/role metadata
- Site settings that administrators must control

## 6. Public Website Data Flow

```text
Firestore
   ↓
server-side data access
   ↓
Next.js page / server component
   ↓
render published content
```

Dynamic content must respect `status`, locale, ordering, visibility, and publication dates.

## 7. Security Principle

The browser must never receive admin capabilities simply because it can see an admin page.

The Admin Dashboard must require Firebase Authentication, and server-side mutation paths must validate authorization.

## 8. Development Order

1. Firebase project configuration
2. Auth + admin roles
3. Firestore schema
4. Storage/media model
5. Security rules
6. Admin dashboard shell
7. Projects CRUD
8. Blog CRUD
9. Inquiries
10. Media library
11. Testimonials / FAQ / Services / About content
12. Public site dynamic integration
13. Notifications
14. Analytics and operational polish

## 9. Non-Goals

Do not create a full CRM, ERP, chat system, or payment system in the first version.

Do not replace the existing design system just because content becomes dynamic.
