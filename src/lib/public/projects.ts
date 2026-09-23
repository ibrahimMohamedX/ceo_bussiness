'use server'

import { getPublicFirestore } from '@/src/lib/firebase/admin'
import type { ProjectRecord, ProjectMedia, ProjectMediaKind, BilingualText } from '@/src/lib/admin/projects'

/**
 * Public-facing project record with bilingual fields and media
 * Used by public pages (homepage, portfolio) - only published projects
 */
export interface PublicProject {
  id: string
  slug: string
  title: BilingualText
  summary: BilingualText
  description: BilingualText
  category: ProjectRecord['category']
  technologies: string[]
  industries: string[]
  featured: boolean
  status: 'published' // Only published projects exposed publicly
  coverMediaId: string | undefined
  sortOrder: number
  media: PublicProjectMedia[]
  createdAt: string
  updatedAt: string
}

/**
 * Public-facing project media item
 */
export interface PublicProjectMedia {
  id: string
  kind: ProjectMediaKind
  storagePath: string
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
 * Converts admin ProjectRecord to public PublicProject
 * Filters and transforms data for public consumption
 */
function toPublicProject(record: ProjectRecord): PublicProject {
  return {
    id: record.id,
    slug: record.slug,
    title: record.title,
    summary: record.summary,
    description: { en: record.description?.en ?? '', ar: record.description?.ar ?? '' },
    category: record.category,
    technologies: record.technologies,
    industries: record.industries,
    featured: record.featured,
    status: 'published' as const,
    coverMediaId: record.coverMediaId,
    sortOrder: record.sortOrder,
    media: record.media.map((m) => ({
      id: m.id,
      kind: m.kind,
      storagePath: m.storagePath,
      alt: { en: m.alt.en ?? '', ar: m.alt.ar ?? '' },
      caption: { en: m.caption.en ?? '', ar: m.caption.ar ?? '' },
      width: m.width ?? null,
      height: m.height ?? null,
      sortOrder: m.sortOrder,
      isCover: m.id === record.coverMediaId,
      createdAt: m.createdAt.toString(),
      updatedAt: m.updatedAt.toString(),
    })),
    createdAt: record.createdAt.toString(),
    updatedAt: record.updatedAt.toString(),
  }
}

/**
 * Fetches all published projects for public pages
 * Ordered by sortOrder asc, then createdAt desc
 * Server-side only - uses Admin SDK via firebase-admin
 */
export async function getPublishedProjects(): Promise<PublicProject[]> {
  const db = getPublicFirestore()
  if (!db) return []
  const snapshot = await db
    .collection('projects')
    .where('status', '==', 'published')
    .orderBy('sortOrder', 'asc')
    .orderBy('createdAt', 'desc')
    .get()

  const projects: PublicProject[] = []
  for (const doc of snapshot.docs) {
    const data = doc.data() as ProjectRecord
    projects.push(toPublicProject({ ...data, id: doc.id }))
  }
  return projects
}

/**
 * Fetches featured published projects for homepage
 * Limited to featured projects, ordered by sortOrder
 */
export async function getFeaturedProjects(limitCount = 3): Promise<PublicProject[]> {
  const db = getPublicFirestore()
  if (!db) return []
  const snapshot = await db
    .collection('projects')
    .where('status', '==', 'published')
    .where('featured', '==', true)
    .orderBy('sortOrder', 'asc')
    .orderBy('createdAt', 'desc')
    .limit(limitCount)
    .get()

  const projects: PublicProject[] = []
  for (const doc of snapshot.docs) {
    const data = doc.data() as ProjectRecord
    projects.push(toPublicProject({ ...data, id: doc.id }))
  }
  return projects
}

/**
 * Fetches a single published project by slug
 * Returns null if not found or not published
 */
export async function getPublishedProjectBySlug(slug: string): Promise<PublicProject | null> {
  const db = getPublicFirestore()
  if (!db) return null
  const snapshot = await db
    .collection('projects')
    .where('slug', '==', slug)
    .where('status', '==', 'published')
    .limit(1)
    .get()

  if (snapshot.empty) return null

  const doc = snapshot.docs[0]
  const data = doc.data() as ProjectRecord
  return toPublicProject({ ...data, id: doc.id })
}

/**
 * Fetches project categories for filtering
 * Returns unique categories from published projects
 */
export async function getProjectCategories(): Promise<ProjectRecord['category'][]> {
  const projects = await getPublishedProjects()
  const categories = new Set<ProjectRecord['category']>()
  for (const p of projects) {
    categories.add(p.category)
  }
  return Array.from(categories)
}

/**
 * Fetches all technologies used in published projects
 * Returns unique technologies array
 */
export async function getProjectTechnologies(): Promise<string[]> {
  const projects = await getPublishedProjects()
  const technologies = new Set<string>()
  for (const p of projects) {
    for (const t of p.technologies) {
      technologies.add(t)
    }
  }
  return Array.from(technologies).sort()
}

/**
 * Fetches all industries from published projects
 * Returns unique industries array
 */
export async function getProjectIndustries(): Promise<string[]> {
  const projects = await getPublishedProjects()
  const industries = new Set<string>()
  for (const p of projects) {
    for (const i of p.industries) {
      industries.add(i)
    }
  }
  return Array.from(industries).sort()
}