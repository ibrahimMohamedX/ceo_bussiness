import 'server-only'
import { getAdminFirestore } from '@/src/lib/firebase/admin'
import { can, type AdminFeature } from '@/src/lib/admin/roles'
import type { AdminSession } from '@/src/lib/admin/session'
import { FieldValue, Timestamp } from 'firebase-admin/firestore'

/**
 * Firestore FAQs collection record — matches 01_FIREBASE_DATA_MODEL.md §10
 * Admin-facing, includes all statuses (draft/published/archived) and internal fields
 */
export interface FaqRecord {
  id: string
  question: BilingualText
  answer: BilingualText
  category?: string
  status: 'draft' | 'published' | 'archived'
  sortOrder: number
  updatedAt: Timestamp | string
  createdAt?: Timestamp | string
}

/**
 * Bilingual text with required en/ar — used for question, answer
 */
export interface BilingualText {
  en: string
  ar: string
}

/**
 * Input for creating a new FAQ entry (excludes auto-generated fields)
 */
export interface CreateFaqInput {
  question: BilingualText
  answer: BilingualText
  category?: string
  status?: 'draft' | 'published' | 'archived'
  sortOrder?: number
}

/**
 * Input for updating a FAQ entry (all fields optional except id)
 */
export interface UpdateFaqInput {
  id: string
  question?: BilingualText
  answer?: BilingualText
  category?: string
  status?: 'draft' | 'published' | 'archived'
  sortOrder?: number
}

export type FaqStatus = 'draft' | 'published' | 'archived'

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

async function requireAdminForFaqs(session: AdminSession | null): Promise<AdminSession> {
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
 * Normalizes FaqRecord from Firestore document data
 */
function normalizeFaqRecord(doc: FirebaseFirestore.DocumentSnapshot): FaqRecord {
  const data = doc.data()!
  return {
    id: doc.id,
    question: data.question,
    answer: data.answer,
    category: data.category,
    status: data.status ?? 'draft',
    sortOrder: data.sortOrder ?? 0,
    updatedAt: timestampToString(data.updatedAt),
    createdAt: timestampToString(data.createdAt),
  }
}

/**
 * Creates a new FAQ document in Firestore
 */
export async function createFaq(session: AdminSession | null, input: CreateFaqInput): Promise<FaqRecord> {
  await requireAdminForFaqs(session)
  validateInput(input)

  const db = getAdminFirestore()
  const now = FieldValue.serverTimestamp()

  const docRef = await db.collection('faqs').add({
    question: input.question,
    answer: input.answer,
    category: input.category ?? '',
    status: input.status ?? 'draft',
    sortOrder: input.sortOrder ?? 0,
    createdAt: now,
    updatedAt: now,
  })

  const newDoc = await docRef.get()
  return normalizeFaqRecord(newDoc)
}

/**
 * Fetches a FAQ entry by its document ID
 * Returns null if not found
 */
export async function getFaqById(session: AdminSession | null, id: string): Promise<FaqRecord | null> {
  await requireAdminForFaqs(session)
  const db = getAdminFirestore()
  const doc = await db.collection('faqs').doc(id).get()
  if (!doc.exists) return null
  return normalizeFaqRecord(doc)
}

/**
 * Fetches all FAQs (all statuses) for admin listing
 * Ordered by sortOrder asc, then updatedAt desc
 */
export async function getAllFaqs(session: AdminSession | null): Promise<FaqRecord[]> {
  await requireAdminForFaqs(session)
  const db = getAdminFirestore()
  const snapshot = await db
    .collection('faqs')
    .orderBy('sortOrder', 'asc')
    .orderBy('updatedAt', 'desc')
    .get()

  return snapshot.docs.map(normalizeFaqRecord)
}

/**
 * Fetches FAQs by status for admin filtering
 */
export async function getFaqsByStatus(session: AdminSession | null, status: FaqStatus): Promise<FaqRecord[]> {
  await requireAdminForFaqs(session)
  const db = getAdminFirestore()
  const snapshot = await db
    .collection('faqs')
    .where('status', '==', status)
    .orderBy('sortOrder', 'asc')
    .orderBy('updatedAt', 'desc')
    .get()

  return snapshot.docs.map(normalizeFaqRecord)
}

/**
 * Updates an existing FAQ entry
 * @throws if FAQ not found
 */
export async function updateFaq(session: AdminSession | null, id: string, input: UpdateFaqInput): Promise<FaqRecord> {
  await requireAdminForFaqs(session)

  const db = getAdminFirestore()
  const docRef = db.collection('faqs').doc(id)
  const existing = await docRef.get()
  if (!existing.exists) {
    throw createApiError(404, `FAQ with id "${id}" not found`)
  }

  await docRef.update({
    ...input,
    updatedAt: FieldValue.serverTimestamp(),
  })

  const updatedDoc = await docRef.get()
  return normalizeFaqRecord(updatedDoc)
}

/**
 * Deletes a FAQ entry by ID
 * @throws if FAQ not found
 */
export async function deleteFaq(session: AdminSession | null, id: string): Promise<void> {
  await requireAdminForFaqs(session)

  const db = getAdminFirestore()
  const docRef = db.collection('faqs').doc(id)
  const existing = await docRef.get()
  if (!existing.exists) {
    throw createApiError(404, `FAQ with id "${id}" not found`)
  }
  await docRef.delete()
}

function validateInput(input: CreateFaqInput): void {
  if (!input.question || !input.question.en.trim() || !input.question.ar.trim())
    throw createApiError(400, 'Question requires both English and Arabic.')
  if (!input.answer || !input.answer.en.trim() || !input.answer.ar.trim())
    throw createApiError(400, 'Answer requires both English and Arabic.')
  if (input.status && !['draft', 'published', 'archived'].includes(input.status))
    throw createApiError(400, 'Invalid status.')
}