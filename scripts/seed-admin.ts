/**
 * PROJEX — one-time server-only admin seed.
 *
 * Firebase security rules only let an existing super_admin create admins/{uid}
 * (see firestore.rules + docs/architecture/03_FIREBASE_SECURITY.md). That makes
 * it impossible to bootstrap the first admin through the app itself. This script
 * is the documented, auditable one-time bootstrap: it runs with the firebase-admin
 * service-account credential from server-only env vars and creates a single
 * admins/{uid} doc with role 'super_admin' and active:true.
 *
 * Usage (from repo root, after `pnpm install`):
 *   FIREBASE_PROJECT_ID=... \
 *   FIREBASE_CLIENT_EMAIL=... \
 *   FIREBASE_PRIVATE_KEY='...\n...' \
 *   pnpm tsx scripts/seed-admin.ts
 *
 * The script intentionally initializes firebase-admin directly rather than
 * importing src/lib/firebase/admin.ts, which is tagged `import 'server-only'`
 * and must never run outside the Next server runtime.
 */

// Load .env.local for standalone tsx execution. Next.js loads this file for its
// own runtime, but a bare `tsx scripts/seed-admin.ts` run does NOT — so we load
// it explicitly here. Order matters: dotenv must populate process.env before the
// firebase-admin imports below read from it.
import { config as loadEnv } from 'dotenv'
import { resolve } from 'node:path'

// Prefer .env.local (Next.js convention); fall back to .env. Does not override
// already-set shell env vars, so an inline `FOO=... pnpm tsx ...` still wins.
loadEnv({ path: resolve(process.cwd(), '.env.local') })
loadEnv({ path: resolve(process.cwd(), '.env') })

import { initializeApp, cert, getApps, type ServiceAccount } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

function env(key: string): string {
  const value = process.env[key]
  if (!value) {
    console.error(`[seed-admin] missing required env var: ${key}`)
    process.exit(1)
  }
  return value
}

function serviceAccount(): ServiceAccount {
  return {
    projectId: env('FIREBASE_PROJECT_ID'),
    clientEmail: env('FIREBASE_CLIENT_EMAIL'),
    // Real service-account keys contain literal "\n". Normalize to real newlines.
    privateKey: env('FIREBASE_PRIVATE_KEY').replace(/\\n/g, '\n'),
  }
}

const app =
  getApps().length > 0
    ? getApps()[0]
    : initializeApp({ credential: cert(serviceAccount()), projectId: env('FIREBASE_PROJECT_ID') })

const auth = getAuth(app)
const firestore = getFirestore(app)

async function main() {
  const email = env('SEED_ADMIN_EMAIL').toLowerCase()
  const password = env('SEED_ADMIN_PASSWORD')
  const displayName = process.env.SEED_ADMIN_NAME?.trim() || undefined

  if (password.length < 6) {
    console.error('[seed-admin] SEED_ADMIN_PASSWORD must be at least 6 characters long.')
    process.exit(1)
  }

  // Look up the user first; only create them if they don't already exist. This
  // keeps the script idempotent across re-runs.
  let uid: string
  try {
    uid = (await auth.getUserByEmail(email)).uid
    console.log(`[seed-admin] found existing Firebase user ${email} (${uid})`)
  } catch (err) {
    if ((err as { code?: string }).code !== 'auth/user-not-found') throw err
    const user = await auth.createUser({ email, password, displayName })
    uid = user.uid
    console.log(`[seed-admin] created Firebase user ${email} (${uid})`)
  }

  // Write the admins/{uid} doc. Only create/overwrite when the doc is absent;
  // never silently demote an existing admin, and never touch existing data.
  const adminRef = firestore.collection('admins').doc(uid)
  const existing = await adminRef.get()
  if (existing.exists) {
    const data = existing.data()
    console.log(`[seed-admin] admins/${uid} already exists (role=${data?.role}, active=${data?.active})`)
    console.log('[seed-admin] no changes made. Done.')
    return
  }

  const now = new Date().toISOString()
  await adminRef.set({
    uid,
    email,
    displayName: displayName ?? email,
    role: 'super_admin',
    active: true,
    createdAt: now,
    updatedAt: now,
  })
  console.log(`[seed-admin] created doc admins/${uid} with role 'super_admin', active:true`)
  console.log('[seed-admin] seed complete.')
}

main()
  .catch((err) => {
    console.error('[seed-admin] failed:', err)
    process.exit(1)
  })