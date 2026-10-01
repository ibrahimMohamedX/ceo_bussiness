import createMiddleware from 'next-intl/middleware'
import { NextResponse, type NextRequest } from 'next/server'
import { routing } from './i18n/routing'

// Next.js 16 renamed middleware.ts â†’ proxy.ts. This runs before the request
// handler and ONLY handles public-tree localization. It deliberately excludes
// /admin (and everything else) so the admin routes are never rewritten through
// the next-intl localePrefix 'always' logic (which would turn /admin into
// /en/admin and break the non-localized admin).
//
// A locale-prefixed admin URL (/en/admin, /ar/admin/overview, â€¦) is NOT a real
// page â€” admin is non-localized at app/admin/. Without this guard next-intl
// would accept `en` as the locale and the router would 404 on the nonexistent
// app/[locale]/admin page. Instead, redirect to the canonical /admin path so
// old links, bookmarks, and locale-carried navigations still land on the
// dashboard (the layout's requireAdmin() then decides login vs. content).
//
// The proxy does NOT authenticate: the admin session boundary is enforced in
// the request path / data-access layer (see src/lib/admin/session.ts).

const intlMiddleware = createMiddleware(routing)

// /:locale/admin or /:locale/admin/:rest. The rest group must start with a
// slash, so /en/administration (a real public page name) is untouched.
const localeAdminPattern = new RegExp(
  `^/(${routing.locales.join('|')})/admin(/.*)?$`
)

function redirectLocaleAdmin(request: NextRequest) {
  const match = request.nextUrl.pathname.match(localeAdminPattern)
  if (!match) return undefined
  const [, , rest] = match
  const url = request.nextUrl.clone()
  url.pathname = `/admin${rest ?? ''}`
  // Query params are locale-orthogonal; carry them through the redirect.
  return NextResponse.redirect(url, 308)
}

export default function proxy(request: NextRequest) {
  return redirectLocaleAdmin(request) ?? intlMiddleware(request)
}

export const config = {
  // Match all pathnames except for:
  // - /api (API routes)
  // - /_next (Next.js internals)
  // - /_vercel (Vercel internals)
  // - /admin (non-localized admin tree, guarded server-side)
  // - Static files (images, fonts, etc.)
  matcher: ['/((?!api|_next|_vercel|admin|.*\..*).*)'],
}





