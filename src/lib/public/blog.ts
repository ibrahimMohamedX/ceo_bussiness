"use server";

import { getPublicFirestore } from "@/src/lib/firebase/admin";
import type {
  BlogPostRecord,
  BlogPostMediaKind,
  BilingualText,
} from "@/src/lib/admin/blog";
import type { CloudinaryResourceType } from "@/src/lib/admin/media";
import { cloudinaryUrl } from "@/src/lib/cloudinary/url";

export interface PublicBlogPost {
  id: string;
  slug: string;
  title: BilingualText;
  excerpt: BilingualText;
  content: BilingualText;
  category: string;
  tags: string[];
  authorName: string;
  status: "published";
  coverMediaId: string | undefined;
  sortOrder: number;
  media: PublicBlogPostMedia[];
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface PublicBlogPostMedia {
  id: string;
  kind: BlogPostMediaKind;
  storagePath: string;
  publicId: string;
  resourceType: CloudinaryResourceType;
  url: string;
  alt: BilingualText;
  caption: BilingualText;
  width: number | null;
  height: number | null;
  sortOrder: number;
  isCover: boolean;
  createdAt: string;
  updatedAt: string;
}

function toMillis(
  value:
    | FirebaseFirestore.Timestamp
    | {
        seconds?: number;
        nanoseconds?: number;
        _seconds?: number;
        _nanoseconds?: number;
      }
    | number
    | Date
    | null
    | undefined,
): number | undefined {
  if (value == null) return undefined;

  if (typeof value === "number") return value;

  if (value instanceof Date) return value.getTime();

  if (typeof (value as FirebaseFirestore.Timestamp).toMillis === "function") {
    return (value as FirebaseFirestore.Timestamp).toMillis();
  }

  const raw = value as {
    seconds?: number;
    nanoseconds?: number;
    _seconds?: number;
    _nanoseconds?: number;
  };

  const seconds = raw.seconds ?? raw._seconds;
  const nanoseconds = raw.nanoseconds ?? raw._nanoseconds ?? 0;

  if (typeof seconds !== "number") return undefined;

  return seconds * 1000 + Math.floor(nanoseconds / 1_000_000);
}

function mapMedia(
  mediaDocs: FirebaseFirestore.QueryDocumentSnapshot[],
  coverMediaId?: string,
): PublicBlogPostMedia[] {
  return mediaDocs.map((mediaDoc) => {
    const m = mediaDoc.data();

    const publicId = m.publicId ?? "";
    const resourceType =
      (m.resourceType as CloudinaryResourceType | undefined) ?? "image";

    const createdAtMillis = toMillis(m.createdAt);
    const updatedAtMillis = toMillis(m.updatedAt);

    return {
      id: mediaDoc.id,
      kind: (m.kind as BlogPostMediaKind) ?? "gallery",
      storagePath: m.storagePath ?? "",
      publicId,
      resourceType,
      url: cloudinaryUrl(publicId, resourceType),
      alt: {
        en: m.alt?.en ?? "",
        ar: m.alt?.ar ?? "",
      },
      caption: {
        en: m.caption?.en ?? "",
        ar: m.caption?.ar ?? "",
      },
      width: m.width ?? null,
      height: m.height ?? null,
      sortOrder: m.sortOrder ?? 0,
      isCover: mediaDoc.id === coverMediaId,
      createdAt: createdAtMillis ? new Date(createdAtMillis).toISOString() : "",
      updatedAt: updatedAtMillis ? new Date(updatedAtMillis).toISOString() : "",
    };
  });
}

async function toPublicBlogPost(
  postDoc: FirebaseFirestore.QueryDocumentSnapshot,
): Promise<PublicBlogPost> {
  const data = postDoc.data() as BlogPostRecord;

  // IMPORTANT:
  // Blog media is stored in the nested `media` subcollection,
  // not inside the blogPosts document itself.
  const mediaSnapshot = await postDoc.ref
    .collection("media")
    .orderBy("sortOrder", "asc")
    .get();

  const media = mapMedia(mediaSnapshot.docs, data.coverMediaId);

  const publishedAtMillis = toMillis(data.publishedAt);
  const createdAtMillis = toMillis(data.createdAt);
  const updatedAtMillis = toMillis(data.updatedAt);

  return {
    id: postDoc.id,
    slug: data.slug ?? "",
    title: {
      en: data.title?.en ?? "",
      ar: data.title?.ar ?? "",
    },
    excerpt: {
      en: data.excerpt?.en ?? "",
      ar: data.excerpt?.ar ?? "",
    },
    content: {
      en: data.content?.en ?? "",
      ar: data.content?.ar ?? "",
    },
    category: data.category ?? "",
    tags: Array.isArray(data.tags) ? data.tags : [],
    authorName: data.authorName ?? "",
    status: "published",
    coverMediaId: data.coverMediaId,
    sortOrder: data.sortOrder ?? 0,
    media,
    publishedAt: publishedAtMillis
      ? new Date(publishedAtMillis).toISOString()
      : createdAtMillis
        ? new Date(createdAtMillis).toISOString()
        : "",
    createdAt: createdAtMillis ? new Date(createdAtMillis).toISOString() : "",
    updatedAt: updatedAtMillis ? new Date(updatedAtMillis).toISOString() : "",
  };
}

export async function getPublishedBlogPosts(): Promise<PublicBlogPost[]> {
  const db = getPublicFirestore();
  if (!db) return [];

  const snapshot = await db
    .collection("blogPosts")
    .where("status", "==", "published")
    .orderBy("sortOrder", "asc")
    .orderBy("publishedAt", "desc")
    .get();

  return Promise.all(snapshot.docs.map((doc) => toPublicBlogPost(doc)));
}

export async function getFeaturedBlogPosts(
  limitCount = 3,
): Promise<PublicBlogPost[]> {
  const db = getPublicFirestore();
  if (!db) return [];

  const snapshot = await db
    .collection("blogPosts")
    .where("status", "==", "published")
    .orderBy("sortOrder", "asc")
    .orderBy("publishedAt", "desc")
    .limit(limitCount)
    .get();

  return Promise.all(snapshot.docs.map((doc) => toPublicBlogPost(doc)));
}

export async function getPublishedBlogPostBySlug(
  slug: string,
): Promise<PublicBlogPost | null> {
  const db = getPublicFirestore();
  if (!db) return null;

  const snapshot = await db
    .collection("blogPosts")
    .where("slug", "==", slug)
    .where("status", "==", "published")
    .limit(1)
    .get();

  if (snapshot.empty) return null;

  return toPublicBlogPost(snapshot.docs[0]);
}

export async function getBlogPostCategories(): Promise<string[]> {
  const posts = await getPublishedBlogPosts();

  const categories = new Set<string>();

  for (const post of posts) {
    if (post.category) {
      categories.add(post.category);
    }
  }

  return Array.from(categories).sort();
}

export async function getBlogPostTags(): Promise<string[]> {
  const posts = await getPublishedBlogPosts();

  const tags = new Set<string>();

  for (const post of posts) {
    for (const tag of post.tags) {
      if (tag) {
        tags.add(tag);
      }
    }
  }

  return Array.from(tags).sort();
}






