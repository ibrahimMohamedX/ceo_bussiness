import { getPublishedBlogPosts, getBlogPostCategories, getBlogPostTags } from '@/src/lib/public/blog'
import { getSiteSettings } from '@/src/lib/public/settings'
import BlogPageClient from './BlogPageClient'

/* ------------------------------------------------------------------ */
/*  Blog page (Server Component)                                       */
/*  Fetches published blog posts, categories, and tags                */
/*  Passes data to client component                                   */
/* ------------------------------------------------------------------ */
export const dynamic = 'force-dynamic'

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const [posts, categories, tags] = await Promise.all([
    getPublishedBlogPosts(),
    getBlogPostCategories(),
    getBlogPostTags(),
  ])

  const siteSettings = await getSiteSettings()

  return <BlogPageClient locale={locale} posts={posts} categories={categories} tags={tags} siteSettings={siteSettings} />
}