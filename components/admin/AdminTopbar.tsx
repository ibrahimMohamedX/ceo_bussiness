'use client'

// Admin topbar: current section title (derived from the URL segment), sidebar
// toggle for mobile, admin identity, theme toggle, and logout.

import { usePathname, useRouter } from 'next/navigation'
import { Moon, Sun } from 'lucide-react'

import { ADMIN_NAV } from './AdminSidebar'
import { useAdminTheme } from './AdminThemeProvider'

export interface AdminIdentity {
  displayName: string | null
  email: string | null
  role: string
}

function titleFor(pathname: string): string {
  const seg = pathname.split('/').find((s) => s && s !== 'admin')
  if (!seg || seg === 'overview') return 'Overview'
  const match = ADMIN_NAV.find((n) => n.href.endsWith(`/${seg}`))
  return match?.label ?? (seg[0]?.toUpperCase() ?? '') + (seg ?? '').slice(1)
}

export function AdminTopbar({
  identity,
  onOpenSidebar,
}: {
  identity: AdminIdentity
  onOpenSidebar: () => void
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, toggle } = useAdminTheme()

  async function handleLogout() {
    await fetch('/admin/auth/session', { method: 'DELETE' })
    router.refresh()
    router.push('/admin/login')
  }

  return (
    <header className="admin-topbar sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-[var(--border)] px-4 sm:px-6">
      {/* Mobile sidebar toggle */}
      <button
        type="button"
        onClick={onOpenSidebar}
        aria-label="Open navigation"
        className="flex size-9 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)] lg:hidden"
      >
        <span className="flex flex-col gap-[3px]">
          <span className="block h-[1.5px] w-4 bg-current" />
          <span className="block h-[1.5px] w-4 bg-current" />
          <span className="block h-[1.5px] w-4 bg-current" />
        </span>
      </button>

      <h1 className="text-base font-semibold tracking-tight">{titleFor(pathname)}</h1>

      <div className="ml-auto flex items-center gap-2">
        {/* Theme toggle — admin-scoped, separate storage key from the public site */}
        <button
          type="button"
          onClick={toggle}
          aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          className="flex size-9 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
        >
          {theme === 'dark' ? <Sun size={16} strokeWidth={1.5} /> : <Moon size={16} strokeWidth={1.5} />}
        </button>

        {/* Admin identity */}
        <div className="hidden items-center gap-3 border-l border-[var(--border)] pl-3 md:flex">
          <div className="text-right">
            <p className="text-[13px] font-medium leading-tight">{identity.displayName ?? 'Admin'}</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
              {identity.role}
            </p>
          </div>
          <span className="flex size-8 items-center justify-center rounded-full bg-[var(--primary)]/15 font-mono text-xs font-semibold text-[var(--primary)]">
            {(identity.displayName ?? identity.email ?? 'A').slice(0, 1).toUpperCase()}
          </span>
        </div>

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          className="flex h-9 items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 text-[13px] font-medium text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
        >
          Sign out
        </button>
      </div>
    </header>
  )
}




