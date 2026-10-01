import "server-only";

import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirebaseAdmin } from "./admin";

export type AuthRole = "support" | "editor" | "admin" | "super_admin";

export function getAdminAuth(): Auth {
  return getAuth(getFirebaseAdmin());
}
