"use client";
'use client'

import { useCallback } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useTheme } from '../../Providers'
import {
  ArrowUpRight,
  Bluetooth,
  Box,
  Briefcase,
  Cable,
  Camera,
  CheckCircle2,
  CircuitBoard,
  Code2,
  Cog,
  Cpu,
  Database,
  GitBranch,
  Gauge,
  Grid,
  LifeBuoy,
  Link,
  Link2,
  Layers,
  Microchip,
  MonitorCog,
  Move,
  Network,
  Radio,
  Rocket,
  Search,
  Server,
  ShieldCheck,
  SlidersHorizontal,
  Terminal,
  Users,
  Wifi,
  Workflow,
  X,
  Zap,
} from 'lucide-react'
import type { PublicService } from '@/src/lib/public/services'
import type { PublicSiteSettings } from '@/src/lib/public/settings'

/* ------------------------------------------------------------------ */
/*  EYEBROW â€” reused section label (site-consistent)                   */
/* ------------------------------------------------------------------ */
function Eyebrow({ label }: { label: string }) {
  return (
    <div className="eyebrow">
      <span className="eyebrow-dot" /> {label}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Software Engineering discipline page Client Component              */
/*  Receives service data as props, renders UI                         */
/* ------------------------------------------------------------------ */
interface SoftwarePageClientProps {
  locale: string
  service: PublicService | null
  siteSettings: PublicSiteSettings | null
}

export default function SoftwarePageClient({ locale, service, siteSettings }: SoftwarePageClientProps) {
  const t = useTranslations()
  const { resolvedTheme, setTheme } = useTheme()

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }, [resolvedTheme, setTheme])

  const enHref = '/en/services/software'
  const arHref = '/ar/services/embedded'
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

  interface CapabilityItem {
    key: string
    icon: typeof Layers
    title: string
    desc: string
  }

  // Capabilities - use dynamic data from service if available, fallback to static
  const capabilities: CapabilityItem[] = service?.description
    ? [
        { key: 'architecture', icon: Layers, title: t('SoftwarePage.capabilities.items.architecture.title'), desc: t('SoftwarePage.capabilities.items.architecture.desc') },
        { key: 'cloud', icon: Server, title: t('SoftwarePage.capabilities.items.cloud.title'), desc: t('SoftwarePage.capabilities.items.cloud.desc') },
        { key: 'tooling', icon: Code2, title: t('SoftwarePage.capabilities.items.tooling.title'), desc: t('SoftwarePage.capabilities.items.tooling.desc') },
        { key: 'data', icon: Database, title: t('SoftwarePage.capabilities.items.data.title'), desc: t('SoftwarePage.capabilities.items.data.desc') },
      ]
    : [
        { key: 'architecture', icon: Layers, title: '', desc: '' },
        { key: 'cloud', icon: Server, title: '', desc: '' },
        { key: 'tooling', icon: Code2, title: '', desc: '' },
        { key: 'data', icon: Database, title: '', desc: '' },
      ]

  const quality = [
    { key: 'maintainable', icon: ShieldCheck },
    { key: 'scalable', icon: GitBranch },
    { key: 'performant', icon: Zap },
    { key: 'secure', icon: Cpu },
  ]

  const processSteps = [
    { key: 'discovery', icon: Search },
    { key: 'architecture', icon: Workflow },
    { key: 'development', icon: Code2 },
    { key: 'testing', icon: CheckCircle2 },
    { key: 'deployment', icon: Rocket },
    { key: 'support', icon: LifeBuoy },
  ]

  const stack = [
    {
      key: 'frontend',
      icon: MonitorCog,
      items: [
        { name: 'React', icon: Code2 },
        { name: 'TypeScript', icon: Code2 },
        { name: 'Next.js', icon: Zap },
        { name: 'Tailwind CSS', icon: SlidersHorizontal },
        { name: 'Three.js', icon: Box },
        { name: 'Framer Motion', icon: Move },
      ],
    },
    {
      key: 'backend',
      icon: Server,
      items: [
        { name: 'Node.js', icon: Server },
        { name: 'Python', icon: Terminal },
        { name: 'Go', icon: Cpu },
        { name: 'Rust', icon: ShieldCheck },
        { name: 'PostgreSQL', icon: Database },
        { name: 'Redis', icon: Zap },
      ],
    },
  ]

  return (
    <main className="foundation-shell">
      {/* â”€â”€ Navbar (homepage-identical; cross-page anchors) â”€â”€ */}
      <nav className="topbar" aria-label="Primary navigation">
        <Brand locale={locale} home={home} siteSettings={siteSettings} />

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
            <a href={arHref} className={`locale-link${locale === 'ar' ? ' active' : ''}`} aria-label="Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©" data-locale="ar">Ø¹</a>
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

        <a className="nav-action" href={getProjectCtaUrl(siteSettings)}>{t('Navbar.cta')} <ArrowUpRight size={15} /></a>
      </nav>

      {/* â”€â”€ 1. Discipline hero â”€â”€ */}
      <section className="services-page-overview" id="overview">
        <div className="eyebrow"><span className="eyebrow-dot" /> {service ? service.title[locale as 'en' | 'ar'] : t('SoftwarePage.hero.eyebrow')}</div>
        <h1>{service ? service.title[locale as 'en' | 'ar'] : t('SoftwarePage.hero.title.line1')}<br /><em>{t('SoftwarePage.hero.title.line2')}</em></h1>
        <p>{service ? service.summary[locale as 'en' | 'ar'] : t('SoftwarePage.hero.description')}</p>
        <div className="hero-actions">
          <a className="button-primary" href={getProjectCtaUrl(siteSettings)}>{t('SoftwarePage.hero.primaryCta')} <ArrowUpRight size={16} /></a>
          <a className="button-secondary" href={`#process`}>{t('SoftwarePage.hero.secondaryCta')} <ArrowUpRight size={15} /></a>
        </div>
      </section>

      {/* â”€â”€ 2. What we build â”€â”€ */}
      <section className="services-page-discipline" id="what-we-build">
        <div className="services-page-discipline-head">
          <div className="process-number" aria-hidden="true">{t('SoftwarePage.whatWeBuild.number')}</div>
          <Eyebrow label={t('SoftwarePage.whatWeBuild.eyebrow')} />
        </div>
        <div className="service-icon"><Code2 size={28} strokeWidth={1.5} /></div>
        <h2>{t('SoftwarePage.whatWeBuild.title')}</h2>
        <p className="services-page-discipline-lede">{t('SoftwarePage.whatWeBuild.lede')}</p>
        <p className="services-page-discipline-desc">{t('SoftwarePage.whatWeBuild.desc')}</p>
        <div className="service-tags">
          <span>{t('SoftwarePage.whatWeBuild.tags.0')}</span>
          <span>{t('SoftwarePage.whatWeBuild.tags.1')}</span>
          <span>{t('SoftwarePage.whatWeBuild.tags.2')}</span>
        </div>
        <a className="service-link" href={`#process`}>{t('SoftwarePage.whatWeBuild.link')} <ArrowUpRight size={13} /></a>
      </section>

      {/* â”€â”€ 3. Engineering capabilities â”€â”€ */}
      <section className="software-grid-section" id="capabilities">
        <div className="software-section-intro">
          <Eyebrow label={t('SoftwarePage.capabilities.eyebrow')} />
          <h2>{t('SoftwarePage.capabilities.title.line1')}<br />{t('SoftwarePage.capabilities.title.line2')}</h2>
          <p>{t('SoftwarePage.capabilities.description')}</p>
        </div>
        <div className="software-card-grid">
          {capabilities.map((cap, i) => (
            <article key={cap.key} className="why-projex-card" style={{ ['--card-index' as string]: i }}>
              <div className="why-projex-icon"><cap.icon size={26} strokeWidth={1.5} /></div>
              <div className="why-projex-card-body">
                <h3>{cap.title}</h3>
                <p>{cap.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* â”€â”€ 4. Technology stack (frontend + backend) â”€â”€ */}
      <section className="software-stack-section" id="technologies">
        <div className="software-section-intro">
          <Eyebrow label={t('SoftwarePage.stack.eyebrow')} />
          <h2>{t('SoftwarePage.stack.title.line1')}<br />{t('SoftwarePage.stack.title.line2')}</h2>
          <p>{t('SoftwarePage.stack.description')}</p>
        </div>
        <div className="software-stack-grid">
          {stack.map((cat) => {
            const CatIcon = cat.icon
            return (
              <div key={cat.key} className="tech-category">
                <div className="tech-category-header">
                  <div className="tech-category-icon"><CatIcon size={18} strokeWidth={1.75} /></div>
                  <h4>{t(`SoftwarePage.stack.categories.${cat.key}.title`)}</h4>
                </div>
                <ul className="tech-items">
                  {cat.items.map((item) => {
                    const ItemIcon = item.icon
                    return (
                      <li key={item.name} className="tech-item">
                        <div className="tech-icon"><ItemIcon size={16} strokeWidth={1.75} /></div>
                        <span className="tech-name">{item.name}</span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })}
        </div>
      </section>

      {/* â”€â”€ 5. Engineering process (six steps) â”€â”€ */}
      <section className="process-section" id="process">
        <div className="process-intro">
          <Eyebrow label={t('SoftwarePage.process.eyebrow')} />
          <h2>{t('SoftwarePage.process.title.line1')}<br />{t('SoftwarePage.process.title.line2')}</h2>
          <p>{t('SoftwarePage.process.description')}</p>
        </div>
        <div className="software-process-timeline">
          {processSteps.map((step, i) => {
            const StepIcon = step.icon
            return (
              <article key={step.key} className="process-step">
                <div className="process-number" aria-hidden="true">{String(i + 1).padStart(2, '0')}</div>
                <div className="process-icon"><StepIcon size={24} strokeWidth={1.5} /></div>
                <h3>{t(`SoftwarePage.process.steps.${step.key}.title`)}</h3>
                <p>{t(`SoftwarePage.process.steps.${step.key}.desc`)}</p>
              </article>
            )
          })}
        </div>
      </section>

      {/* â”€â”€ 6. Quality / reliability â”€â”€ */}
      <section className="software-grid-section" id="quality">
        <div className="software-section-intro">
          <Eyebrow label={t('SoftwarePage.quality.eyebrow')} />
          <h2>{t('SoftwarePage.quality.title.line1')}<br />{t('SoftwarePage.quality.title.line2')}</h2>
          <p>{t('SoftwarePage.quality.description')}</p>
        </div>
        <div className="software-card-grid">
          {quality.map((item, i) => {
            const Icon = item.icon
            return (
              <article key={item.key} className="why-projex-card" style={{ ['--card-index' as string]: i }}>
                <div className="why-projex-icon"><Icon size={24} strokeWidth={1.5} /></div>
                <div className="why-projex-card-body">
                  <h3>{t(`SoftwarePage.quality.items.${item.key}.title`)}</h3>
                  <p>{t(`SoftwarePage.quality.items.${item.key}.desc`)}</p>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      {/* â”€â”€ 7. Relevant work (repo-represented project) â”€â”€ */}
      <section className="projects-section" id="work">
        <div className="projects-intro">
          <div className="projects-intro-head">
            <Eyebrow label={t('SoftwarePage.work.eyebrow')} />
            <h2>{t('SoftwarePage.work.title.line1')}<br />{t('SoftwarePage.work.title.line2')}</h2>
          </div>
          <p>{t('SoftwarePage.work.description')}</p>
        </div>
        <div className="software-projects-grid">
          <a className="project-card" href={`${home}#projects`}>
            <div className="project-content">
              <h3>{t('Projects.items.1.title')}</h3>
              <p className="project-summary">{t('Projects.items.1.summary')}</p>
              <div className="project-tags">
                {(t.raw('Projects.items.1.tags') as string[]).map((tag) => (
                  <span className="project-tag" key={tag}>{tag}</span>
                ))}
              </div>
              <span className="project-link">{t('Projects.items.1.cta')} <ArrowUpRight size={13} /></span>
            </div>
          </a>
        </div>
      </section>

      {/* â”€â”€ Pricing / contact CTA (reused) â”€â”€ */}
      <section className="contact-cta-section" id="contact" aria-labelledby="software-contact-cta-title">
        <div className="contact-cta-glow" aria-hidden="true" />
        <div className="contact-cta-intro">
          <Eyebrow label={t('ContactCta.eyebrow')} />
          <h2 id="software-contact-cta-title">{t('ContactCta.title.line1')}<br /><em>{t('ContactCta.title.line2')}</em></h2>
          <p>{t('ContactCta.description')}</p>
          <div className="contact-cta-actions">
            <a className="button-primary" href={getProjectCtaUrl(siteSettings)}>{t('ContactCta.primaryCta')} <ArrowUpRight size={16} /></a>
            <a className="button-secondary" href={getEngineersWhatsAppUrl(siteSettings, locale)}>{t('ContactCta.secondaryCta')} <ArrowUpRight size={15} /></a>
          </div>
        </div>
      </section>

      {/* â”€â”€ Footer (homepage-identical; cross-page anchors) â”€â”€ */}
      <footer className="footer-section" id="footer" aria-labelledby="software-footer-tagline">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-brand-name"><FooterBrandLogo siteSettings={siteSettings} />
            <span>{siteSettings?.brandName?.[locale === "ar" ? "ar" : "en"]?.trim() || siteSettings?.companyName || t("Navbar.brand")}</span></div>
            <p className="footer-tagline" id="software-footer-tagline">{t('Footer.tagline')}</p>
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
            <a className="footer-contact-cta" href={getProjectCtaUrl(siteSettings)}>{t('Footer.columns.contact.cta')}<ArrowUpRight size={16} /></a>
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





















