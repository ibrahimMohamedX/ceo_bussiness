import 'server-only'

import { cache } from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { getAdminAuth, getAdminFirestore } from '@/src/lib/firebase/admin'
import type { AdminRole } from '@/src/lib/admin/roles'

// Server-only session boundary (per docs/architecture/07_NEXTJS_FIREBASE_INTEGRATION.md).
// Phase 2 uses firebase-admin session cookies + a Firestore admins/{uid}.active
// role read. Nothing here is ever shipped to the browser bundle.

export const SESSION_COOKIE = 'projex_session'
// 7 days — matches the 12-hour minimum but 7d gives a durable admin session.
const SESSION_DURATION_MS = 60 * 60 * 24 * 7 * 1000

export interface AdminSession {
  uid: string
  email: string | null
  role: AdminRole
  displayName: string | null
}

// React.cache() memoizes within a single render pass so the Admin SDK verify +
// Firestore read happen at most once per request even though several components
// call requireAdmin()/verifySession().
export const verifySession = cache(async (): Promise<AdminSession | null> => {
  const store = await cookies()
  const token = store.get(SESSION_COOKIE)?.value
  if (!token) return null

  let decoded
  try {
    // `true` = check if the session cookie has been revoked (fires on logout).
    decoded = await getAdminAuth().verifySessionCookie(token, true)
  } catch {
    return null
  }

  // A valid token alone is insufficient: the Firebase user must ALSO have an
  // active admins/{uid} doc. Authenticated ⊅ authorized.
  try {
    const doc = await getAdminFirestore().collection('admins').doc(decoded.uid).get()
    const data = doc.data()
    if (!doc.exists || !data || data.active !== true) return null

    return {
      uid: decoded.uid,
      email: data.email ?? decoded.email ?? null,
      role: data.role as AdminRole,
      displayName: data.displayName ?? decoded.name ?? null,
    }
  } catch {
    return null
  }
})

/** Redirects to /admin/login when there is no active admin session. */
export async function requireAdmin(): Promise<AdminSession | null> {
  const session = await verifySession()
  if (!session) redirect('/admin/login')
  return session
}

export { SESSION_DURATION_MS }

/** Mint and store the HttpOnly session cookie for an already-verified idToken. */
export async function createSession(idToken: string): Promise<{ ok: true } | { ok: false; reason: 'invalid' }> {
  try {
    await getAdminAuth().createSessionCookie(idToken, { expiresIn: SESSION_DURATION_MS })
  } catch {
    return { ok: false, reason: 'invalid' }
  }
  return { ok: true }
}