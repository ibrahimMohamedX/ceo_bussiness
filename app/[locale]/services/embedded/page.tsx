import { getPublishedServiceBySlug } from '@/src/lib/public/services'
import { getPublishedProjects } from '@/src/lib/public/projects'
import { getSiteSettings } from '@/src/lib/public/settings'
import EmbeddedPageClient from './EmbeddedPageClient'

/* ------------------------------------------------------------------ */
/*  Embedded Systems discipline page (Server Component)                */
/*  Fetches the published service by slug plus this discipline's        */
/*  published projects (empty array → the client hides the section).    */
/* ------------------------------------------------------------------ */
export const dynamic = 'force-dynamic'

export default async function EmbeddedPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const [service, siteSettings, allProjects] = await Promise.all([
    getPublishedServiceBySlug('embedded'),
    getSiteSettings(),
    getPublishedProjects(),
  ])
  const projects = allProjects
    .filter((p) => p.category === 'embedded')
    .slice(0, 6)

  return (
    <EmbeddedPageClient
      locale={locale}
      service={service}
      siteSettings={siteSettings}
      projects={projects}
    />
  )
}