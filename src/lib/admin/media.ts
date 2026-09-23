import 'server-only'

import { getAdminFirestore } from '@/src/lib/firebase/admin'
import { can, type AdminFeature } from '@/src/lib/admin/roles'
import type { AdminSession } from '@/src/lib/admin/session'

// Server-only data-access layer for the media metadata index (media/ collection)
// and per-project media subcollection writes. The binary itself is uploaded by
// the client directly to Storage under media/{ownerType}/{ownerId} (enforced by
// storage.rules isAnyAdmin()); the server only authorizes and records metadata,
// so firebase-admin credentials never touch raw blobs.
//
// Firestore writes here go through the Admin SDK, which bypasses client rules but
// is role-gated by the session check below. Nothing here is importable by a
// client component.

import { ApiError, type BilingualText } from '@/src/lib/admin/projects'
export { ApiError }

const firestore = () => getAdminFirestore()

export type MediaOwnerType =
  | 'project'
  | 'blog'
  | 'about'
  | 'testimonial'
  | 'inquiry'
  | 'general'

export type ProjectMediaKind = 'cover' | 'gallery' | 'diagram' | 'screenshot' | 'logo'
export type BlogPostMediaKind = 'cover' | 'gallery' | 'diagram' | 'screenshot'

export interface ProjectMediaInput {
  projectId: string
  storagePath: string
  fileName: string
  kind: ProjectMediaKind
  alt?: Partial<BilingualText>
  caption?: Partial<BilingualText>
  sortOrder: number
  width?: number
  height?: number
  mimeType?: string
  sizeBytes?: number
}

export interface BlogPostMediaInput {
  postId: string
  storagePath: string
  fileName: string
  kind: BlogPostMediaKind
  alt?: Partial<BilingualText>
  caption?: Partial<BilingualText>
  sortOrder: number
  width?: number
  height?: number
  mimeType?: string
  sizeBytes?: number
}

export interface MediaLibraryInput {
  ownerType: MediaOwnerType
  ownerId?: string
  storagePath: string
  fileName: string
  mimeType: string
  sizeBytes: number
  width?: number
  height?: number
  alt?: Partial<BilingualText>
  caption?: Partial<BilingualText>
}

function requireRole(session: AdminSession | null, feature: AdminFeature): AdminSession {
  if (!session) throw new ApiError(401, 'Not authenticated.')
  if (!can(session.role, feature)) throw new ApiError(403, `Role '${session.role}' cannot manage ${feature}.`)
  return session
}

async function requireMediaAdmin(session: AdminSession | null): Promise<AdminSession> {
  return requireRole(session, 'content')
}

/**
 * Register a project media subcollection doc (projects/{id}/media/{mediaId})
 * and mirror it in the global media/ library index. Enforces the storage path
 * convention media/projects/{projectId}/... for every project binary.
 */
export async function createProjectMedia(
  session: AdminSession | null,
  input: ProjectMediaInput
): Promise<{ mediaId: string }> {
  const authSession = await requireMediaAdmin(session)

  if (!input.projectId) throw new ApiError(400, 'projectId is required.')
  if (!input.storagePath) throw new ApiError(400, 'storagePath is required.')
  if (!input.fileName) throw new ApiError(400, 'fileName is required.')

  const expectedPrefix = `media/projects/${input.projectId}/`
  if (!input.storagePath.startsWith(expectedPrefix)) {
    throw new ApiError(
      400,
      `Storage path must live under ${expectedPrefix} (storage.rules only permits media/{ownerType}/{ownerId}).`,
    )
  }

  const now = new Date()
  const ref = firestore().collection('projects').doc(input.projectId)
  const snap = await ref.get()
  if (!snap.exists) throw new ApiError(404, 'Project not found.')

  const mediaDoc = ref.collection('media').doc()
  await mediaDoc.set({
    storagePath: input.storagePath,
    fileName: input.fileName,
    kind: input.kind,
    alt: cleanPartial(input.alt),
    caption: cleanPartial(input.caption),
    sortOrder: input.sortOrder ?? 0,
    width: input.width ?? null,
    height: input.height ?? null,
    mimeType: input.mimeType ?? null,
    sizeBytes: input.sizeBytes ?? null,
    createdAt: now,
    updatedAt: now,
  })

  // Global media/ library index (docs/architecture/06_MEDIA_LIBRARY.md §4).
  // Use a deterministic doc id derived from the storage path so re-registering
  // the same path upserts instead of duplicating the index entry.
  await firestore().collection('media').doc(indexIdForPath(input.storagePath)).set({
    storagePath: input.storagePath,
    public: true,
    ownerType: 'project',
    ownerId: input.projectId,
    fileName: input.fileName,
    mimeType: input.mimeType ?? '',
    sizeBytes: input.sizeBytes ?? 0,
    width: input.width ?? null,
    height: input.height ?? null,
    alt: cleanPartial(input.alt),
    caption: cleanPartial(input.caption),
    createdBy: authSession.uid,
    createdAt: now,
    updatedAt: now,
  })

  return { mediaId: mediaDoc.id }
}

/**
 * Update an existing project media doc in place (kind/alt/caption/sort/dims).
 */
export async function updateProjectMedia(
  session: AdminSession | null,
  projectId: string,
  mediaId: string,
  patch: {
    kind?: ProjectMediaKind
    alt?: Partial<BilingualText>
    caption?: Partial<BilingualText>
    sortOrder?: number
    width?: number
    height?: number
    mimeType?: string
    sizeBytes?: number
  }
): Promise<void> {
  requireRole(session, 'content')

  const ref = firestore().collection('projects').doc(projectId).collection('media').doc(mediaId)
  const snap = await ref.get()
  if (!snap.exists) throw new ApiError(404, 'Media item not found.')

  const next: Record<string, unknown> = { updatedAt: new Date() }
  if (patch.kind) next.kind = patch.kind
  if (patch.alt) next.alt = cleanPartial(patch.alt)
  if (patch.caption) next.caption = cleanPartial(patch.caption)
  if (typeof patch.sortOrder === 'number') next.sortOrder = patch.sortOrder
  if (typeof patch.width === 'number') next.width = patch.width
  if (typeof patch.height === 'number') next.height = patch.height
  if (typeof patch.mimeType === 'string') next.mimeType = patch.mimeType
  if (typeof patch.sizeBytes === 'number') next.sizeBytes = patch.sizeBytes

  await ref.update(next)

  // Mirror the full patched metadata into the library index (not just updatedAt),
  // so the global picker stays consistent with the per-owner subcollection.
  const c = await ref.get()
  const storagePath = c.data()?.storagePath
  if (storagePath) {
    const index: Record<string, unknown> = { updatedAt: new Date() }
    if (patch.kind) index.kind = patch.kind
    if (patch.alt) index.alt = cleanPartial(patch.alt)
    if (patch.caption) index.caption = cleanPartial(patch.caption)
    if (typeof patch.width === 'number') index.width = patch.width
    if (typeof patch.height === 'number') index.height = patch.height
    if (typeof patch.mimeType === 'string') index.mimeType = patch.mimeType
    if (typeof patch.sizeBytes === 'number') index.sizeBytes = patch.sizeBytes
    const lib = await firestore().collection('media').where('storagePath', '==', storagePath).get()
    for (const libDoc of lib.docs) await libDoc.ref.update(index)
  }
}

/**
 * Reorder many project media items in one go (write every doc's sortOrder).
 */
export async function reorderProjectMedia(
  session: AdminSession | null,
  projectId: string,
  orderedMediaIds: string[]
): Promise<void> {
  requireRole(session, 'content')

  const col = firestore()
    .collection('projects')
    .doc(projectId)
    .collection('media')

  // Reject the whole request if any id does not exist, to keep ordering atomic.
  const snap = await col.get()
  const existing = new Set(snap.docs.map((d) => d.id))
  for (const id of orderedMediaIds) {
    if (!existing.has(id)) throw new ApiError(400, `Media item not found: ${id}`)
  }

  const batch = firestore().batch()
  orderedMediaIds.forEach((id, index) => {
    batch.update(col.doc(id), { sortOrder: index, updatedAt: new Date() })
  })
  await batch.commit()
}

/**
 * Delete a project media item after reference checks (per
 * docs/architecture/06_MEDIA_LIBRARY.md §8). This removes Firestore metadata but
 * NOT the storage binary — callers should also delete the storage object and, if
 * it was the cover, clear the project's coverMediaId.
 */
export async function deleteProjectMedia(
  session: AdminSession | null,
  projectId: string,
  mediaId: string
): Promise<{ wasCover: boolean; storagePath: string | null }> {
  requireRole(session, 'content')

  const ref = firestore().collection('projects').doc(projectId).collection('media').doc(mediaId)
  const snap = await ref.get()
  if (!snap.exists) throw new ApiError(404, 'Media item not found.')

  const media = snap.data()!
  const storagePath: string | null = media.storagePath ?? null

  const projectSnap = await firestore().collection('projects').doc(projectId).get()
  const wasCover = projectSnap.data()?.coverMediaId === mediaId

  // Update the project doc if this was the cover reference.
  if (wasCover) {
    await projectSnap.ref.update({ coverMediaId: null, updatedAt: new Date() })
  }

  // Remove library index docs pointing at the same storage path.
  if (storagePath) {
    const lib = await firestore().collection('media').where('storagePath', '==', storagePath).get()
    for (const libDoc of lib.docs) await libDoc.ref.delete()
  }

  await ref.delete()
  return { wasCover, storagePath }
}

/**
 * Register a blog post media subcollection doc (blogPosts/{id}/media/{mediaId})
 * and mirror it in the global media/ library index with ownerType 'blog'.
 * Enforces the storage path convention media/blog/{postId}/... for every blog
 * binary — a blog post is its own owner type, NOT a project.
 */
export async function createBlogMedia(
  session: AdminSession | null,
  input: BlogPostMediaInput
): Promise<{ mediaId: string }> {
  const authSession = await requireMediaAdmin(session)

  if (!input.postId) throw new ApiError(400, 'postId is required.')
  if (!input.storagePath) throw new ApiError(400, 'storagePath is required.')
  if (!input.fileName) throw new ApiError(400, 'fileName is required.')

  const expectedPrefix = `media/blog/${input.postId}/`
  if (!input.storagePath.startsWith(expectedPrefix)) {
    throw new ApiError(
      400,
      `Storage path must live under ${expectedPrefix} (storage.rules only permits media/{ownerType}/{ownerId}).`,
    )
  }

  const now = new Date()
  const ref = firestore().collection('blogPosts').doc(input.postId)
  const snap = await ref.get()
  if (!snap.exists) throw new ApiError(404, 'Blog post not found.')

  const mediaDoc = ref.collection('media').doc()
  await mediaDoc.set({
    storagePath: input.storagePath,
    fileName: input.fileName,
    kind: input.kind,
    alt: cleanPartial(input.alt),
    caption: cleanPartial(input.caption),
    sortOrder: input.sortOrder ?? 0,
    width: input.width ?? null,
    height: input.height ?? null,
    mimeType: input.mimeType ?? null,
    sizeBytes: input.sizeBytes ?? null,
    createdAt: now,
    updatedAt: now,
  })

  // Global media/ library index (docs/architecture/06_MEDIA_LIBRARY.md §4).
  // Use a deterministic doc id derived from the storage path so re-registering
  // the same path upserts instead of duplicating the index entry.
  await firestore().collection('media').doc(indexIdForPath(input.storagePath)).set({
    storagePath: input.storagePath,
    public: true,
    ownerType: 'blog',
    ownerId: input.postId,
    fileName: input.fileName,
    mimeType: input.mimeType ?? '',
    sizeBytes: input.sizeBytes ?? 0,
    width: input.width ?? null,
    height: input.height ?? null,
    alt: cleanPartial(input.alt),
    caption: cleanPartial(input.caption),
    createdBy: authSession.uid,
    createdAt: now,
    updatedAt: now,
  })

  return { mediaId: mediaDoc.id }
}

/**
 * Update an existing blog post media doc in place (kind/alt/caption/sort/dims).
 */
export async function updateBlogMedia(
  session: AdminSession | null,
  postId: string,
  mediaId: string,
  patch: {
    kind?: BlogPostMediaKind
    alt?: Partial<BilingualText>
    caption?: Partial<BilingualText>
    sortOrder?: number
    width?: number
    height?: number
    mimeType?: string
    sizeBytes?: number
  }
): Promise<void> {
  requireRole(session, 'content')

  const ref = firestore().collection('blogPosts').doc(postId).collection('media').doc(mediaId)
  const snap = await ref.get()
  if (!snap.exists) throw new ApiError(404, 'Media item not found.')

  const next: Record<string, unknown> = { updatedAt: new Date() }
  if (patch.kind) next.kind = patch.kind
  if (patch.alt) next.alt = cleanPartial(patch.alt)
  if (patch.caption) next.caption = cleanPartial(patch.caption)
  if (typeof patch.sortOrder === 'number') next.sortOrder = patch.sortOrder
  if (typeof patch.width === 'number') next.width = patch.width
  if (typeof patch.height === 'number') next.height = patch.height
  if (typeof patch.mimeType === 'string') next.mimeType = patch.mimeType
  if (typeof patch.sizeBytes === 'number') next.sizeBytes = patch.sizeBytes

  await ref.update(next)

  // Mirror the full patched metadata into the library index (not just updatedAt),
  // so the global picker stays consistent with the per-owner subcollection.
  const c = await ref.get()
  const storagePath = c.data()?.storagePath
  if (storagePath) {
    const index: Record<string, unknown> = { updatedAt: new Date() }
    if (patch.kind) index.kind = patch.kind
    if (patch.alt) index.alt = cleanPartial(patch.alt)
    if (patch.caption) index.caption = cleanPartial(patch.caption)
    if (typeof patch.width === 'number') index.width = patch.width
    if (typeof patch.height === 'number') index.height = patch.height
    if (typeof patch.mimeType === 'string') index.mimeType = patch.mimeType
    if (typeof patch.sizeBytes === 'number') index.sizeBytes = patch.sizeBytes
    const lib = await firestore().collection('media').where('storagePath', '==', storagePath).get()
    for (const libDoc of lib.docs) await libDoc.ref.update(index)
  }
}

/**
 * Reorder many blog post media items in one go (write every doc's sortOrder).
 */
export async function reorderBlogMedia(
  session: AdminSession | null,
  postId: string,
  orderedMediaIds: string[]
): Promise<void> {
  requireRole(session, 'content')

  const col = firestore()
    .collection('blogPosts')
    .doc(postId)
    .collection('media')

  // Reject the whole request if any id does not exist, to keep ordering atomic.
  const snap = await col.get()
  const existing = new Set(snap.docs.map((d) => d.id))
  for (const id of orderedMediaIds) {
    if (!existing.has(id)) throw new ApiError(400, `Media item not found: ${id}`)
  }

  const batch = firestore().batch()
  orderedMediaIds.forEach((id, index) => {
    batch.update(col.doc(id), { sortOrder: index, updatedAt: new Date() })
  })
  await batch.commit()
}

/**
 * Delete a blog post media item after reference checks (per
 * docs/architecture/06_MEDIA_LIBRARY.md §8). This removes Firestore metadata but
 * NOT the storage binary — callers should also delete the storage object and, if
 * it was the cover, clear the post's coverMediaId.
 */
export async function deleteBlogMedia(
  session: AdminSession | null,
  postId: string,
  mediaId: string
): Promise<{ wasCover: boolean; storagePath: string | null }> {
  requireRole(session, 'content')

  const ref = firestore().collection('blogPosts').doc(postId).collection('media').doc(mediaId)
  const snap = await ref.get()
  if (!snap.exists) throw new ApiError(404, 'Media item not found.')

  const media = snap.data()!
  const storagePath: string | null = media.storagePath ?? null

  const postSnap = await firestore().collection('blogPosts').doc(postId).get()
  const wasCover = postSnap.data()?.coverMediaId === mediaId

  // Update the post doc if this was the cover reference.
  if (wasCover) {
    await postSnap.ref.update({ coverMediaId: null, updatedAt: new Date() })
  }

  // Remove library index docs pointing at the same storage path.
  if (storagePath) {
    const lib = await firestore().collection('media').where('storagePath', '==', storagePath).get()
    for (const libDoc of lib.docs) await libDoc.ref.delete()
  }

  await ref.delete()
  return { wasCover, storagePath }
}

/** A single record in the global media/ library index. */
export interface MediaLibraryItem {
  id: string
  storagePath: string
  public: boolean
  ownerType: MediaOwnerType
  ownerId?: string
  fileName: string
  mimeType: string
  sizeBytes: number
  width?: number | null
  height?: number | null
  alt?: Partial<BilingualText> | null
  caption?: Partial<BilingualText> | null
  createdBy: string
  createdAt: unknown
  updatedAt: unknown
}

/** Generic media library record (read-only access for pickers). */
export async function listMediaLibrary(
  session: AdminSession | null,
  ownerType?: MediaOwnerType
): Promise<MediaLibraryItem[]> {
  requireRole(session, 'media')

  let q = firestore()
    .collection('media')
    .orderBy('createdAt', 'desc')
  if (ownerType) q = q.where('ownerType', '==', ownerType)
  const snap = await q.limit(500).get()
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as MediaLibraryItem)
}

/**
 * Delete a media item from the global library index (media/{mediaId}) plus the
 * source subcollection doc (e.g. projects/{id}/media/{mediaId}) that mirrors it,
 * and return the storage path so the caller can remove the binary. Reference
 * checks per docs/architecture/06_MEDIA_LIBRARY.md §8: refuse if another entity
 * still references the storage path (a cover reference). All index docs sharing
 * the storage path are removed, so legacy duplicates are cleaned up too.
 */
export async function deleteMediaLibrary(
  session: AdminSession | null,
  mediaId: string
): Promise<{ storagePath: string; ownerType: MediaOwnerType; ownerId?: string }> {
  requireRole(session, 'media')

  const libRef = firestore().collection('media').doc(mediaId)
  const libSnap = await libRef.get()
  if (!libSnap.exists) throw new ApiError(404, 'Media item not found.')

  const data = libSnap.data()!
  const storagePath: string | undefined = data.storagePath
  const ownerType: MediaOwnerType | undefined = data.ownerType
  const ownerId: string | undefined = data.ownerId

  if (!storagePath) throw new ApiError(400, 'Media item is missing a storage path.')
  if (!ownerType) throw new ApiError(400, 'Media item is missing an owner type.')

  // Reference check: refuse deletion while this storage path is still the cover
  // of its owning project or blog post (docs/architecture/06_MEDIA_LIBRARY.md §8).
  if (ownerType === 'project' && ownerId) {
    const projectSnap = await firestore().collection('projects').doc(ownerId).get()
    if (projectSnap.exists && projectSnap.data()?.coverMediaId) {
      const subSnap = await firestore()
        .collection('projects')
        .doc(ownerId)
        .collection('media')
        .where('storagePath', '==', storagePath)
        .get()
      const isCover = subSnap.docs.some((d) => d.id === projectSnap.data()?.coverMediaId)
      if (isCover) {
        throw new ApiError(409, 'This media is the cover of a project. Change the cover before deleting it.')
      }
    }
  }
  if (ownerType === 'blog' && ownerId) {
    const postSnap = await firestore().collection('blogPosts').doc(ownerId).get()
    if (postSnap.exists && postSnap.data()?.coverMediaId) {
      const subSnap = await firestore()
        .collection('blogPosts')
        .doc(ownerId)
        .collection('media')
        .where('storagePath', '==', storagePath)
        .get()
      const isCover = subSnap.docs.some((d) => d.id === postSnap.data()?.coverMediaId)
      if (isCover) {
        throw new ApiError(409, 'This media is the cover of a blog post. Change the cover before deleting it.')
      }
    }
  }

  // Remove any source subcollection docs that mirror this storage path (so the
  // per-owner gallery stays consistent with the library index).
  if (ownerType === 'project' && ownerId) {
    const sub = await firestore()
      .collection('projects')
      .doc(ownerId)
      .collection('media')
      .where('storagePath', '==', storagePath)
      .get()
    for (const subDoc of sub.docs) await subDoc.ref.delete()
  }
  if (ownerType === 'blog' && ownerId) {
    const sub = await firestore()
      .collection('blogPosts')
      .doc(ownerId)
      .collection('media')
      .where('storagePath', '==', storagePath)
      .get()
    for (const subDoc of sub.docs) await subDoc.ref.delete()
  }

  // Remove every index doc pointing at this storage path (covers legacy
  // duplicates created before the deterministic-id fix).
  const lib = await firestore().collection('media').where('storagePath', '==', storagePath).get()
  for (const libDoc of lib.docs) await libDoc.ref.delete()

  return { storagePath, ownerType, ownerId }
}

/**
 * Deterministic id for a global media/ index doc, keyed off the storage path so
 * the same binary is never indexed twice. A stable, filesystem-safe encoding of
 * the path (no '/', no '.' prefix, ≤ 1500 bytes) keeps the id a valid Firestore
 * doc id while remaining unique per distinct path.
 */
function indexIdForPath(storagePath: string): string {
  return Buffer.from(storagePath, 'utf8').toString('base64url')
}

function cleanPartial(v?: Partial<BilingualText>): Partial<BilingualText> | null {
  if (!v) return null
  const out: Partial<BilingualText> = {}
  if (typeof v.en === 'string') out.en = v.en.trim()
  if (typeof v.ar === 'string') out.ar = v.ar.trim()
  return out.en || out.ar ? out : null
}