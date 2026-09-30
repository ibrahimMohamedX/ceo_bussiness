"use client";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaGithub,
  FaXTwitter,
} from "react-icons/fa6";
import { useCallback, useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useTheme } from "../Providers";
import { ArrowUpRight, Briefcase, Camera, Code2, Users, X } from "lucide-react";
import Image from "next/image";
import type { PublicBlogPost } from "@/src/lib/public/blog";
import type { PublicSiteSettings } from "@/src/lib/public/settings";
import { getProjectCtaUrl } from "@/src/lib/project-cta";
import { Brand } from "@/components/Brand";
import { FooterBrandLogo } from "@/components/FooterBrandLogo";

/* ------------------------------------------------------------------ */
/*  EYEBROW â€” reused section label (site-consistent)                   */
/* ------------------------------------------------------------------ */
function Eyebrow({ label }: { label: string }) {
  return (
    <div className="eyebrow">
      <span className="eyebrow-dot" /> {label}
    </div>
  );
}

/* Resolve a media record -> display URL.

   Cloudinary records resolve synchronously from publicId (delivery URLs are
   public and need no credentials, so nothing sensitive reaches the browser).
   Legacy records that only carry a Firebase storagePath are still resolved via
   getDownloadURL â€” retained solely for pre-migration documents. */

interface BlogPageClientProps {
  locale: string;
  posts: PublicBlogPost[];
  categories: string[];
  tags: string[];
  siteSettings: PublicSiteSettings | null;
}

/* ------------------------------------------------------------------ */
/*  Blog page Client Component                                         */
/*  Renders the UI with fetched blog posts data                       */
/* ------------------------------------------------------------------ */
export default function BlogPageClient({
  locale,
  posts,
  categories,
  tags,
  siteSettings,
}: BlogPageClientProps) {
  const t = useTranslations();
  const currentLocale = useLocale();
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  const enHref = "/en/blog";
  const arHref = "/ar/blog";
  // Cross-page anchors: this page sits directly under [locale], like services.
  const servicesHref = `/${locale}/services`;
  const home = `/${locale}`;
  const portfolioHref = `/${locale}/portfolio`;

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
    {
      key: "x",
      href: social.x,
      label: t("Footer.social.twitter"),
      Icon: FaXTwitter,
    },
  ];

  // Filter posts by locale for display
  const displayLocale = currentLocale === "ar" ? "ar" : "en";

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
              className={`locale-link${currentLocale === "en" ? " active" : ""}`}
              aria-label="English"
              data-locale="en"
            >
              EN
            </a>
            <span className="locale-divider">/</span>
            <a
              href={arHref}
              className={`locale-link${currentLocale === "ar" ? " active" : ""}`}
              aria-label="Ø§Ù„عØ±Ø¨ÙŠØ©"
              data-locale="ar"
            >
              ع
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

      {/* â”€â”€ 1. Blog hero â”€â”€ */}
      <section className="services-page-overview" id="overview">
        <div className="eyebrow">
          <span className="eyebrow-dot" /> {t("BlogPage.hero.eyebrow")}
        </div>
        <h1>
          {t("BlogPage.hero.title.line1")}
          <br />
          <em>{t("BlogPage.hero.title.line2")}</em>
        </h1>
        <p>{t("BlogPage.hero.description")}</p>
        <div className="hero-actions">
          <a className="button-primary" href={`#articles`}>
            {t("BlogPage.featured.cta")} <ArrowUpRight size={16} />
          </a>
        </div>
      </section>

      {/* â”€â”€ 2. Article grid (dynamic from Firestore) â”€â”€ */}
      <section
        className="projects-section blog-page-work"
        id="articles"
        aria-labelledby="blog-articles-title"
      >
        <div className="projects-intro">
          <div className="projects-intro-head">
            <Eyebrow label={t("BlogPage.articles.eyebrow")} />
            <h2 id="blog-articles-title">
              {t("BlogPage.articles.title.line1")}
              <br />
              {t("BlogPage.articles.title.line2")}
            </h2>
          </div>
          <p>{t("BlogPage.articles.description")}</p>
        </div>
        <div className="projects-grid blog-page-grid">
          {posts.length > 0 ? (
            posts.map((post) => {
              const title = post.title[displayLocale];
              const category = post.category;
              const coverImage =
                post.media.find((m) => m.id === post.coverMediaId) ??
                post.media[0];

              const coverUrl = coverImage?.url ?? "";

              const href = `/${locale}/blog/${post.slug}`;

              return (
                <article className="project-card blog-post-card" key={post.id}>
                  {coverUrl && (
                    <a
                      className="project-cover"
                      href={href}
                      aria-hidden="true"
                      tabIndex={-1}
                    >
                      <Image
                        src={coverUrl}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="project-cover-image"
                        loading="lazy"
                        quality={80}
                      />
                    </a>
                  )}
                  <div className="project-content">
                    <span className="blog-post-category">{category}</span>
                    <h3>
                      <a href={href}>{title}</a>
                    </h3>
                    <p className="project-summary">
                      {post.excerpt[displayLocale]}
                    </p>
                    <div className="project-tags">
                      {post.tags.slice(0, 4).map((tag) => (
                        <span className="project-tag" key={tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <a className="project-link" href={href}>
                      {t("BlogPage.featured.cta")} <ArrowUpRight size={13} />
                    </a>
                  </div>
                </article>
              );
            })
          ) : (
            <div
              className="projects-empty-state"
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                padding: "3rem",
              }}
            >
              <p>{t("BlogPage.empty.title")}</p>
              <p className="project-summary">
                {t("BlogPage.empty.description")}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* â”€â”€ Contact CTA (reused) â”€â”€ */}
      <section
        className="contact-cta-section"
        id="contact"
        aria-labelledby="blog-contact-cta-title"
      >
        <div className="contact-cta-glow" aria-hidden="true" />
        <div className="contact-cta-intro">
          <Eyebrow label={t("BlogPage.cta.eyebrow")} />
          <h2 id="blog-contact-cta-title">
            {t("BlogPage.cta.title.line1")}
            <br />
            <em>{t("BlogPage.cta.title.line2")}</em>
          </h2>
          <p>{t("BlogPage.cta.description")}</p>
          <div className="contact-cta-actions">
            <a className="button-primary" href={getProjectCtaUrl(siteSettings)}>
              {t("BlogPage.cta.primaryCta")} <ArrowUpRight size={16} />
            </a>
            <a className="button-secondary" href={portfolioHref}>
              {t("BlogPage.cta.secondaryCta")} <ArrowUpRight size={15} />
            </a>
          </div>
        </div>
      </section>

      {/* â”€â”€ Footer (homepage-identical; cross-page anchors) â”€â”€ */}
      <footer
        className="footer-section"
        id="footer"
        aria-labelledby="blog-footer-tagline"
      >
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-brand-name">
              <FooterBrandLogo siteSettings={siteSettings} />
              <span>
                {siteSettings?.brandName?.[
                  locale === "ar" ? "ar" : "en"
                ]?.trim() ||
                  siteSettings?.companyName ||
                  t("Navbar.brand")}
              </span>
            </div>
            <p className="footer-tagline" id="blog-footer-tagline">
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
                <a href={`${servicesHref}#discipline-software`}>
                  {t("Footer.columns.engineering.links.software")}
                </a>
              </li>
              <li>
                <a href={`${servicesHref}#discipline-embedded`}>
                  {t("Footer.columns.engineering.links.embedded")}
                </a>
              </li>
              <li>
                <a href={`${servicesHref}#discipline-ai`}>
                  {t("Footer.columns.engineering.links.ai")}
                </a>
              </li>
              <li>
                <a href={`${servicesHref}#technologies`}>
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
                <a href={portfolioHref}>
                  {t("Footer.columns.resources.links.portfolio")}
                </a>
              </li>
              <li>
                <span className="footer-resource-current">
                  {t("Footer.columns.resources.links.blog")}
                </span>
              </li>
              <li>
                <a href={`#contact`}>
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
            <a
              className="footer-contact-cta"
              href={getProjectCtaUrl(siteSettings)}
            >
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
