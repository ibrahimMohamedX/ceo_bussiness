'use client'

import { useTranslations, useLocale } from 'next-intl'
import { ArrowUpRight } from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  404 / NOT FOUND                                                    */
/*  Renders inside [locale]/layout.tsx when no route slot matches, so  */
/*  Providers/messages/RTL/theme are all inherited. Intentionally      */
/*  minimal per the design library: eyebrow, status, one-line message, */
/*  a single primary CTA back to the active-locale homepage.           */
/* ------------------------------------------------------------------ */
export default function NotFound() {
  const t = useTranslations()
  const locale = useLocale()

  const home = `/${locale}`

  return (
    <main className="foundation-shell notfound-section">
      <div className="notfound-inner">
        <div className="eyebrow">
          <span className="eyebrow-dot" /> {t('NotFoundPage.eyebrow')}
        </div>

        <div className="notfound-status" aria-hidden="true">
          {t('NotFoundPage.status')}
        </div>

        <h1 className="notfound-title">{t('NotFoundPage.title')}</h1>
        <p className="notfound-message">{t('NotFoundPage.message')}</p>

        <div className="hero-actions notfound-actions">
          <a className="button-primary" href={home}>
            {t('NotFoundPage.homeCta')} <ArrowUpRight size={16} />
          </a>
        </div>
      </div>
    </main>
  )
}