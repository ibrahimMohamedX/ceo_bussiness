'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ref as storageRef, getDownloadURL } from 'firebase/storage'
import { firebaseStorage } from '@/src/lib/firebase/client'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { Select, cls } from '@/components/admin/ui'
import type { MediaLibraryItem, MediaOwnerType } from '@/src/lib/admin/media'

interface MediaLibraryClientProps {
  media: MediaLibraryItem[]
}

const OWNER_FILTERS: { value: MediaOwnerType | 'all'; label: string }[] = [
  { value: 'all', label: 'All types' },
  { value: 'project', label: 'Project' },
  { value: 'blog', label: 'Blog' },
  { value: 'about', label: 'About' },
  { value: 'testimonial', label: 'Testimonial' },
  { value: 'inquiry', label: 'Inquiry' },
  { value: 'general', label: 'General' },
]

function formatBytes(bytes?: number | null): string {
  if (typeof bytes !== 'number' || Number.isNaN(bytes)) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// Resolve Firebase Storage download URLs for each storagePath. The library index
// stores a Storage path (media/{ownerType}/{ownerId}/...), NOT a URL, so the
// binary must be resolved via getDownloadURL before it can be shown as an <img>.
function useMediaUrls(paths: string[]): Record<string, string> {
  const [urls, setUrls] = useState<Record<string, string>>({})
  useEffect(() => {
    let cancelled = false
    const pending = new Set(paths)
    // Only resolve paths we don't already have (avoid re-fetching on filter change).
    setUrls((prev) => {
      const next = { ...prev }
      for (const p of Array.from(pending)) if (next[p]) pending.delete(p)
      return next
    })
    Promise.all(
      Array.from(pending).map(async (p) => {
        try {
          const url = await getDownloadURL(storageRef(firebaseStorage, p))
          return [p, url] as const
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
  }, [paths.join('|')])
  return urls
}

export default function MediaLibraryClient({ media }: MediaLibraryClientProps) {
  const router = useRouter()
  const [filter, setFilter] = useState<MediaOwnerType | 'all'>('all')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const rows = useMemo(
    () => (filter === 'all' ? media : media.filter((m) => m.ownerType === filter)),
    [media, filter],
  )

  const urls = useMediaUrls(rows.map((m) => m.storagePath))

  const deleting = media.find((m) => m.id === deletingId) ?? null

  const handleCopy = async (path: string) => {
    try {
      await navigator.clipboard.writeText(path)
      setCopied(path)
      setTimeout(() => setCopied(null), 1500)
    } catch {
      // Clipboard may be unavailable (non-secure context); ignore silently.
    }
  }

  const handleDelete = async (id: string) => {
    setBusy(true)
    setDeleteError(null)
    try {
      const res = await fetch(`/admin/api/media/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = (await res.json()) as { error?: string }
        throw new Error(data.error ?? 'Delete failed')
      }
      setDeletingId(null)
      router.refresh()
    } catch (e) {
      setDeleteError(e instanceof Error ? e.message : 'Delete failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-[20px] font-bold text-[var(--foreground)]">Media library</h1>
        <div className="w-44">
          <Select
            id="media-filter"
            label="Filter"
            value={filter}
            options={OWNER_FILTERS}
            onChange={setFilter}
          />
        </div>
      </div>

      {deleteError && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-3 text-[13px] text-red-400">
          {deleteError}
        </div>
      )}

      {rows.length === 0 ? (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-6 py-16 text-center">
          <p className="text-[14px] font-semibold text-[var(--foreground)]">No media uploaded</p>
          <p className="mt-1.5 text-[12px] text-[var(--muted-foreground)]">
            Upload images from a project's edit page. They will appear here in the library.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((m) => (
            <div
              key={m.id}
              className="group overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)]"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-[var(--card)]/60">
                {urls[m.storagePath] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={urls[m.storagePath]}
                    alt={m.alt?.en ?? m.fileName}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center gap-2 bg-black/20 text-[12px] text-[var(--muted-foreground)]">
                    <span className="text-base">🖼</span>
                    <span className="min-w-0 truncate font-mono text-[10px]" title={m.fileName}>
                      {m.fileName}
                    </span>
                  </div>
                )}
                <span className="absolute left-2 top-2 rounded bg-black/60 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-white/90">
                  {m.ownerType}
                </span>
              </div>

              <div className="space-y-2 p-3">
                <div className="truncate text-[13px] font-medium text-[var(--foreground)]">
                  {m.fileName}
                </div>
                <div className="flex items-center gap-2 text-[11px] text-[var(--muted-foreground)]">
                  <span>{formatBytes(m.sizeBytes)}</span>
                  {m.width && m.height ? <span>· {m.width}×{m.height}</span> : null}
                </div>

                <div className="flex items-center gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => handleCopy(m.storagePath)}
                    className={cls.btnGhost + ' px-2.5 py-1 text-[11px]'}
                  >
                    {copied === m.storagePath ? 'Copied' : 'Copy path'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingId(m.id)}
                    className="rounded border border-red-500/30 px-2.5 py-1 text-[11px] text-red-400 hover:bg-red-500/10"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deletingId}
        title="Delete media"
        body={
          deleting?.ownerType === 'project'
            ? 'This permanently removes the metadata and the storage file. If this is a project cover, change the cover first.'
            : 'This permanently removes the metadata and the storage file. This action cannot be undone.'
        }
        confirmLabel="Delete"
        busy={busy}
        onConfirm={() => deletingId && handleDelete(deletingId)}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  )
}