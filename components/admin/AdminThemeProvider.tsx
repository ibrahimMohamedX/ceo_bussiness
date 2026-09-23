'use client'

// Admin-scoped theme toggle. The public theme lives in app/[locale]/Providers.tsx
// and mutates document.documentElement via the 'theme' localStorage key. To keep
// zero cross-talk between the two trees, the admin uses its OWN storage key and
// toggles the `light` class directly on the admin <html> element (the design
// tokens in app/globals.css scope light mode through `html.light`). This is not
// a second global provider — it never wraps the public tree.
//
// The admin <html> participates in global font/background styles, but its class
// is managed here and restored on mount to avoid a hydration flash.

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

const STORAGE_KEY = 'projex-admin-theme'

type AdminTheme = 'dark' | 'light'

interface AdminThemeContextValue {
  theme: AdminTheme
  toggle: () => void
}

const AdminThemeContext = createContext<AdminThemeContextValue | undefined>(undefined)

export function useAdminTheme(): AdminThemeContextValue {
  const ctx = useContext(AdminThemeContext)
  if (!ctx) throw new Error('useAdminTheme must be used within AdminThemeProvider')
  return ctx
}

function applyTheme(theme: AdminTheme) {
  const root = document.documentElement
  if (theme === 'light') root.classList.add('light')
  else root.classList.remove('light')
  root.style.colorScheme = theme
}

export function AdminThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<AdminTheme>('dark')

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as AdminTheme | null
    const initial = stored === 'light' ? 'light' : 'dark'
    setTheme(initial)
    applyTheme(initial)
  }, [])

  const toggle = () => {
    const next: AdminTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    window.localStorage.setItem(STORAGE_KEY, next)
    applyTheme(next)
  }

  return (
    <AdminThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </AdminThemeContext.Provider>
  )
}