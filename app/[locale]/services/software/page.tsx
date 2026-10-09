import { getPublishedServiceBySlug } from '@/src/lib/public/services'
import { getPublishedProjects } from '@/src/lib/public/projects'
import { getSiteSettings } from '@/src/lib/public/settings'
import SoftwarePageClient from './SoftwarePageClient'

/* ------------------------------------------------------------------ */
/*  Software Engineering discipline page (Server Component)            */
/*  Fetches the published service by slug plus this discipline's        */
/*  published projects (empty array → the client hides the section).    */
/* ------------------------------------------------------------------ */
export const dynamic = 'force-dynamic'

export default async function SoftwarePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const [service, siteSettings, allProjects] = await Promise.all([
    getPublishedServiceBySlug('software'),
    getSiteSettings(),
    getPublishedProjects(),
  ])
  const projects = allProjects
    .filter((p) => p.category === 'software')
    .slice(0, 6)

  return (
    <SoftwarePageClient
      locale={locale}
      service={service}
      siteSettings={siteSettings}
      projects={projects}
    />
  )
}
