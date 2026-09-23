import { firebaseAuth } from './client'

export type AuthRole = 'super_admin' | 'admin' | 'editor' | 'support'

// Client-side re-export of the browser Firebase Auth instance.
// Route/role protection on the server uses the Admin SDK (see admin.ts).
// Biome: reads cleanly, no client leaks.
export { firebaseAuth as auth }