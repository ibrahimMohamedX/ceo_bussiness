"use client";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaGithub,
  FaXTwitter,
} from "react-icons/fa6";
import { useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useTheme } from "../Providers";
import {
  ArrowUpRight,
  Brain,
  Briefcase,
  Camera,
  CircleCheckBig,
  Code2,
  Cog,
  GitBranch,
  Microchip,
  Rocket,
  Search,
  Users,
  X,
} from "lucide-react";
import type { PublicService } from "@/src/lib/public/services";
import type { PublicSiteSettings } from "@/src/lib/public/settings";

/* ------------------------------------------------------------------ */
/*  EYEBROW â€” reused section label (homepage-consistent)               */
/* ------------------------------------------------------------------ */
function Eyebrow({ label }: { label: string }) {
  return (
    <div className="eyebrow">
      <span className="eyebrow-dot" /> {label}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Services page Client Component                                     */
/*  Renders the UI with fetched services data                          */
/* ------------------------------------------------------------------ */
interface ServicesPageClientProps {
  locale: string;
  services: PublicService[];
  siteSettings: PublicSiteSettings | null;
}

export default function ServicesPageClient({
  locale,
  services,
  siteSettings,
}: ServicesPageClientProps) {
  const t = useTranslations();
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  const enHref = "/en/services";
  const arHref = "/ar/services";
  const home = `/${locale}`;
  const blogHref = `/${locale}/blog`;

  // Company facts from siteSettings/global (fall back to i18n-agnostic empty).
  const social = siteSettings?.socialLinks ?? {};
  const socialLinks = [
    {
      key: "github",
      href: social.github,
      label: t("Footer.social.github"),
      Icon: FaGithub,
    },
    {
      key: "linkedin",
      href: social.linkedin,
      label: t("Footer.social.linkedin"),
      Icon: FaLinkedinIn,
    },
    {
      key: "instagram",
      href: social.instagram,
      label: t("Footer.social.instagram"),
      Icon: FaInstagram,
    },
    {
      key: "facebook",
      href: social.facebook,
      label: t("Footer.social.facebook"),
      Icon: FaFacebookF,
    },
    { key: "x", href: social.x, label: t("Footer.social.twitter"), Icon: FaXTwitter },
  ];

  // Discipline icons mapping
  const disciplineIcons: Record<string, React.ReactNode> = {
    software: <Code2 size={28} strokeWidth={1.5} />,
    embedded: <Microchip size={28} strokeWidth={1.5} />,
    ai: <Brain size={28} strokeWidth={1.5} />,
  };

  // Discipline slug to route mapping
  const disciplineRoutes: Record<string, string> = {
    software: "/services/software",
    embedded: "/services/embedded",
    ai: "/services/ai",
  };

  // Group services by discipline (tag)
  const servicesByDiscipline: Record<string, PublicService[]> = {
    software: services.filter((s) => s.tags.includes("software")),
    embedded: services.filter((s) => s.tags.includes("embedded")),
    ai: services.filter((s) => s.tags.includes("ai")),
  };

  return (
    <main className="foundation-shell">
      {/* â”€â”€ Navbar (homepage-identical; cross-page anchors) â”€â”€ */}
      <nav className="topbar" aria-label="Primary navigation">
        <Brand locale={locale} home={home} siteSettings={siteSettings} />

        <div className="nav-links">
          <a href={`${home}#services`}>{t("Navbar.links.services")}</a>
          <a href={`${home}#industries`}>{t("Navbar.links.industries")}</a>
          <a href={`${home}#projects`}>{t("Navbar.links.projects")}</a>
          <a href={`${home}#process`}>{t("Navbar.links.engineering")}</a>
          <a href={`${home}#why-projex`}>{t("Navbar.links.company")}</a>
          <a href={`${home}#contact`}>{t("Navbar.links.contact")}</a>
        </div>

        <div className="nav-controls">
          <div className="locale-switcher">
            <a
              href={enHref}
              className={`locale-link${locale === "en" ? " active" : ""}`}
              aria-label="English"
              data-locale="en"
            >
              EN
            </a>
            <span className="locale-divider">/</span>
            <a
              href={arHref}
              className={`locale-link${locale === "ar" ? " active" : ""}`}
              aria-label="Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©"
              data-locale="ar"
            >
              Ø¹
            </a>
          </div>

          <button
            className="theme-toggle"
            aria-label={t("Navbar.themeLabel")}
            onClick={toggleTheme}
          >
            <svg
              className={`theme-icon theme-icon-light${resolvedTheme === "light" ? " active" : ""}`}
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
            <svg
              className={`theme-icon theme-icon-dark${resolvedTheme === "dark" ? " active" : ""}`}
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </button>
        </div>

        <a className="nav-action" href={getProjectCtaUrl(siteSettings)}>
          {t("Navbar.cta")} <ArrowUpRight size={15} />
        </a>
      </nav>

      {/* â”€â”€ 1. Overview â”€â”€ */}
      <section className="services-page-overview" id="overview">
        <div className="eyebrow">
          <span className="eyebrow-dot" /> {t("ServicesPage.eyebrow")}
        </div>
        <h1>
          {t("ServicesPage.title.line1")}
          <br />
          <em>{t("ServicesPage.title.line2")}</em>
        </h1>
        <p>{t("ServicesPage.description")}</p>
        <div className="hero-actions">
          <a className="button-primary" href={getProjectCtaUrl(siteSettings)}>
            {t("ServicesPage.primaryCta")} <ArrowUpRight size={16} />
          </a>
          <a className="button-secondary" href={`#process`}>
            {t("ServicesPage.secondaryCta")} <ArrowUpRight size={15} />
          </a>
        </div>
      </section>

      {/* â”€â”€ 2-4. Discipline detail sections â”€â”€ */}
      {["software", "embedded", "ai"].map((d) => {
        const disciplineServices = servicesByDiscipline[d] || [];
        return (
          <section
            className="services-page-discipline"
            id={`discipline-${d}`}
            key={d}
          >
            <div className="services-page-discipline-head">
              <div className="process-number" aria-hidden="true">
                {t(`ServicesPage.disciplines.${d}.number`)}
              </div>
              <Eyebrow label={t(`ServicesPage.disciplines.${d}.eyebrow`)} />
            </div>
            <div className="service-icon">{disciplineIcons[d]}</div>
            <h2>{t(`Services.cards.${d}.title`)}</h2>
            <p className="services-page-discipline-lede">
              {t(`ServicesPage.disciplines.${d}.lede`)}
            </p>
            <p className="services-page-discipline-desc">
              {t(`Services.cards.${d}.description`)}
            </p>
            <div className="service-tags">
              <span>{t(`Services.cards.${d}.tags.0`)}</span>
              <span>{t(`Services.cards.${d}.tags.1`)}</span>
              <span>{t(`Services.cards.${d}.tags.2`)}</span>
            </div>
            <a
              className="service-link"
              href={`/${locale}${disciplineRoutes[d]}`}
            >
              {t("ServicesPage.learnMore")} <ArrowUpRight size={13} />
            </a>
          </section>
        );
      })}

      {/* â”€â”€ 5. Development Process (reused) â”€â”€ */}
      <section className="process-section" id="process">
        <div className="process-intro">
          <Eyebrow label={t("Process.eyebrow")} />
          <h2>
            {t("Process.title.line1")}
            <br />
            {t("Process.title.line2")}
          </h2>
          <p>{t("Process.description")}</p>
        </div>
        <div className="process-timeline">
          <div className="process-connector" aria-hidden="true" />
          <article className="process-step">
            <div className="process-number" aria-hidden="true">
              01
            </div>
            <div className="process-icon">
              <Search size={28} strokeWidth={1.5} />
            </div>
            <h3>{t("Process.steps.discovery.title")}</h3>
            <p>{t("Process.steps.discovery.description")}</p>
          </article>
          <article className="process-step">
            <div className="process-number" aria-hidden="true">
              02
            </div>
            <div className="process-icon">
              <GitBranch size={28} strokeWidth={1.5} />
            </div>
            <h3>{t("Process.steps.architecture.title")}</h3>
            <p>{t("Process.steps.architecture.description")}</p>
          </article>
          <article className="process-step">
            <div className="process-number" aria-hidden="true">
              03
            </div>
            <div className="process-icon">
              <Cog size={28} strokeWidth={1.5} />
            </div>
            <h3>{t("Process.steps.engineering.title")}</h3>
            <p>{t("Process.steps.engineering.description")}</p>
          </article>
          <article className="process-step">
            <div className="process-number" aria-hidden="true">
              04
            </div>
            <div className="process-icon">
              <CircleCheckBig size={28} strokeWidth={1.5} />
            </div>
            <h3>{t("Process.steps.validation.title")}</h3>
            <p>{t("Process.steps.validation.description")}</p>
          </article>
          <article className="process-step">
            <div className="process-number" aria-hidden="true">
              05
            </div>
            <div className="process-icon">
              <Rocket size={28} strokeWidth={1.5} />
            </div>
            <h3>{t("Process.steps.deployment.title")}</h3>
            <p>{t("Process.steps.deployment.description")}</p>
          </article>
        </div>
      </section>

      {/* â”€â”€ 6. Pricing CTA (reused) â”€â”€ */}
      <section
        className="contact-cta-section"
        id="contact"
        aria-labelledby="services-contact-cta-title"
      >
        <div className="contact-cta-glow" aria-hidden="true" />
        <div className="contact-cta-intro">
          <Eyebrow label={t("ContactCta.eyebrow")} />
          <h2 id="services-contact-cta-title">
            {t("ContactCta.title.line1")}
            <br />
            <em>{t("ContactCta.title.line2")}</em>
          </h2>
          <p>{t("ContactCta.description")}</p>
          <div className="contact-cta-actions">
            <a className="button-primary" href={getProjectCtaUrl(siteSettings)}>
              {t("ContactCta.primaryCta")} <ArrowUpRight size={16} />
            </a>
            <a className="button-secondary" href={getEngineersWhatsAppUrl(siteSettings, locale)}>
              {t("ContactCta.secondaryCta")} <ArrowUpRight size={15} />
            </a>
          </div>
        </div>
      </section>

      {/* â”€â”€ Footer (homepage-identical; cross-page anchors) â”€â”€ */}
      <footer
        className="footer-section"
        id="footer"
        aria-labelledby="services-footer-tagline"
      >
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-brand-name">
              <FooterBrandLogo siteSettings={siteSettings} />
            <span>{siteSettings?.brandName?.[locale === "ar" ? "ar" : "en"]?.trim() || siteSettings?.companyName || t("Navbar.brand")}</span>
            </div>
            <p className="footer-tagline" id="services-footer-tagline">
              {t("Footer.tagline")}
            </p>
            <div
              className="footer-social"
              aria-label={t("Footer.social.label")}
            >
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

          <nav
            className="footer-col"
            aria-label={t("Footer.columns.company.heading")}
          >
            <h3 className="footer-heading">
              {t("Footer.columns.company.heading")}
            </h3>
            <ul className="footer-links">
              <li>
                <a href={`${home}#services`}>
                  {t("Footer.columns.company.links.services")}
                </a>
              </li>
              <li>
                <a href={`${home}#industries`}>
                  {t("Footer.columns.company.links.industries")}
                </a>
              </li>
              <li>
                <a href={`${home}#projects`}>
                  {t("Footer.columns.company.links.projects")}
                </a>
              </li>
              <li>
                <a href={`${home}#process`}>
                  {t("Footer.columns.company.links.process")}
                </a>
              </li>
            </ul>
          </nav>

          <nav
            className="footer-col"
            aria-label={t("Footer.columns.engineering.heading")}
          >
            <h3 className="footer-heading">
              {t("Footer.columns.engineering.heading")}
            </h3>
            <ul className="footer-links">
              <li>
                <a href={`#discipline-software`}>
                  {t("Footer.columns.engineering.links.software")}
                </a>
              </li>
              <li>
                <a href={`#discipline-embedded`}>
                  {t("Footer.columns.engineering.links.embedded")}
                </a>
              </li>
              <li>
                <a href={`#discipline-ai`}>
                  {t("Footer.columns.engineering.links.ai")}
                </a>
              </li>
              <li>
                <a href={`${home}#technologies`}>
                  {t("Footer.columns.engineering.links.technologies")}
                </a>
              </li>
            </ul>
          </nav>

          <nav
            className="footer-col"
            aria-label={t("Footer.columns.resources.heading")}
          >
            <h3 className="footer-heading">
              {t("Footer.columns.resources.heading")}
            </h3>
            <ul className="footer-links">
              <li>
                <a href={`${home}#why-projex`}>
                  {t("Footer.columns.resources.links.whyProjex")}
                </a>
              </li>
              <li>
                <a href={`${home}#testimonials`}>
                  {t("Footer.columns.resources.links.testimonials")}
                </a>
              </li>
              <li>
                <a href={`${home}#faq`}>
                  {t("Footer.columns.resources.links.faq")}
                </a>
              </li>
              <li>
                <a href={`${home}/portfolio`}>
                  {t("Footer.columns.resources.links.portfolio")}
                </a>
              </li>
              <li>
                <a href={blogHref}>
                  {t("Footer.columns.resources.links.blog")}
                </a>
              </li>
              <li>
                <a href={getEngineersWhatsAppUrl(siteSettings, locale)}>
                  {t("Footer.columns.resources.links.contact")}
                </a>
              </li>
            </ul>
          </nav>

          <nav
            className="footer-col footer-col-contact"
            aria-label={t("Footer.columns.contact.heading")}
          >
            <h3 className="footer-heading">
              {t("Footer.columns.contact.heading")}
            </h3>
            <p className="footer-contact-prompt">
              {t("Footer.columns.contact.prompt")}
            </p>
            <a className="footer-contact-cta" href={getProjectCtaUrl(siteSettings)}>
              {t("Footer.columns.contact.cta")}
              <ArrowUpRight size={16} />
            </a>
          </nav>
        </div>

        <div className="footer-divider" aria-hidden="true" />

        <div className="footer-bottom">
          <p className="footer-copyright" suppressHydrationWarning>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            {t("Footer.bottomBar.copyright", {
              year: new Date().getFullYear(),
            })}
          </p>
          <div className="footer-legal">
            <a href={`#footer`}>{t("Footer.bottomBar.privacy")}</a>
            <a href={`#footer`}>{t("Footer.bottomBar.terms")}</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
























