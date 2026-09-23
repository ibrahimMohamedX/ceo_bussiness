import { getPublishedServiceBySlug } from '@/src/lib/public/services'
import { getSiteSettings } from '@/src/lib/public/settings'
import EmbeddedPageClient from './EmbeddedPageClient'

/* ------------------------------------------------------------------ */
/*  Embedded Systems discipline page (Server Component)                */
/*  Fetches published service by slug                                  */
/*  Passes data to client component                                    */
/* ------------------------------------------------------------------ */
export const dynamic = 'force-dynamic'

export default async function EmbeddedPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const service = await getPublishedServiceBySlug('embedded')
  const siteSettings = await getSiteSettings()

  return <EmbeddedPageClient locale={locale} service={service} siteSettings={siteSettings} />
}