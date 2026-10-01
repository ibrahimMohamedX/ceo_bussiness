import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";

import { firebaseFirestore } from "./client";

export { collection, getDocs, query, where, orderBy, limit };

export const publicDb = firebaseFirestore;
