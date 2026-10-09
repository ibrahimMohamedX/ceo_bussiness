'use client'

// Client-side media uploader for a project's or blog post's gallery.
//
// Upload flow (matches the storage/CRUD split in src/lib/admin/media.ts):
//   1. The client POSTs the raw file as multipart/form-data to
//      /admin/api/media/upload, which authorizes (editor+) and streams the bytes
//      to Cloudinary via src/lib/cloudinary/media.ts. The Cloudinary API
//      key/secret never reach the browser.
//   2. The client then POSTs the returned Cloudinary identity
//      { publicId, resourceType, ... } to the server route
//      /admin/api/{projects|blog}/[id]/media, which records Firestore metadata in
//      the owner subcollection and the global media/ index.
// The cover is selected on the owner doc via coverMediaId (PATCH on the owner).
//
// Legacy compatibility: records written before the Cloudinary migration carry
// only a Firebase storagePath. Those are still rendered by resolving a download
// URL through the client Firebase SDK; nothing new is ever written that way.

import { useEffect, useRef, useState } from 'react'
import { ref as storageRef, getDownloadURL } from 'firebase/storage'
import { firebaseStorage } from '@/src/lib/firebase/client'
import { cloudinaryUrl } from '@/src/lib/cloudinary/url'
import type { ProjectMediaKind, BlogPostMediaKind } from '@/src/lib/admin/media'
import { Select } from './ui'

// A project supports 'logo' as an extra kind; a blog post does not.
export const PROJECT_KINDS: { value: ProjectMediaKind; label: string }[] = [
  { value: 'cover', label: 'Cover' },
  { value: 'gallery', label: 'Gallery' },
  { value: 'diagram', label: 'Diagram' },
  { value: 'screenshot', label: 'Screenshot' },
  { value: 'logo', label: 'Logo' },
]

export const BLOG_KINDS: { value: BlogPostMediaKind; label: string }[] = [
  { value: 'cover', label: 'Cover' },
  { value: 'gallery', label: 'Gallery' },
  { value: 'diagram', label: 'Diagram' },
  { value: 'screenshot', label: 'Screenshot' },
]

// Image types the project accepts (image/*; a cover is always an image).
const ACCEPTED_MIME = /^image\/(png|jpe?g|webp|gif|avif|svg\+xml)$/i

// Upper bound to catch accidental huge uploads before they hit Storage. Generous
// safety cap, not a new project restriction.
const MAX_FILE_BYTES = 25 * 1024 * 1024

export type MediaOwnerType = 'project' | 'blog'

// Media records across both owner types expose the same fields the gallery needs.
export interface MediaItem {
  id: string
  storagePath?: string
  fileName?: string
  kind: string
  sortOrder: number
  publicId?: string
  resourceType?: 'image' | 'video'
}

// Legacy Firebase Storage records carry storagePath; Cloudinary records carry
// publicId + resourceType. Coerce to a stable string so a record written under
// either model can be rendered without a non-null assertion at every call site.
export const getStoragePath = (m: MediaItem): string => m.storagePath ?? ''
export const getPublicId = (m: MediaItem): string => m.publicId ?? ''
export const getResourceType = (m: MediaItem): 'image' | 'video' => m.resourceType ?? 'image'

// Resolve a display URL for each media record.
//
// Cloudinary records resolve synchronously from publicId (delivery URLs are
// public and need no credentials). Legacy records that only carry a Firebase
// storagePath still need getDownloadURL — that path is retained solely for
// pre-migration documents and is never used for anything newly uploaded.
function useMediaUrls(items: MediaItem[]): Record<string, string> {
  const [urls, setUrls] = useState<Record<string, string>>({})
  // Key on both identities so a record that gains a publicId re-resolves.
  const key = items.map((m) => `${m.id}:${getPublicId(m)}:${getStoragePath(m)}`).join('|')

  useEffect(() => {
    let cancelled = false
    const next: Record<string, string> = {}
    const legacy: string[] = []

    for (const m of items) {
      const direct = cloudinaryUrl(getPublicId(m), getResourceType(m))
      if (direct) next[m.id] = direct
      else if (getStoragePath(m)) legacy.push(getStoragePath(m))
    }

    setUrls((prev) => ({ ...prev, ...next }))
    if (legacy.length === 0) return

    Promise.all(
      legacy.map(async (p) => {
        try {
          return [p, await getDownloadURL(storageRef(firebaseStorage, p))] as const
        } catch {
          return [p, ''] as const
        }
      }),
    ).then((resolved) => {
      if (cancelled) return
      setUrls((prev) => {
        const merged = { ...prev }
        // Legacy URLs are keyed by storagePath; map back to the record id.
        for (const m of items) {
          const p = getStoragePath(m)
          if (!p) continue
          const hit = resolved.find(([path]) => path === p)
          if (hit) merged[m.id] = hit[1]
        }
        return merged
      })
    })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return urls
}

export function MediaUploader({
  ownerType,
  ownerId,
  media,
  onChanged,
  onReorder,
  onDelete,
}: {
  ownerType: MediaOwnerType
  ownerId: string
  media: MediaItem[]
  onChanged: () => Promise<void> | void
  // If provided, the parent owns the delete confirmation flow (open a
  // ConfirmDialog and call onDelete(mediaId)); MediaUploader only renders the
  // trigger. If omitted, delete is performed inline here with a confirm() prompt.
  onDelete?: (mediaId: string) => void
  // If provided, MediaUploader renders reorder controls and calls
  // onReorder(orderedIds); the parent persists the new order.
  onReorder?: (orderedIds: string[]) => Promise<void> | void
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [uploadingCount, setUploadingCount] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState<number | null>(null)
  const [kind, setKind] = useState<MediaItem['kind']>('gallery')

  const isProject = ownerType === 'project'
  const kindOptions = isProject ? PROJECT_KINDS : BLOG_KINDS

  const ordered = media.slice().sort((a, b) => a.sortOrder - b.sortOrder)
  const urls = useMediaUrls(ordered)

  const kindLabel = (k: string) =>
    kindOptions.find((x) => x.value === k)?.label ?? k

  const apiBase = isProject
    ? `/admin/api/projects/${ownerId}/media`
    : `/admin/api/blog/${ownerId}/media`

  // Move an item up/down in the gallery, then persist the full ordered list.
  const move = async (index: number, dir: -1 | 1) => {
    const target = index + dir
    if (target < 0 || target >= ordered.length) return
    const next = ordered.slice()
    const [item] = next.splice(index, 1)
    next.splice(target, 0, item)
    setError(null)
    if (onReorder) {
      try {
        await onReorder(next.map((m) => m.id))
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Reorder failed.')
      }
    }
  }

  const upload = async (file: File) => {
    if (!ACCEPTED_MIME.test(file.type)) {
      setError(`"${file.name}" is not a supported image type.`)
      return
    }
    if (file.size > MAX_FILE_BYTES) {
      setError(`"${file.name}" exceeds the 25 MB size limit.`)
      return
    }
    setError(null)
    setBusy(true)
    setUploadingCount((c) => c + 1)
    setProgress(0)
    let uploadedPublicId = ''
    let uploadedResourceType: 'image' | 'video' = 'image'
    try {
      // Step 1: stream the bytes to Cloudinary through the server route. The
      // Cloudinary API key/secret stay server-side.
      const form = new FormData()
      form.append('file', file)
      form.append('ownerType', ownerType)
      form.append('ownerId', ownerId)
      const uploadRes = await fetch('/admin/api/media/upload', {
        method: 'POST',
        body: form,
      })
      if (!uploadRes.ok) {
        const data = (await uploadRes.json()) as { error?: string }
        throw new Error(data.error ?? 'Upload failed.')
      }
      const uploaded = (await uploadRes.json()) as {
        publicId: string
        resourceType: 'image' | 'video'
        width: number | null
        height: number | null
        sizeBytes: number
        mimeType: string
      }
      uploadedPublicId = uploaded.publicId
      uploadedResourceType = uploaded.resourceType
      setProgress(1)

      // Step 2: register the Cloudinary identity as Firestore metadata.
      const res = await fetch(apiBase, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          publicId: uploaded.publicId,
          resourceType: uploaded.resourceType,
          fileName: file.name,
          kind,
          alt: {},
          caption: {},
          sortOrder: media.length + uploadingCount,
          mimeType: uploaded.mimeType || file.type || 'application/octet-stream',
          sizeBytes: uploaded.sizeBytes ?? file.size,
          width: uploaded.width ?? undefined,
          height: uploaded.height ?? undefined,
        }),
      })
      if (!res.ok) {
        const data = (await res.json()) as { error?: string }
        throw new Error(data.error ?? 'Failed to register media.')
      }
      await onChanged()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed.')
      // If the binary reached Cloudinary but metadata registration failed, ask the
      // server to destroy the orphan so the gallery does not accumulate
      // unreachable assets. Best effort only; a lingering orphan is harmless.
      if (uploadedPublicId) {
        try {
          await fetch('/admin/api/media/upload', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              publicId: uploadedPublicId,
              resourceType: uploadedResourceType,
            }),
          })
        } catch {
          // Best effort only.
        }
      }
    } finally {
      setUploadingCount((c) => Math.max(0, c - 1))
      setBusy(false)
      setProgress(null)
    }
  }

  const handleFiles = async (list: FileList | null) => {
    const files = Array.from(list ?? [])
    if (files.length === 0) return
    const invalid = files.find((f) => !ACCEPTED_MIME.test(f.type))
    if (invalid) {
      setError(`"${invalid.name}" is not a supported image type.`)
      return
    }
    const tooLarge = files.find((f) => f.size > MAX_FILE_BYTES)
    if (tooLarge) {
      setError(`"${tooLarge.name}" exceeds the 25 MB size limit.`)
      return
    }
    // Upload sequentially so order and progress remain deterministic.
    for (const file of files) {
      await upload(file)
    }
  }

  const requestDelete = async (id: string) => {
    if (onDelete) {
      onDelete(id)
      return
    }
    // Self-contained fallback with a confirmation prompt.
    if (!window.confirm('Delete this media item? This cannot be undone.')) return
    setError(null)
    setBusy(true)
    try {
      const res = await fetch(`${apiBase}/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = (await res.json()) as { error?: string }
        throw new Error(data.error ?? 'Failed to delete media.')
      }
      await onChanged()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete failed.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <span className="mt-2 block text-[12px] font-semibold text-[var(--muted-foreground)]">
          Gallery
        </span>

        {ordered.length === 0 ? (
          <div className="mt-2 rounded-lg border border-dashed border-[var(--border)] px-6 py-10 text-center">
            <p className="text-[13px] text-[var(--muted-foreground)]">No media yet.</p>
            <p className="mt-1 text-[12px] text-[var(--muted-foreground)]/70">
              Upload images to build the gallery.
            </p>
          </div>
        ) : (
          <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {ordered.map((m, i) => (
              <div
                key={m.id}
                className="relative flex flex-col overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--card)]"
              >
                <div className="flex aspect-[4/3] items-center justify-center overflow-hidden bg-black/20">
                  {urls[m.id] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={urls[m.id]}
                      alt={m.fileName ?? m.id}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex items-center justify-center gap-2 px-3 text-[11px] text-[var(--muted-foreground)]">
                      <span className="text-base">ðŸ–¼</span>
                      <span
                        className="min-w-0 truncate font-mono text-[10px]"
                        title={m.fileName ?? m.id}
                      >
                        {m.fileName ?? m.id}
                      </span>
                    </div>
                  )}
                </div>
                <div className="space-y-1 border-t border-[var(--border)] p-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--muted-foreground)]">
                      {kindLabel(m.kind)}
                    </span>
                    <span className="font-mono text-[10px] text-[var(--muted-foreground)]/70">
                      #{m.sortOrder}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {onReorder && (
                      <span className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => move(i, -1)}
                          disabled={i === 0}
                          aria-label="Move earlier"
                          className="rounded border border-[var(--border)] px-1.5 py-0.5 text-[10px] text-[var(--muted-foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)] disabled:opacity-40"
                        >
                          â†
                        </button>
                        <button
                          type="button"
                          onClick={() => move(i, 1)}
                          disabled={i === ordered.length - 1}
                          aria-label="Move later"
                          className="rounded border border-[var(--border)] px-1.5 py-0.5 text-[10px] text-[var(--muted-foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)] disabled:opacity-40"
                        >
                          â†’
                        </button>
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => requestDelete(m.id)}
                      className="rounded border border-red-500/30 px-1.5 py-0.5 text-[10px] text-red-400 hover:bg-red-500/10"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {progress !== null ? (
        <div className="space-y-1">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--border)]">
            <div
              className="h-full rounded-full bg-[var(--primary)] transition-all"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-[var(--muted-foreground)]">
            Uploading {uploadingCount > 0 ? `${uploadingCount} file(s)…` : '…'}
          </p>
        </div>
      ) : null}

      {error ? <p className="text-[12px] text-red-400">{error}</p> : null}

      <div className="flex flex-wrap items-end gap-3">
        <div className="w-40">
          <Select
            id="upload-kind"
            label="Kind"
            value={kind}
            options={kindOptions as { value: string; label: string }[]}
            onChange={setKind}
          />
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            void handleFiles(e.target.files)
            e.target.value = ''
          }}
        />
        <button
          type="button"
          disabled={busy}
          onClick={() => fileRef.current?.click()}
          className="rounded-lg border border-[var(--primary)]/40 px-4 py-2 text-[13px] font-medium text-[var(--primary)] hover:bg-[var(--primary)]/10 disabled:opacity-50"
        >
          {busy ? 'Uploading…' : 'Upload image'}
        </button>
      </div>
    </div>
  )
}




