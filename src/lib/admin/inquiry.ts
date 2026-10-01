import 'server-only'
import { getAdminFirestore } from '@/src/lib/firebase/admin'
import { can, type AdminFeature } from '@/src/lib/admin/roles'
import type { AdminSession } from '@/src/lib/admin/session'
import { FieldValue, Timestamp } from 'firebase-admin/firestore'

/**
 * Firestore inquiries/{inquiryId} â€” matches 01_FIREBASE_DATA_MODEL.md Â§11 and
 * 05_CONTACT_INQUIRIES.md. Inbound contact-form submissions, created via the
 * public server endpoint (src/lib/public/inquiry.ts) and managed here in the
 * admin dashboard. Unlike FAQ (bilingual), an inquiry carries a single `locale`.
 */

export type InquiryStatus =
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'proposal'
  | 'won'
  | 'lost'
  | 'spam'
  | 'archived'

export type InquiryPriority = 'low' | 'medium' | 'high'

export type InquiryLocale = 'en' | 'ar'

export const INQUIRY_STATUSES: InquiryStatus[] = [
  'new',
  'contacted',
  'qualified',
  'proposal',
  'won',
  'lost',
  'spam',
  'archived',
]

export const INQUIRY_PRIORITIES: InquiryPriority[] = ['low', 'medium', 'high']

export interface InquiryRecord {
  id: string
  name: string
  company?: string
  email: string
  phone?: string
  service: string
  projectType?: string
  budget?: string
  message: string
  attachmentMediaIds?: string[]
  sourcePath?: string
  locale: InquiryLocale
  status: InquiryStatus
  priority: InquiryPriority
  assignedTo?: string
  internalNotes?: string
  createdAt: string
  updatedAt: string
  lastContactedAt?: string
}

/** Input for creating an inquiry (admin-side; mirrors the public form fields). */
export interface CreateInquiryInput {
  name: string
  company?: string
  email: string
  phone?: string
  service: string
  projectType?: string
  budget?: string
  message: string
  attachmentMediaIds?: string[]
  sourcePath?: string
  locale: InquiryLocale
  status?: InquiryStatus
  priority?: InquiryPriority
  assignedTo?: string
  internalNotes?: string
}

/** Input for updating an inquiry (every field optional). */
export interface UpdateInquiryInput {
  name?: string
  company?: string
  email?: string
  phone?: string
  service?: string
  projectType?: string
  budget?: string
  message?: string
  attachmentMediaIds?: string[]
  sourcePath?: string
  locale?: InquiryLocale
  status?: InquiryStatus
  priority?: InquiryPriority
  assignedTo?: string
  internalNotes?: string
}

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

async function requireAdminForInquiries(session: AdminSession | null): Promise<AdminSession> {
  return requireRole(session, 'inquiries')
}

function timestampToString(ts: Timestamp | string | undefined): string {
  if (!ts) return ''
  if (typeof ts === 'string') return ts
  return ts.toDate().toISOString()
}

function normalizeInquiry(data: FirebaseFirestore.DocumentData | undefined, id: string): InquiryRecord {
  const d = data ?? {}
  return {
    id,
    name: d.name ?? '',
    company: d.company,
    email: d.email ?? '',
    phone: d.phone,
    service: d.service ?? '',
    projectType: d.projectType,
    budget: d.budget,
    message: d.message ?? '',
    attachmentMediaIds: d.attachmentMediaIds,
    sourcePath: d.sourcePath,
    locale: d.locale ?? 'en',
    status: d.status ?? 'new',
    priority: d.priority ?? 'medium',
    assignedTo: d.assignedTo,
    internalNotes: d.internalNotes,
    createdAt: timestampToString(d.createdAt),
    updatedAt: timestampToString(d.updatedAt),
    lastContactedAt: timestampToString(d.lastContactedAt) || undefined,
  }
}

function validateInput(input: CreateInquiryInput | UpdateInquiryInput): void {
  if ('name' in input && input.name !== undefined && !input.name.trim())
    throw createApiError(400, 'Name is required.')
  if ('email' in input && input.email !== undefined && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim()))
    throw createApiError(400, 'Email must be a valid email address.')
  if ('message' in input && input.message !== undefined && !input.message.trim())
    throw createApiError(400, 'Message is required.')
  if ('service' in input && input.service !== undefined && !input.service.trim())
    throw createApiError(400, 'Service is required.')
  if ('locale' in input && input.locale !== undefined && !['en', 'ar'].includes(input.locale))
    throw createApiError(400, 'Locale must be "en" or "ar".')
  if ('status' in input && input.status !== undefined && !INQUIRY_STATUSES.includes(input.status as InquiryStatus))
    throw createApiError(400, 'Invalid status.')
  if ('priority' in input && input.priority !== undefined && !INQUIRY_PRIORITIES.includes(input.priority as InquiryPriority))
    throw createApiError(400, 'Invalid priority.')
}

export async function createInquiry(
  session: AdminSession | null,
  input: CreateInquiryInput,
): Promise<InquiryRecord> {
  await requireAdminForInquiries(session)
  validateInput(input)

  const db = getAdminFirestore()

  const record: Record<string, unknown> = {
    name: input.name.trim(),
    email: input.email.trim(),
    service: input.service.trim(),
    message: input.message.trim(),
    locale: input.locale,
    status: input.status ?? 'new',
    priority: input.priority ?? 'medium',
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  }
  if (input.company?.trim()) record.company = input.company.trim()
  if (input.phone?.trim()) record.phone = input.phone.trim()
  if (input.projectType?.trim()) record.projectType = input.projectType.trim()
  if (input.budget?.trim()) record.budget = input.budget.trim()
  if (input.attachmentMediaIds?.length) record.attachmentMediaIds = input.attachmentMediaIds
  if (input.sourcePath) record.sourcePath = input.sourcePath
  if (input.assignedTo) record.assignedTo = input.assignedTo
  if (input.internalNotes?.trim()) record.internalNotes = input.internalNotes.trim()

  const docRef = await db.collection('inquiries').add(record)
  const doc = await docRef.get()
  return normalizeInquiry(doc.exists ? doc.data() : undefined, docRef.id)
}

export async function getInquiryById(
  session: AdminSession | null,
  id: string,
): Promise<InquiryRecord | null> {
  await requireAdminForInquiries(session)
  const db = getAdminFirestore()
  const doc = await db.collection('inquiries').doc(id).get()
  if (!doc.exists) return null
  return normalizeInquiry(doc.data(), doc.id)
}

export async function getAllInquiries(session: AdminSession | null): Promise<InquiryRecord[]> {
  await requireAdminForInquiries(session)
  const db = getAdminFirestore()
  const snapshot = await db
    .collection('inquiries')
    .orderBy('createdAt', 'desc')
    .get()
  return snapshot.docs.map((doc) => normalizeInquiry(doc.data(), doc.id))
}

export async function getInquiriesByStatus(
  session: AdminSession | null,
  status: InquiryStatus,
): Promise<InquiryRecord[]> {
  await requireAdminForInquiries(session)
  const db = getAdminFirestore()
  const snapshot = await db
    .collection('inquiries')
    .where('status', '==', status)
    .orderBy('createdAt', 'desc')
    .get()
  return snapshot.docs.map((doc) => normalizeInquiry(doc.data(), doc.id))
}

export async function updateInquiry(
  session: AdminSession | null,
  id: string,
  input: UpdateInquiryInput,
): Promise<InquiryRecord> {
  await requireAdminForInquiries(session)
  validateInput(input)

  const db = getAdminFirestore()
  const docRef = db.collection('inquiries').doc(id)
  const existing = await docRef.get()
  if (!existing.exists) throw createApiError(404, 'Inquiry not found.')

  const patch: Record<string, unknown> = { updatedAt: FieldValue.serverTimestamp() }
  if (input.name !== undefined) patch.name = input.name.trim()
  if (input.company !== undefined) patch.company = input.company.trim() || undefined
  if (input.email !== undefined) patch.email = input.email.trim()
  if (input.phone !== undefined) patch.phone = input.phone.trim() || undefined
  if (input.service !== undefined) patch.service = input.service.trim()
  if (input.projectType !== undefined) patch.projectType = input.projectType.trim() || undefined
  if (input.budget !== undefined) patch.budget = input.budget.trim() || undefined
  if (input.message !== undefined) patch.message = input.message.trim()
  if (input.attachmentMediaIds !== undefined) patch.attachmentMediaIds = input.attachmentMediaIds
  if (input.sourcePath !== undefined) patch.sourcePath = input.sourcePath
  if (input.locale !== undefined) patch.locale = input.locale
  if (input.status !== undefined) {
    patch.status = input.status
    if (input.status === 'contacted') patch.lastContactedAt = FieldValue.serverTimestamp()
  }
  if (input.priority !== undefined) patch.priority = input.priority
  if (input.assignedTo !== undefined) patch.assignedTo = input.assignedTo || undefined
  if (input.internalNotes !== undefined) patch.internalNotes = input.internalNotes.trim() || undefined

  await docRef.update(patch)

  const updated = await docRef.get()
  return normalizeInquiry(updated.exists ? updated.data() : undefined, id)
}

export async function deleteInquiry(session: AdminSession | null, id: string): Promise<void> {
  await requireAdminForInquiries(session)
  const db = getAdminFirestore()
  const docRef = db.collection('inquiries').doc(id)
  const existing = await docRef.get()
  if (!existing.exists) throw createApiError(404, 'Inquiry not found.')
  await docRef.delete()
}




