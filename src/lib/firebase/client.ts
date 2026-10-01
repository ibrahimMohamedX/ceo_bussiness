import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

import type { FirebaseOptions } from "firebase/app";

// Public, browser-safe Firebase web configuration, read from NEXT_PUBLIC_*
// environment variables (defined in .env.local â€” see .env.example for the
// template). These are the Firebase web-app public config keys only â€” no
// service-account or admin credentials are referenced here. Never import this
// module from server/admin code; use ./admin for the Admin SDK.
//
// NOTE: keep each env lookup as a STATIC `process.env.NEXT_PUBLIC_FIREBASE_X`
// literal. Next.js inlines NEXT_PUBLIC_* at build time by statically analyzing
// the source; a dynamic index access (e.g. process.env[key]) would not be
// inlined and would evaluate to undefined in the client bundle.
const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize a single, shared app instance. Guarded so hot reloads / repeated
// module eval don't re-initialize Firebase (initializeApp twice with the same
// name throws), which would otherwise crash during dev hot-reload.
function initializeClient(): FirebaseApp {
  if (getApps().length > 0) {
    return getApps()[0];
  }
  return initializeApp(firebaseConfig);
}

const app = initializeClient();

export const firebaseApp: FirebaseApp = app;
export const firebaseAuth: Auth = getAuth(app);
export const firebaseFirestore: Firestore = getFirestore(app);
export const firebaseStorage: FirebaseStorage = getStorage(app);
export const db = firebaseFirestore;





