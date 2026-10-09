import { getPublishedServiceBySlug } from '@/src/lib/public/services'
import { getPublishedProjects } from '@/src/lib/public/projects'
import { getSiteSettings } from '@/src/lib/public/settings'
import AIPageClient from './AIPageClient'

/* ------------------------------------------------------------------ */
/*  Artificial Intelligence discipline page (Server Component)         */
/*  Fetches the published service by slug plus this discipline's       */
/*  published projects (empty array → the client hides the section).   */
/* ------------------------------------------------------------------ */
export const dynamic = 'force-dynamic'

export default async function AIPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const [service, siteSettings, allProjects] = await Promise.all([
    getPublishedServiceBySlug('ai'),
    getSiteSettings(),
    getPublishedProjects(),
  ])
  const projects = allProjects
    .filter((p) => p.category === 'ai')
    .slice(0, 6)

  return (
    <AIPageClient
      locale={locale}
      service={service}
      siteSettings={siteSettings}
      projects={projects}
    />
  )
}