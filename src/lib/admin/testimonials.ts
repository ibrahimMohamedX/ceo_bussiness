import 'server-only'
import { getAdminFirestore } from '@/src/lib/firebase/admin'
import { can, type AdminFeature } from '@/src/lib/admin/roles'
import type { AdminSession } from '@/src/lib/admin/session'
import { FieldValue, Timestamp } from 'firebase-admin/firestore'

/**
 * Firestore Testimonials collection record â€” matches 01_FIREBASE_DATA_MODEL.md Â§9
 * Admin-facing, includes all statuses (draft/published/archived) and internal fields
 */
export interface TestimonialRecord {
  id: string
  quote: BilingualText
  personName?: string
  role?: BilingualTextOptional
  company?: string
  avatarMediaId?: string
  featured: boolean
  status: 'draft' | 'published' | 'archived'
  sortOrder: number
  updatedAt: Timestamp | string
  createdAt?: Timestamp | string
}

/**
 * Bilingual text with required en/ar â€” used for quote
 */
export interface BilingualText {
  en: string
  ar: string
}

/**
 * Bilingual text with optional en/ar â€” used for role
 */
export interface BilingualTextOptional {
  en?: string
  ar?: string
}

/**
 * Input for creating a new testimonial (excludes auto-generated fields)
 */
export interface CreateTestimonialInput {
  quote: BilingualText
  personName?: string
  role?: BilingualTextOptional
  company?: string
  avatarMediaId?: string
  featured?: boolean
  status?: 'draft' | 'published' | 'archived'
  sortOrder?: number
}

/**
 * Input for updating a testimonial (all fields optional except id)
 */
export interface UpdateTestimonialInput {
  id: string
  quote?: BilingualText
  personName?: string
  role?: BilingualTextOptional
  company?: string
  avatarMediaId?: string
  featured?: boolean
  status?: 'draft' | 'published' | 'archived'
  sortOrder?: number
}

export type TestimonialStatus = 'draft' | 'published' | 'archived'

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

async function requireAdminForTestimonials(session: AdminSession | null): Promise<AdminSession> {
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
 * Normalizes TestimonialRecord from Firestore document data
 */
function normalizeTestimonialRecord(doc: FirebaseFirestore.DocumentSnapshot): TestimonialRecord {
  const data = doc.data()!
  return {
    id: doc.id,
    quote: data.quote,
    personName: data.personName,
    role: data.role,
    company: data.company,
    avatarMediaId: data.avatarMediaId,
    featured: data.featured ?? false,
    status: data.status ?? 'draft',
    sortOrder: data.sortOrder ?? 0,
    updatedAt: timestampToString(data.updatedAt),
    createdAt: timestampToString(data.createdAt),
  }
}

/**
 * Creates a new testimonial document in Firestore
 */
export async function createTestimonial(session: AdminSession | null, input: CreateTestimonialInput): Promise<TestimonialRecord> {
  await requireAdminForTestimonials(session)
  validateInput(input)

  const db = getAdminFirestore()
  const now = FieldValue.serverTimestamp()

  const docRef = await db.collection('testimonials').add({
    quote: input.quote,
    personName: input.personName ?? '',
    role: input.role ?? { en: '', ar: '' },
    company: input.company ?? '',
    avatarMediaId: input.avatarMediaId ?? '',
    featured: input.featured ?? false,
    status: input.status ?? 'draft',
    sortOrder: input.sortOrder ?? 0,
    createdAt: now,
    updatedAt: now,
  })

  const newDoc = await docRef.get()
  return normalizeTestimonialRecord(newDoc)
}

/**
 * Fetches a testimonial by its document ID
 * Returns null if not found
 */
export async function getTestimonialById(session: AdminSession | null, id: string): Promise<TestimonialRecord | null> {
  await requireAdminForTestimonials(session)
  const db = getAdminFirestore()
  const doc = await db.collection('testimonials').doc(id).get()
  if (!doc.exists) return null
  return normalizeTestimonialRecord(doc)
}

/**
 * Fetches all testimonials (all statuses) for admin listing
 * Ordered by sortOrder asc, then updatedAt desc
 */
export async function getAllTestimonials(session: AdminSession | null): Promise<TestimonialRecord[]> {
  await requireAdminForTestimonials(session)
  const db = getAdminFirestore()
  const snapshot = await db
    .collection('testimonials')
    .orderBy('sortOrder', 'asc')
    .orderBy('updatedAt', 'desc')
    .get()

  return snapshot.docs.map(normalizeTestimonialRecord)
}

/**
 * Fetches testimonials by status for admin filtering
 */
export async function getTestimonialsByStatus(session: AdminSession | null, status: TestimonialStatus): Promise<TestimonialRecord[]> {
  await requireAdminForTestimonials(session)
  const db = getAdminFirestore()
  const snapshot = await db
    .collection('testimonials')
    .where('status', '==', status)
    .orderBy('sortOrder', 'asc')
    .orderBy('updatedAt', 'desc')
    .get()

  return snapshot.docs.map(normalizeTestimonialRecord)
}

/**
 * Updates an existing testimonial
 * @throws if testimonial not found
 */
export async function updateTestimonial(session: AdminSession | null, id: string, input: UpdateTestimonialInput): Promise<TestimonialRecord> {
  await requireAdminForTestimonials(session)

  const db = getAdminFirestore()
  const docRef = db.collection('testimonials').doc(id)
  const existing = await docRef.get()
  if (!existing.exists) {
    throw createApiError(404, `Testimonial with id "${id}" not found`)
  }

  await docRef.update({
    ...input,
    updatedAt: FieldValue.serverTimestamp(),
  })

  const updatedDoc = await docRef.get()
  return normalizeTestimonialRecord(updatedDoc)
}

/**
 * Deletes a testimonial by ID
 * @throws if testimonial not found
 */
export async function deleteTestimonial(session: AdminSession | null, id: string): Promise<void> {
  await requireAdminForTestimonials(session)

  const db = getAdminFirestore()
  const docRef = db.collection('testimonials').doc(id)
  const existing = await docRef.get()
  if (!existing.exists) {
    throw createApiError(404, `Testimonial with id "${id}" not found`)
  }
  await docRef.delete()
}

/**
 * Reorders testimonials by updating sortOrder values
 * Expects array of { id, sortOrder } in the desired order
 */
export async function reorderTestimonials(session: AdminSession | null, testimonials: { id: string; sortOrder: number }[]): Promise<void> {
  await requireAdminForTestimonials(session)

  const db = getAdminFirestore()
  const batch = db.batch()

  for (const { id, sortOrder } of testimonials) {
    const docRef = db.collection('testimonials').doc(id)
    batch.update(docRef, { sortOrder, updatedAt: FieldValue.serverTimestamp() })
  }

  await batch.commit()
}

function validateInput(input: CreateTestimonialInput): void {
  if (!input.quote || !input.quote.en.trim() || !input.quote.ar.trim())
    throw createApiError(400, 'Quote requires both English and Arabic.')
  if (input.status && !['draft', 'published', 'archived'].includes(input.status))
    throw createApiError(400, 'Invalid status.')
}




