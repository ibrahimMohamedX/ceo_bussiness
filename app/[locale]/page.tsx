import { getFeaturedProjects } from '@/src/lib/public/projects'
import { getSiteSettings } from '@/src/lib/public/settings'
import { getFeaturedTestimonials } from '@/src/lib/public/testimonials'
import { getPublishedFaqs } from '@/src/lib/public/faq'
import HomepageClient from './HomepageClient'

/* ------------------------------------------------------------------ */
/*  Homepage (Server Component)                                       */
/*  Fetches featured projects and testimonials, delegates to client   */
/* ------------------------------------------------------------------ */
export const dynamic = 'force-dynamic'

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const featuredProjects = await getFeaturedProjects(6)
  const featuredTestimonials = await getFeaturedTestimonials(6)
  const faqs = await getPublishedFaqs()
  const siteSettings = await getSiteSettings()

  return (
    <HomepageClient
      locale={locale}
      featuredProjects={featuredProjects}
      featuredTestimonials={featuredTestimonials}
      faqs={faqs}
      siteSettings={siteSettings}
    />
  )
}