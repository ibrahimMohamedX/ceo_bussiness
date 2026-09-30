"use client";
import { PROJECT_CTA_URL, ENGINEERS_WHATSAPP_URL } from "@/src/lib/project-cta";
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
/*  Embedded Systems discipline page Client Component                  */
/*  Receives service data as props, renders UI                         */
/* ------------------------------------------------------------------ */
interface EmbeddedPageClientProps {
  locale: string
  service: PublicService | null
  siteSettings: PublicSiteSettings | null
}

export default function EmbeddedPageClient({ locale, service, siteSettings }: EmbeddedPageClientProps) {
  const t = useTranslations()
  const { resolvedTheme, setTheme } = useTheme()

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }, [resolvedTheme, setTheme])

  const enHref = '/en/services/embedded'
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
    icon: typeof Microchip
    title: string
    desc: string
  }

  // Capabilities - use dynamic data from service if available, fallback to static
  const capabilities: CapabilityItem[] = service?.description
    ? [
        { key: 'deterministic', icon: Microchip, title: t('EmbeddedPage.capabilities.items.deterministic.title'), desc: t('EmbeddedPage.capabilities.items.deterministic.desc') },
        { key: 'closeToHardware', icon: Cpu, title: t('EmbeddedPage.capabilities.items.closeToHardware.title'), desc: t('EmbeddedPage.capabilities.items.closeToHardware.desc') },
        { key: 'protocols', icon: Bluetooth, title: t('EmbeddedPage.capabilities.items.protocols.title'), desc: t('EmbeddedPage.capabilities.items.protocols.desc') },
        { key: 'drivers', icon: CircuitBoard, title: t('EmbeddedPage.capabilities.items.drivers.title'), desc: t('EmbeddedPage.capabilities.items.drivers.desc') },
      ]
    : [
        { key: 'firmware', icon: Microchip, title: '', desc: '' },
        { key: 'iot', icon: Cpu, title: '', desc: '' },
        { key: 'connectivity', icon: Bluetooth, title: '', desc: '' },
        { key: 'hardware', icon: CircuitBoard, title: '', desc: '' },
      ]

  const quality = [
    { key: 'hardwareInLoop', icon: ShieldCheck },
    { key: 'integrationTest', icon: Gauge },
    { key: 'realDevice', icon: Cpu },
    { key: 'maintainable', icon: CheckCircle2 },
  ]

  const processSteps = [
    { key: 'requirements', icon: Search },
    { key: 'architecture', icon: Workflow },
    { key: 'firmware', icon: Code2 },
    { key: 'integration', icon: CircuitBoard },
    { key: 'validation', icon: CheckCircle2 },
    { key: 'support', icon: Rocket },
  ]

  const stack = [
    {
      key: 'embedded',
      icon: Microchip,
      items: [
        { name: 'STM32', icon: Microchip },
        { name: 'ESP32', icon: Wifi },
        { name: 'nRF52', icon: Bluetooth },
        { name: 'RP2040', icon: Cpu },
        { name: 'ARM Cortex-M', icon: Cpu },
        { name: 'RISC-V', icon: CircuitBoard },
      ],
    },
    {
      key: 'iot',
      icon: Cog,
      items: [
        { name: 'FreeRTOS', icon: Cog },
        { name: 'Zephyr', icon: GitBranch },
        { name: 'ThreadX', icon: Cpu },
        { name: 'Bare Metal', icon: Code2 },
        { name: 'RT-Thread', icon: Workflow },
        { name: 'Custom Scheduler', icon: SlidersHorizontal },
      ],
    },
    {
      key: 'connectivity',
      icon: Bluetooth,
      items: [
        { name: 'BLE 5.x', icon: Bluetooth },
        { name: 'Wi-Fi 6/6E', icon: Wifi },
        { name: 'LoRaWAN', icon: Radio },
        { name: 'Matter/Thread', icon: Link2 },
        { name: 'CAN/Ethernet', icon: Cable },
        { name: 'Cellular (LTE/5G)', icon: Network },
      ],
    },
    {
      key: 'tools',
      icon: Terminal,
      items: [
        { name: 'GCC/Clang', icon: Terminal },
        { name: 'CMake/Zephyr', icon: Box },
        { name: 'JTAG/SWD', icon: Cable },
        { name: 'Logic Analyzer', icon: Gauge },
        { name: 'Oscilloscope', icon: Zap },
        { name: 'PCB Design (KiCad)', icon: CircuitBoard },
      ],
    },
  ]

  // Import Battery icon dynamically or use a fallback
  const Battery = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="6" width="18" height="12" rx="2" />
      <line x1="23" y1="10" x2="23" y2="14" />
    </svg>
  )

  return (
    <main className="foundation-shell">
      {/* â”€â”€ Navbar (homepage-identical; cross-page anchors) â”€â”€ */}
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

        <a className="nav-action" href={PROJECT_CTA_URL}>{t('Navbar.cta')} <ArrowUpRight size={15} /></a>
      </nav>

      {/* â”€â”€ 1. Discipline hero â”€â”€ */}
      <section className="services-page-overview" id="overview">
        <div className="eyebrow"><span className="eyebrow-dot" /> {service ? service.title[locale as 'en' | 'ar'] : t('EmbeddedPage.hero.eyebrow')}</div>
        <h1>{service ? service.title[locale as 'en' | 'ar'] : t('EmbeddedPage.hero.title.line1')}<br /><em>{t('EmbeddedPage.hero.title.line2')}</em></h1>
        <p>{service ? service.summary[locale as 'en' | 'ar'] : t('EmbeddedPage.hero.description')}</p>
        <div className="hero-actions">
          <a className="button-primary" href={PROJECT_CTA_URL}>{t('EmbeddedPage.hero.primaryCta')} <ArrowUpRight size={16} /></a>
          <a className="button-secondary" href={`#process`}>{t('EmbeddedPage.hero.secondaryCta')} <ArrowUpRight size={15} /></a>
        </div>
      </section>

      {/* â”€â”€ 2. What we build â”€â”€ */}
      <section className="services-page-discipline" id="what-we-build">
        <div className="services-page-discipline-head">
          <div className="process-number" aria-hidden="true">{t('EmbeddedPage.whatWeBuild.number')}</div>
          <Eyebrow label={t('EmbeddedPage.whatWeBuild.eyebrow')} />
        </div>
        <div className="service-icon"><Microchip size={28} strokeWidth={1.5} /></div>
        <h2>{t('EmbeddedPage.whatWeBuild.title')}</h2>
        <p className="services-page-discipline-lede">{t('EmbeddedPage.whatWeBuild.lede')}</p>
        <p className="services-page-discipline-desc">{t('EmbeddedPage.whatWeBuild.desc')}</p>
        <div className="service-tags">
          <span>{t('EmbeddedPage.whatWeBuild.tags.0')}</span>
          <span>{t('EmbeddedPage.whatWeBuild.tags.1')}</span>
          <span>{t('EmbeddedPage.whatWeBuild.tags.2')}</span>
        </div>
        <a className="service-link" href={`#process`}>{t('EmbeddedPage.whatWeBuild.link')} <ArrowUpRight size={13} /></a>
      </section>

      {/* â”€â”€ 3. Engineering capabilities â”€â”€ */}
      <section className="software-grid-section" id="capabilities">
        <div className="software-section-intro">
          <Eyebrow label={t('EmbeddedPage.capabilities.eyebrow')} />
          <h2>{t('EmbeddedPage.capabilities.title.line1')}<br />{t('EmbeddedPage.capabilities.title.line2')}</h2>
          <p>{t('EmbeddedPage.capabilities.description')}</p>
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

      {/* â”€â”€ 4. Technology stack â”€â”€ */}
      <section className="software-stack-section" id="technologies">
        <div className="software-section-intro">
          <Eyebrow label={t('EmbeddedPage.stack.eyebrow')} />
          <h2>{t('EmbeddedPage.stack.title.line1')}<br />{t('EmbeddedPage.stack.title.line2')}</h2>
          <p>{t('EmbeddedPage.stack.description')}</p>
        </div>
        <div className="software-stack-grid">
          {stack.map((cat) => {
            const CatIcon = cat.icon
            return (
              <div key={cat.key} className="tech-category">
                <div className="tech-category-header">
                  <div className="tech-category-icon"><CatIcon size={18} strokeWidth={1.75} /></div>
                  <h4>{t(`EmbeddedPage.stack.categories.${cat.key}.title`)}</h4>
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
          <Eyebrow label={t('EmbeddedPage.process.eyebrow')} />
          <h2>{t('EmbeddedPage.process.title.line1')}<br />{t('EmbeddedPage.process.title.line2')}</h2>
          <p>{t('EmbeddedPage.process.description')}</p>
        </div>
        <div className="software-process-timeline">
          {processSteps.map((step, i) => {
            const StepIcon = step.icon
            return (
              <article key={step.key} className="process-step">
                <div className="process-number" aria-hidden="true">{String(i + 1).padStart(2, '0')}</div>
                <div className="process-icon"><StepIcon size={24} strokeWidth={1.5} /></div>
                <h3>{t(`EmbeddedPage.process.steps.${step.key}.title`)}</h3>
                <p>{t(`EmbeddedPage.process.steps.${step.key}.desc`)}</p>
              </article>
            )
          })}
        </div>
      </section>

      {/* â”€â”€ 6. Quality / reliability â”€â”€ */}
      <section className="software-grid-section" id="quality">
        <div className="software-section-intro">
          <Eyebrow label={t('EmbeddedPage.reliability.eyebrow')} />
          <h2>{t('EmbeddedPage.reliability.title.line1')}<br />{t('EmbeddedPage.reliability.title.line2')}</h2>
          <p>{t('EmbeddedPage.reliability.description')}</p>
        </div>
        <div className="software-card-grid">
          {quality.map((item, i) => {
            const Icon = item.icon
            return (
              <article key={item.key} className="why-projex-card" style={{ ['--card-index' as string]: i }}>
                <div className="why-projex-icon"><Icon size={24} strokeWidth={1.5} /></div>
                <div className="why-projex-card-body">
                  <h3>{t(`EmbeddedPage.reliability.items.${item.key}.title`)}</h3>
                  <p>{t(`EmbeddedPage.reliability.items.${item.key}.desc`)}</p>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      {/* â”€â”€ 7. Relevant work â”€â”€ */}
      <section className="projects-section" id="work">
        <div className="projects-intro">
          <div className="projects-intro-head">
            <Eyebrow label={t('EmbeddedPage.work.eyebrow')} />
            <h2>{t('EmbeddedPage.work.title.line1')}<br />{t('EmbeddedPage.work.title.line2')}</h2>
          </div>
          <p>{t('EmbeddedPage.work.description')}</p>
        </div>
        <div className="software-projects-grid">
          <a className="project-card" href={`${home}#projects`}>
            <div className="project-content">
              <h3>{t('Projects.items.2.title')}</h3>
              <p className="project-summary">{t('Projects.items.2.summary')}</p>
              <div className="project-tags">
                {(t.raw('Projects.items.2.tags') as string[]).map((tag) => (
                  <span className="project-tag" key={tag}>{tag}</span>
                ))}
              </div>
              <span className="project-link">{t('Projects.items.2.cta')} <ArrowUpRight size={13} /></span>
            </div>
          </a>
        </div>
      </section>

      {/* â”€â”€ Pricing / contact CTA (reused) â”€â”€ */}
      <section className="contact-cta-section" id="contact" aria-labelledby="embedded-contact-cta-title">
        <div className="contact-cta-glow" aria-hidden="true" />
        <div className="contact-cta-intro">
          <Eyebrow label={t('ContactCta.eyebrow')} />
          <h2 id="embedded-contact-cta-title">{t('ContactCta.title.line1')}<br /><em>{t('ContactCta.title.line2')}</em></h2>
          <p>{t('ContactCta.description')}</p>
          <div className="contact-cta-actions">
            <a className="button-primary" href={PROJECT_CTA_URL}>{t('ContactCta.primaryCta')} <ArrowUpRight size={16} /></a>
            <a className="button-secondary" href={ENGINEERS_WHATSAPP_URL}>{t('ContactCta.secondaryCta')} <ArrowUpRight size={15} /></a>
          </div>
        </div>
      </section>

      {/* â”€â”€ Footer (homepage-identical; cross-page anchors) â”€â”€ */}
      <footer className="footer-section" id="footer" aria-labelledby="embedded-footer-tagline">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-brand-name">{siteSettings?.companyName || t('Navbar.brand')}</div>
            <p className="footer-tagline" id="embedded-footer-tagline">{t('Footer.tagline')}</p>
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
            <a className="footer-contact-cta" href={PROJECT_CTA_URL}>{t('Footer.columns.contact.cta')}<ArrowUpRight size={16} /></a>
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















