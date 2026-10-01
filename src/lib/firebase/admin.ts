import "server-only";
export const runtime = "nodejs";

// SERVER-ONLY module. Do not import from any 'use client' component or any
// module that is reachable from the client bundle. See client.ts for the
// browser-safe Firebase web SDK.

import {
  initializeApp,
  getApps,
  cert,
  type App,
  type ServiceAccount,
} from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getStorage, type Storage } from "firebase-admin/storage";

function adminInitialized(): App | undefined {
  return getApps()[0];
}

function clientEmail(): string | undefined {
  return process.env.FIREBASE_CLIENT_EMAIL;
}

function privateKey(): string | undefined {
  const raw = process.env.FIREBASE_PRIVATE_KEY;
  if (!raw) return undefined;
  // Real service-account keys contain literal "\n" (backslash + n) sequences.
  // Many shell/tooling environments collapse these into real newlines, so
  // normalize both forms to actual newlines before handing the key to the SDK.
  return raw.replace(/\\n/g, "\n");
}

function serviceAccount(): ServiceAccount {
  return {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: clientEmail(),
    privateKey: privateKey(),
  };
}

/**
 * True when all server-only Admin SDK credentials are present. The public data
 * layer uses this to degrade gracefully (render empty) instead of throwing a
 * 500 when the Admin SDK is not yet configured locally. Admin/auth paths must
 * NOT use this — they require real credentials and should surface the error.
 */
export function hasAdminCredentials(): boolean {
  return Boolean(
    process.env.FIREBASE_PROJECT_ID && clientEmail() && privateKey(),
  );
}

export function getFirebaseAdmin(): App {
  if (adminInitialized()) {
    return adminInitialized() as App;
  }
  // Requires FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY.
  // These server-only values must never be exposed to the client bundle.
  return initializeApp(
    {
      credential: cert(serviceAccount()),
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    },
    "server",
  );
}

export function getAdminAuth(): Auth {
  return getAuth(getFirebaseAdmin());
}

export function getAdminFirestore(): Firestore {
  return getFirestore(getFirebaseAdmin());
}

/**
 * Firestore for the PUBLIC data layer only. Returns null when the Admin SDK is
 * unconfigured so public pages degrade to empty content instead of crashing.
 * Never use for admin/authenticated data access — those need real credentials.
 */
export function getPublicFirestore(): Firestore | null {
  if (!hasAdminCredentials()) return null;
  return getAdminFirestore();
}

export function getAdminStorage(): Storage {
  return getStorage(getFirebaseAdmin());
}
