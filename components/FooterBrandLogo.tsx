'use client'

import { cloudinaryUrl } from '@/src/lib/cloudinary/url'
import type { PublicSiteSettings } from '@/src/lib/public/settings'

export function FooterBrandLogo({
  siteSettings,
}: {
  siteSettings: PublicSiteSettings | null
}) {
  const logoUrl = cloudinaryUrl(
    siteSettings?.brandLogoPublicId,
    siteSettings?.brandLogoResourceType ?? 'image',
  )

  if (!logoUrl) return null

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={logoUrl}
      alt=""
      className="brand-logo footer-brand-logo"
    />
  )
}





