'use server'

import { getPublicFirestore } from '@/src/lib/firebase/admin'

/**
 * Public-facing site settings — the operationally editable company information
 * surfaced on the public About page footer (name, contact, social links).
 * Reads the siteSettings/global singleton server-side via the Admin SDK; no
 * client-side Firestore query. Core UI labels remain in i18n.
 */
export interface PublicSiteSettings {
  companyName: string
  contactEmail: string
  contactPhone?: string
  address?: { en?: string; ar?: string }
  socialLinks: {
    linkedin?: string
    github?: string
    instagram?: string
    facebook?: string
    x?: string
  }
  /**
   * Navbar brand label per language. When a language is empty the navbar falls
   * back to the i18n Navbar.brand string, so an unset brand renders as before.
   */
  brandName?: { en?: string; ar?: string }
  /** Cloudinary identity of the navbar logo; absent => the CSS brand mark. */
  brandLogoPublicId?: string
  brandLogoResourceType?: 'image' | 'video'
}

/**
 * Returns the published site settings, or null when the singleton document
 * does not exist yet (the public page then falls back to i18n-only content).
 */
export async function getSiteSettings(): Promise<PublicSiteSettings | null> {
  const db = getPublicFirestore()
  if (!db) return null
  const doc = await db.collection('siteSettings').doc('global').get()
  if (!doc.exists) return null

  const data = doc.data()
  if (!data) return null

  return {
    companyName: data.companyName ?? '',
    contactEmail: data.contactEmail ?? '',
    contactPhone: data.contactPhone ?? '',
    address: data.address ?? {},
    socialLinks: data.socialLinks ?? {},
    brandName: data.brandName ?? {},
    brandLogoPublicId: data.brandLogoPublicId ?? undefined,
    brandLogoResourceType: data.brandLogoResourceType ?? undefined,
  }
}