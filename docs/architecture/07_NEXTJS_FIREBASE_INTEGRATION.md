# PROJEX — Next.js + Firebase Integration

## 1. Packages

Use the Firebase client SDK only where client-side access is appropriate.

Use the Firebase Admin SDK on trusted server-side code paths.

Do not expose Admin credentials to the browser.

## 2. Environment Variables

Client-safe values may include the Firebase web app configuration values required by the SDK.

Server-only values include:

- service account credentials or equivalent server credentials
- privileged secrets
- function-specific secrets

Never commit secrets.

## 3. Suggested Firebase Modules

```text
src/lib/firebase/client.ts
src/lib/firebase/admin.ts
src/lib/firebase/auth.ts
src/lib/firebase/firestore.ts
src/lib/firebase/storage.ts
```

Exact location may follow the repository's current architecture.

## 4. Client Initialization

Initialize Firebase client SDK once.

Do not reinitialize the app on every render.

## 5. Admin Initialization

Use server-only code.

Guard imports so Admin SDK modules are never bundled into client components.

## 6. Server Data Access

Preferred flow for public dynamic content:

```text
Server Component / Route Handler
        ↓
server Firebase data access
        ↓
Firestore
```

This is preferred for SEO-critical page content.

## 7. Client Dashboard

Admin dashboard may use client-side Firestore access when protected by Firebase Auth + Security Rules, but sensitive mutations can be routed through trusted server functions when required.

## 8. Caching / Revalidation

Dynamic content should define an explicit freshness strategy.

For content pages:

- server rendering
- controlled revalidation
- on-demand invalidation after dashboard publish/update when practical

Do not make every page `no-store` by default unless required.

## 9. Slugs

Public routes should use stable slugs.

Example:

```text
/en/portfolio/orion-avionics-suite
/ar/portfolio/orion-avionics-suite
```

The current first version can keep project cards non-navigational if case-study pages are not yet implemented.

## 10. i18n Interaction

Keep UI translations in next-intl.

Dynamic content carries its own `en`/`ar` content values.

Do not put business content back into the UI translation namespace simply because it is localized.

## 11. Error Handling

Public content read failures must degrade gracefully.

Admin operations must show actionable errors without exposing secrets or raw server traces.
