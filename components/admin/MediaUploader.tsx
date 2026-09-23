'use client'

// Client-side media uploader for a project's or blog post's gallery.
//
// Upload flow (matches the storage/CRUD split in src/lib/admin/media.ts):
//   1. The client uploads the raw blob DIRECTLY to Cloud Storage under
//      media/{ownerType}/{ownerId}/{fileName} using the client Firebase SDK.
//      storage.rules gates the write on isAnyAdmin() (the signed-in client token),
//      and only permits the media/{ownerType}/{ownerId}/... shape.
//   2. The client then POSTs the metadata { storagePath, fileName, kind, ... } to
//      the server route /admin/api/{projects|blog}/[id]/media, which authorizes
//      (editor+) and records Firestore metadata in the owner subcollection and
//      the global media/ index. The server never touches the raw blob.
// The cover is selected on the owner doc via coverMediaId (PATCH on the owner).

import { useEffect, useRef, useState } from 'react'
import { ref as storageRef, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage'
import { firebaseStorage } from '@/src/lib/firebase/client'
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
  storagePath: string
  fileName?: string
  kind: string
  sortOrder: number
}

// Resolve Firebase Storage download URLs for each storagePath. The metadata
// stores a Storage path (media/{ownerType}/{ownerId}/...), NOT a URL, so the
// binary must be resolved via getDownloadURL before it can be shown as an <img>.
function useMediaUrls(paths: string[]): Record<string, string> {
  const [urls, setUrls] = useState<Record<string, string>>({})
  const key = paths.join('|')
  useEffect(() => {
    let cancelled = false
    const pending = paths.filter((p) => !urls[p])
    if (pending.length === 0) return
    Promise.all(
      pending.map(async (p) => {
        try {
          return [p, await getDownloadURL(storageRef(firebaseStorage, p))] as const
        } catch {
          return [p, ''] as const
        }
      }),
    ).then((resolved) => {
      if (cancelled) return
      setUrls((prev) => {
        const next = { ...prev }
        for (const [p, url] of resolved) next[p] = url
        return next
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
  const urls = useMediaUrls(ordered.map((m) => m.storagePath))

  const kindLabel = (k: string) =>
    kindOptions.find((x) => x.value === k)?.label ?? k

  const storagePrefix = isProject
    ? `media/projects/${ownerId}/`
    : `media/blog/${ownerId}/`

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
    let path = ''
    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
      path = `${storagePrefix}${Date.now()}-${safeName}`
      const ref = storageRef(firebaseStorage, path)
      const task = uploadBytesResumable(ref, file)
      await new Promise<void>((resolve, reject) => {
        task.on(
          'state_changed',
          (snap) =>
            setProgress(snap.totalBytes > 0 ? snap.bytesTransferred / snap.totalBytes : 0),
          reject,
          () => resolve(),
        )
      })

      const res = await fetch(apiBase, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storagePath: path,
          fileName: file.name,
          kind,
          alt: {},
          caption: {},
          sortOrder: media.length + uploadingCount,
          mimeType: file.type || 'application/octet-stream',
          sizeBytes: file.size,
        }),
      })
      if (!res.ok) {
        const data = (await res.json()) as { error?: string }
        throw new Error(data.error ?? 'Failed to register media.')
      }
      await onChanged()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed.')
      // If the binary reached Storage but metadata registration failed, remove the
      // orphaned blob so the gallery does not accumulate unreachable files.
      if (path) {
        try {
          await deleteObject(storageRef(firebaseStorage, path))
        } catch {
          // Best effort only; a lingering orphan is harmless.
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
                  {urls[m.storagePath] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={urls[m.storagePath]}
                      alt={m.fileName ?? m.id}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex items-center justify-center gap-2 px-3 text-[11px] text-[var(--muted-foreground)]">
                      <span className="text-base">🖼</span>
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
                          ←
                        </button>
                        <button
                          type="button"
                          onClick={() => move(i, 1)}
                          disabled={i === ordered.length - 1}
                          aria-label="Move later"
                          className="rounded border border-[var(--border)] px-1.5 py-0.5 text-[10px] text-[var(--muted-foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)] disabled:opacity-40"
                        >
                          →
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