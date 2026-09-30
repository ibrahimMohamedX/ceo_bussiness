import 'server-only'
import { getAdminFirestore } from '@/src/lib/firebase/admin'
import { can, type AdminFeature } from '@/src/lib/admin/roles'
import type { AdminSession } from '@/src/lib/admin/session'
import { FieldValue, Timestamp } from 'firebase-admin/firestore'
import { deleteMedia } from '@/src/lib/cloudinary/media'

/**
 * Firestore siteSettings/global singleton — matches 01_FIREBASE_DATA_MODEL.md §4.
 * Holds the operationally editable company information surfaced on the public
 * About page footer (company name, contact details, social links). Core UI
 * labels stay in i18n; only company-level facts live here.
 */
export interface SiteSettingsRecord {
  companyName: string
  contactEmail: string
  contactPhone?: string
  address?: BilingualAddressOptional
  socialLinks: SocialLinks
  /** Navbar brand label, per language. Falls back to i18n Navbar.brand when unset. */
  brandName?: BilingualAddressOptional
  /** Cloudinary identity of the navbar logo. No logo set => CSS brand mark. */
  brandLogoPublicId?: string
  brandLogoResourceType?: CloudinaryResourceType
  updatedAt: Timestamp | string
}

/** Cloudinary asset kind, mirrored from the media layer to avoid a server-only import. */
export type CloudinaryResourceType = 'image' | 'video'

/** Bilingual address block (both parts optional, per §4). */
export interface BilingualAddressOptional {
  en?: string
  ar?: string
}

/** Social profile URLs. The `x` key maps to the Twitter/X icon in the footer. */
export interface SocialLinks {
  linkedin?: string
  github?: string
  instagram?: string
  facebook?: string
  x?: string
}

/** Input for updating the singleton (every field optional). */
export interface UpdateSiteSettingsInput {
  companyName?: string
  contactEmail?: string
  contactPhone?: string
  address?: BilingualAddressOptional
  socialLinks?: SocialLinks
  brandName?: BilingualAddressOptional
  // null clears the logo (and destroys the Cloudinary asset); undefined leaves it.
  brandLogoPublicId?: string | null
  brandLogoResourceType?: CloudinaryResourceType | null
}

/** Sentinel returned when the singleton doc has not been created yet. */
export const EMPTY_SITE_SETTINGS: SiteSettingsRecord = {
  companyName: '',
  contactEmail: '',
  contactPhone: '',
  address: { en: '', ar: '' },
  socialLinks: {},
  brandName: { en: '', ar: '' },
  updatedAt: '',
}

const DOC_ID = 'global'

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

async function requireAdminForSettings(session: AdminSession | null): Promise<AdminSession> {
  return requireRole(session, 'settings')
}

function timestampToString(ts: Timestamp | string | undefined): string {
  if (!ts) return ''
  if (typeof ts === 'string') return ts
  return ts.toDate().toISOString()
}

function normalizeSettings(data: FirebaseFirestore.DocumentData | undefined): SiteSettingsRecord {
  if (!data) return EMPTY_SITE_SETTINGS
  return {
    companyName: data.companyName ?? '',
    contactEmail: data.contactEmail ?? '',
    contactPhone: data.contactPhone ?? '',
    address: data.address ?? { en: '', ar: '' },
    socialLinks: data.socialLinks ?? {},
    brandName: data.brandName ?? { en: '', ar: '' },
    brandLogoPublicId: data.brandLogoPublicId ?? undefined,
    brandLogoResourceType: data.brandLogoResourceType ?? undefined,
    updatedAt: timestampToString(data.updatedAt),
  }
}

/**
 * Reads the siteSettings/global singleton. Returns an empty record when the
 * document has not been created yet (so the editor renders a blank form).
 */
export async function getSiteSettings(session: AdminSession | null): Promise<SiteSettingsRecord> {
  await requireAdminForSettings(session)
  const db = getAdminFirestore()
  const doc = await db.collection('siteSettings').doc(DOC_ID).get()
  return normalizeSettings(doc.exists ? doc.data() : undefined)
}

/**
 * Creates or updates the siteSettings/global singleton. Uses `set(..., { merge: true })`
 * so a first save creates the doc and later saves patch only the provided fields.
 */
export async function updateSiteSettings(
  session: AdminSession | null,
  input: UpdateSiteSettingsInput,
): Promise<SiteSettingsRecord> {
  await requireAdminForSettings(session)
  validateInput(input)

  const db = getAdminFirestore()
  const docRef = db.collection('siteSettings').doc(DOC_ID)

  // Read the current logo before writing so a replacement can destroy the asset
  // it supersedes instead of orphaning it in Cloudinary.
  const before = await docRef.get()
  const prevPublicId = before.exists ? (before.data()?.brandLogoPublicId as string | undefined) : undefined
  const prevResourceType =
    (before.exists ? (before.data()?.brandLogoResourceType as CloudinaryResourceType | undefined) : undefined) ?? 'image'

  const patch: Record<string, unknown> = { updatedAt: FieldValue.serverTimestamp() }
  if (input.companyName !== undefined) patch.companyName = input.companyName
  if (input.contactEmail !== undefined) patch.contactEmail = input.contactEmail
  if (input.contactPhone !== undefined) patch.contactPhone = input.contactPhone
  if (input.address !== undefined) patch.address = input.address
  if (input.socialLinks !== undefined) patch.socialLinks = input.socialLinks
  if (input.brandName !== undefined) patch.brandName = input.brandName
  // null clears; a string sets. Both must be written explicitly, so this cannot
  // use a truthiness check — '' and null are meaningful here.
  if (input.brandLogoPublicId !== undefined) patch.brandLogoPublicId = input.brandLogoPublicId
  if (input.brandLogoResourceType !== undefined) patch.brandLogoResourceType = input.brandLogoResourceType

  await docRef.set(patch, { merge: true })

  // Best effort: a missing or already-deleted asset must not fail the save.
  if (
    prevPublicId &&
    input.brandLogoPublicId !== undefined &&
    input.brandLogoPublicId !== prevPublicId
  ) {
    await deleteMedia(prevPublicId, prevResourceType).catch(() => {})
  }

  const updated = await docRef.get()
  return normalizeSettings(updated.exists ? updated.data() : undefined)
}

function validateInput(input: UpdateSiteSettingsInput): void {
  if (input.companyName !== undefined && !input.companyName.trim())
    throw createApiError(400, 'Company name cannot be empty.')
  if (input.contactEmail !== undefined && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.contactEmail.trim()))
    throw createApiError(400, 'Contact email must be a valid email address.')
  // Mirrors resolveMediaIdentity() in src/lib/admin/media.ts: a Cloudinary
  // identity is only meaningful with both halves present.
  if (input.brandLogoPublicId && !input.brandLogoResourceType)
    throw createApiError(400, 'brandLogoResourceType is required when brandLogoPublicId is set.')
}