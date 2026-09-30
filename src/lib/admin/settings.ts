import 'server-only'
import { getAdminFirestore } from '@/src/lib/firebase/admin'
import { can, type AdminFeature } from '@/src/lib/admin/roles'
import type { AdminSession } from '@/src/lib/admin/session'
import { FieldValue, Timestamp } from 'firebase-admin/firestore'
import { deleteMedia } from '@/src/lib/cloudinary/media'

export interface SiteSettingsRecord {
  companyName: string
  contactEmail: string
  contactPhone?: string
  address?: BilingualAddressOptional
  socialLinks: SocialLinks
  brandName?: BilingualAddressOptional
  brandLogoPublicId?: string
  brandLogoResourceType?: CloudinaryResourceType

  /** Public URL opened by all "Start Your Project" CTAs. */
  projectCtaUrl: string

  /** WhatsApp number without the + sign. */
  whatsappNumber: string

  /** WhatsApp pre-filled message for Arabic pages. */
  whatsappMessageAr: string

  /** WhatsApp pre-filled message for English pages. */
  whatsappMessageEn: string

  updatedAt: Timestamp | string
}

export type CloudinaryResourceType = 'image' | 'video'

export interface BilingualAddressOptional {
  en?: string
  ar?: string
}

export interface SocialLinks {
  linkedin?: string
  github?: string
  instagram?: string
  facebook?: string
  x?: string
}

export interface UpdateSiteSettingsInput {
  companyName?: string
  contactEmail?: string
  contactPhone?: string
  address?: BilingualAddressOptional
  socialLinks?: SocialLinks
  brandName?: BilingualAddressOptional
  brandLogoPublicId?: string | null
  brandLogoResourceType?: CloudinaryResourceType | null

  projectCtaUrl?: string
  whatsappNumber?: string
  whatsappMessageAr?: string
  whatsappMessageEn?: string
}

export const EMPTY_SITE_SETTINGS: SiteSettingsRecord = {
  companyName: '',
  contactEmail: '',
  contactPhone: '',
  address: { en: '', ar: '' },
  socialLinks: {},
  brandName: { en: '', ar: '' },
  updatedAt: '',

  projectCtaUrl: 'https://landing-ideas.web.app/',
  whatsappNumber: '201555686164',
  whatsappMessageAr: 'مرحباً بكم، أرغب في التواصل مع فريق Archai Solutions.',
  whatsappMessageEn:
    "Hello, I'd like to get in touch with the Archai Solutions team.",
}

const DOC_ID = 'global'

export function createApiError(status: number, message: string): ApiError {
  return { status, message, name: 'ApiError' }
}

export interface ApiError {
  status: number
  message: string
  name: 'ApiError'
}

function requireRole(
  session: AdminSession | null,
  feature: AdminFeature,
): AdminSession {
  if (!session) throw createApiError(401, 'Not authenticated.')
  if (!can(session.role, feature)) {
    throw createApiError(
      403,
      `Role '${session.role}' cannot manage ${feature}.`,
    )
  }
  return session
}

async function requireAdminForSettings(
  session: AdminSession | null,
): Promise<AdminSession> {
  return requireRole(session, 'settings')
}

function timestampToString(ts: Timestamp | string | undefined): string {
  if (!ts) return ''
  if (typeof ts === 'string') return ts
  return ts.toDate().toISOString()
}

function normalizeSettings(
  data: FirebaseFirestore.DocumentData | undefined,
): SiteSettingsRecord {
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

    projectCtaUrl:
      data.projectCtaUrl ?? EMPTY_SITE_SETTINGS.projectCtaUrl,
    whatsappNumber:
      data.whatsappNumber ?? EMPTY_SITE_SETTINGS.whatsappNumber,
    whatsappMessageAr:
      data.whatsappMessageAr ?? EMPTY_SITE_SETTINGS.whatsappMessageAr,
    whatsappMessageEn:
      data.whatsappMessageEn ?? EMPTY_SITE_SETTINGS.whatsappMessageEn,

    updatedAt: timestampToString(data.updatedAt),
  }
}

export async function getSiteSettings(
  session: AdminSession | null,
): Promise<SiteSettingsRecord> {
  await requireAdminForSettings(session)

  const db = getAdminFirestore()
  const doc = await db.collection('siteSettings').doc(DOC_ID).get()

  return normalizeSettings(doc.exists ? doc.data() : undefined)
}

export async function updateSiteSettings(
  session: AdminSession | null,
  input: UpdateSiteSettingsInput,
): Promise<SiteSettingsRecord> {
  await requireAdminForSettings(session)
  validateInput(input)

  const db = getAdminFirestore()
  const docRef = db.collection('siteSettings').doc(DOC_ID)

  const before = await docRef.get()

  const prevPublicId = before.exists
    ? (before.data()?.brandLogoPublicId as string | undefined)
    : undefined

  const prevResourceType =
    (before.exists
      ? (before.data()?.brandLogoResourceType as
          | CloudinaryResourceType
          | undefined)
      : undefined) ?? 'image'

  const patch: Record<string, unknown> = {
    updatedAt: FieldValue.serverTimestamp(),
  }

  if (input.companyName !== undefined) patch.companyName = input.companyName
  if (input.contactEmail !== undefined)
    patch.contactEmail = input.contactEmail
  if (input.contactPhone !== undefined)
    patch.contactPhone = input.contactPhone
  if (input.address !== undefined) patch.address = input.address
  if (input.socialLinks !== undefined)
    patch.socialLinks = input.socialLinks
  if (input.brandName !== undefined) patch.brandName = input.brandName

  if (input.brandLogoPublicId !== undefined) {
    patch.brandLogoPublicId = input.brandLogoPublicId
  }

  if (input.brandLogoResourceType !== undefined) {
    patch.brandLogoResourceType = input.brandLogoResourceType
  }

  if (input.projectCtaUrl !== undefined) {
    patch.projectCtaUrl = input.projectCtaUrl
  }

  if (input.whatsappNumber !== undefined) {
    patch.whatsappNumber = input.whatsappNumber
  }

  if (input.whatsappMessageAr !== undefined) {
    patch.whatsappMessageAr = input.whatsappMessageAr
  }

  if (input.whatsappMessageEn !== undefined) {
    patch.whatsappMessageEn = input.whatsappMessageEn
  }

  await docRef.set(patch, { merge: true })

  if (
    prevPublicId &&
    input.brandLogoPublicId !== undefined &&
    input.brandLogoPublicId !== prevPublicId
  ) {
    await deleteMedia(prevPublicId, prevResourceType).catch(() => {})
  }

  const updated = await docRef.get()

  return normalizeSettings(
    updated.exists ? updated.data() : undefined,
  )
}

function validateInput(input: UpdateSiteSettingsInput): void {
  if (
    input.companyName !== undefined &&
    !input.companyName.trim()
  ) {
    throw createApiError(400, 'Company name cannot be empty.')
  }

  if (
    input.contactEmail !== undefined &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.contactEmail.trim())
  ) {
    throw createApiError(
      400,
      'Contact email must be a valid email address.',
    )
  }

  if (
    input.brandLogoPublicId &&
    !input.brandLogoResourceType
  ) {
    throw createApiError(
      400,
      'brandLogoResourceType is required when brandLogoPublicId is set.',
    )
  }

  if (
    input.projectCtaUrl !== undefined &&
    !/^https?:\/\/\S+$/i.test(input.projectCtaUrl.trim())
  ) {
    throw createApiError(
      400,
      'Start Your Project URL must be a valid HTTP/HTTPS URL.',
    )
  }

  if (
    input.whatsappNumber !== undefined &&
    !/^\d{8,15}$/.test(
      input.whatsappNumber.replace(/[^\d]/g, ''),
    )
  ) {
    throw createApiError(
      400,
      'WhatsApp number must contain 8 to 15 digits.',
    )
  }

  if (
    input.whatsappMessageAr !== undefined &&
    !input.whatsappMessageAr.trim()
  ) {
    throw createApiError(
      400,
      'Arabic WhatsApp message cannot be empty.',
    )
  }

  if (
    input.whatsappMessageEn !== undefined &&
    !input.whatsappMessageEn.trim()
  ) {
    throw createApiError(
      400,
      'English WhatsApp message cannot be empty.',
    )
  }
}
