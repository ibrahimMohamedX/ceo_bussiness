'use client'

import { useCallback } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useTheme } from '../Providers'
import type { PublicSiteSettings } from '@/src/lib/public/settings'
import {
  ArrowUpRight,
  Bot,
  Brain,
  Briefcase,
  Camera,
  CircleCheckBig,
  Code2,
  Gauge,
  GitBranch,
  Link,
  Microchip,
  Rocket,
  Search,
  ShieldCheck,
  Users,
  Workflow,
  X,
  Zap,
} from 'lucide-react'

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

/* ------------------------------------------------------------------ */
/*  About page                                                         */
/*  A direct child of [locale]. Navbar/Footer are homepage-identical.  */
/*  Copy is translated and factual — engineering culture first, no     */
/*  invented history or dated events.                                  */
/* ------------------------------------------------------------------ */
export default function AboutPageClient({
  locale,
  siteSettings,
}: {
  locale: string
  siteSettings: PublicSiteSettings | null
}) {
  const t = useTranslations()
  const { resolvedTheme, setTheme } = useTheme()

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }, [resolvedTheme, setTheme])

  const enHref = '/en/about'
  const arHref = '/ar/about'
  // Cross-page anchors: this page is a direct child of the locale route.
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

  const missionItems = [
    { key: 'precision', icon: Gauge },
    { key: 'reliability', icon: ShieldCheck },
    { key: 'performance', icon: Zap },
  ]

  const visionItems = [
    { key: 'scalable', icon: GitBranch },
    { key: 'secure', icon: ShieldCheck },
    { key: 'automation', icon: Bot },
  ]

  const teamItems = [
    { key: 'software', icon: Code2 },
    { key: 'embedded', icon: Microchip },
    { key: 'ai', icon: Brain },
  ]

  const valuesItems = [
    { key: 'integrity', icon: ShieldCheck },
    { key: 'quality', icon: CircleCheckBig },
    { key: 'collaboration', icon: Link },
  ]

  const processSteps = [
    { key: 'discovery', icon: Search },
    { key: 'architecture', icon: Workflow },
    { key: 'build', icon: Code2 },
    { key: 'validate', icon: CircleCheckBig },
    { key: 'operate', icon: Rocket },
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

      {/* ── 1. Hero ── */}
      <section className="services-page-overview" id="overview">
        <div className="eyebrow"><span className="eyebrow-dot" /> {t('AboutPage.hero.eyebrow')}</div>
        <h1>{t('AboutPage.hero.title.line1')}<br /><em>{t('AboutPage.hero.title.line2')}</em></h1>
        <p>{t('AboutPage.hero.description')}</p>
        <div className="hero-actions">
          <a className="button-primary" href={`#contact`}>{t('AboutPage.hero.primaryCta')} <ArrowUpRight size={16} /></a>
          <a className="button-secondary" href={`#values`}>{t('AboutPage.hero.secondaryCta')} <ArrowUpRight size={15} /></a>
        </div>
      </section>

      {/* ── 2. Mission ── */}
      <section className="software-grid-section" id="mission">
        <div className="software-section-intro">
          <Eyebrow label={t('AboutPage.mission.eyebrow')} />
          <h2>{t('AboutPage.mission.title.line1')}<br />{t('AboutPage.mission.title.line2')}</h2>
          <p>{t('AboutPage.mission.description')}</p>
        </div>
        <div className="software-card-grid">
          {missionItems.map((item, i) => {
            const Icon = item.icon
            return (
              <article key={item.key} className="why-projex-card" style={{ ['--card-index' as string]: i }}>
                <div className="why-projex-icon"><Icon size={26} strokeWidth={1.5} /></div>
                <div className="why-projex-card-body">
                  <h3>{t(`AboutPage.mission.items.${item.key}.title`)}</h3>
                  <p>{t(`AboutPage.mission.items.${item.key}.desc`)}</p>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      {/* ── 3. Vision ── */}
      <section className="software-grid-section" id="vision">
        <div className="software-section-intro">
          <Eyebrow label={t('AboutPage.vision.eyebrow')} />
          <h2>{t('AboutPage.vision.title.line1')}<br />{t('AboutPage.vision.title.line2')}</h2>
          <p>{t('AboutPage.vision.description')}</p>
        </div>
        <div className="software-card-grid">
          {visionItems.map((item, i) => {
            const Icon = item.icon
            return (
              <article key={item.key} className="why-projex-card" style={{ ['--card-index' as string]: i }}>
                <div className="why-projex-icon"><Icon size={26} strokeWidth={1.5} /></div>
                <div className="why-projex-card-body">
                  <h3>{t(`AboutPage.vision.items.${item.key}.title`)}</h3>
                  <p>{t(`AboutPage.vision.items.${item.key}.desc`)}</p>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      {/* ── 4. Story ── */}
      <section className="services-page-discipline" id="story">
        <div className="services-page-discipline-head">
          <div className="process-number" aria-hidden="true">{t('AboutPage.story.number')}</div>
          <Eyebrow label={t('AboutPage.story.eyebrow')} />
        </div>
        <div className="service-icon"><Code2 size={28} strokeWidth={1.5} /></div>
        <h2>{t('AboutPage.story.title.line1')}<br />{t('AboutPage.story.title.line2')}</h2>
        <p className="services-page-discipline-lede">{t('AboutPage.story.lede')}</p>
        <p className="services-page-discipline-desc">{t('AboutPage.story.desc')}</p>
        <a className="service-link" href={`#team`}>{t('AboutPage.story.link')} <ArrowUpRight size={13} /></a>
      </section>

      {/* ── 5. Team ── */}
      <section className="software-grid-section" id="team">
        <div className="software-section-intro">
          <Eyebrow label={t('AboutPage.team.eyebrow')} />
          <h2>{t('AboutPage.team.title.line1')}<br />{t('AboutPage.team.title.line2')}</h2>
          <p>{t('AboutPage.team.description')}</p>
        </div>
        <div className="software-card-grid">
          {teamItems.map((item, i) => {
            const Icon = item.icon
            return (
              <article key={item.key} className="why-projex-card" style={{ ['--card-index' as string]: i }}>
                <div className="why-projex-icon"><Icon size={26} strokeWidth={1.5} /></div>
                <div className="why-projex-card-body">
                  <h3>{t(`AboutPage.team.items.${item.key}.title`)}</h3>
                  <p>{t(`AboutPage.team.items.${item.key}.desc`)}</p>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      {/* ── 6. Values ── */}
      <section className="software-grid-section" id="values">
        <div className="software-section-intro">
          <Eyebrow label={t('AboutPage.values.eyebrow')} />
          <h2>{t('AboutPage.values.title.line1')}<br />{t('AboutPage.values.title.line2')}</h2>
          <p>{t('AboutPage.values.description')}</p>
        </div>
        <div className="software-card-grid">
          {valuesItems.map((item, i) => {
            const Icon = item.icon
            return (
              <article key={item.key} className="why-projex-card" style={{ ['--card-index' as string]: i }}>
                <div className="why-projex-icon"><Icon size={26} strokeWidth={1.5} /></div>
                <div className="why-projex-card-body">
                  <h3>{t(`AboutPage.values.items.${item.key}.title`)}</h3>
                  <p>{t(`AboutPage.values.items.${item.key}.desc`)}</p>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      {/* ── 7. Timeline (how we work) ── */}
      <section className="process-section" id="process">
        <div className="process-intro">
          <Eyebrow label={t('AboutPage.timeline.eyebrow')} />
          <h2>{t('AboutPage.timeline.title.line1')}<br />{t('AboutPage.timeline.title.line2')}</h2>
          <p>{t('AboutPage.timeline.description')}</p>
        </div>
        <div className="software-process-timeline">
          {processSteps.map((step, i) => {
            const StepIcon = step.icon
            return (
              <article key={step.key} className="process-step">
                <div className="process-number" aria-hidden="true">{String(i + 1).padStart(2, '0')}</div>
                <div className="process-icon"><StepIcon size={24} strokeWidth={1.5} /></div>
                <h3>{t(`AboutPage.timeline.steps.${step.key}.title`)}</h3>
                <p>{t(`AboutPage.timeline.steps.${step.key}.desc`)}</p>
              </article>
            )
          })}
        </div>
      </section>

      {/* ── Contact CTA (reused) ── */}
      <section className="contact-cta-section" id="contact" aria-labelledby="about-contact-cta-title">
        <div className="contact-cta-glow" aria-hidden="true" />
        <div className="contact-cta-intro">
          <Eyebrow label={t('ContactCta.eyebrow')} />
          <h2 id="about-contact-cta-title">{t('ContactCta.title.line1')}<br /><em>{t('ContactCta.title.line2')}</em></h2>
          <p>{t('ContactCta.description')}</p>
          <div className="contact-cta-actions">
            <a className="button-primary" href={`#contact`}>{t('ContactCta.primaryCta')} <ArrowUpRight size={16} /></a>
            <a className="button-secondary" href={`#contact`}>{t('ContactCta.secondaryCta')} <ArrowUpRight size={15} /></a>
          </div>
        </div>
      </section>

      {/* ── Footer (homepage-identical; cross-page anchors) ── */}
      <footer className="footer-section" id="footer" aria-labelledby="about-footer-tagline">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-brand-name">{siteSettings?.companyName || t('Navbar.brand')}</div>
            <p className="footer-tagline" id="about-footer-tagline">{t('Footer.tagline')}</p>
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
            {siteSettings?.contactEmail ? (
              <p className="footer-contact-prompt">
                <a href={`mailto:${siteSettings.contactEmail}`}>{siteSettings.contactEmail}</a>
              </p>
            ) : null}
            {siteSettings?.contactPhone ? (
              <p className="footer-contact-prompt">{siteSettings.contactPhone}</p>
            ) : null}
            {siteSettings?.address?.[locale as 'en' | 'ar'] ? (
              <p className="footer-contact-prompt">{siteSettings.address[locale as 'en' | 'ar']}</p>
            ) : null}
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