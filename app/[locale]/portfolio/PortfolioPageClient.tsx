'use client'

import { useCallback, useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useTheme } from '../Providers'
import { ArrowUpRight, Briefcase, Camera, Code2, Users, X } from 'lucide-react'
import Image from 'next/image'
import { ref as storageRef, getDownloadURL } from 'firebase/storage'
import { firebaseStorage } from '@/src/lib/firebase/client'
import type { PublicProject } from '@/src/lib/public/projects'
import type { PublicSiteSettings } from '@/src/lib/public/settings'

/* ------------------------------------------------------------------ */
/*  EYEBROW — reused section label (site-consistent)                   */
/* ------------------------------------------------------------------ */
function Eyebrow({ label }: { label: string }) {
  return (
    <div className="eyebrow">
      <span className="eyebrow-dot" /> {label}
    </div>
  )
}

/* Resolve a Storage path -> download URL. See BlogPostClient for rationale. */
function useMediaUrl(path: string | null | undefined): string {
  const [url, setUrl] = useState('')

  useEffect(() => {
    if (!path) {
      setUrl('')
      return
    }
    let cancelled = false
    getDownloadURL(storageRef(firebaseStorage, path))
      .then((resolved) => {
        if (!cancelled) setUrl(resolved)
      })
      .catch(() => {
        if (!cancelled) setUrl('')
      })
    return () => {
      cancelled = true
    }
  }, [path])

  return url
}

/* ------------------------------------------------------------------ */
/*  PROJECT CARD — module-level so useMediaUrl runs at top level       */
/*  (Rules of Hooks: never inside projects.map()).                     */
/* ------------------------------------------------------------------ */
function ProjectCard({ project, locale, ctaLabel }: {
  project: PublicProject
  locale: string
  ctaLabel: string
}) {
  const projectLocale = locale === 'ar' ? 'ar' : 'en'
  const title = project.title[projectLocale]
  const summary = project.summary[projectLocale]
  const coverImage = project.media.find((m) => m.id === project.coverMediaId)
  const coverUrl = useMediaUrl(coverImage?.storagePath)

  return (
    <a className="project-card" href={`/${locale}/portfolio/${project.slug}`}>
      {coverUrl && (
        <div className="project-cover" aria-hidden="true">
          <Image
            src={coverUrl}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="project-cover-image"
            loading="lazy"
            quality={85}
          />
        </div>
      )}
      <div className="project-content">
        <h3>{title}</h3>
        <p className="project-summary">{summary}</p>
        <div className="project-tags">
          {project.technologies.slice(0, 4).map((tag) => (
            <span className="project-tag" key={tag}>{tag}</span>
          ))}
        </div>
        <span className="project-link">{ctaLabel} <ArrowUpRight size={13} /></span>
      </div>
    </a>
  )
}

interface PortfolioPageClientProps {
  locale: string
  projects: PublicProject[]
  siteSettings: PublicSiteSettings | null
}

/* ------------------------------------------------------------------ */
/*  Portfolio page Client Component                                    */
/*  Renders the UI with fetched projects data                         */
/* ------------------------------------------------------------------ */
export default function PortfolioPageClient({ locale, projects, siteSettings }: PortfolioPageClientProps) {
  const t = useTranslations()
  const { resolvedTheme, setTheme } = useTheme()

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }, [resolvedTheme, setTheme])

  const enHref = '/en/portfolio'
  const arHref = '/ar/portfolio'
  // Cross-page anchors: this page sits directly under [locale], like services.
  const servicesHref = `/${locale}/services`
  const home = `/${locale}`
  const blogHref = `/${locale}/blog`

  // Company facts from siteSettings/global (fall back to i18n-agnostic empty).
  const social = siteSettings?.socialLinks ?? {}
  const socialLinks = [
    { key: 'github', href: social.github, label: t('Footer.social.github'), Icon: Code2 },
    { key: 'linkedin', href: social.linkedin, label: t('Footer.social.linkedin'), Icon: Briefcase },
    { key: 'instagram', href: social.instagram, label: t('Footer.social.instagram'), Icon: Camera },
    { key: 'facebook', href: social.facebook, label: t('Footer.social.facebook'), Icon: Users },
    { key: 'x', href: social.x, label: t('Footer.social.twitter'), Icon: X },
  ]

  return (
    <main className="foundation-shell">
      {/* ── Navbar (homepage-identical; cross-page anchors) ── */}
      <nav className="topbar" aria-label="Primary navigation">
        <a className="brand" href={home} aria-label="Nodal home">
          <span className="brand-mark"><span /><span /><span /></span>
          <span>{t('Navbar.brand')}</span>
        </a>

        <div className="nav-links">
          <a href={`${home}#services`}>{t('Navbar.links.services')}</a>
          <a href={`${home}#industries`}>{t('Navbar.links.industries')}</a>
          <a href={`${home}#projects`}>{t('Navbar.links.projects')}</a>
          <a href={`${home}#process`}>{t('Navbar.links.engineering')}</a>
          <a href={`${home}#why-projex`}>{t('Navbar.links.company')}</a>
          <a href={`${home}#contact`}>{t('Navbar.links.contact')}</a>
        </div>

        <div className="nav-controls">
          <div className="locale-switcher">
            <a href={enHref} className={`locale-link${locale === 'en' ? ' active' : ''}`} aria-label="English" data-locale="en">EN</a>
            <span className="locale-divider">/</span>
            <a href={arHref} className={`locale-link${locale === 'ar' ? ' active' : ''}`} aria-label="العربية" data-locale="ar">ع</a>
          </div>

          <button
            className="theme-toggle"
            aria-label={t('Navbar.themeLabel')}
            onClick={toggleTheme}
          >
            <svg className={`theme-icon theme-icon-light${resolvedTheme === 'light' ? ' active' : ''}`}
              width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
            <svg className={`theme-icon theme-icon-dark${resolvedTheme === 'dark' ? ' active' : ''}`}
              width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </button>
        </div>

        <a className="nav-action" href={`${home}#contact`}>{t('Navbar.cta')} <ArrowUpRight size={15} /></a>
      </nav>

      {/* ── 1. Portfolio hero ── */}
      <section className="services-page-overview" id="overview">
        <div className="eyebrow"><span className="eyebrow-dot" /> {t('PortfolioPage.hero.eyebrow')}</div>
        <h1>{t('PortfolioPage.hero.title.line1')}<br /><em>{t('PortfolioPage.hero.title.line2')}</em></h1>
        <p>{t('PortfolioPage.hero.description')}</p>
        <div className="hero-actions">
          <a className="button-primary" href={`#contact`}>{t('PortfolioPage.hero.primaryCta')} <ArrowUpRight size={16} /></a>
          <a className="button-secondary" href={`#work`}>{t('PortfolioPage.hero.secondaryCta')} <ArrowUpRight size={15} /></a>
        </div>
      </section>

      {/* ── 2. Featured projects grid (repo-represented projects) ── */}
      <section className="projects-section portfolio-page-work" id="work" aria-labelledby="portfolio-work-title">
        <div className="projects-intro">
          <div className="projects-intro-head">
            <Eyebrow label={t('PortfolioPage.grid.eyebrow')} />
            <h2 id="portfolio-work-title">{t('PortfolioPage.grid.title.line1')}<br />{t('PortfolioPage.grid.title.line2')}</h2>
          </div>
          <p>{t('PortfolioPage.grid.description')}</p>
        </div>
        <div className="projects-grid portfolio-page-grid">
          {projects.length > 0 ? (
            projects.map((project) => (
              <ProjectCard key={project.id} project={project} locale={locale} ctaLabel={t('Projects.cta')} />
            ))
          ) : (
            <div className="projects-empty-state" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
              <p>{t('Projects.empty')}</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Contact CTA (reused) ── */}
      <section className="contact-cta-section" id="contact" aria-labelledby="portfolio-contact-cta-title">
        <div className="contact-cta-glow" aria-hidden="true" />
        <div className="contact-cta-intro">
          <Eyebrow label={t('ContactCta.eyebrow')} />
          <h2 id="portfolio-contact-cta-title">{t('ContactCta.title.line1')}<br /><em>{t('ContactCta.title.line2')}</em></h2>
          <p>{t('ContactCta.description')}</p>
          <div className="contact-cta-actions">
            <a className="button-primary" href={`#contact`}>{t('ContactCta.primaryCta')} <ArrowUpRight size={16} /></a>
            <a className="button-secondary" href={`#contact`}>{t('ContactCta.secondaryCta')} <ArrowUpRight size={15} /></a>
          </div>
        </div>
      </section>

      {/* ── Footer (homepage-identical; cross-page anchors) ── */}
      <footer className="footer-section" id="footer" aria-labelledby="portfolio-footer-tagline">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-brand-name">{siteSettings?.companyName || t('Navbar.brand')}</div>
            <p className="footer-tagline" id="portfolio-footer-tagline">{t('Footer.tagline')}</p>
            <div className="footer-social" aria-label={t('Footer.social.label')}>
              {socialLinks.map(({ key, href, label, Icon }) =>
                href ? (
                  <a
                    key={key}
                    className="footer-social-link"
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                  >
                    <Icon size={20} />
                  </a>
                ) : null,
              )}
            </div>
          </div>

          <nav className="footer-col" aria-label={t('Footer.columns.company.heading')}>
            <h3 className="footer-heading">{t('Footer.columns.company.heading')}</h3>
            <ul className="footer-links">
              <li><a href={`${home}#services`}>{t('Footer.columns.company.links.services')}</a></li>
              <li><a href={`${home}#industries`}>{t('Footer.columns.company.links.industries')}</a></li>
              <li><a href={`${home}#projects`}>{t('Footer.columns.company.links.projects')}</a></li>
              <li><a href={`${home}#process`}>{t('Footer.columns.company.links.process')}</a></li>
            </ul>
          </nav>

          <nav className="footer-col" aria-label={t('Footer.columns.engineering.heading')}>
            <h3 className="footer-heading">{t('Footer.columns.engineering.heading')}</h3>
            <ul className="footer-links">
              <li><a href={`${servicesHref}#discipline-software`}>{t('Footer.columns.engineering.links.software')}</a></li>
              <li><a href={`${servicesHref}#discipline-embedded`}>{t('Footer.columns.engineering.links.embedded')}</a></li>
              <li><a href={`${servicesHref}#discipline-ai`}>{t('Footer.columns.engineering.links.ai')}</a></li>
              <li><a href={`${servicesHref}#technologies`}>{t('Footer.columns.engineering.links.technologies')}</a></li>
            </ul>
          </nav>

          <nav className="footer-col" aria-label={t('Footer.columns.resources.heading')}>
            <h3 className="footer-heading">{t('Footer.columns.resources.heading')}</h3>
            <ul className="footer-links">
              <li><a href={`${home}#why-projex`}>{t('Footer.columns.resources.links.whyProjex')}</a></li>
              <li><a href={`${home}#testimonials`}>{t('Footer.columns.resources.links.testimonials')}</a></li>
              <li><a href={`${home}#faq`}>{t('Footer.columns.resources.links.faq')}</a></li>
              <li><a href={`${home}/portfolio`}>{t('Footer.columns.resources.links.portfolio')}</a></li>
              <li><a href={blogHref}>{t('Footer.columns.resources.links.blog')}</a></li>
              <li><a href={`#contact`}>{t('Footer.columns.resources.links.contact')}</a></li>
            </ul>
          </nav>

          <nav className="footer-col footer-col-contact" aria-label={t('Footer.columns.contact.heading')}>
            <h3 className="footer-heading">{t('Footer.columns.contact.heading')}</h3>
            <p className="footer-contact-prompt">{t('Footer.columns.contact.prompt')}</p>
            <a className="footer-contact-cta" href={`#contact`}>{t('Footer.columns.contact.cta')}<ArrowUpRight size={16} /></a>
          </nav>
        </div>

        <div className="footer-divider" aria-hidden="true" />

        <div className="footer-bottom">
          <p className="footer-copyright" suppressHydrationWarning>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            {t('Footer.bottomBar.copyright', { year: new Date().getFullYear() })}
          </p>
          <div className="footer-legal">
            <a href={`#footer`}>{t('Footer.bottomBar.privacy')}</a>
            <a href={`#footer`}>{t('Footer.bottomBar.terms')}</a>
          </div>
        </div>
      </footer>
    </main>
  )
}