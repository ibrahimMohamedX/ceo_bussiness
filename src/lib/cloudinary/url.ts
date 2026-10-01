// Client-safe Cloudinary delivery URL builder.
//
// Cloudinary delivery URLs are public and require NO credentials, so this module
// is safe to import from client components. Only the cloud NAME is needed, and it
// is exposed to the browser via NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME. The API key and
// API secret are server-only and must never be referenced here.
//
// Kept free of `server-only` and of the `cloudinary` SDK so it can be bundled for
// the browser without pulling in the server config.

export type CloudinaryResourceType = 'image' | 'video'

// The cloud name is inlined at build time. Read defensively so a missing value
// degrades to an empty URL instead of throwing during render.
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? ''

/**
 * Build a delivery URL for a Cloudinary asset.
 *
 * Returns '' when publicId is empty, so callers can render a placeholder rather
 * than a broken <img>. Deliberately does NOT take a version or transformation:
 * the base delivery URL is stable and transformations can be layered on later
 * via the Cloudinary URL API without touching stored records.
 */
export function cloudinaryUrl(
  publicId: string | null | undefined,
  resourceType: CloudinaryResourceType = 'image',
): string {
  if (!publicId || !CLOUD_NAME) return ''
  // publicId may contain '/' (folders); those are path separators, not encoding.
  const path = publicId
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/')
  return `https://res.cloudinary.com/${CLOUD_NAME}/${resourceType}/upload/${path}`
}





