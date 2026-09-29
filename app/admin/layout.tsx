import { AdminThemeProvider } from "@/components/admin/AdminThemeProvider";

import "../globals.css";

// Parallel root layout for the ENTIRE admin tree (login + dashboard shell).
// There is no root app/layout.tsx; this siblings the localized
// app/[locale]/layout.tsx and renders its OWN <html>/<body>. Admin is
// English-only and NOT localized. This root is deliberately guardless — the
// session guard lives in app/admin/(shell)/layout.tsx so /admin/login is never
// redirected back onto itself.
export default function AdminLayout({
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
