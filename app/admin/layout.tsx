import type { Metadata } from "next";
import { Geist, Geist_Mono, IBM_Plex_Sans_Arabic } from "next/font/google";
import { AdminThemeProvider } from "@/components/admin/AdminThemeProvider";
import { LivingBackground } from "@/components/LivingBackground";
import { getSiteSettings } from "@/src/lib/public/settings";
import { cloudinaryUrl } from "@/src/lib/cloudinary/url";

import "../globals.css";

/* Same font system as the public site (app/[locale]/layout.tsx):
   Geist for Latin, IBM Plex Sans Arabic for Arabic label/content
   text inside the bilingual forms. Self-hosted via next/font. */
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

export async function generateMetadata(): Promise<Metadata> {
  const siteSettings = await getSiteSettings();

  const logoUrl = cloudinaryUrl(
    siteSettings?.brandLogoPublicId,
    siteSettings?.brandLogoResourceType ?? "image",
  );

  return {
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

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      className={`${geistSans.variable} ${geistMono.variable} ${arabicSans.variable}`}
      lang="en"
      suppressHydrationWarning
    >
      {/* No background on body: the fixed LivingBackground canvas
          behind the content is the console's backdrop (html keeps the
          solid --base under it) — same layer order as the public site.
          density 45000 = calmer particle field for a working console. */}
      <body className="text-[var(--foreground)] antialiased">
        <AdminThemeProvider>
          <LivingBackground density={45000} />
          {children}
        </AdminThemeProvider>
      </body>
    </html>
  );
}





