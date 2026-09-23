import { getSiteSettings } from '@/src/lib/public/settings'
import AboutPageClient from './AboutPageClient'

/* ------------------------------------------------------------------ */
/*  About (Server Component)                                          */
/*  Fetches the site settings singleton (company info / social links) */
/*  and delegates rendering to the client component.                  */
/* ------------------------------------------------------------------ */
export const dynamic = 'force-dynamic'

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const siteSettings = await getSiteSettings()

  return <AboutPageClient locale={locale} siteSettings={siteSettings} />
}