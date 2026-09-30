'use server'

import { getPublicFirestore } from '@/src/lib/firebase/admin'

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
  brandName?: { en?: string; ar?: string }
  brandLogoPublicId?: string
  brandLogoResourceType?: 'image' | 'video'

  projectCtaUrl: string
  whatsappNumber: string
  whatsappMessageAr: string
  whatsappMessageEn: string
}

const DEFAULT_PROJECT_CTA_URL = 'https://landing-ideas.web.app/'
const DEFAULT_WHATSAPP_NUMBER = '201555686164'
const DEFAULT_WHATSAPP_MESSAGE_AR =
  'مرحباً بكم، أرغب في التواصل مع فريق Archai Solutions.'
const DEFAULT_WHATSAPP_MESSAGE_EN =
  "Hello, I'd like to get in touch with the Archai Solutions team."

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

    projectCtaUrl:
      data.projectCtaUrl ?? DEFAULT_PROJECT_CTA_URL,

    whatsappNumber:
      data.whatsappNumber ?? DEFAULT_WHATSAPP_NUMBER,

    whatsappMessageAr:
      data.whatsappMessageAr ?? DEFAULT_WHATSAPP_MESSAGE_AR,

    whatsappMessageEn:
      data.whatsappMessageEn ?? DEFAULT_WHATSAPP_MESSAGE_EN,
  }
}
