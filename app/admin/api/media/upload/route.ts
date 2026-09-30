import { NextResponse } from 'next/server'

import { verifySession } from '@/src/lib/admin/session'
import { can } from '@/src/lib/admin/roles'
import { ApiError } from '@/src/lib/admin/media'
import {
  uploadMedia,
  deleteMedia,
  type CloudinaryResourceType,
} from '@/src/lib/cloudinary/media'

// Server-side Cloudinary upload endpoint.
//
// The browser no longer talks to Firebase Storage. It POSTs the raw file here as
// multipart/form-data; this route authorizes the session (media feature, editor+),
// streams the bytes to Cloudinary via the existing src/lib/cloudinary/media.ts
// service, and returns the resulting identity. The client then registers that
// identity as Firestore metadata through the per-owner media routes.
//
// The Cloudinary API key/secret stay server-side: they are only read by
// src/lib/cloudinary/server.ts, which imports 'server-only'.

export const dynamic = 'force-dynamic'

// Mirrors the client-side guard that existed before the migration.
const ACCEPTED_MIME = /^(image|video)\/(png|jpe?g|webp|gif|avif|svg\+xml|mp4|webm|quicktime)$/i
const MAX_FILE_BYTES = 25 * 1024 * 1024

// Cloudinary errors carry this extra field on the thrown object. `name` and
// `message` are already declared by Error, so they are not re-declared here.
interface CloudinaryError extends Error {
  http_code?: number
  error?: { message?: string }
}

/**
 * Strip anything credential-shaped from a value before it reaches the client or
 * the log. Cloudinary never echoes the secret back, but request context can, and
 * this route must never leak CLOUDINARY_API_SECRET / API_KEY under any path.
 */
function sanitize(value: unknown): unknown {
  const secret = process.env.CLOUDINARY_API_SECRET
  const key = process.env.CLOUDINARY_API_KEY
  const redact = (s: string): string => {
    let out = s
    if (secret) out = out.split(secret).join('[REDACTED_SECRET]')
    if (key) out = out.split(key).join('[REDACTED_KEY]')
    return out
  }

  if (typeof value === 'string') return redact(value)
  if (value && typeof value === 'object') {
    if (Array.isArray(value)) return value.map(sanitize)
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      // Drop credential-bearing keys outright.
      if (/secret|api_?key|authorization|signature|token/i.test(k)) {
        out[k] = '[REDACTED]'
        continue
      }
      out[k] = sanitize(v)
    }
    return out
  }
  return value
}

function toError(e: unknown) {
  if (e instanceof ApiError) {
    return NextResponse.json({ error: e.message }, { status: e.status })
  }

  const err = e as CloudinaryError
  const name = err?.name ?? 'Error'
  const message = err?.message ?? 'Upload failed'
  const httpCode = err?.http_code

  // Full detail to the server terminal only. Never to the response.
  console.error('[media/upload] Cloudinary upload failed', {
    name,
    message,
    http_code: httpCode,
    error: sanitize(err?.error),
    stack: typeof err?.stack === 'string' ? sanitize(err.stack) : undefined,
  })

  // Safe JSON to the client: the real message + code so the failure is
  // diagnosable without server log access, with credentials stripped.
  return NextResponse.json(
    {
      error: String(sanitize(message)),
      name,
      ...(typeof httpCode === 'number' ? { http_code: httpCode } : {}),
    },
    { status: 500 },
  )
}

export async function POST(request: Request) {
  const session = await verifySession()
  try {
    if (!session) throw new ApiError(401, 'Not authenticated.')
    if (!can(session.role, 'media')) {
      throw new ApiError(403, `Role '${session.role}' cannot manage media.`)
    }

    const form = await request.formData()
    const file = form.get('file')
    const ownerType = String(form.get('ownerType') ?? '')
    const ownerId = String(form.get('ownerId') ?? '')

    if (!(file instanceof File)) throw new ApiError(400, 'file is required.')
    // Surface a malformed multipart body explicitly rather than letting an empty
    // or unnamed File fail deeper in the Cloudinary SDK.
    if (!file.size) {
      throw new ApiError(400, `"${file.name || 'file'}" is empty (0 bytes).`)
    }
    if (!file.name) {
      throw new ApiError(400, 'Uploaded file has no filename.')
    }
    if (ownerType !== 'project' && ownerType !== 'blog' && ownerType !== 'settings') {
      throw new ApiError(400, "ownerType must be 'project', 'blog' or 'settings'.")
    }
    if (!ownerId) throw new ApiError(400, 'ownerId is required.')
    if (!ACCEPTED_MIME.test(file.type)) {
      throw new ApiError(400, `"${file.name}" is not a supported media type.`)
    }
    if (file.size > MAX_FILE_BYTES) {
      throw new ApiError(400, `"${file.name}" exceeds the 25 MB size limit.`)
    }

    // Cloudinary folder convention mirrors the old Storage convention
    // (media/{ownerType}/{ownerId}/...) so assets stay grouped by owner.
    const folder = `media/${ownerType}/${ownerId}`
    const resourceType: CloudinaryResourceType = file.type.startsWith('video/')
      ? 'video'
      : 'image'

    // Config sanity check before the SDK round-trip. Presence alone is not
    // enough — a secret that does not match the key fails only at the API, so
    // log the shapes (never the values) to make a copy-paste slip obvious.
    const cfgName = process.env.CLOUDINARY_CLOUD_NAME
    const cfgKey = process.env.CLOUDINARY_API_KEY
    const cfgSecret = process.env.CLOUDINARY_API_SECRET
    if (!cfgName || !cfgKey || !cfgSecret) {
      throw new ApiError(500, 'Cloudinary configuration is incomplete on the server.')
    }
    console.log('[media/upload] dispatching to Cloudinary', {
      cloud_name: cfgName,
      key_len: cfgKey.length,
      secret_len: cfgSecret.length,
      // A secret identical to the key is always a misconfiguration.
      secret_equals_key: cfgSecret === cfgKey,
      folder,
      resourceType,
      fileName: file.name,
      mimeType: file.type,
      size: file.size,
    })

    const result = await uploadMedia(file, {
      folder,
      resourceType,
      originalFilename: file.name,
    })
    return NextResponse.json(
      {
        publicId: result.publicId,
        assetId: result.assetId,
        resourceType: result.resourceType,
        width: result.width ?? null,
        height: result.height ?? null,
        sizeBytes: result.bytes,
        mimeType: file.type || 'application/octet-stream',
      },
      { status: 201 },
    )
  } catch (e) {
    return toError(e)
  }
}

// Compensating action for a failed metadata registration: the client calls this
// to destroy an asset that reached Cloudinary but was never recorded in
// Firestore. Authorized identically to the upload so it cannot be used to delete
// arbitrary assets by an unauthenticated caller.
export async function DELETE(request: Request) {
  const session = await verifySession()
  try {
    if (!session) throw new ApiError(401, 'Not authenticated.')
    if (!can(session.role, 'media')) {
      throw new ApiError(403, `Role '${session.role}' cannot manage media.`)
    }

    const body = (await request.json()) as {
      publicId?: string
      resourceType?: CloudinaryResourceType
    }
    if (!body.publicId) throw new ApiError(400, 'publicId is required.')

    await deleteMedia(body.publicId, body.resourceType ?? 'image')
    return NextResponse.json({ ok: true })
  } catch (e) {
    return toError(e)
  }
}
