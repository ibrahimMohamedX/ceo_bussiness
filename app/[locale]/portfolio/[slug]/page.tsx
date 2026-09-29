import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPublishedProjectBySlug } from '@/src/lib/public/projects'
import { getSiteSettings } from '@/src/lib/public/settings'
import ProjectDetailClient from './ProjectDetailClient'

/* ------------------------------------------------------------------ */
/*  Portfolio project detail page (Server Component)                   */
/*  Fetches a single PUBLISHED project by slug; 404s on missing/draft. */
/*  Localized SEO metadata comes from the real Firestore record.       */
/* ------------------------------------------------------------------ */
export const dynamic = 'force-dynamic'

interface PortfolioProjectPageProps {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: PortfolioProjectPageProps): Promise<Metadata> {
  const { locale, slug } = await params
  const project = await getPublishedProjectBySlug(slug)
  if (!project) return {}

  const displayLocale = locale === 'ar' ? 'ar' : 'en'
  const title = project.title[displayLocale]?.trim() || project.title.en?.trim() || ''
  const description = project.summary[displayLocale]?.trim() || project.summary.en?.trim() || ''

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      locale: locale === 'ar' ? 'ar' : 'en',
    },
  }
}

export default async function PortfolioProjectPage({ params }: PortfolioProjectPageProps) {
  const { locale, slug } = await params
  const project = await getPublishedProjectBySlug(slug)

  // Published-only: anything else (draft, archived, or missing) → 404.
  if (!project) notFound()

  const siteSettings = await getSiteSettings()

  return <ProjectDetailClient locale={locale} project={project} siteSettings={siteSettings} />
}