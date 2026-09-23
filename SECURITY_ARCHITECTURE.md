# PROJEX — SECURITY & ARCHITECTURE CONFIRMATION (Phase 12–14)

## 1. Authentication boundary

- **Session cookie**: HttpOnly, Secure, SameSite=Lax, Path=/, name `projex_session`.
- **Mint**: `POST /admin/login` receives a Firebase ID token, calls
  `createSessionCookie(idToken, {expiresIn: 7d})`, sets the cookie with matching
  `maxAge`. No secret or token is ever returned to the client.
- **Clear**: `DELETE /admin/login` clears the cookie.
- **Verify**: `verifySession()` (React `cache()`, `server-only`) reads the cookie,
  calls `verifySessionCookie(token, true)`, then reads `admins/{uid}` from Admin
  Firestore and returns `{uid, email, role, displayName}` **only if `active === true`**;
  otherwise `null`.

## 2. Authorization (least privilege)

Role order: `super_admin > admin > editor > support`.

`can(role, feature)` lookup:
| Feature | Minimum role |
|---|---|
| overview | super_admin |
| inquiries | support |
| content (projects/blog/services/about/testimonials/faq) | editor |
| media | editor |
| settings | super_admin |

Every admin DAL function calls a `requireRole(session, feature)` guard **before** any
Firestore read/write. Unauthenticated (`!session`) throws `ApiError(401)`; authenticated
but insufficient role throws `ApiError(403)`.

## 3. Route protection (defense in depth)

- `app/admin/layout.tsx` exports `dynamic = 'force-dynamic'` and calls `requireAdmin()`
  before rendering children — every dashboard page is server-gated.
- API routes (`app/admin/api/**`) each call `verifySession()` and pass the session into
  the DAL, which re-checks the role (no trust in the client).
- Proxy matcher excludes `admin`, so no locale rewrite touches the admin tree.

## 4. Parallel root layouts

- Public: `app/[locale]/layout.tsx` (wraps `IntlProvider` + `ThemeProvider`).
- Admin: `app/admin/layout.tsx` (own `<html>/<body>`, `AdminThemeProvider` scoped to the
  admin tree only). The two ThemeProviders never conflict because they live in separate
  React roots and mutate separate document roots.

## 5. Next.js 16 specifics honored

- `src/middleware.ts` deleted; `src/proxy.ts` is the single localization proxy
  (`export default createMiddleware(routing)`).
- `localePrefix: 'always'`, locales `['en','ar']`, default `en`.
- Server components use `params: Promise<{locale: string}>`.
- `next-intl` `createMiddleware(routing)` with matcher excluding `admin`.

## 6. Data access (no parallel source)

- Admin and public both read/write the **same** Firestore collections via the same
  `src/lib/firebase/admin.ts` (Admin SDK) and `src/lib/firebase/client.ts` (client SDK).
- No in-memory store, no mock layer, no second database. The public site reads only
  `published` records; the admin writes the canonical record.

## 7. Rules parity

- `firestore.rules` / `storage.rules` mirror the same role feature map as the DAL,
  enforcing ownership (`request.auth.token.ownerId`) and role claims server-side.
- Storage paths are enforced as `media/{ownerType}/{ownerId}/{fileName}` with owner
  types `project | blog | about | testimonial | inquiry | general`.

## 8. Secrets & environment

- No secret is present in source; Firebase Admin credentials are read from env
  (`FIREBASE_*`). `.env.example` documents required variables without values.
- `scripts/seed-admin.ts` is the single auditable bootstrap for the first `super_admin`
  (Firestore rules prevent a super_admin from self-granting the first `admins/{uid}` doc).

## Verification status

| Check | Result |
|---|---|
| `npx tsc --noEmit` | EXIT 0 |
| `npx next build` | EXIT 0 |
| Firestore collection parity | ✓ (grep-verified) |
| Field/enum parity | ✓ (grep-verified) |
| Authz guard coverage | ✓ (every DAL module has requireRole) |
| Route protection | ✓ (layout + per-route verifySession) |
| No parallel data source | ✓ (single Firebase project `ceo-bussiness`) |