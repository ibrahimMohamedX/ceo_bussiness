'use client'

import { useTranslations } from 'next-intl'

import { cloudinaryUrl } from '@/src/lib/cloudinary/url'
import type { PublicSiteSettings } from '@/src/lib/public/settings'

type BrandProps = {
  locale: string
  home: string
  siteSettings: PublicSiteSettings | null
}

export function BrandContent({
  locale,
  siteSettings,
}: {
  locale: string
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
    <>
      {logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logoUrl} alt="" className="brand-logo" />
      ) : (
        <span className="brand-mark" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      )}

      <span>{name || t('Navbar.brand')}</span>
    </>
  )
}

export function Brand({ locale, home, siteSettings }: BrandProps) {
  const t = useTranslations()

  const displayLocale = locale === 'ar' ? 'ar' : 'en'
  const name = siteSettings?.brandName?.[displayLocale]?.trim()

  return (
    <a
      className="brand"
      href={home}
      aria-label={`${name || t('Navbar.brand')} home`}
    >
      <BrandContent locale={locale} siteSettings={siteSettings} />
    </a>
  )
}





