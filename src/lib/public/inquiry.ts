'use server'

import { getAdminFirestore } from '@/src/lib/firebase/admin'
import { FieldValue } from 'firebase-admin/firestore'

/**
 * Public-facing inquiry submission — the controlled server path for inbound
 * contact forms (05_CONTACT_INQUIRIES.md). Validation + anti-spam honeypot live
 * here, NOT in the client; the browser never writes Firestore directly and
 * `inquiries` is never publicly queryable (03_FIREBASE_SECURITY.md §5).
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

/** Payload accepted from the public contact form. */
export interface SubmitInquiryInput {
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
  /** Honeypot — must be empty for a human submission. */
  website?: string
}

export interface SubmitInquiryResult {
  ok: boolean
  id?: string
  error?: string
}

const MAX_MESSAGE_LENGTH = 4000
const MAX_NAME_LENGTH = 200
const MAX_COMPANY_LENGTH = 200
const MAX_ATTACHMENTS = 5
const ALLOWED_SERVICES = ['software', 'embedded', 'ai', 'consulting', 'other'] as const

/**
 * Creates an inquiry document with status `new` / priority `medium`. Rejects
 * bots via a honeypot and enforces the same field rules as the admin DAL.
 */
export async function submitInquiry(input: SubmitInquiryInput): Promise<SubmitInquiryResult> {
  try {
    validatePublicInput(input)
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Invalid submission.' }
  }

  const db = getAdminFirestore()

  const record: Record<string, unknown> = {
    name: input.name.trim(),
    email: input.email.trim(),
    service: input.service.trim(),
    message: input.message.trim(),
    locale: input.locale,
    status: 'new' as InquiryStatus,
    priority: 'medium' as InquiryPriority,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  }
  if (input.company?.trim()) record.company = input.company.trim()
  if (input.phone?.trim()) record.phone = input.phone.trim()
  if (input.projectType?.trim()) record.projectType = input.projectType.trim()
  if (input.budget?.trim()) record.budget = input.budget.trim()
  if (input.attachmentMediaIds?.length) record.attachmentMediaIds = input.attachmentMediaIds
  if (input.sourcePath) record.sourcePath = input.sourcePath

  const docRef = await db.collection('inquiries').add(record)
  return { ok: true, id: docRef.id }
}

function validatePublicInput(input: SubmitInquiryInput): void {
  // Honeypot: bots fill hidden fields, humans leave them empty.
  if (input.website !== undefined && input.website.trim() !== '')
    throw new Error('Submission rejected.')

  if (!input.name || !input.name.trim()) throw new Error('Name is required.')
  if (input.name.trim().length > MAX_NAME_LENGTH) throw new Error('Name is too long.')

  if (!input.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim()))
    throw new Error('A valid email is required.')

  if (input.company && input.company.trim().length > MAX_COMPANY_LENGTH)
    throw new Error('Company is too long.')

  if (!input.service || !(ALLOWED_SERVICES as readonly string[]).includes(input.service))
    throw new Error('A valid service is required.')

  if (!input.message || !input.message.trim()) throw new Error('Message is required.')
  if (input.message.trim().length > MAX_MESSAGE_LENGTH) throw new Error('Message is too long.')

  if (!['en', 'ar'].includes(input.locale)) throw new Error('Invalid locale.')

  if (input.attachmentMediaIds && input.attachmentMediaIds.length > MAX_ATTACHMENTS)
    throw new Error('Too many attachments.')
}