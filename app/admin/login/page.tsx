'use client'

// Admin login — standalone, not a copy of the public homepage and not a generic
// SaaS template. PROJEX branded, restrained/engineering-oriented, cyan accent,
// dark/light compatible through the admin theme tokens from app/globals.css.
//
// Auth flow: client signs in with Firebase Email/Password, POSTs the resulting
// idToken to the /admin/login route handler which exchanges it for an HttpOnly
// session cookie server-side, then refreshes and navigates to the dashboard.
// No tokens are ever stored in localStorage.

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'

import { signInWithEmailAndPassword, sendPasswordResetEmail, type AuthError } from 'firebase/auth'
import { firebaseAuth } from '@/src/lib/firebase/client'

function BrandMark() {
  return (
    <span className="grid shrink-0 grid-cols-[repeat(3,1fr)] gap-[3px] -skew-y-[25deg]" aria-hidden>
      <span className="h-[6px] rounded-[2px] bg-[var(--primary)] shadow-[0_0_14px_rgba(110,231,242,0.5)]" />
      <span className="mt-[6px] h-[6px] rounded-[2px] bg-[var(--primary)] opacity-70 shadow-[0_0_14px_rgba(110,231,242,0.5)]" />
      <span className="mt-[12px] h-[6px] rounded-[2px] bg-[var(--primary)] opacity-40 shadow-[0_0_14px_rgba(110,231,242,0.5)]" />
    </span>
  )
}

const inputClass = [
  'w-full min-h-[44px] rounded-lg border border-[var(--border)] bg-[var(--card)] px-3.5 text-sm',
  'text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]/70',
  'focus:border-[var(--primary)] focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]',
].join(' ')

function errorFor(code: string | undefined): string {
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/user-disabled':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/too-many-requests':
      return 'Invalid email or password, or the account is temporarily locked. Check your credentials and try again.'
    case 'auth/invalid-email':
    case 'auth/missing-password':
      return 'Enter a valid email address and your password.'
    default:
      return 'Unable to sign in. Please try again.'
  }
}

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [resetBusy, setResetBusy] = useState(false)
  const [resetSent, setResetSent] = useState(false)

  async function handleReset(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    if (resetBusy) return
    setError(null)
    setResetSent(false)

    const trimmed = email.trim()
    if (!trimmed) {
      setError('Enter your email address to request a reset link.')
      return
    }

    setResetBusy(true)
    try {
      await sendPasswordResetEmail(firebaseAuth, trimmed)
      setResetSent(true)
    } catch (err) {
      const code = (err as AuthError)?.code
      setError(
        code === 'auth/user-not-found'
          ? 'No account exists for that email address.'
          : errorFor(code),
      )
    } finally {
      setResetBusy(false)
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (loading) return
    setError(null)
    setLoading(true)

    try {
      const { user } = await signInWithEmailAndPassword(firebaseAuth, email, password)
      const idToken = await user.getIdToken()

      const res = await fetch('/admin/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      })

      if (res.status === 403) {
        // Valid Firebase sign-in, but this user has no active admins/{uid} doc.
        setError(
          'These credentials are valid but this account is not authorized for the PROJEX Console.',
        )
        return
      }
      if (!res.ok) {
        setError(errorFor('auth/invalid-credential'))
        return
      }

      router.refresh()
      router.push('/admin')
    } catch (err) {
      const code = (err as AuthError)?.code
      setError(errorFor(code))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="admin-card w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--card)]/85 p-8 backdrop-blur-xl">
        <div className="mb-10 flex flex-col items-center gap-3 text-center">
          <BrandMark />
          <div>
            <p className="text-[15px] font-bold tracking-[0.18em] text-[var(--foreground)]">PROJEX</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.13em] text-[var(--muted-foreground)]">
              Admin Console
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
          <div>
            <label htmlFor="email" className="mb-2 block font-mono text-[10px] uppercase tracking-[0.13em] text-[var(--muted-foreground)]">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              placeholder="you@projex.studio"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label htmlFor="password" className="block font-mono text-[10px] uppercase tracking-[0.13em] text-[var(--muted-foreground)]">
                Password
              </label>
              <button
                type="button"
                onClick={handleReset}
                disabled={resetBusy}
                className="font-mono text-[10px] uppercase tracking-[0.13em] text-[var(--primary)] transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
              >
                {resetBusy ? 'Sending…' : 'Reset link'}
              </button>
            </div>
            <input
              id="password"
              type="password"
              name="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              placeholder="••••••••"
            />
          </div>

          {resetSent ? (
            <p
              role="status"
              className="rounded-lg border border-green-500/30 bg-green-500/10 px-3.5 py-3 text-[13px] leading-relaxed text-green-400"
            >
              Reset link sent. Check your inbox.
            </p>
          ) : null}

          {error ? (
            <p
              role="alert"
              className="rounded-lg border border-[var(--primary)]/30 bg-[var(--primary)]/10 px-3.5 py-3 text-[13px] leading-relaxed text-[var(--primary)]"
            >
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className={[
              'admin-btn-primary mt-1 flex min-h-[44px] items-center justify-center gap-2 rounded-lg px-4 text-sm',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]',
              loading ? 'pointer-events-none opacity-60' : '',
            ].join(' ')}
          >
            {loading ? (
              <>
                <span className="size-3.5 animate-spin rounded-full border-2 border-[var(--card)]/40 border-t-[var(--card)]" />
                Signing in…
              </>
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        <p className="mt-8 text-center font-mono text-[10px] uppercase tracking-[0.13em] text-[var(--muted-foreground)]/70">
          Authorized personnel only
        </p>
      </div>
    </main>
  )
}




