import { getPublishedServiceBySlug } from '@/src/lib/public/services'
import { getSiteSettings } from '@/src/lib/public/settings'
import AIPageClient from './AIPageClient'

/* ------------------------------------------------------------------ */
/*  Artificial Intelligence discipline page (Server Component)         */
/*  Fetches published service by slug                                  */
/*  Passes data to client component                                    */
/* ------------------------------------------------------------------ */
export const dynamic = 'force-dynamic'

export default async function AIPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const service = await getPublishedServiceBySlug('ai')
  const siteSettings = await getSiteSettings()

  return <AIPageClient locale={locale} service={service} siteSettings={siteSettings} />
}