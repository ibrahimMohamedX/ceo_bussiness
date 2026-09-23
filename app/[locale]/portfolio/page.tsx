import { getPublishedProjects } from '@/src/lib/public/projects'
import { getSiteSettings } from '@/src/lib/public/settings'
import PortfolioPageClient from './PortfolioPageClient'

/* ------------------------------------------------------------------ */
/*  Portfolio page (Server Component)                                  */
/*  Fetches published projects and passes to client component         */
/* ------------------------------------------------------------------ */
export const dynamic = 'force-dynamic'

export default async function PortfolioPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const projects = await getPublishedProjects()
  const siteSettings = await getSiteSettings()

  return <PortfolioPageClient locale={locale} projects={projects} siteSettings={siteSettings} />
}