import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

import { getAdminAuth, getAdminFirestore } from '@/src/lib/firebase/admin'
import { SESSION_COOKIE } from '@/src/lib/admin/session'

// Server-only route handler that mints/clears the HttpOnly admin session cookie.
// The client runs Firebase Auth (signInWithEmailAndPassword) to get an idToken,
// then POSTs it here; this handler exchanges it for a session cookie via the
// Admin SDK and stores it as HttpOnly. No Firebase credentials ever leave the
// server, and the cookie is not readable from client JS.
//
// Sits at /admin/auth/session (not /admin/login) so the POST handler does not
// collide with the page route at /admin/login.

const SESSION_DURATION_MS = 60 * 60 * 24 * 7 * 1000 // 7 days
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
}

async function verifyIsActiveAdmin(uid: string): Promise<boolean> {
  try {
    const doc = await getAdminFirestore().collection('admins').doc(uid).get()
    const data = doc.data()
    return !!doc.exists && data?.active === true
  } catch {
    return false
  }
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { idToken?: string } | null
  const idToken = body?.idToken
  if (!idToken) {
    return NextResponse.json({ error: 'missing idToken' }, { status: 400 })
  }

  // Verify the idToken and that the user is an active admin BEFORE minting a
  // session cookie. This keeps the cookie meaningful only for authorized staff.
  let uid: string
  try {
    uid = (await getAdminAuth().verifyIdToken(idToken)).uid
  } catch {
    return NextResponse.json({ error: 'invalid-credential' }, { status: 401 })
  }

  if (!(await verifyIsActiveAdmin(uid))) {
    // Valid Firebase user, but no active admins/{uid} doc → not authorized.
    return NextResponse.json({ error: 'unauthorized' }, { status: 403 })
  }

  try {
    const sessionCookie = await getAdminAuth().createSessionCookie(idToken, {
      expiresIn: SESSION_DURATION_MS,
    })
    const response = NextResponse.json({ ok: true })
    response.cookies.set(SESSION_COOKIE, sessionCookie, {
      ...COOKIE_OPTIONS,
      maxAge: SESSION_DURATION_MS / 1000,
    })
    response.headers.set('Cache-Control', 'no-store')
    return response
  } catch {
    return NextResponse.json({ error: 'invalid-credential' }, { status: 401 })
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true })
  response.cookies.set(SESSION_COOKIE, '', {
    ...COOKIE_OPTIONS,
    maxAge: 0,
  })
  response.headers.set('Cache-Control', 'no-store')
  return response
}

export async function GET() {
  return NextResponse.json({ error: 'method not allowed' }, { status: 405 })
}