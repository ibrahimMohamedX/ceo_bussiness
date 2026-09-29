'use server'

import { getPublicFirestore } from '@/src/lib/firebase/admin'
import type {
  BlogPostRecord,
  BlogPostMedia,
  BlogPostMediaKind,
  BilingualText,
} from '@/src/lib/admin/blog'
import type { CloudinaryResourceType } from '@/src/lib/admin/media'

/**
 * Public-facing blog post record with bilingual fields and media
 * Used by public pages (blog listing, blog detail) - only published posts
 */
export interface PublicBlogPost {
  id: string
  slug: string
  title: BilingualText
  excerpt: BilingualText
  content: BilingualText
  category: string
  tags: string[]
  authorName: string
  status: 'published' // Only published posts exposed publicly
  coverMediaId: string | undefined
  sortOrder: number
  media: PublicBlogPostMedia[]
  publishedAt: string
  createdAt: string
  updatedAt: string
}

/**
 * Public-facing blog post media item
 */
export interface PublicBlogPostMedia {
  id: string
  kind: BlogPostMediaKind
  storagePath: string
  publicId: string
  resourceType: CloudinaryResourceType
  alt: BilingualText
  caption: BilingualText
  width: number | null
  height: number | null
  sortOrder: number
  isCover: boolean
  createdAt: string
  updatedAt: string
}

/**
 * Converts admin BlogPostRecord to public PublicBlogPost
 * Filters and transforms data for public consumption
 */
function toPublicBlogPost(record: BlogPostRecord): PublicBlogPost {
  return {
    id: record.id,
    slug: record.slug,
    title: record.title,
    excerpt: record.excerpt,
    content: { en: record.content?.en ?? '', ar: record.content?.ar ?? '' },
    category: record.category,
    tags: record.tags,
    authorName: record.authorName,
    status: 'published' as const,
    coverMediaId: record.coverMediaId,
    sortOrder: record.sortOrder,
    media: record.media.map((m) => ({
      id: m.id,
      kind: m.kind,
      storagePath: m.storagePath ?? '',
      publicId: m.publicId ?? '',
      resourceType: m.resourceType ?? 'image',
      alt: { en: m.alt.en ?? '', ar: m.alt.ar ?? '' },
      caption: { en: m.caption.en ?? '', ar: m.caption.ar ?? '' },
      width: m.width ?? null,
      height: m.height ?? null,
      sortOrder: m.sortOrder,
      isCover: m.id === record.coverMediaId,
      createdAt: m.createdAt.toString(),
      updatedAt: m.updatedAt.toString(),
    })),
    publishedAt: record.publishedAt?.toString() ?? record.createdAt.toString(),
    createdAt: record.createdAt.toString(),
    updatedAt: record.updatedAt.toString(),
  }
}

/**
 * Fetches all published blog posts for public pages
 * Ordered by sortOrder asc, then publishedAt desc
 * Server-side only - uses Admin SDK via firebase-admin
 */
export async function getPublishedBlogPosts(): Promise<PublicBlogPost[]> {
  const db = getPublicFirestore()
  if (!db) return []
  const snapshot = await db
    .collection('blogPosts')
    .where('status', '==', 'published')
    .orderBy('sortOrder', 'asc')
    .orderBy('publishedAt', 'desc')
    .get()

  const posts: PublicBlogPost[] = []
  for (const doc of snapshot.docs) {
    const data = doc.data() as BlogPostRecord
    posts.push(toPublicBlogPost({ ...data, id: doc.id }))
  }
  return posts
}

/**
 * Fetches featured published blog posts for homepage
 * Limited to featured posts, ordered by sortOrder
 * Note: Blog posts don't have a 'featured' field, so we use sortOrder to determine priority
 */
export async function getFeaturedBlogPosts(limitCount = 3): Promise<PublicBlogPost[]> {
  const db = getPublicFirestore()
  if (!db) return []
  const snapshot = await db
    .collection('blogPosts')
    .where('status', '==', 'published')
    .orderBy('sortOrder', 'asc')
    .orderBy('publishedAt', 'desc')
    .limit(limitCount)
    .get()

  const posts: PublicBlogPost[] = []
  for (const doc of snapshot.docs) {
    const data = doc.data() as BlogPostRecord
    posts.push(toPublicBlogPost({ ...data, id: doc.id }))
  }
  return posts
}

/**
 * Fetches a single published blog post by slug
 * Returns null if not found or not published
 */
export async function getPublishedBlogPostBySlug(slug: string): Promise<PublicBlogPost | null> {
  const db = getPublicFirestore()
  if (!db) return null
  const snapshot = await db
    .collection('blogPosts')
    .where('slug', '==', slug)
    .where('status', '==', 'published')
    .limit(1)
    .get()

  if (snapshot.empty) return null

  const doc = snapshot.docs[0]
  const data = doc.data() as BlogPostRecord
  return toPublicBlogPost({ ...data, id: doc.id })
}

/**
 * Fetches blog post categories for filtering
 * Returns unique categories from published posts
 */
export async function getBlogPostCategories(): Promise<string[]> {
  const posts = await getPublishedBlogPosts()
  const categories = new Set<string>()
  for (const p of posts) {
    categories.add(p.category)
  }
  return Array.from(categories).sort()
}

/**
 * Fetches all tags used in published blog posts
 * Returns unique tags array
 */
export async function getBlogPostTags(): Promise<string[]> {
  const posts = await getPublishedBlogPosts()
  const tags = new Set<string>()
  for (const p of posts) {
    for (const t of p.tags) {
      tags.add(t)
    }
  }
  return Array.from(tags).sort()
}