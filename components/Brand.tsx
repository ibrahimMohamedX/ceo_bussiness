'use client'

// Shared navbar brand: logo + label, both driven by siteSettings/global.
//
// Extracted from the ten page clients, which each inlined an identical
// <a className="brand"> block. One component means the brand is defined once.
//
// Fallbacks are deliberate and preserve the pre-settings behaviour exactly:
//   - no brandName[locale]  -> the i18n Navbar.brand string ("NODAL" / "نودال")
//   - no brandLogoPublicId  -> the original three-bar CSS mark
// So a site that never opens the Settings page renders as it always did.
//
// Client-safe: cloudinaryUrl() only needs the public cloud name and carries no
// credentials.

import { useTranslations } from 'next-intl'

import { cloudinaryUrl } from '@/src/lib/cloudinary/url'
import type { PublicSiteSettings } from '@/src/lib/public/settings'

export function Brand({
  locale,
  home,
  siteSettings,
}: {
  locale: string
  /** The locale-prefixed homepage href, e.g. "/en". */
  home: string
  siteSettings: PublicSiteSettings | null
}) {
  const t = useTranslations()

  const displayLocale = locale === 'ar' ? 'ar' : 'en'
  const name = siteSettings?.brandName?.[displayLocale]?.trim()
  const logoUrl = cloudinaryUrl(
    siteSettings?.brandLogoPublicId,
    siteSettings?.brandLogoResourceType ?? 'image',
  )

  return (
    <a className="brand" href={home} aria-label={`${name || t('Navbar.brand')} home`}>
      {logoUrl ? (
        // The logo is an admin-supplied arbitrary-size image; a plain <img> with a
        // fixed CSS height avoids next/image's intrinsic-dimension requirement.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logoUrl} alt="" className="brand-logo" />
      ) : (
        <span className="brand-mark">
          <span />
          <span />
          <span />
        </span>
      )}
      <span>{name || t('Navbar.brand')}</span>
    </a>
  )
}
