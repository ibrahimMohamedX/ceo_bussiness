"use server";

import { getPublicFirestore } from "@/src/lib/firebase/admin";
import type {
  ProjectRecord,
  ProjectMedia,
  ProjectMediaKind,
  BilingualText,
} from "@/src/lib/admin/projects";
import { cloudinaryUrl } from "@/src/lib/cloudinary/url";
import type { CloudinaryResourceType } from "@/src/lib/admin/media";

/**
 * Public-facing project record with bilingual fields and media.
 * Only published projects are exposed publicly.
 */
export interface PublicProject {
  id: string;
  slug: string;
  title: BilingualText;
  summary: BilingualText;
  description: BilingualText;
  category: ProjectRecord["category"];
  technologies: string[];
  industries: string[];
  featured: boolean;
  status: "published";
  coverMediaId: string | undefined;
  sortOrder: number;
  media: PublicProjectMedia[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Public-facing project media item.
 */
export interface PublicProjectMedia {
  id: string;
  kind: ProjectMediaKind;
  storagePath: string;
  publicId: string;
  url: string;
  resourceType: CloudinaryResourceType;
  alt: BilingualText;
  caption: BilingualText;
  width: number | null;
  height: number | null;
  sortOrder: number;
  isCover: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Build a secure Cloudinary delivery URL from the stored publicId.
 *
 * This file runs on the server, so it can safely use the existing
 * CLOUDINARY_CLOUD_NAME environment variable.
 */
// function getCloudinaryUrl(
//   publicId: string,
//   resourceType: CloudinaryResourceType,
// ): string {
//   if (!publicId) return "";

//   const cloudName = process.env.CLOUDINARY_CLOUD_NAME;

//   if (!cloudName) {
//     console.error(
//       "[Cloudinary] CLOUDINARY_CLOUD_NAME is missing while building a public media URL.",
//     );
//     return "";
//   }

//   return `https://res.cloudinary.com/${cloudName}/${resourceType}/upload/${publicId}`;
// }

/**
 * Convert a Firestore project media document into ProjectMedia.
 */
function toProjectMedia(
  mediaDoc: FirebaseFirestore.QueryDocumentSnapshot,
): ProjectMedia {
  const m = mediaDoc.data();

  return {
    id: mediaDoc.id,
    storagePath: m.storagePath ?? "",
    publicId: m.publicId ?? "",
    resourceType: m.resourceType ?? "image",
    fileName: m.fileName ?? "",
    kind: (m.kind as ProjectMediaKind) ?? "gallery",
    alt: m.alt ?? {},
    caption: m.caption ?? {},
    sortOrder: m.sortOrder ?? 0,
    width: m.width,
    height: m.height,
    mimeType: m.mimeType,
    sizeBytes: m.sizeBytes,
    createdAt: m.createdAt,
    updatedAt: m.updatedAt,
  };
}

/**
 * Fetch a project's nested media collection.
 *
 * Project media is stored at:
 * projects/{projectId}/media/{mediaId}
 *
 * It is NOT part of projects/{projectId}.data().
 */
async function attachProjectMedia(
  doc: FirebaseFirestore.DocumentSnapshot,
): Promise<ProjectRecord> {
  const data = doc.data();

  if (!data) {
    throw new Error(`Project document "${doc.id}" has no data.`);
  }

  const mediaSnap = await doc.ref
    .collection("media")
    .orderBy("sortOrder", "asc")
    .get();

  const media = mediaSnap.docs.map(toProjectMedia);

  return {
    id: doc.id,
    slug: data.slug ?? "",
    title: data.title ?? { en: "", ar: "" },
    summary: data.summary ?? { en: "", ar: "" },
    description: data.description,
    category: data.category ?? "software",
    technologies: Array.isArray(data.technologies) ? data.technologies : [],
    industries: Array.isArray(data.industries) ? data.industries : [],
    featured: data.featured === true,
    status: data.status ?? "draft",
    coverMediaId: data.coverMediaId ?? undefined,
    sortOrder: data.sortOrder ?? 0,
    publishedAt: data.publishedAt,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    media,
  } as ProjectRecord;
}

/**
 * Converts admin ProjectRecord to public PublicProject.
 */
function toPublicProject(record: ProjectRecord): PublicProject {
  return {
    id: record.id,
    slug: record.slug,

    title: {
      en: record.title?.en ?? "",
      ar: record.title?.ar ?? "",
    },

    summary: {
      en: record.summary?.en ?? "",
      ar: record.summary?.ar ?? "",
    },

    description: {
      en: record.description?.en ?? "",
      ar: record.description?.ar ?? "",
    },

    category: record.category ?? "",

    technologies: Array.isArray(record.technologies) ? record.technologies : [],

    industries: Array.isArray(record.industries) ? record.industries : [],

    featured: record.featured === true,

    status: "published",

    coverMediaId: record.coverMediaId,

    sortOrder: record.sortOrder,

    media:
      record.media?.map((m) => ({
        id: m.id,
        kind: m.kind ?? "gallery",

        storagePath: m.storagePath ?? "",

        publicId: m.publicId ?? "",

        url: cloudinaryUrl(m.publicId ?? "", m.resourceType ?? "image"),

        resourceType: m.resourceType ?? "image",

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

        isCover: m.id === record.coverMediaId,

        createdAt: m.createdAt?.toString() ?? "",
        updatedAt: m.updatedAt?.toString() ?? "",
      })) ?? [],

    createdAt: record.createdAt?.toString() ?? "",
    updatedAt: record.updatedAt?.toString() ?? "",
  };
}

/**
 * Fetches all published projects for public pages.
 */
export async function getPublishedProjects(): Promise<PublicProject[]> {
  const db = getPublicFirestore();

  if (!db) return [];

  const snapshot = await db
    .collection("projects")
    .where("status", "==", "published")
    .orderBy("sortOrder", "asc")
    .orderBy("createdAt", "desc")
    .get();

  const projects: PublicProject[] = [];

  for (const doc of snapshot.docs) {
    const project = await attachProjectMedia(doc);
    projects.push(toPublicProject(project));
  }

  return projects;
}

/**
 * Fetches featured published projects for homepage.
 */
export async function getFeaturedProjects(
  limitCount = 3,
): Promise<PublicProject[]> {
  const db = getPublicFirestore();

  if (!db) return [];

  const snapshot = await db
    .collection("projects")
    .where("status", "==", "published")
    .where("featured", "==", true)
    .orderBy("sortOrder", "asc")
    .orderBy("createdAt", "desc")
    .limit(limitCount)
    .get();

  const projects: PublicProject[] = [];

  for (const doc of snapshot.docs) {
    const project = await attachProjectMedia(doc);
    projects.push(toPublicProject(project));
  }

  return projects;
}

/**
 * Fetches a single published project by slug.
 */
export async function getPublishedProjectBySlug(
  slug: string,
): Promise<PublicProject | null> {
  const db = getPublicFirestore();

  if (!db) return null;

  const snapshot = await db
    .collection("projects")
    .where("slug", "==", slug)
    .where("status", "==", "published")
    .limit(1)
    .get();

  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];

  const project = await attachProjectMedia(doc);

  return toPublicProject(project);
}

/**
 * Fetches project categories for filtering.
 */
export async function getProjectCategories(): Promise<
  ProjectRecord["category"][]
> {
  const projects = await getPublishedProjects();

  const categories = new Set<ProjectRecord["category"]>();

  for (const p of projects) {
    categories.add(p.category);
  }

  return Array.from(categories);
}

/**
 * Fetches all technologies used in published projects.
 */
export async function getProjectTechnologies(): Promise<string[]> {
  const projects = await getPublishedProjects();

  const technologies = new Set<string>();

  for (const p of projects) {
    for (const t of p.technologies) {
      technologies.add(t);
    }
  }

  return Array.from(technologies).sort();
}

/**
 * Fetches all industries from published projects.
 */
export async function getProjectIndustries(): Promise<string[]> {
  const projects = await getPublishedProjects();

  const industries = new Set<string>();

  for (const p of projects) {
    for (const i of p.industries) {
      industries.add(i);
    }
  }

  return Array.from(industries).sort();
}
