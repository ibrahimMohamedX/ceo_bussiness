import 'server-only'
import { getAdminFirestore } from '@/src/lib/firebase/admin'
import { can, type AdminFeature } from '@/src/lib/admin/roles'
import type { AdminSession } from '@/src/lib/admin/session'
import { FieldValue, Timestamp } from 'firebase-admin/firestore'

/**
 * Firestore Services collection record â€” matches 01_FIREBASE_DATA_MODEL.md Â§7
 * Admin-facing, includes all statuses (draft/published/archived) and internal fields
 */
export interface ServiceRecord {
  id: string
  slug: string
  title: BilingualText
  summary: BilingualText
  description?: BilingualTextOptional
  tags: string[]
  icon?: string
  featured: boolean
  status: 'draft' | 'published' | 'archived'
  sortOrder: number
  updatedAt: Timestamp | string
  createdAt?: Timestamp | string
}

/**
 * Bilingual text with required en/ar â€” used for title, summary
 */
export interface BilingualText {
  en: string
  ar: string
}

/**
 * Bilingual text with optional en/ar â€” used for description
 */
export interface BilingualTextOptional {
  en?: string
  ar?: string
}

/**
 * Input for creating a new service (excludes auto-generated fields)
 */
export interface CreateServiceInput {
  slug: string
  title: BilingualText
  summary: BilingualText
  description?: BilingualTextOptional
  tags?: string[]
  icon?: string
  featured?: boolean
  status?: 'draft' | 'published' | 'archived'
  sortOrder?: number
}

/**
 * Input for updating a service (all fields optional except id)
 */
export interface UpdateServiceInput {
  id: string
  slug?: string
  title?: BilingualText
  summary?: BilingualText
  description?: BilingualTextOptional
  tags?: string[]
  icon?: string
  featured?: boolean
  status?: 'draft' | 'published' | 'archived'
  sortOrder?: number
}

export type ServiceStatus = 'draft' | 'published' | 'archived'

/**
 * HTTP-style error so route handlers can translate directly to status codes.
 * Plain object instead of class to work with "use server" constraint.
 */
export function createApiError(status: number, message: string): ApiError {
  return { status, message, name: 'ApiError' }
}

export interface ApiError {
  status: number
  message: string
  name: 'ApiError'
}

function requireRole(session: AdminSession | null, feature: AdminFeature): AdminSession {
  if (!session) throw createApiError(401, 'Not authenticated.')
  if (!can(session.role, feature)) throw createApiError(403, `Role '${session.role}' cannot manage ${feature}.`)
  return session
}

async function requireAdminForServices(session: AdminSession | null): Promise<AdminSession> {
  return requireRole(session, 'content')
}

/**
 * Converts Firestore Timestamp to ISO string for JSON serialization
 */
function timestampToString(ts: Timestamp | string | undefined): string {
  if (!ts) return new Date().toISOString()
  if (typeof ts === 'string') return ts
  return ts.toDate().toISOString()
}

/**
 * Normalizes ServiceRecord from Firestore document data
 */
function normalizeServiceRecord(doc: FirebaseFirestore.DocumentSnapshot): ServiceRecord {
  const data = doc.data()!
  return {
    id: doc.id,
    slug: data.slug,
    title: data.title,
    summary: data.summary,
    description: data.description,
    tags: data.tags ?? [],
    icon: data.icon,
    featured: data.featured ?? false,
    status: data.status ?? 'draft',
    sortOrder: data.sortOrder ?? 0,
    updatedAt: timestampToString(data.updatedAt),
    createdAt: timestampToString(data.createdAt),
  }
}

/**
 * Creates a new service document in Firestore
 * @throws if slug already exists
 */
export async function createService(session: AdminSession | null, input: CreateServiceInput): Promise<ServiceRecord> {
  await requireAdminForServices(session)
  validateInput(input)

  const db = getAdminFirestore()
  const now = FieldValue.serverTimestamp()

  // Check slug uniqueness
  const slugCheck = await db.collection('services').where('slug', '==', input.slug).limit(1).get()
  if (!slugCheck.empty) {
    throw createApiError(400, `Service with slug "${input.slug}" already exists`)
  }

  const docRef = await db.collection('services').add({
    ...input,
    tags: input.tags ?? [],
    icon: input.icon ?? '',
    featured: input.featured ?? false,
    status: input.status ?? 'draft',
    sortOrder: input.sortOrder ?? 0,
    createdAt: now,
    updatedAt: now,
  })

  const newDoc = await docRef.get()
  return normalizeServiceRecord(newDoc)
}

/**
 * Fetches a service by its document ID
 * Returns null if not found
 */
export async function getServiceById(session: AdminSession | null, id: string): Promise<ServiceRecord | null> {
  await requireAdminForServices(session)
  const db = getAdminFirestore()
  const doc = await db.collection('services').doc(id).get()
  if (!doc.exists) return null
  return normalizeServiceRecord(doc)
}

/**
 * Fetches a service by its slug
 * Returns null if not found
 */
export async function getServiceBySlug(session: AdminSession | null, slug: string): Promise<ServiceRecord | null> {
  await requireAdminForServices(session)
  const db = getAdminFirestore()
  const snapshot = await db.collection('services').where('slug', '==', slug).limit(1).get()
  if (snapshot.empty) return null
  return normalizeServiceRecord(snapshot.docs[0])
}

/**
 * Fetches all services (all statuses) for admin listing
 * Ordered by sortOrder asc, then updatedAt desc
 */
export async function getAllServices(session: AdminSession | null): Promise<ServiceRecord[]> {
  await requireAdminForServices(session)
  const db = getAdminFirestore()
  const snapshot = await db
    .collection('services')
    .orderBy('sortOrder', 'asc')
    .orderBy('updatedAt', 'desc')
    .get()

  return snapshot.docs.map(normalizeServiceRecord)
}

/**
 * Fetches services by status for admin filtering
 */
export async function getServicesByStatus(session: AdminSession | null, status: ServiceStatus): Promise<ServiceRecord[]> {
  await requireAdminForServices(session)
  const db = getAdminFirestore()
  const snapshot = await db
    .collection('services')
    .where('status', '==', status)
    .orderBy('sortOrder', 'asc')
    .orderBy('updatedAt', 'desc')
    .get()

  return snapshot.docs.map(normalizeServiceRecord)
}

/**
 * Updates an existing service
 * @throws if service not found or slug conflicts with another service
 */
export async function updateService(session: AdminSession | null, id: string, input: UpdateServiceInput): Promise<ServiceRecord> {
  await requireAdminForServices(session)

  const db = getAdminFirestore()
  const { slug, ...updates } = input

  const docRef = db.collection('services').doc(id)
  const existing = await docRef.get()
  if (!existing.exists) {
    throw createApiError(404, `Service with id "${id}" not found`)
  }

  // Check slug uniqueness if being changed
  if (slug && slug !== existing.data()?.slug) {
    const slugCheck = await db.collection('services').where('slug', '==', slug).limit(1).get()
    if (!slugCheck.empty) {
      throw createApiError(400, `Service with slug "${slug}" already exists`)
    }
  }

  await docRef.update({
    ...updates,
    ...(slug && { slug }),
    updatedAt: FieldValue.serverTimestamp(),
  })

  const updatedDoc = await docRef.get()
  return normalizeServiceRecord(updatedDoc)
}

/**
 * Deletes a service by ID
 * @throws if service not found
 */
export async function deleteService(session: AdminSession | null, id: string): Promise<void> {
  await requireAdminForServices(session)

  const db = getAdminFirestore()
  const docRef = db.collection('services').doc(id)
  const existing = await docRef.get()
  if (!existing.exists) {
    throw createApiError(404, `Service with id "${id}" not found`)
  }
  await docRef.delete()
}

/**
 * Reorders services by updating sortOrder values
 * Expects array of { id, sortOrder } in the desired order
 */
export async function reorderServices(session: AdminSession | null, services: { id: string; sortOrder: number }[]): Promise<void> {
  await requireAdminForServices(session)

  const db = getAdminFirestore()
  const batch = db.batch()

  for (const { id, sortOrder } of services) {
    const docRef = db.collection('services').doc(id)
    batch.update(docRef, { sortOrder, updatedAt: FieldValue.serverTimestamp() })
  }

  await batch.commit()
}

function validateInput(input: CreateServiceInput): void {
  if (!input.slug || !input.slug.trim()) throw createApiError(400, 'Slug is required.')
  if (!input.title || !input.title.en.trim() || !input.title.ar.trim())
    throw createApiError(400, 'Title requires both English and Arabic.')
  if (!input.summary || !input.summary.en.trim() || !input.summary.ar.trim())
    throw createApiError(400, 'Summary requires both English and Arabic.')
  if (input.status && !['draft', 'published', 'archived'].includes(input.status))
    throw createApiError(400, 'Invalid status.')
}




