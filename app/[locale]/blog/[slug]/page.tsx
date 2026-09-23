import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPublishedBlogPostBySlug } from '@/src/lib/public/blog'
import { getSiteSettings } from '@/src/lib/public/settings'
import BlogPostClient from './BlogPostClient'

/* ------------------------------------------------------------------ */
/*  Blog post detail page (Server Component)                           */
/*  Fetches a single PUBLISHED post by slug; 404s on missing/draft.    */
/*  Localized SEO metadata comes from the real Firestore record.       */
/* ------------------------------------------------------------------ */
export const dynamic = 'force-dynamic'

interface BlogPostPageProps {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { locale, slug } = await params
  const post = await getPublishedBlogPostBySlug(slug)
  if (!post) return {}

  const displayLocale = locale === 'ar' ? 'ar' : 'en'
  const title = post.title[displayLocale]?.trim() || post.title.en?.trim() || ''
  const description =
    post.excerpt[displayLocale]?.trim() || post.excerpt.en?.trim() || ''

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      locale: locale === 'ar' ? 'ar' : 'en',
      publishedTime: post.publishedAt,
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { locale, slug } = await params
  const post = await getPublishedBlogPostBySlug(slug)

  // Published-only: anything else (draft, archived, or missing) → 404.
  if (!post) notFound()

  const siteSettings = await getSiteSettings()

  return <BlogPostClient locale={locale} post={post} siteSettings={siteSettings} />
}