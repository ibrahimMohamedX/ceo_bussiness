"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { getProjectCtaUrl } from "@/src/lib/project-cta";
import type { PublicSiteSettings } from "@/src/lib/public/settings";

/* ─────────────────────────────────────────────────────────────────
   MobileMenu — hamburger drawer for ≤760px viewports.
   The desktop .nav-links are hidden on mobile, so this drawer is the
   only way to reach the site anchors from a phone. Uses the exact
   same Navbar.* message keys as the desktop nav (no new copy), and
   locks body scroll while open. Rendered inside .nav-controls; see
   .nav-menu-btn / .mobile-drawer in globals.css.
   ───────────────────────────────────────────────────────────────── */

export function MobileMenu({
  siteSettings,
}: {
  siteSettings: PublicSiteSettings | null;
}) {
  const [open, setOpen] = useState(false);
  const locale = useLocale();
  const t = useTranslations();
  const home = `/${locale}`;

  const links = [
    { href: `${home}#services`, label: t("Navbar.links.services") },
    { href: `${home}#industries`, label: t("Navbar.links.industries") },
    { href: `${home}#projects`, label: t("Navbar.links.projects") },
    { href: `${home}#process`, label: t("Navbar.links.engineering") },
    { href: `${home}#why-projex`, label: t("Navbar.links.company") },
    { href: `${home}#contact`, label: t("Navbar.links.contact") },
  ];

  /* Lock body scroll while the drawer is open. */
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="nav-menu-btn"
        aria-expanded={open}
        aria-controls="mobile-drawer"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {open && (
        <div id="mobile-drawer" className="mobile-drawer">
          <nav className="mobile-drawer-nav" aria-label="Mobile">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <a
            className="button-primary mobile-drawer-cta"
            href={getProjectCtaUrl(siteSettings)}
            onClick={() => setOpen(false)}
          >
            {t("Navbar.cta")} <ArrowUpRight size={16} />
          </a>
        </div>
      )}
    </>
  );
}

export default MobileMenu;
