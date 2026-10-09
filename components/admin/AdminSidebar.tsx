"use client";

// Admin sidebar — structural navigation only. Every link points at a real
// placeholder page under app/admin/(shell)/. There is deliberately no CRUD and
// no fake page behind any entry. Layout is responsive and the drawer is driven
// by the parent shell so the topbar can open/close it.

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  FileText,
  HelpCircle,
  Image as ImageIcon,
  Inbox,
  Info,
  LayoutDashboard,
  Quote,
  Settings,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export const ADMIN_NAV = [
  { href: "/admin/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/inquiries", label: "Inquiries", icon: Inbox },
  { href: "/admin/projects", label: "Projects", icon: Briefcase },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/services", label: "Services", icon: Wrench },
  { href: "/admin/media", label: "Media", icon: ImageIcon },
  { href: "/admin/testimonials", label: "Testimonials", icon: Quote },
  { href: "/admin/faq", label: "FAQ", icon: HelpCircle },
  { href: "/admin/about", label: "About", icon: Info },
  { href: "/admin/settings", label: "Settings", icon: Settings },
] as const satisfies ReadonlyArray<{
  href: string;
  label: string;
  icon: LucideIcon;
}>;

function BrandMark() {
  return (
    <span
      className="grid shrink-0 grid-cols-[repeat(3,1fr)] gap-[2px] -skew-y-[25deg]"
      aria-hidden
    >
      <span className="h-[5px] rounded-[2px] bg-[var(--primary)] shadow-[0_0_12px_rgba(110,231,242,0.5)]" />
      <span className="mt-[5px] h-[5px] rounded-[2px] bg-[var(--primary)] opacity-70 shadow-[0_0_12px_rgba(110,231,242,0.5)]" />
      <span className="mt-[10px] h-[5px] rounded-[2px] bg-[var(--primary)] opacity-40 shadow-[0_0_12px_rgba(110,231,242,0.5)]" />
    </span>
  );
}

function NavList() {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin" className="flex flex-col gap-1">
      {ADMIN_NAV.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={[
              "flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]",
              active
                ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                : "text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--foreground)]",
            ].join(" ")}
          >
            <item.icon size={18} strokeWidth={1.5} className="shrink-0" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarBody({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <Link
        href="/admin/overview"
        onClick={onNavigate}
        className="flex items-center gap-3 px-3 py-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
      >
        <BrandMark />
        <span className="text-[13px] font-bold tracking-[0.18em]">
          PROJEX
        </span>
        <span className="ml-auto rounded-full border border-[var(--primary)]/30 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.13em] text-[var(--primary)]">
          Admin
        </span>
      </Link>
      <div className="flex-1 overflow-y-auto px-3 pb-4">
        <NavList />
      </div>
      <div className="border-t border-[var(--border)] px-3 py-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.13em] text-[var(--muted-foreground)]">
          PROJEX Console
        </p>
      </div>
    </div>
  );
}

export function AdminSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {/* Overlay — closes the mobile drawer when tapping outside */}
      <div
        aria-hidden
        onClick={onClose}
        className={[
          "fixed inset-0 z-30 bg-black/50 backdrop-blur-sm transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
      />

      {/* Mobile drawer (slides in) + desktop persistent glass rail */}
      <aside
        className={[
          "admin-rail fixed z-40 flex w-[260px] flex-col border-r border-[var(--border)]",
          "transition-transform duration-200 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <SidebarBody onNavigate={open ? onClose : undefined} />
      </aside>
    </>
  );
}





