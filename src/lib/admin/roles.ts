import type { AuthRole } from "@/src/lib/firebase/auth";

// Admin role model per docs/architecture/03_FIREBASE_SECURITY.md.
// Authenticated firebase users are NOT admins unless an admins/{uid} doc exists
// and is active. `can()` lets server guards express role-gated features without
// inventing a parallel role system.

export type AdminRole = AuthRole;

// Order of increasing privilege; super_admin is the highest.
export const ROLE_ORDER: AdminRole[] = [
  "support",
  "editor",
  "admin",
  "super_admin",
];

// Minimum role required per admin feature (map is intentionally small for Phase 2).
const FEATURE_ROLES = {
  overview: "super_admin",
  inquiries: "support",
  content: "editor", // projects, blog, services, about
  media: "editor",
  settings: "super_admin",
} as const;

export type AdminFeature = keyof typeof FEATURE_ROLES;

const rank = (role: AdminRole): number => ROLE_ORDER.indexOf(role);

/** True when `role` is allowed to act on `feature`. */
export function can(role: AdminRole, feature: AdminFeature): boolean {
  const required = rank(FEATURE_ROLES[feature]);
  return rank(role) >= required;
}
