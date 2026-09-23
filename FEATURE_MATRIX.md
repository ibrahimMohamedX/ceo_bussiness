# PROJEX — FEATURE MATRIX (Phase 14)

## Admin Dashboard
✓ Authentication & Session
  - POST /admin/login mints HttpOnly `projex_session` cookie (7d)
  - DELETE /admin/login clears cookie
  - verifySession() returns {uid, email, role, displayName} or null
  - requireAdmin() redirects to /admin/login on null
  - Role model: super_admin > admin > editor > support
  - can() lookup table enforces least-privilege access
✓ Route protection
  - app/admin/layout.tsx exports dynamic = 'force-dynamic'
  - layout calls requireAdmin() before rendering children
  - All admin pages inherit protection (no per-page requireAdmin() needed)
✓ Shell & Navigation
  - Parallel root layout: app/admin/layout.tsx (own <html>/<body>)
  - AdminSidebar: Overview, Inquiries, Projects, Blog, Services, Media, Testimonials, FAQ, About, Settings
  - AdminTopbar: page title, admin identity, theme toggle, logout
  - AdminThemeProvider: scoped dark/light on admin <html> only
✓ Media Library
  - listMediaLibrary() enforces requireRole(session, 'media')
  - Owner-scoped operations enforce requireRole(session, 'content')
  - Storage paths: media/{ownerType}/{ownerId}/{fileName}
  - Drag-drop reorder endpoints (/reorder) for media arrays
✓ CRUD — Projects, Blog, Services, Testimonials, FAQ
  - Write path: admin libs write status, slug, sortOrder, featured, coverMediaId, publishedAt
  - Guard: requireRole(session, 'content') before every Firestore write
  - Edit forms pre-fill with existing data; validation mirrors public filters
  - Delete with cascade: removes owner media & nested subcollections
  - Reorder: updates sortOrder field atomically
✓ Inquiry Management
  - Guard: requireRole(session, 'support')
  - Writes: status: 'new' (immutable after create)
  - Read path: getAllInquiries(session) returns all inquiries
✓ Settings
  - Guard: requireRole(session, 'super_admin')
  - getSiteSettings(session) returns singleton document
  - SettingsEditorClient pre-fills form; writes merged changes
✓ Placeholder pages (no fake data)
  - overview/page.tsx — intentional empty state (see ROOT_CAUSE.md)
  - about/page.tsx — intentional empty state (see ROOT_CAUSE.md)
  - All other shell pages wire to real DAL functions

## Public Website (Bilingual en/ar)
✓ Routing & Localization
  - src/i18n/routing.ts: createMiddleware(routing), localePrefix: 'always'
  - Locales: ['en', 'ar']; default: 'en'
  - Proxy matcher excludes admin: ['/((?!api|_next|_vercel|admin|.*\\..*).*)']
  - app/proxy.ts renamed from middleware.ts (Next 16)
✓ Data Synchronization Contract
  - Public reads filter: where('status','==','published') && orderBy('sortOrder','asc')
  - Featured variant adds: where('featured','==',true)
  - Detail routes add: where('slug','==',slug)
  - Admin writes match: status, slug, sortOrder, featured, coverMediaId, publishedAt
  - Enum parity: ProjectStatus = BlogPostStatus = ServiceStatus = FaqStatus = TestimonialStatus = 'draft' | 'published' | 'archived'
✓ Site Settings
  - Public reads: getSiteSettings() reads siteSettings/global
  - Canonical social block used in every client component:
    ```tsx
    const social = siteSettings?.socialLinks ?? {}
    const socialLinks = [
      { key: 'github', href: social.github, label: t('Footer.social.github'), Icon: Code2 },
      { key: 'linkedin', href: social.linkedin, label: t('Footer.social.linkedin'), Icon: Briefcase },
      { key: 'instagram', href: social.instagram, label: t('Footer.social.instagram'), Icon: Camera },
      { key: 'facebook', href: social.facebook, label: t('Footer.social.facebook'), Icon: Users },
      { key: 'x', href: social.x, label: t('Footer.social.twitter'), Icon: X },
    ]
    ```
✓ Pages & Components
  - Homepage: getFeaturedProjects(3), getSiteSettings(), getFeaturedTestimonials(), getPublishedFaqs()
  - Portfolio: getPublishedProjects()
  - Blog index: getPublishedBlogPosts()
  - Blog detail: getPublishedBlogPostBySlug(slug)
  - Services: getPublishedServices()
  - Services disciplines: filter by tags (software/embedded/ai)
  - About: getAboutContent()
✓ UI & Accessibility
  - ThemeProvider: client-scoped dark/light on document.documentElement
  - Locale switcher: preserves path, updates hreflang
  - Navbar & Footer: cross-page anchors, consistent branding
  - Lucide-react icons: Code2=GitHub, Briefcase=LinkedIn, Camera=Instagram, Users=Facebook, X=Twitter/X
✓ Forms & Validation
  - Inquiry submission: writes to inquiries collection with server-side validation
  - Max lengths enforced client & server (name, email, company, service, message, attachments)
  - Locale restricted to ['en', 'ar']
  - File type & size limits enforced via Firebase Storage rules

## Firebase & Infrastructure
✓ Firestore Collections (exact match admin↔public)
  - projects, projects/{id}/media
  - blogPosts, blogPosts/{id}/media
  - services, testimonials, faqs, inquiries, media, siteSettings/global, admins/{uid}
✓ Storage Rules
  - Path: media/{ownerType}/{ownerId}/{fileName}
  - Owner types: project, blog, about, testimonial, inquiry, general
  - Write: request.auth.token.admin == true || request.auth.token.ownerId == resource.data.ownerId
  - Size: ≤ 5 MB (image/video), ≤ 10 MB (document)
  - Types: image/*, video/mp4, application/pdf
✓ Security Rules
  - Collections inherit same role mapping as admin DAL:
    - content: projects, blogPosts, services, testimonials, faqs
    - support: inquiries
    - super_admin: siteSettings/global, admins/{uid}
  - Firestore reads/writes require matching role token claims
✓ Environment & Scripts
  - firebase.json: project = ceo-bussiness, hosting public/, ignore []
  - firestore.indexes.xml: auto-generated composite indexes for sortOrder + status queries
  - scripts/seed-admin.ts: one-time super-admin bootstrap (FIREBASE_* env vars)
  - Next.js 16: app/router, server components, route.ts handlers, dynamic = 'force-dynamic'
✓ Type Safety & Build
  - npx tsc --noEmit → EXIT 0
  - npx next build → EXIT 0 (static + hybrid rendering)
  - No any-types; strict nulls enforced
  - Prerendered routes: ○, Dynamic (SSR) routes: ƒ