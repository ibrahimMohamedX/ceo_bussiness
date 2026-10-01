import type { Metadata } from "next";
import { AdminThemeProvider } from "@/components/admin/AdminThemeProvider";
import { getSiteSettings } from "@/src/lib/public/settings";
import { cloudinaryUrl } from "@/src/lib/cloudinary/url";

import "../globals.css";

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
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[var(--background)] text-[var(--foreground)] antialiased">
        <AdminThemeProvider>{children}</AdminThemeProvider>
      </body>
    </html>
  );
}





