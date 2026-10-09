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
import { useTheme } from "../../Providers";
import { ArrowUpRight, Briefcase, Camera, Code2, Users, X } from "lucide-react";
import Image from "next/image";
import type { PublicBlogPost } from "@/src/lib/public/blog";
import type { PublicSiteSettings } from "@/src/lib/public/settings";
import { getProjectCtaUrl } from "@/src/lib/project-cta";
import { Brand } from "@/components/Brand";
import { MobileMenu } from "@/components/MobileMenu";
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

interface BlogPostClientProps {
  locale: string;
  post: PublicBlogPost;
  siteSettings: PublicSiteSettings | null;
}

/* ------------------------------------------------------------------ */
/*  Blog post detail Client Component                                  */
/*  Renders a single published post: cover, title, plain-text body,    */
/*  gallery. Content is PLAIN TEXT (authored via textarea) â€” rendered   */
/*  with whitespace-pre-wrap, never injected as HTML.                  */
/* ------------------------------------------------------------------ */
export default function BlogPostClient({
  locale,
  post,
  siteSettings,
}: BlogPostClientProps) {
  const t = useTranslations();
  const currentLocale = useLocale();
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  const enHref = `/en/blog/${post.slug}`;
  const arHref = `/ar/blog/${post.slug}`;
  const home = `/${locale}`;
  const blogHref = `/${locale}/blog`;
  const servicesHref = `/${locale}/services`;
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

  const displayLocale = currentLocale === "ar" ? "ar" : "en";

  const title =
    post.title[displayLocale]?.trim() || post.title.en?.trim() || "";
  const excerpt =
    post.excerpt[displayLocale]?.trim() || post.excerpt.en?.trim() || "";
  // Content is plain text; fall back to the other locale's text if empty.
  const content =
    post.content[displayLocale]?.trim() || post.content.en?.trim() || "";

  const coverMedia =
    post.media.find((m) => m.id === post.coverMediaId) ?? post.media[0];

  const galleryMedia = post.media.filter((m) => m.id !== coverMedia?.id);

  const coverUrl = coverMedia?.url ?? "";

  const publishedLabel = (() => {
    if (!post.publishedAt) return "";
    const d = new Date(post.publishedAt);
    if (Number.isNaN(d.getTime())) return "";
    try {
      return new Intl.DateTimeFormat(currentLocale === "ar" ? "ar" : "en", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(d);
    } catch {
      return "";
    }
  })();

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

          <MobileMenu siteSettings={siteSettings} />
        </div>

        <a className="nav-action" href={getProjectCtaUrl(siteSettings)}>
          {t("Navbar.cta")} <ArrowUpRight size={16} />
        </a>
      </nav>

      {/* â”€â”€ Article body â”€â”€ */}
      <article className="blog-detail" aria-labelledby="blog-detail-title">
        <header className="blog-detail-header">
          <a className="blog-detail-back" href={blogHref}>
            â† {t("BlogPage.articles.eyebrow")}
          </a>

          {post.category && (
            <span className="blog-post-category">{post.category}</span>
          )}

          <h1 id="blog-detail-title">{title}</h1>

          <div className="blog-detail-meta">
            {post.authorName && (
              <span className="blog-detail-author">{post.authorName}</span>
            )}
            {publishedLabel && (
              <span className="blog-detail-date">{publishedLabel}</span>
            )}
          </div>

          {excerpt && <p className="blog-detail-excerpt">{excerpt}</p>}
        </header>

        {coverUrl && (
          <div className="blog-detail-cover" aria-hidden="true">
            <Image
              src={coverUrl}
              alt={
                coverMedia?.alt[displayLocale] || coverMedia?.alt.en || title
              }
              fill
              sizes="(max-width: 768px) 100vw, 1200px"
              className="project-cover-image"
              priority
              quality={85}
            />
          </div>
        )}

        {content ? (
          <div className="blog-detail-body" style={{ whiteSpace: "pre-wrap" }}>
            {content}
          </div>
        ) : (
          <div
            className="projects-empty-state"
            style={{ textAlign: "center", padding: "3rem" }}
          >
            <p>{t("BlogPage.empty.title")}</p>
            <p className="project-summary">{t("BlogPage.empty.description")}</p>
          </div>
        )}

        {post.tags.length > 0 && (
          <div className="blog-detail-tags">
            <div className="project-tags">
              {post.tags.map((tag) => (
                <span className="project-tag" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {galleryMedia.length > 0 && (
          <section className="blog-detail-gallery" aria-label="Post gallery">
            {galleryMedia.map((m) => (
              <GalleryImage
                key={m.id}
                media={m}
                displayLocale={displayLocale}
              />
            ))}
          </section>
        )}
      </article>

      {/* â”€â”€ Contact CTA (reused) â”€â”€ */}
      <section
        className="contact-cta-section"
        id="contact"
        aria-labelledby="blog-detail-cta-title"
      >
        <div className="contact-cta-glow" aria-hidden="true" />
        <div className="contact-cta-intro">
          <Eyebrow label={t("BlogPage.cta.eyebrow")} />
          <h2 id="blog-detail-cta-title">
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
              {t("BlogPage.cta.secondaryCta")} <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* â”€â”€ Footer (homepage-identical; cross-page anchors) â”€â”€ */}
      <footer
        className="footer-section"
        id="footer"
        aria-labelledby="blog-detail-footer-tagline"
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
            <p className="footer-tagline" id="blog-detail-footer-tagline">
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
                <a href={blogHref}>
                  {t("Footer.columns.resources.links.blog")}
                </a>
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

/* ------------------------------------------------------------------ */
/*  GalleryImage â€” resolves a gallery media item's Storage path to a    */
/*  download URL, renders an <img> with its localized alt/caption.     */
/* ------------------------------------------------------------------ */
function GalleryImage({
  media,
  displayLocale,
}: {
  media: PublicBlogPost["media"][number];
  displayLocale: "en" | "ar";
}) {
  const url = media.url;
  const alt = media.alt[displayLocale]?.trim() || media.alt.en?.trim() || "";
  const caption =
    media.caption[displayLocale]?.trim() || media.caption.en?.trim() || "";

  return (
    <figure className="blog-detail-gallery-item">
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt={alt}
          className="blog-detail-gallery-image"
          loading="lazy"
        />
      ) : (
        <div className="blog-detail-gallery-placeholder" aria-hidden="true">
          <span>ðŸ–¼</span>
        </div>
      )}
      {caption && (
        <figcaption className="blog-detail-gallery-caption">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
