import { getPublishedServiceBySlug } from '@/src/lib/public/services'
import { getSiteSettings } from '@/src/lib/public/settings'
import SoftwarePageClient from './SoftwarePageClient'

/* ------------------------------------------------------------------ */
/*  Software Engineering discipline page (Server Component)            */
/*  Fetches published service by slug                                  */
/*  Passes data to client component                                    */
/* ------------------------------------------------------------------ */
export const dynamic = 'force-dynamic'

export default async function SoftwarePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const service = await getPublishedServiceBySlug('software')
  const siteSettings = await getSiteSettings()

  return <SoftwarePageClient locale={locale} service={service} siteSettings={siteSettings} />
}