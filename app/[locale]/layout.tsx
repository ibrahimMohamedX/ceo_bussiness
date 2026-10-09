import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, IBM_Plex_Sans_Arabic } from "next/font/google";
import { getMessages } from "next-intl/server";
import { routing } from "@/src/i18n/routing";
import { getSiteSettings } from "@/src/lib/public/settings";
import { cloudinaryUrl } from "@/src/lib/cloudinary/url";
import Providers from "./Providers";
import { LivingBackground } from "@/components/LivingBackground";
import "../globals.css";

/* ── Font system ─────────────────────────────────────────────────
   Self-hosted via next/font/google (no CDN, no layout shift).
   • Geist / Geist Mono  → Latin text everywhere (EN pages + Latin
     fragments inside Arabic pages).
   • IBM Plex Sans Arabic → all Arabic script, on the ar locale and
     anywhere Arabic glyphs appear. The font stacks in globals.css
     fall through Geist → Plex Arabic, so one stack serves both
   locales: Latin renders in Geist, Arabic in Plex Arabic.        */
const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const arabicSans = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-arabic-sans",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const siteSettings = await getSiteSettings();

  const logoUrl = cloudinaryUrl(
    siteSettings?.brandLogoPublicId,
    siteSettings?.brandLogoResourceType ?? "image",
  );

  return {
    title: "Nodal — Engineering Design Foundation",
    description:
      "A precise visual language for software engineering, embedded systems, and artificial intelligence.",
    generator: "Nodal",
    verification: {
      google: "sGewejYP9poKmGMD-XSbmhveGhP2MeeYX2m6Qc1jlEw",
    },
    icons: {
      icon: logoUrl
        ? [{ url: logoUrl }]
        : [
            {
              url: "/icon-light-32x32.png",
              media: "(prefers-color-scheme: light)",
            },
            {
              url: "/icon-dark-32x32.png",
              media: "(prefers-color-scheme: dark)",
            },
            { url: "/icon.svg", type: "image/svg+xml" },
          ],
      apple: logoUrl || "/apple-icon.png",
    },
  };
}

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#070a0d",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages({ locale });

  return (
    <html
      className={`${geistSans.variable} ${geistMono.variable} ${arabicSans.variable}`}
      lang={locale === "ar" ? "ar" : "en"}
      dir={locale === "ar" ? "rtl" : "ltr"}
      suppressHydrationWarning
    >
      <body className="antialiased">
        {/* Site-wide living background — fixed layer behind all public
            pages (see .living-bg in globals.css). */}
        <LivingBackground />
        <Providers locale={locale} messages={messages}>
          {children}
        </Providers>

        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}