import { getPublishedServices } from '@/src/lib/public/services'
import { getSiteSettings } from '@/src/lib/public/settings'
import ServicesPageClient from './ServicesPageClient'

/* ------------------------------------------------------------------ */
/*  Services page (Server Component)                                   */
/*  Fetches published services                                         */
/*  Passes data to client component                                    */
/* ------------------------------------------------------------------ */
export const dynamic = 'force-dynamic'

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const services = await getPublishedServices()
  const siteSettings = await getSiteSettings()

  return <ServicesPageClient locale={locale} services={services} siteSettings={siteSettings} />
}