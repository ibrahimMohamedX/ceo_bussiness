import "server-only";

import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirebaseAdmin } from "./admin";

export function getAdminAuth(): Auth {
  return getAuth(getFirebaseAdmin());
}

