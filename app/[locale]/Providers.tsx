'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { NextIntlClientProvider } from 'next-intl'

// Theme context
type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: 'light' | 'dark'
  themes: Theme[]
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

function useThemeContext() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

// Custom ThemeProvider without script injection (React 19/Next.js 16 compatible)
function ThemeProvider({
  children,
  attribute = 'class',
  defaultTheme = 'dark',
  enableSystem = true,
  disableTransitionOnChange = true,
  themes = ['light', 'dark'],
}: {
  children: ReactNode
  attribute?: 'class' | string
  defaultTheme?: Theme
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
  themes?: Theme[]
}) {
  const [mounted, setMounted] = useState(false)
  const [theme, setThemeState] = useState<Theme>(defaultTheme)
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark')

  // Initialize theme from localStorage and system preference
  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('theme') as Theme | null
    const initialTheme = stored || defaultTheme
    setThemeState(initialTheme)
    applyTheme(initialTheme)
  }, [defaultTheme])

  // Listen for storage changes (cross-tab sync)
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'theme' && e.newValue) {
        setThemeState(e.newValue as Theme)
        applyTheme(e.newValue as Theme)
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  // Listen for system theme changes
  useEffect(() => {
    if (!enableSystem) return
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      const stored = localStorage.getItem('theme')
      if (!stored || stored === 'system') {
        const systemTheme = mediaQuery.matches ? 'dark' : 'light'
        setResolvedTheme(systemTheme)
        applyTheme('system')
      }
    }
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [enableSystem])

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement
    const resolved: 'light' | 'dark' = newTheme === 'system'
      ? (enableSystem
          ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
          : (defaultTheme === 'system' ? 'dark' : defaultTheme))
      : newTheme

    setResolvedTheme(resolved)

    // Remove all theme classes
    themes.forEach(t => root.classList.remove(t))
    // Add resolved theme class
    root.classList.add(resolved)

    // Handle color-scheme for native UI
    if (enableSystem) {
      root.style.colorScheme = resolved
    }

    // Disable transitions temporarily if needed
    if (disableTransitionOnChange) {
      const style = document.createElement('style')
      style.textContent = '*{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}'
      document.head.appendChild(style)
      // Force reflow
      window.getComputedStyle(document.body)
      setTimeout(() => document.head.removeChild(style), 1)
    }
  }

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem('theme', newTheme)
    applyTheme(newTheme)
  }

  // Don't render children until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <ThemeContext.Provider value={{
        theme: defaultTheme,
        setTheme: () => {},
        resolvedTheme: defaultTheme === 'system' ? 'dark' : defaultTheme,
        themes: enableSystem ? [...themes, 'system'] : themes
      }}>
        {children}
      </ThemeContext.Provider>
    )
  }

  return (
    <ThemeContext.Provider value={{
      theme,
      setTheme,
      resolvedTheme,
      themes: enableSystem ? [...themes, 'system'] : themes
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

// Export useTheme hook compatible with next-themes API
export function useTheme() {
  const { theme, setTheme, resolvedTheme, themes } = useThemeContext()
  return {
    theme,
    setTheme,
    resolvedTheme,
    themes,
    forcedTheme: undefined,
    systemTheme: themes.includes('system') ? resolvedTheme : undefined
  }
}

export default function Providers({
  children,
  locale,
  messages,
}: {
  children: ReactNode
  locale: string
  messages: Record<string, unknown>
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
      themes={['dark', 'light']}
    >
      <NextIntlClientProvider key={locale} locale={locale} messages={messages} timeZone="UTC">
        {children}
      </NextIntlClientProvider>
    </ThemeProvider>
  )
}