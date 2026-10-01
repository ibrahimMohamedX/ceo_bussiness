import "server-only";

import { getAdminFirestore } from "@/src/lib/firebase/admin";
import { can, type AdminFeature } from "@/src/lib/admin/roles";
import type { AdminSession } from "@/src/lib/admin/session";

// Server-only data-access layer for the media metadata index (media/ collection)
// and per-project media subcollection writes. The binary itself is uploaded by
// the client directly to Storage under media/{ownerType}/{ownerId} (enforced by
// storage.rules isAnyAdmin()); the server only authorizes and records metadata,
// so firebase-admin credentials never touch raw blobs.
//
// Firestore writes here go through the Admin SDK, which bypasses client rules but
// is role-gated by the session check below. Nothing here is importable by a
// client component.

import { ApiError, type BilingualText } from "@/src/lib/admin/projects";
export { ApiError };

const firestore = () => getAdminFirestore();

export type MediaOwnerType =
  | "project"
  | "blog"
  | "about"
  | "testimonial"
  | "inquiry"
  | "general";

export type ProjectMediaKind =
  | "cover"
  | "gallery"
  | "diagram"
  | "screenshot"
  | "logo";
export type BlogPostMediaKind = "cover" | "gallery" | "diagram" | "screenshot";

export type CloudinaryResourceType = "image" | "video";

export interface ProjectMediaInput {
  projectId: string;
  storagePath?: string;
  publicId?: string;
  resourceType?: CloudinaryResourceType;
  fileName: string;
  kind: ProjectMediaKind;
  alt?: Partial<BilingualText>;
  caption?: Partial<BilingualText>;
  sortOrder: number;
  width?: number;
  height?: number;
  mimeType?: string;
  sizeBytes?: number;
}

export interface BlogPostMediaInput {
  postId: string;
  storagePath?: string;
  publicId?: string;
  resourceType?: CloudinaryResourceType;
  fileName: string;
  kind: BlogPostMediaKind;
  alt?: Partial<BilingualText>;
  caption?: Partial<BilingualText>;
  sortOrder: number;
  width?: number;
  height?: number;
  mimeType?: string;
  sizeBytes?: number;
}

export interface MediaLibraryInput {
  ownerType: MediaOwnerType;
  ownerId?: string;
  // Asset identity: Cloudinary (publicId + resourceType) or legacy Firebase
  // storagePath. At least one is required â€” see resolveMediaIdentity().
  storagePath?: string;
  publicId?: string;
  resourceType?: CloudinaryResourceType;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  width?: number;
  height?: number;
  alt?: Partial<BilingualText>;
  caption?: Partial<BilingualText>;
}

function requireRole(
  session: AdminSession | null,
  feature: AdminFeature,
): AdminSession {
  if (!session) throw new ApiError(401, "Not authenticated.");
  if (!can(session.role, feature))
    throw new ApiError(403, `Role '${session.role}' cannot manage ${feature}.`);
  return session;
}

async function requireMediaAdmin(
  session: AdminSession | null,
): Promise<AdminSession> {
  return requireRole(session, "content");
}

/**
 * Register a project media subcollection doc (projects/{id}/media/{mediaId})
 * and mirror it in the global media/ library index. Enforces the storage path
 * convention media/projects/{projectId}/... for every project binary.
 */
/**
 * A media record's asset identity, resolved across the legacy and Cloudinary
 * models. During the migration a record may carry EITHER:
 *   - legacy:    storagePath (Firebase Storage object path)
 *   - Cloudinary: publicId + resourceType
 * New writes always carry the Cloudinary identity. The legacy storagePath is
 * retained (when present) so pre-migration documents remain readable and their
 * binaries remain deletable until the backfill is run.
 */
export interface MediaIdentity {
  storagePath?: string;
  publicId?: string;
  resourceType?: CloudinaryResourceType;
}

/**
 * Validate a media input's identity and normalise it for persistence.
 * Requires at least one of storagePath / publicId; returns the fields to spread
 * into the Firestore write so both call sites stay in lockstep.
 */
function resolveMediaIdentity(
  input: MediaIdentity,
  label: string,
): MediaIdentity {
  const storagePath = input.storagePath?.trim() || undefined;
  const publicId = input.publicId?.trim() || undefined;

  if (!storagePath && !publicId) {
    throw new ApiError(400, "Either storagePath or publicId is required.");
  }
  if (publicId && !input.resourceType) {
    throw new ApiError(400, "resourceType is required when publicId is set.");
  }

  // A legacy storage path must still satisfy the storage.rules convention; a
  // Cloudinary publicId is scoped by its folder instead (media/{ownerType}/{ownerId}).
  if (storagePath && !storagePath.startsWith(label)) {
    throw new ApiError(
      400,
      `Storage path must live under ${label} (storage.rules only permits media/{ownerType}/{ownerId}).`,
    );
  }

  return {
    storagePath,
    publicId,
    resourceType: publicId ? input.resourceType : undefined,
  };
}

/**
 * Deterministic id for a global media/ index doc. Prefers the Cloudinary publicId
 * (the primary identity going forward); falls back to the legacy storage path so
 * pre-migration records keep their existing, stable index ids.
 */
function indexIdForMedia(identity: MediaIdentity): string {
  const key = identity.publicId
    ? `cloudinary:${identity.publicId}`
    : `storage:${identity.storagePath}`;
  return Buffer.from(key, "utf8").toString("base64url");
}

export async function createProjectMedia(
  session: AdminSession | null,
  input: ProjectMediaInput,
): Promise<{ mediaId: string }> {
  const authSession = await requireMediaAdmin(session);

  if (!input.projectId) throw new ApiError(400, "projectId is required.");
  if (!input.fileName) throw new ApiError(400, "fileName is required.");

  const identity = resolveMediaIdentity(
    input,
    `media/projects/${input.projectId}/`,
  );

  const now = new Date();
  const ref = firestore().collection("projects").doc(input.projectId);
  const snap = await ref.get();
  if (!snap.exists) throw new ApiError(404, "Project not found.");

  const mediaDoc = ref.collection("media").doc();
  await mediaDoc.set({
    storagePath: identity.storagePath ?? null,
    publicId: identity.publicId ?? null,
    resourceType: identity.resourceType ?? null,
    fileName: input.fileName,
    kind: input.kind,
    alt: cleanPartial(input.alt),
    caption: cleanPartial(input.caption),
    sortOrder: input.sortOrder ?? 0,
    width: input.width ?? null,
    height: input.height ?? null,
    mimeType: input.mimeType ?? null,
    sizeBytes: input.sizeBytes ?? null,
    createdAt: now,
    updatedAt: now,
  });

  // Global media/ library index (docs/architecture/06_MEDIA_LIBRARY.md Â§4).
  // Use a deterministic doc id derived from the asset identity so re-registering
  // the same asset upserts instead of duplicating the index entry.
  await firestore()
    .collection("media")
    .doc(indexIdForMedia(identity))
    .set({
      storagePath: identity.storagePath ?? null,
      publicId: identity.publicId ?? null,
      resourceType: identity.resourceType ?? null,
      public: true,
      ownerType: "project",
      ownerId: input.projectId,
      fileName: input.fileName,
      mimeType: input.mimeType ?? "",
      sizeBytes: input.sizeBytes ?? 0,
      width: input.width ?? null,
      height: input.height ?? null,
      alt: cleanPartial(input.alt),
      caption: cleanPartial(input.caption),
      createdBy: authSession.uid,
      createdAt: now,
      updatedAt: now,
    });

  return { mediaId: mediaDoc.id };
}

/**
 * Update an existing project media doc in place (kind/alt/caption/sort/dims).
 */
export async function updateProjectMedia(
  session: AdminSession | null,
  projectId: string,
  mediaId: string,
  patch: {
    kind?: ProjectMediaKind;
    alt?: Partial<BilingualText>;
    caption?: Partial<BilingualText>;
    sortOrder?: number;
    width?: number;
    height?: number;
    mimeType?: string;
    sizeBytes?: number;
  },
): Promise<void> {
  requireRole(session, "content");

  const ref = firestore()
    .collection("projects")
    .doc(projectId)
    .collection("media")
    .doc(mediaId);
  const snap = await ref.get();
  if (!snap.exists) throw new ApiError(404, "Media item not found.");

  const next: Record<string, unknown> = { updatedAt: new Date() };
  if (patch.kind) next.kind = patch.kind;
  if (patch.alt) next.alt = cleanPartial(patch.alt);
  if (patch.caption) next.caption = cleanPartial(patch.caption);
  if (typeof patch.sortOrder === "number") next.sortOrder = patch.sortOrder;
  if (typeof patch.width === "number") next.width = patch.width;
  if (typeof patch.height === "number") next.height = patch.height;
  if (typeof patch.mimeType === "string") next.mimeType = patch.mimeType;
  if (typeof patch.sizeBytes === "number") next.sizeBytes = patch.sizeBytes;

  await ref.update(next);

  // Mirror the full patched metadata into the library index (not just updatedAt),
  // so the global picker stays consistent with the per-owner subcollection.
  // Matched on publicId (Cloudinary era) or storagePath (legacy); a record may
  // carry either, so both are queried and de-duplicated by doc id.
  const c = await ref.get();
  const index: Record<string, unknown> = { updatedAt: new Date() };
  if (patch.kind) index.kind = patch.kind;
  if (patch.alt) index.alt = cleanPartial(patch.alt);
  if (patch.caption) index.caption = cleanPartial(patch.caption);
  if (typeof patch.width === "number") index.width = patch.width;
  if (typeof patch.height === "number") index.height = patch.height;
  if (typeof patch.mimeType === "string") index.mimeType = patch.mimeType;
  if (typeof patch.sizeBytes === "number") index.sizeBytes = patch.sizeBytes;
  await updateLibraryIndexEntries(readAssetIdentity(c.data()!), index);
}

/**
 * Reorder many project media items in one go (write every doc's sortOrder).
 */
export async function reorderProjectMedia(
  session: AdminSession | null,
  projectId: string,
  orderedMediaIds: string[],
): Promise<void> {
  requireRole(session, "content");

  const col = firestore()
    .collection("projects")
    .doc(projectId)
    .collection("media");

  // Reject the whole request if any id does not exist, to keep ordering atomic.
  const snap = await col.get();
  const existing = new Set(snap.docs.map((d) => d.id));
  for (const id of orderedMediaIds) {
    if (!existing.has(id))
      throw new ApiError(400, `Media item not found: ${id}`);
  }

  const batch = firestore().batch();
  orderedMediaIds.forEach((id, index) => {
    batch.update(col.doc(id), { sortOrder: index, updatedAt: new Date() });
  });
  await batch.commit();
}

/**
 * Delete a project media item after reference checks (per
 * docs/architecture/06_MEDIA_LIBRARY.md Â§8). This removes Firestore metadata but
 * NOT the underlying binary â€” callers should also delete the Cloudinary asset
 * (and any legacy Firebase object) and, if
 * it was the cover, clear the project's coverMediaId.
 */
/**
 * What a delete operation hands back so the caller can remove the underlying
 * binary. Both identities are returned because a record may be legacy-only
 * (storagePath), Cloudinary-only (publicId), or transitional (both).
 */
export interface DeletedMediaAsset {
  storagePath: string | null;
  publicId: string | null;
  resourceType: CloudinaryResourceType;
}

/** Read the asset identity off a raw Firestore media document. */
function readAssetIdentity(data: Record<string, unknown>): DeletedMediaAsset {
  return {
    storagePath: (data.storagePath as string) ?? null,
    publicId: (data.publicId as string) ?? null,
    resourceType: (data.resourceType as CloudinaryResourceType) ?? "image",
  };
}

/**
 * Remove every global media/ library index doc that points at the same asset,
 * matching on publicId first and falling back to storagePath so both legacy and
 * Cloudinary-era index entries are cleaned up.
 */
async function deleteLibraryIndexEntries(
  asset: DeletedMediaAsset,
): Promise<void> {
  const seen = new Set<string>();
  const queries: Promise<FirebaseFirestore.QuerySnapshot>[] = [];
  if (asset.publicId) {
    queries.push(
      firestore()
        .collection("media")
        .where("publicId", "==", asset.publicId)
        .get(),
    );
  }
  if (asset.storagePath) {
    queries.push(
      firestore()
        .collection("media")
        .where("storagePath", "==", asset.storagePath)
        .get(),
    );
  }
  for (const snap of await Promise.all(queries)) {
    for (const doc of snap.docs) {
      if (seen.has(doc.id)) continue;
      seen.add(doc.id);
      await doc.ref.delete();
    }
  }
}

/**
 * Apply a metadata patch to every global media/ library index doc that points at
 * the same asset, matching on publicId first and falling back to storagePath so
 * both legacy and Cloudinary-era index entries stay in sync.
 */
async function updateLibraryIndexEntries(
  asset: DeletedMediaAsset,
  patch: Record<string, unknown>,
): Promise<void> {
  const seen = new Set<string>();
  const queries: Promise<FirebaseFirestore.QuerySnapshot>[] = [];
  if (asset.publicId) {
    queries.push(
      firestore()
        .collection("media")
        .where("publicId", "==", asset.publicId)
        .get(),
    );
  }
  if (asset.storagePath) {
    queries.push(
      firestore()
        .collection("media")
        .where("storagePath", "==", asset.storagePath)
        .get(),
    );
  }
  for (const snap of await Promise.all(queries)) {
    for (const doc of snap.docs) {
      if (seen.has(doc.id)) continue;
      seen.add(doc.id);
      await doc.ref.update(patch);
    }
  }
}

export async function deleteProjectMedia(
  session: AdminSession | null,
  projectId: string,
  mediaId: string,
): Promise<{ wasCover: boolean } & DeletedMediaAsset> {
  requireRole(session, "content");

  const ref = firestore()
    .collection("projects")
    .doc(projectId)
    .collection("media")
    .doc(mediaId);
  const snap = await ref.get();
  if (!snap.exists) throw new ApiError(404, "Media item not found.");

  const asset = readAssetIdentity(snap.data()!);

  const projectSnap = await firestore()
    .collection("projects")
    .doc(projectId)
    .get();
  const wasCover = projectSnap.data()?.coverMediaId === mediaId;

  // Update the project doc if this was the cover reference.
  if (wasCover) {
    await projectSnap.ref.update({ coverMediaId: null, updatedAt: new Date() });
  }

  await deleteLibraryIndexEntries(asset);
  await ref.delete();
  return { wasCover, ...asset };
}

/**
 * Register a blog post media subcollection doc (blogPosts/{id}/media/{mediaId})
 * and mirror it in the global media/ library index with ownerType 'blog'.
 * Enforces the storage path convention media/blog/{postId}/... for every blog
 * binary â€” a blog post is its own owner type, NOT a project.
 */
export async function createBlogMedia(
  session: AdminSession | null,
  input: BlogPostMediaInput,
): Promise<{ mediaId: string }> {
  const authSession = await requireMediaAdmin(session);

  if (!input.postId) throw new ApiError(400, "postId is required.");
  if (!input.fileName) throw new ApiError(400, "fileName is required.");

  const identity = resolveMediaIdentity(input, `media/blog/${input.postId}/`);

  const now = new Date();
  const ref = firestore().collection("blogPosts").doc(input.postId);
  const snap = await ref.get();
  if (!snap.exists) throw new ApiError(404, "Blog post not found.");

  const mediaDoc = ref.collection("media").doc();
  await mediaDoc.set({
    storagePath: identity.storagePath ?? null,
    publicId: identity.publicId ?? null,
    resourceType: identity.resourceType ?? null,
    fileName: input.fileName,
    kind: input.kind,
    alt: cleanPartial(input.alt),
    caption: cleanPartial(input.caption),
    sortOrder: input.sortOrder ?? 0,
    width: input.width ?? null,
    height: input.height ?? null,
    mimeType: input.mimeType ?? null,
    sizeBytes: input.sizeBytes ?? null,
    createdAt: now,
    updatedAt: now,
  });

  // Global media/ library index (docs/architecture/06_MEDIA_LIBRARY.md Â§4).
  // Use a deterministic doc id derived from the asset identity so re-registering
  // the same asset upserts instead of duplicating the index entry.
  await firestore()
    .collection("media")
    .doc(indexIdForMedia(identity))
    .set({
      storagePath: identity.storagePath ?? null,
      publicId: identity.publicId ?? null,
      resourceType: identity.resourceType ?? null,
      public: true,
      ownerType: "blog",
      ownerId: input.postId,
      fileName: input.fileName,
      mimeType: input.mimeType ?? "",
      sizeBytes: input.sizeBytes ?? 0,
      width: input.width ?? null,
      height: input.height ?? null,
      alt: cleanPartial(input.alt),
      caption: cleanPartial(input.caption),
      createdBy: authSession.uid,
      createdAt: now,
      updatedAt: now,
    });

  return { mediaId: mediaDoc.id };
}

/**
 * Update an existing blog post media doc in place (kind/alt/caption/sort/dims).
 */
export async function updateBlogMedia(
  session: AdminSession | null,
  postId: string,
  mediaId: string,
  patch: {
    kind?: BlogPostMediaKind;
    alt?: Partial<BilingualText>;
    caption?: Partial<BilingualText>;
    sortOrder?: number;
    width?: number;
    height?: number;
    mimeType?: string;
    sizeBytes?: number;
  },
): Promise<void> {
  requireRole(session, "content");

  const ref = firestore()
    .collection("blogPosts")
    .doc(postId)
    .collection("media")
    .doc(mediaId);
  const snap = await ref.get();
  if (!snap.exists) throw new ApiError(404, "Media item not found.");

  const next: Record<string, unknown> = { updatedAt: new Date() };
  if (patch.kind) next.kind = patch.kind;
  if (patch.alt) next.alt = cleanPartial(patch.alt);
  if (patch.caption) next.caption = cleanPartial(patch.caption);
  if (typeof patch.sortOrder === "number") next.sortOrder = patch.sortOrder;
  if (typeof patch.width === "number") next.width = patch.width;
  if (typeof patch.height === "number") next.height = patch.height;
  if (typeof patch.mimeType === "string") next.mimeType = patch.mimeType;
  if (typeof patch.sizeBytes === "number") next.sizeBytes = patch.sizeBytes;

  await ref.update(next);

  // Mirror the full patched metadata into the library index (not just updatedAt),
  // so the global picker stays consistent with the per-owner subcollection.
  // Matched on publicId (Cloudinary era) or storagePath (legacy); a record may
  // carry either, so both are queried and de-duplicated by doc id.
  const c = await ref.get();
  const index: Record<string, unknown> = { updatedAt: new Date() };
  if (patch.kind) index.kind = patch.kind;
  if (patch.alt) index.alt = cleanPartial(patch.alt);
  if (patch.caption) index.caption = cleanPartial(patch.caption);
  if (typeof patch.width === "number") index.width = patch.width;
  if (typeof patch.height === "number") index.height = patch.height;
  if (typeof patch.mimeType === "string") index.mimeType = patch.mimeType;
  if (typeof patch.sizeBytes === "number") index.sizeBytes = patch.sizeBytes;
  await updateLibraryIndexEntries(readAssetIdentity(c.data()!), index);
}

/**
 * Reorder many blog post media items in one go (write every doc's sortOrder).
 */
export async function reorderBlogMedia(
  session: AdminSession | null,
  postId: string,
  orderedMediaIds: string[],
): Promise<void> {
  requireRole(session, "content");

  const col = firestore()
    .collection("blogPosts")
    .doc(postId)
    .collection("media");

  // Reject the whole request if any id does not exist, to keep ordering atomic.
  const snap = await col.get();
  const existing = new Set(snap.docs.map((d) => d.id));
  for (const id of orderedMediaIds) {
    if (!existing.has(id))
      throw new ApiError(400, `Media item not found: ${id}`);
  }

  const batch = firestore().batch();
  orderedMediaIds.forEach((id, index) => {
    batch.update(col.doc(id), { sortOrder: index, updatedAt: new Date() });
  });
  await batch.commit();
}

/**
 * Delete a blog post media item after reference checks (per
 * docs/architecture/06_MEDIA_LIBRARY.md Â§8). This removes Firestore metadata but
 * NOT the underlying binary â€” callers should also delete the Cloudinary asset
 * (and any legacy Firebase object) and, if
 * it was the cover, clear the post's coverMediaId.
 */
export async function deleteBlogMedia(
  session: AdminSession | null,
  postId: string,
  mediaId: string,
): Promise<{ wasCover: boolean } & DeletedMediaAsset> {
  requireRole(session, "content");

  const ref = firestore()
    .collection("blogPosts")
    .doc(postId)
    .collection("media")
    .doc(mediaId);
  const snap = await ref.get();
  if (!snap.exists) throw new ApiError(404, "Media item not found.");

  const asset = readAssetIdentity(snap.data()!);

  const postSnap = await firestore().collection("blogPosts").doc(postId).get();
  const wasCover = postSnap.data()?.coverMediaId === mediaId;

  // Update the post doc if this was the cover reference.
  if (wasCover) {
    await postSnap.ref.update({ coverMediaId: null, updatedAt: new Date() });
  }

  await deleteLibraryIndexEntries(asset);
  await ref.delete();
  return { wasCover, ...asset };
}

/** A single record in the global media/ library index. */
export interface MediaLibraryItem {
  id: string;
  storagePath?: string;
  publicId?: string;
  resourceType?: CloudinaryResourceType;
  public: boolean;
  ownerType: MediaOwnerType;
  ownerId?: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  width?: number | null;
  height?: number | null;
  alt?: Partial<BilingualText> | null;
  caption?: Partial<BilingualText> | null;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
}

function timestampToMillis(value: unknown): number {
  if (typeof value === "number") return value;

  if (value instanceof Date) return value.getTime();

  if (
    value &&
    typeof (value as { toMillis?: unknown }).toMillis === "function"
  ) {
    return (value as { toMillis: () => number }).toMillis();
  }

  if (value && typeof value === "object") {
    const raw = value as {
      seconds?: number;
      nanoseconds?: number;
      _seconds?: number;
      _nanoseconds?: number;
    };

    const seconds = raw.seconds ?? raw._seconds;
    const nanoseconds = raw.nanoseconds ?? raw._nanoseconds ?? 0;

    if (typeof seconds === "number") {
      return seconds * 1000 + Math.floor(nanoseconds / 1_000_000);
    }
  }

  return 0;
}
/** Generic media library record (read-only access for pickers). */
export async function listMediaLibrary(
  session: AdminSession | null,
  ownerType?: MediaOwnerType,
): Promise<MediaLibraryItem[]> {
  requireRole(session, "media");

  let q = firestore().collection("media").orderBy("createdAt", "desc");
  if (ownerType) q = q.where("ownerType", "==", ownerType);
  const snap = await q.limit(500).get();
  return snap.docs.map((d) => {
    const data = d.data();

    return {
      id: d.id,
      storagePath: data.storagePath ?? undefined,
      publicId: data.publicId ?? undefined,
      resourceType: data.resourceType ?? undefined,
      public: data.public === true,
      ownerType: data.ownerType as MediaOwnerType,
      ownerId: data.ownerId ?? undefined,
      fileName: data.fileName ?? "",
      mimeType: data.mimeType ?? "",
      sizeBytes: typeof data.sizeBytes === "number" ? data.sizeBytes : 0,
      width: typeof data.width === "number" ? data.width : null,
      height: typeof data.height === "number" ? data.height : null,
      alt: data.alt ?? null,
      caption: data.caption ?? null,
      createdBy: data.createdBy ?? "",
      createdAt: timestampToMillis(data.createdAt),
      updatedAt: timestampToMillis(data.updatedAt),
    } satisfies MediaLibraryItem;
  });
}

/**
 * Delete a media item from the global library index (media/{mediaId}) plus the
 * source subcollection doc (e.g. projects/{id}/media/{mediaId}) that mirrors it,
 * and return the asset identity so the caller can remove the binary. Reference
 * checks per docs/architecture/06_MEDIA_LIBRARY.md Â§8: refuse if another entity
 * still references the asset (a cover reference). Matching is done on publicId
 * (Cloudinary era) or storagePath (legacy), so both kinds of record are handled.
 */
export async function deleteMediaLibrary(
  session: AdminSession | null,
  mediaId: string,
): Promise<
  { ownerType: MediaOwnerType; ownerId?: string } & DeletedMediaAsset
> {
  requireRole(session, "media");

  const libRef = firestore().collection("media").doc(mediaId);
  const libSnap = await libRef.get();
  if (!libSnap.exists) throw new ApiError(404, "Media item not found.");

  const data = libSnap.data()!;
  const asset = readAssetIdentity(data);
  const ownerType: MediaOwnerType | undefined = data.ownerType;
  const ownerId: string | undefined = data.ownerId;

  if (!asset.storagePath && !asset.publicId) {
    throw new ApiError(400, "Media item is missing an asset identity.");
  }
  if (!ownerType)
    throw new ApiError(400, "Media item is missing an owner type.");

  const ownerCollection =
    ownerType === "project"
      ? "projects"
      : ownerType === "blog"
        ? "blogPosts"
        : null;

  // Locate the source subcollection docs that mirror this asset, matching on
  // publicId (Cloudinary era) or storagePath (legacy). Both are checked because
  // a transitional record carries both.
  const findMirrorDocs = async (): Promise<
    FirebaseFirestore.QueryDocumentSnapshot[]
  > => {
    if (!ownerCollection || !ownerId) return [];
    const col = firestore()
      .collection(ownerCollection)
      .doc(ownerId)
      .collection("media");
    const docs: FirebaseFirestore.QueryDocumentSnapshot[] = [];
    if (asset.publicId)
      docs.push(
        ...(await col.where("publicId", "==", asset.publicId).get()).docs,
      );
    if (asset.storagePath)
      docs.push(
        ...(await col.where("storagePath", "==", asset.storagePath).get()).docs,
      );
    // De-duplicate: a transitional record matches both queries.
    const byId = new Map(docs.map((d) => [d.id, d]));
    return Array.from(byId.values());
  };

  const mirrorDocs = await findMirrorDocs();

  // Reference check: refuse deletion while this asset is still the cover of its
  // owning project or blog post (docs/architecture/06_MEDIA_LIBRARY.md Â§8).
  if (ownerCollection && ownerId) {
    const ownerSnap = await firestore()
      .collection(ownerCollection)
      .doc(ownerId)
      .get();
    const coverMediaId = ownerSnap.data()?.coverMediaId;
    if (coverMediaId && mirrorDocs.some((d) => d.id === coverMediaId)) {
      const noun = ownerType === "project" ? "a project" : "a blog post";
      throw new ApiError(
        409,
        `This media is the cover of ${noun}. Change the cover before deleting it.`,
      );
    }
  }

  // Remove the mirroring subcollection docs so the per-owner gallery stays
  // consistent with the library index.
  for (const doc of mirrorDocs) await doc.ref.delete();

  // Remove every index doc pointing at this asset, by either identity.
  await deleteLibraryIndexEntries(asset);

  return { ownerType, ownerId, ...asset };
}

function cleanPartial(
  v?: Partial<BilingualText>,
): Partial<BilingualText> | null {
  if (!v) return null;
  const out: Partial<BilingualText> = {};
  if (typeof v.en === "string") out.en = v.en.trim();
  if (typeof v.ar === "string") out.ar = v.ar.trim();
  return out.en || out.ar ? out : null;
}






