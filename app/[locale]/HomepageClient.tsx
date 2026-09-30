"use client";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaGithub,
  FaXTwitter,
} from "react-icons/fa6";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useTheme } from "./Providers";
import {
  ArrowUpRight,
  CircleCheckBig,
  Code2,
  Cog,
  Cpu,
  Database,
  Factory,
  GitBranch,
  HeartPulse,
  LifeBuoy,
  Microchip,
  Radio,
  Rocket,
  Search,
  Server,
  Shield,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Brain,
  Zap,
  Box,
  SlidersHorizontal,
  Move,
  Terminal,
  FileCode,
  CircuitBoard,
  Grid,
  Cog as CogIcon,
  Wifi,
  Bluetooth,
  Cable,
  Link,
  Network,
  Layers,
  Globe,
  Plug,
  Apple,
  Bot,
  Eye,
  MessageSquare,
  Truck,
  Cloud,
  Quote,
  Plus,
  Briefcase,
  Camera,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import { ref as storageRef, getDownloadURL } from "firebase/storage";
import { firebaseStorage } from "@/src/lib/firebase/client";
import { cloudinaryUrl } from "@/src/lib/cloudinary/url";
import type { PublicProject } from "@/src/lib/public/projects";
import type { PublicTestimonial } from "@/src/lib/public/testimonials";
import type { PublicFaq } from "@/src/lib/public/faq";
import type { PublicSiteSettings } from "@/src/lib/public/settings";
import {
  getEngineersWhatsAppUrl,
  getProjectCtaUrl,
} from "@/src/lib/project-cta";
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
function useMediaUrl(
  media:
    | {
        publicId?: string | null;
        resourceType?: "image" | "video" | null;
        storagePath?: string | null;
      }
    | null
    | undefined,
): string {
  const publicId = media?.publicId ?? "";
  const resourceType = media?.resourceType ?? "image";
  const path = media?.storagePath ?? "";

  const direct = cloudinaryUrl(publicId, resourceType);
  const [legacyUrl, setLegacyUrl] = useState("");

  useEffect(() => {
    // Cloudinary records need no async resolution.
    if (direct || !path) {
      setLegacyUrl("");
      return;
    }
    let cancelled = false;
    getDownloadURL(storageRef(firebaseStorage, path))
      .then((resolved) => {
        if (!cancelled) setLegacyUrl(resolved);
      })
      .catch(() => {
        if (!cancelled) setLegacyUrl("");
      });
    return () => {
      cancelled = true;
    };
  }, [direct, path]);

  return direct || legacyUrl;
}

interface HomepageClientProps {
  locale: string;
  featuredProjects: PublicProject[];
  featuredTestimonials: PublicTestimonial[];
  faqs: PublicFaq[];
  siteSettings: PublicSiteSettings | null;
}

/* ------------------------------------------------------------------ */
/*  DigitalCore â€” parallax hero visual (unchanged)                    */
/* ------------------------------------------------------------------ */
function DigitalCore({ t }: { t: ReturnType<typeof useTranslations> }) {
  const coreRef = useRef<HTMLDivElement>(null);
  // Index position maps to `.asset-layer-N` classes in globals.css (index â†’ N+1).
  // Do NOT reindex or reorder: each layer must keep its assigned layer class so
  // the per-layer blend/opacity/animation stays correct.
  // All six layers resolve to verified local copies in /public/hero/ (sourced from
  // docs/assets/), replacing the dead Vercel Blob URLs. Background_Effects.png,
  // Glow_Auras.png and Holographic_Grid.png are present in docs/assets but are NOT
  // part of this 6-layer composition (no original slot) â€” not added to avoid redesign.
  const layers = [
    "/hero/hero-glow.webp",
    "/hero/hero-rings.png",
    "/hero/Network_Layer.png",
    "/hero/Data_Streams.png",
    "/hero/hero-core.png",
    "/hero/Light_Particles.png",
  ];

  useEffect(() => {
    const core = coreRef.current;
    if (
      !core ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !window.matchMedia("(pointer: fine)").matches
    )
      return;

    let frame = 0;
    const reset = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        core.style.setProperty("--parallax-x", "0px");
        core.style.setProperty("--parallax-y", "0px");
      });
    };
    const onPointerMove = (event: PointerEvent) => {
      const bounds = core.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 8;
      const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 6;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        core.style.setProperty("--parallax-x", `${x.toFixed(2)}px`);
        core.style.setProperty("--parallax-y", `${y.toFixed(2)}px`);
      });
    };

    core.addEventListener("pointermove", onPointerMove, { passive: true });
    core.addEventListener("pointerleave", reset);
    return () => {
      cancelAnimationFrame(frame);
      core.removeEventListener("pointermove", onPointerMove);
      core.removeEventListener("pointerleave", reset);
    };
  }, []);

  return (
    <figure
      ref={coreRef}
      className="digital-core"
      aria-labelledby="core-caption"
    >
      <div className="core-label">DIGITAL CORE / 001</div>
      <div className="core-readout">
        SYS ONLINE
        <br />
        <span>LATENCY 0.04MS</span>
      </div>
      <div className="asset-stack" aria-hidden="true">
        {layers.map((src, index) =>
          src ? (
            <Image
              key={src}
              className={`asset-layer asset-layer-${index + 1}`}
              src={src}
              alt=""
              fill
              sizes="(max-width: 760px) 110vw, (max-width: 1100px) 62vw, 660px"
              quality={78}
              priority={index < 2 || index === 4}
              loading={index < 2 || index === 4 ? undefined : "lazy"}
              aria-hidden="true"
            />
          ) : null,
        )}
      </div>
      <ul className="core-side-labels" aria-label="Engineering disciplines">
        <li>
          <b>{t("Hero.coreLabels.ai")}</b>
          <span>{t("Hero.coreLabels.aiVerbs")}</span>
        </li>
        <li>
          <b>{t("Hero.coreLabels.software")}</b>
          <span>{t("Hero.coreLabels.softwareVerbs")}</span>
        </li>
        <li>
          <b>{t("Hero.coreLabels.embedded")}</b>
          <span>{t("Hero.coreLabels.embeddedVerbs")}</span>
        </li>
        <li>
          <b>{t("Hero.coreLabels.impact")}</b>
          <span>{t("Hero.coreLabels.impactVerbs")}</span>
        </li>
      </ul>
      <div className="core-status" role="status" aria-live="polite">
        <span aria-hidden="true" />{" "}
        <span className="sr-only">System status:</span> {t("Hero.coreStatus")}
      </div>
      <div className="core-coordinates" aria-label="Core coordinates">
        {t("Hero.coreCoordinates")}
      </div>
      <figcaption id="core-caption" className="sr-only">
        A layered visualization of a digital engineering core connecting
        artificial intelligence, software engineering, embedded systems, and
        real-world impact.
      </figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/*  Technologies section component                                    */
/* ------------------------------------------------------------------ */

const techCategories = [
  { key: "frontend", icon: Code2 },
  { key: "backend", icon: Server },
  { key: "embedded", icon: Microchip },
  { key: "ai", icon: Brain },
  { key: "cloud", icon: Cloud },
  { key: "iot", icon: Wifi },
  { key: "mobile", icon: Smartphone },
] as const;

const whyProjexCards = [
  { key: "quality", icon: ShieldCheck },
  { key: "e2e", icon: GitBranch },
  { key: "hardware", icon: Cpu },
  { key: "modern", icon: Zap },
  { key: "delivery", icon: Truck },
  { key: "support", icon: LifeBuoy },
] as const;

function TechnologyIcon({ name }: { name: string }) {
  const iconMap: Record<string, React.ReactNode> = {
    Code2: <Code2 size={20} strokeWidth={1.5} />,
    Zap: <Zap size={20} strokeWidth={1.5} />,
    SlidersHorizontal: <SlidersHorizontal size={20} strokeWidth={1.5} />,
    Box: <Box size={20} strokeWidth={1.5} />,
    Move: <Move size={20} strokeWidth={1.5} />,
    Server: <Server size={20} strokeWidth={1.5} />,
    Terminal: <Terminal size={20} strokeWidth={1.5} />,
    Cpu: <Cpu size={20} strokeWidth={1.5} />,
    Shield: <Shield size={20} strokeWidth={1.5} />,
    Database: <Database size={20} strokeWidth={1.5} />,
    Microchip: <Microchip size={20} strokeWidth={1.5} />,
    CogIcon: <CogIcon size={20} strokeWidth={1.5} />,
    CircuitBoard: <CircuitBoard size={20} strokeWidth={1.5} />,
    Grid: <Grid size={20} strokeWidth={1.5} />,
    Brain: <Brain size={20} strokeWidth={1.5} />,
    MessageSquare: <MessageSquare size={20} strokeWidth={1.5} />,
    Link: <Link size={20} strokeWidth={1.5} />,
    Eye: <Eye size={20} strokeWidth={1.5} />,
    FileCode: <FileCode size={20} strokeWidth={1.5} />,
    GitBranch: <GitBranch size={20} strokeWidth={1.5} />,
    Radio: <Radio size={20} strokeWidth={1.5} />,
    Wifi: <Wifi size={20} strokeWidth={1.5} />,
    Bluetooth: <Bluetooth size={20} strokeWidth={1.5} />,
    Cable: <Cable size={20} strokeWidth={1.5} />,
    Network: <Network size={20} strokeWidth={1.5} />,
    Smartphone: <Smartphone size={20} strokeWidth={1.5} />,
    Layers: <Layers size={20} strokeWidth={1.5} />,
    Apple: <Apple size={20} strokeWidth={1.5} />,
    Bot: <Bot size={20} strokeWidth={1.5} />,
    Globe: <Globe size={20} strokeWidth={1.5} />,
    Plug: <Plug size={20} strokeWidth={1.5} />,
  };
  return iconMap[name] || <Code2 size={20} strokeWidth={1.5} />;
}

function TechnologyCategory({
  category,
  t,
}: {
  category: (typeof techCategories)[number];
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <div className="tech-category">
      <div className="tech-category-header">
        <div className="tech-category-icon">
          <category.icon size={22} strokeWidth={1.5} />
        </div>
        <h4>{t(`Technologies.categories.${category.key}.title`)}</h4>
      </div>
      <ul className="tech-items">
        {Array.from({ length: 6 }, (_, i) => (
          <li key={i} className="tech-item">
            <div className="tech-icon">
              <TechnologyIcon
                name={t(
                  `Technologies.categories.${category.key}.items.${i}.icon`,
                )}
              />
            </div>
            <span className="tech-name">
              {t(`Technologies.categories.${category.key}.items.${i}.name`)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function WhyProjexCard({
  card,
  t,
  index,
  featured = false,
}: {
  card: (typeof whyProjexCards)[number];
  t: ReturnType<typeof useTranslations>;
  index: number;
  featured?: boolean;
}) {
  return (
    <article
      className={`why-projex-card${featured ? " why-projex-card--featured" : ""}`}
      style={{ "--card-index": index } as React.CSSProperties}
    >
      <div className="why-projex-icon">
        <card.icon size={28} strokeWidth={1.5} />
      </div>
      <div className="why-projex-card-body">
        <h3>{t(`WhyProjex.cards.${card.key}.title`)}</h3>
        <p>{t(`WhyProjex.cards.${card.key}.description`)}</p>
      </div>
    </article>
  );
}

function TestimonialCard({
  testimonial,
  locale,
  index,
}: {
  testimonial: PublicTestimonial;
  locale: string;
  index: number;
}) {
  const isAr = locale === "ar";
  return (
    <article
      className="testimonial-card"
      style={{ "--card-index": index } as React.CSSProperties}
    >
      <div className="testimonial-quote-mark" aria-hidden="true">
        <Quote size={28} strokeWidth={1.5} />
      </div>
      <blockquote className="testimonial-quote">
        <p>{isAr ? testimonial.quote.ar : testimonial.quote.en}</p>
      </blockquote>
      <div className="testimonial-author">
        <span className="testimonial-name">{testimonial.personName}</span>
        <span className="testimonial-company">{testimonial.company}</span>
        <span className="testimonial-role">
          {isAr ? testimonial.role?.ar : testimonial.role?.en}
        </span>
      </div>
    </article>
  );
}

function FaqItem({
  faq,
  locale,
  index,
}: {
  faq: PublicFaq;
  locale: string;
  index: number;
}) {
  const [open, setOpen] = useState(false);
  const isAr = locale === "ar";
  const panelId = `faq-panel-${faq.id}`;
  const buttonId = `faq-button-${faq.id}`;

  return (
    <div
      className={`faq-item${open ? " faq-item--open" : ""}`}
      style={{ "--card-index": index } as React.CSSProperties}
    >
      <h3>
        <button
          id={buttonId}
          className="faq-question"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
          type="button"
        >
          <span className="faq-question-text">
            {isAr ? faq.question.ar : faq.question.en}
          </span>
          <span className="faq-toggle" aria-hidden="true">
            <Plus size={22} strokeWidth={1.5} />
          </span>
        </button>
      </h3>
      <div
        className="faq-panel-wrapper"
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
      >
        <div className="faq-panel">
          <p>{isAr ? faq.answer.ar : faq.answer.en}</p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  FeaturedProjectCard                                                */
/*  Extracted so useMediaUrl (a hook) runs at a component's top level.  */
/*  Calling it inside .map() tied the hook count to the projects list  */
/*  length â€” a Rules of Hooks violation that crashes hydration as      */
/*  soon as the featured list changes between renders.                  */
/* ------------------------------------------------------------------ */
function FeaturedProjectCard({
  project,
  locale,
  index,
  ctaLabel,
}: {
  project: PublicProject;
  locale: string;
  index: number;
  ctaLabel: string;
}) {
  const projectLocale = locale === "ar" ? "ar" : "en";
  const title = project.title[projectLocale];
  const summary = project.summary[projectLocale];
  const coverImage =
    project.media.find((m) => m.id === project.coverMediaId) ??
    project.media[0];
  const coverUrl = coverImage?.url ?? "";

  return (
    <a className="project-card" href={`/${locale}/portfolio/${project.slug}`}>
      {coverUrl && (
        <div className="project-image-wrapper">
          <Image
            src={coverUrl}
            alt={coverImage?.alt[projectLocale] || ""}
            fill
            sizes="(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 33vw"
            className="project-image"
            quality={80}
            loading={index === 0 ? "eager" : "lazy"}
          />
          <div className="project-overlay" aria-hidden="true" />
        </div>
      )}
      <div className="project-content">
        <h3>{title}</h3>
        <p className="project-summary">{summary}</p>
        <div className="project-tags">
          {project.technologies.slice(0, 4).map((tag, tagIndex) => (
            <span key={tagIndex} className="project-tag">
              {tag}
            </span>
          ))}
        </div>
        <span className="project-link">
          {ctaLabel} <ArrowUpRight size={13} strokeWidth={1.5} />
        </span>
      </div>
    </a>
  );
}

/* ------------------------------------------------------------------ */
/*  Homepage Client Component                                          */
/* ------------------------------------------------------------------ */
export default function HomepageClient({
  locale,
  featuredProjects,
  featuredTestimonials,
  faqs,
  siteSettings,
}: HomepageClientProps) {
  const t = useTranslations();
  const { resolvedTheme, setTheme } = useTheme();

  // Toggle between dark/light
  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  // Locale href: "/en" for English, "/ar" for Arabic
  const enHref = "/en";
  const arHref = "/ar";

  // Dedicated Services page (same locale): /[locale]/services + per-discipline anchors
  const servicesHref = `/${locale}/services`;
  const servicesAnchor = (d: string) => `${servicesHref}#discipline-${d}`;

  // Dedicated Blog (Engineering Notes) page (same locale)
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
    {
      key: "x",
      href: social.x,
      label: t("Footer.social.twitter"),
      Icon: FaXTwitter,
    },
  ];

  return (
    <main className="foundation-shell">
      {/* â”€â”€ Navbar â”€â”€ */}
      <nav className="topbar" aria-label="Primary navigation">
        <Brand
          locale={locale}
          home={`/${locale}`}
          siteSettings={siteSettings}
        />

        <div className="nav-links">
          <a href="#services">{t("Navbar.links.services")}</a>
          <a href="#industries">{t("Navbar.links.industries")}</a>
          <a href="#projects">{t("Navbar.links.projects")}</a>
          <a href="#process">{t("Navbar.links.engineering")}</a>
          <a href={`/${locale}/about`}>{t("Navbar.links.about")}</a>
          <a href="#why-projex">{t("Navbar.links.company")}</a>
          <a href="#contact">{t("Navbar.links.contact")}</a>
        </div>

        {/* â”€â”€ Locale switcher + Theme toggle group â”€â”€ */}
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
            {/* Moon icon (visible in light mode / when resolved is light) */}
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
            {/* Moon icon (visible in dark mode) */}
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

      {/* â”€â”€ Hero â”€â”€ */}
      <section className="hero section-grid" id="hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="eyebrow-dot" /> {t("Hero.eyebrow.software")}{" "}
            <span>â€¢</span> {t("Hero.eyebrow.embedded")} <span>â€¢</span>{" "}
            {t("Hero.eyebrow.ai")}
          </div>
          <h1>
            {t("Hero.title.line1")}
            <br />
            <em>{t("Hero.title.line2")}</em>
            <br />
            {t("Hero.title.line3")}
          </h1>
          <p className="hero-lede">{t("Hero.description")}</p>
          <div className="hero-actions">
            <a className="button-primary" href={getProjectCtaUrl(siteSettings)}>
              {t("Hero.primaryCta")} <ArrowUpRight size={16} />
            </a>
            <a className="button-secondary" href={servicesHref}>
              {t("Hero.secondaryCta")} <ArrowUpRight size={15} />
            </a>
          </div>
          <div className="hero-highlights">
            <span>
              <Cpu size={18} /> {t("Hero.highlights.engineering")}
            </span>
            <span>
              <ShieldCheck size={18} /> {t("Hero.highlights.reliable")}
            </span>
            <span>
              <Radio size={18} /> {t("Hero.highlights.hardware")}
            </span>
            <span>
              <Sparkles size={18} /> {t("Hero.highlights.ai")}
            </span>
          </div>
          <div className="hero-note">
            <span>{t("Hero.coreCaption")}</span>
            <b>{t("Hero.corePurpose")}</b>
          </div>
        </div>
        <DigitalCore t={t} />
      </section>

      {/* â”€â”€ Services â”€â”€ */}
      <section className="services" id="services">
        <div className="services-intro">
          <Eyebrow label={t("Services.eyebrow")} />
          <h2>
            {t("Services.title.line1")}
            <br />
            {t("Services.title.line2")}
          </h2>
          <p>{t("Services.description")}</p>
        </div>
        <div className="services-grid">
          <article className="service-card">
            <div className="service-icon">
              <Code2 size={28} strokeWidth={1.5} />
            </div>
            <h3>{t("Services.cards.software.title")}</h3>
            <p>{t("Services.cards.software.description")}</p>
            <div className="service-tags">
              <span>{t("Services.cards.software.tags.0")}</span>
              <span>{t("Services.cards.software.tags.1")}</span>
              <span>{t("Services.cards.software.tags.2")}</span>
            </div>
            <a className="service-link" href={servicesAnchor("software")}>
              {t("Services.cards.software.link")} <ArrowUpRight size={13} />
            </a>
          </article>
          <article className="service-card">
            <div className="service-icon">
              <Microchip size={28} strokeWidth={1.5} />
            </div>
            <h3>{t("Services.cards.embedded.title")}</h3>
            <p>{t("Services.cards.embedded.description")}</p>
            <div className="service-tags">
              <span>{t("Services.cards.embedded.tags.0")}</span>
              <span>{t("Services.cards.embedded.tags.1")}</span>
              <span>{t("Services.cards.embedded.tags.2")}</span>
            </div>
            <a className="service-link" href={servicesAnchor("embedded")}>
              {t("Services.cards.embedded.link")} <ArrowUpRight size={13} />
            </a>
          </article>
          <article className="service-card">
            <div className="service-icon">
              <Brain size={28} strokeWidth={1.5} />
            </div>
            <h3>{t("Services.cards.ai.title")}</h3>
            <p>{t("Services.cards.ai.description")}</p>
            <div className="service-tags">
              <span>{t("Services.cards.ai.tags.0")}</span>
              <span>{t("Services.cards.ai.tags.1")}</span>
              <span>{t("Services.cards.ai.tags.2")}</span>
            </div>
            <a className="service-link" href={servicesAnchor("ai")}>
              {t("Services.cards.ai.link")} <ArrowUpRight size={13} />
            </a>
          </article>
        </div>
      </section>

      {/* â”€â”€ Industries â”€â”€ */}
      <section className="industries" id="industries">
        <div className="industries-intro">
          <Eyebrow label={t("Industries.eyebrow")} />
          <h2>
            {t("Industries.title.line1")}
            <br />
            {t("Industries.title.line2")}
          </h2>
          <p>{t("Industries.description")}</p>
        </div>
        <div className="industries-grid">
          <article className="industry-card">
            <div className="industry-icon">
              <Rocket size={28} strokeWidth={1.5} />
            </div>
            <h3>{t("Industries.cards.aerospace.title")}</h3>
            <p>{t("Industries.cards.aerospace.description")}</p>
          </article>
          <article className="industry-card">
            <div className="industry-icon">
              <Factory size={28} strokeWidth={1.5} />
            </div>
            <h3>{t("Industries.cards.manufacturing.title")}</h3>
            <p>{t("Industries.cards.manufacturing.description")}</p>
          </article>
          <article className="industry-card">
            <div className="industry-icon">
              <HeartPulse size={28} strokeWidth={1.5} />
            </div>
            <h3>{t("Industries.cards.healthcare.title")}</h3>
            <p>{t("Industries.cards.healthcare.description")}</p>
          </article>
          <article className="industry-card">
            <div className="industry-icon">
              <Zap size={28} strokeWidth={1.5} />
            </div>
            <h3>{t("Industries.cards.energy.title")}</h3>
            <p>{t("Industries.cards.energy.description")}</p>
          </article>
        </div>
      </section>

      {/* â”€â”€ Engineering Process â”€â”€ */}
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

      {/* â”€â”€ Featured Projects â”€â”€ */}
      <section className="projects-section" id="projects">
        <div className="projects-intro">
          <div className="projects-intro-head">
            <Eyebrow label={t("Projects.eyebrow")} />
            <h2>
              {t("Projects.title.line1")}
              <br />
              {t("Projects.title.line2")}
            </h2>
          </div>
          <p>{t("Projects.description")}</p>
        </div>
        <div className="projects-grid">
          {featuredProjects.length > 0 ? (
            featuredProjects.map((project, index) => (
              <FeaturedProjectCard
                key={project.id}
                project={project}
                locale={locale}
                index={index}
                ctaLabel={t("Projects.cta")}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-[var(--muted-foreground)]">
              {t("Projects.empty")}
            </div>
          )}
        </div>
      </section>

      {/* â”€â”€ Technologies â”€â”€ */}
      <section className="technologies-section" id="technologies">
        <div className="technologies-intro">
          <Eyebrow label={t("Technologies.eyebrow")} />
          <h2>
            {t("Technologies.title.line1")}
            <br />
            <em>{t("Technologies.title.line2")}</em>
          </h2>
          <p>{t("Technologies.description")}</p>
        </div>
        <div className="technologies-grid">
          {techCategories.map((category) => (
            <TechnologyCategory key={category.key} category={category} t={t} />
          ))}
        </div>
      </section>

      {/* â”€â”€ Why PROJEX â”€â”€ */}
      <section className="why-projex-section" id="why-projex">
        <div className="why-projex-intro">
          <Eyebrow label={t("WhyProjex.eyebrow")} />
          <h2>
            {t("WhyProjex.title.line1")}
            <br />
            <em>{t("WhyProjex.title.line2")}</em>
          </h2>
          <p>{t("WhyProjex.description")}</p>
        </div>
        <div className="why-projex-pillars">
          {whyProjexCards.slice(0, 2).map((card, index) => (
            <WhyProjexCard
              key={card.key}
              card={card}
              t={t}
              index={index}
              featured
            />
          ))}
        </div>
        <div className="why-projex-support">
          {whyProjexCards.slice(2).map((card, index) => (
            <WhyProjexCard key={card.key} card={card} t={t} index={index + 2} />
          ))}
        </div>
      </section>
      <section className="testimonials-section" id="testimonials">
        <div className="testimonials-intro">
          <Eyebrow label={t("Testimonials.eyebrow")} />
          <h2>
            {t("Testimonials.title.line1")}
            <br />
            <em>{t("Testimonials.title.line2")}</em>
          </h2>
          <p>{t("Testimonials.description")}</p>
        </div>
        <div className="testimonials-grid">
          {featuredTestimonials.length > 0 ? (
            featuredTestimonials.map((testimonial, index) => (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
                locale={locale}
                index={index}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-[var(--muted-foreground)]">
              {t("Testimonials.empty")}
            </div>
          )}
        </div>
      </section>
      <section className="faq-section" id="faq">
        <div className="faq-intro">
          <Eyebrow label={t("Faq.eyebrow")} />
          <h2>
            {t("Faq.title.line1")}
            <br />
            <em>{t("Faq.title.line2")}</em>
          </h2>
          <p>{t("Faq.description")}</p>
        </div>
        {faqs.length === 0 ? (
          <p className="faq-empty">{t("Faq.empty")}</p>
        ) : (
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <FaqItem key={faq.id} faq={faq} locale={locale} index={index} />
            ))}
          </div>
        )}
      </section>

      {/* ---------------------------------------------------------------- */}
      {/*  11 â€” Contact CTA (centered heading + dual CTA + glow bg)       */}
      {/* ---------------------------------------------------------------- */}
      <section
        className="contact-cta-section"
        id="contact"
        aria-labelledby="contact-cta-title"
      >
        <div className="contact-cta-glow" aria-hidden="true" />
        <div className="contact-cta-intro">
          <Eyebrow label={t("ContactCta.eyebrow")} />
          <h2 id="contact-cta-title">
            {t("ContactCta.title.line1")}
            <br />
            <em>{t("ContactCta.title.line2")}</em>
          </h2>
          <p>{t("ContactCta.description")}</p>
          <div className="contact-cta-actions">
            <a className="button-primary" href={getProjectCtaUrl(siteSettings)}>
              {t("ContactCta.primaryCta")} <ArrowUpRight size={16} />
            </a>
            <a
              className="button-secondary"
              href={getEngineersWhatsAppUrl(siteSettings)}
            >
              {t("ContactCta.secondaryCta")} <ArrowUpRight size={15} />
            </a>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/*  12 â€” Footer (4 columns + bottom bar, minimal, glass top border) */}
      {/* ---------------------------------------------------------------- */}
      <footer
        className="footer-section"
        id="footer"
        aria-labelledby="footer-tagline"
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
            <p className="footer-tagline" id="footer-tagline">
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
                <a href={`/${locale}/about`}>
                  {t("Footer.columns.company.links.about")}
                </a>
              </li>
              <li>
                <a href="#services">
                  {t("Footer.columns.company.links.services")}
                </a>
              </li>
              <li>
                <a href="#industries">
                  {t("Footer.columns.company.links.industries")}
                </a>
              </li>
              <li>
                <a href="#projects">
                  {t("Footer.columns.company.links.projects")}
                </a>
              </li>
              <li>
                <a href="#process">
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
                <a href={servicesAnchor("software")}>
                  {t("Footer.columns.engineering.links.software")}
                </a>
              </li>
              <li>
                <a href={servicesAnchor("embedded")}>
                  {t("Footer.columns.engineering.links.embedded")}
                </a>
              </li>
              <li>
                <a href={servicesAnchor("ai")}>
                  {t("Footer.columns.engineering.links.ai")}
                </a>
              </li>
              <li>
                <a href="#technologies">
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
                <a href="#why-projex">
                  {t("Footer.columns.resources.links.whyProjex")}
                </a>
              </li>
              <li>
                <a href="#testimonials">
                  {t("Footer.columns.resources.links.testimonials")}
                </a>
              </li>
              <li>
                <a href="#faq">{t("Footer.columns.resources.links.faq")}</a>
              </li>
              <li>
                <a href={`/${locale}/portfolio`}>
                  {t("Footer.columns.resources.links.portfolio")}
                </a>
              </li>
              <li>
                <a href={blogHref}>
                  {t("Footer.columns.resources.links.blog")}
                </a>
              </li>
              <li>
                <a href="#contact">
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
          {/* Render-time year: suppress the content check so a cached build
              crossing New Year doesn't log a hydration text mismatch. */}
          <p className="footer-copyright" suppressHydrationWarning>
            {t("Footer.bottomBar.copyright", {
              year: new Date().getFullYear(),
            })}
          </p>
          <div className="footer-legal">
            <a href="#footer">{t("Footer.bottomBar.privacy")}</a>
            <a href="#footer">{t("Footer.bottomBar.terms")}</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
