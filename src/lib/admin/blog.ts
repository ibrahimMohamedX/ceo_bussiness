import 'server-only'

import { getAdminFirestore, getAdminStorage } from '@/src/lib/firebase/admin'
import { can, type AdminFeature } from '@/src/lib/admin/roles'
import { deleteMedia } from '@/src/lib/cloudinary/media'
import type { AdminSession } from '@/src/lib/admin/session'
import type { CloudinaryResourceType } from '@/src/lib/admin/media'

// Server-only data-access layer for Blog Posts CRUD.
//
// The Admin SDK is the ONLY way this module reads/writes Firestore and Storage.
// Nothing here is ever imported by a client component. Authorization is enforced
// at each function boundary via requireBlogAdmin() (role-gated with can()).
// Binary uploads follow the enforced storage convention media/{ownerType}/{ownerId}
// (see storage.rules) and are referenced by Firestore, never inlined.

const firestore = () => getAdminFirestore()
const storage = () => getAdminStorage()

export type BlogPostStatus = 'draft' | 'published' | 'archived'
export type BlogPostMediaKind = 'cover' | 'gallery' | 'diagram' | 'screenshot'

export interface BilingualText {
  en: string
  ar: string
}

export interface BlogPostMedia {
  id: string
  storagePath?: string
  publicId?: string
  resourceType?: CloudinaryResourceType
  fileName: string
  kind: BlogPostMediaKind
  alt: { en?: string; ar?: string }
  caption: { en?: string; ar?: string }
  sortOrder: number
  width?: number
  height?: number
  mimeType?: string
  sizeBytes?: number
  createdAt: number
  updatedAt: number
}

export interface BlogPostRecord {
  id: string
  slug: string
  title: BilingualText
  excerpt: BilingualText
  content?: Partial<BilingualText>
  category: string
  tags: string[]
  authorName: string
  status: BlogPostStatus
  coverMediaId?: string
  sortOrder: number
  publishedAt?: number
  createdAt: number
  updatedAt: number
  media: BlogPostMedia[]
}

export interface BlogPostInput {
  slug: string
  title: BilingualText
  excerpt: BilingualText
  content?: Partial<BilingualText>
  category: string
  tags: string[]
  authorName: string
  status: BlogPostStatus
  coverMediaId?: string
  sortOrder: number
  publishedAt?: Date | null
}

const isBilingualStr = (v: unknown): v is BilingualText =>
  !!v && typeof v === 'object' && typeof (v as BilingualText).en === 'string' && typeof (v as BilingualText).ar === 'string'

const ts = (v: FirebaseFirestore.Timestamp | undefined): number | undefined =>
  v ? v.toMillis() : undefined

function requireRole(session: AdminSession | null, feature: AdminFeature): AdminSession {
  if (!session) throw new ApiError(401, 'Not authenticated.')
  if (!can(session.role, feature)) throw new ApiError(403, `Role '${session.role}' cannot manage ${feature}.`)
  return session
}

// HTTP-style error so route handlers can translate directly to status codes.
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function toRecord(postId: string): Promise<BlogPostRecord> {
  const doc = await firestore().collection('blogPosts').doc(postId).get()
  const data = doc.data()
  if (!doc.exists || !data) throw new ApiError(404, 'Blog post not found.')

  const mediaSnap = await doc.ref.collection('media').orderBy('sortOrder', 'asc').get()
  const media: BlogPostMedia[] = mediaSnap.docs.map((md) => {
    const m = md.data()
    return {
      id: md.id,
      storagePath: m.storagePath ?? '',
      publicId: m.publicId ?? '',
      resourceType: m.resourceType ?? 'image',
      fileName: m.fileName ?? '',
      kind: (m.kind as BlogPostMediaKind) ?? 'gallery',
      alt: m.alt ?? {},
      caption: m.caption ?? {},
      sortOrder: m.sortOrder ?? 0,
      width: m.width,
      height: m.height,
      mimeType: m.mimeType,
      sizeBytes: m.sizeBytes,
      createdAt: ts(m.createdAt) ?? 0,
      updatedAt: ts(m.updatedAt) ?? 0,
    }
  })

  return {
    id: doc.id,
    slug: data.slug ?? '',
    title: data.title ?? { en: '', ar: '' },
    excerpt: data.excerpt ?? { en: '', ar: '' },
    content: data.content,
    category: data.category ?? '',
    tags: data.tags ?? [],
    authorName: data.authorName ?? '',
    status: (data.status as BlogPostStatus) ?? 'draft',
    coverMediaId: data.coverMediaId,
    sortOrder: data.sortOrder ?? 0,
    publishedAt: ts(data.publishedAt),
    createdAt: ts(data.createdAt) ?? 0,
    updatedAt: ts(data.updatedAt) ?? 0,
    media,
  }
}

export async function requireAdminForBlog(
  session: AdminSession | null
): Promise<AdminSession> {
  return requireRole(session, 'content')
}

export async function listBlogPosts(session: AdminSession | null): Promise<BlogPostRecord[]> {
  requireAdminForBlog(session)
  const snap = await firestore().collection('blogPosts').orderBy('sortOrder', 'asc').get()
  return Promise.all(snap.docs.map((d) => toRecord(d.id)))
}

export async function getBlogPost(
  session: AdminSession | null,
  id: string
): Promise<BlogPostRecord> {
  requireAdminForBlog(session)
  return toRecord(id)
}

export async function createBlogPost(
  session: AdminSession | null,
  input: BlogPostInput
): Promise<BlogPostRecord> {
  requireAdminForBlog(session)
  validateInput(input)

  const now = new Date()
  const doc = firestore().collection('blogPosts').doc()
  await doc.set({
    slug: input.slug,
    title: { en: input.title.en.trim(), ar: input.title.ar.trim() },
    excerpt: { en: input.excerpt.en.trim(), ar: input.excerpt.ar.trim() },
    content: cleanPartial(input.content),
    category: input.category,
    tags: input.tags.map((t) => t.trim()).filter(Boolean),
    authorName: input.authorName.trim(),
    status: input.status,
    coverMediaId: input.coverMediaId ?? null,
    sortOrder: input.sortOrder ?? 0,
    publishedAt: input.status === 'published' ? (input.publishedAt ?? now) : null,
    createdAt: now,
    updatedAt: now,
  })

  return toRecord(doc.id)
}

export async function updateBlogPost(
  session: AdminSession | null,
  id: string,
  input: BlogPostInput
): Promise<BlogPostRecord> {
  requireAdminForBlog(session)
  validateInput(input)

  const ref = firestore().collection('blogPosts').doc(id)
  const snap = await ref.get()
  if (!snap.exists) throw new ApiError(404, 'Blog post not found.')

  await ref.update({
    slug: input.slug,
    title: { en: input.title.en.trim(), ar: input.title.ar.trim() },
    excerpt: { en: input.excerpt.en.trim(), ar: input.excerpt.ar.trim() },
    content: cleanPartial(input.content),
    category: input.category,
    tags: input.tags.map((t) => t.trim()).filter(Boolean),
    authorName: input.authorName.trim(),
    status: input.status,
    coverMediaId: input.coverMediaId ?? null,
    sortOrder: input.sortOrder ?? 0,
    publishedAt: input.status === 'published' ? (input.publishedAt ?? new Date()) : null,
    updatedAt: new Date(),
  })

  return toRecord(id)
}

export async function deleteBlogPost(
  session: AdminSession | null,
  id: string
): Promise<void> {
  requireAdminForBlog(session)

  const ref = firestore().collection('blogPosts').doc(id)
  const snap = await ref.get()
  if (!snap.exists) throw new ApiError(404, 'Blog post not found.')

  // Remove subcollection media docs + referenced storage files before the doc.
  const mediaSnap = await ref.collection('media').get()
  const bucket = storage().bucket()
  const mediaLibrary = firestore().collection('media')

  for (const md of mediaSnap.docs) {
    const media = md.data()
    const storagePath = media.storagePath
    const publicId = media.publicId
    const resourceType = media.resourceType ?? 'image'
    // Destroy the Cloudinary asset first (primary store). Best effort: a missing
    // or already-deleted asset must not block removing the owning document.
    if (publicId) {
      await deleteMedia(publicId, resourceType).catch(() => {})
    }
    // Legacy Firebase object, if this record predates the Cloudinary migration.
    if (storagePath) {
      await bucket.file(storagePath).delete().catch(() => {})
    }
    // Remove the media/ library metadata docs that point at the same asset,
    // matching on either identity so legacy and Cloudinary-era entries are cleaned.
    const libQueries = []
    if (publicId) libQueries.push(mediaLibrary.where('publicId', '==', publicId).get())
    if (storagePath) libQueries.push(mediaLibrary.where('storagePath', '==', storagePath).get())
    for (const lib of await Promise.all(libQueries)) {
      for (const libDoc of lib.docs) await libDoc.ref.delete()
    }
    await md.ref.delete()
  }

  await ref.delete()
}

function validateInput(input: BlogPostInput): void {
  if (!input.slug || !input.slug.trim()) throw new ApiError(400, 'Slug is required.')
  if (!isBilingualStr(input.title) || !input.title.en.trim() || !input.title.ar.trim())
    throw new ApiError(400, 'Title requires both English and Arabic.')
  if (!isBilingualStr(input.excerpt) || !input.excerpt.en.trim() || !input.excerpt.ar.trim())
    throw new ApiError(400, 'Excerpt requires both English and Arabic.')
  if (!input.category || !input.category.trim()) throw new ApiError(400, 'Category is required.')
  if (!input.authorName || !input.authorName.trim()) throw new ApiError(400, 'Author name is required.')
  if (!['draft', 'published', 'archived'].includes(input.status))
    throw new ApiError(400, 'Invalid status.')
}

function cleanPartial(v?: Partial<BilingualText>): Partial<BilingualText> | undefined {
  if (!v) return undefined
  const out: Partial<BilingualText> = {}
  if (typeof v.en === 'string') out.en = v.en.trim()
  if (typeof v.ar === 'string') out.ar = v.ar.trim()
  return out.en || out.ar ? out : undefined
}