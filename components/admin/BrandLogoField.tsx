'use client'

// Single-image logo field for the siteSettings/global brand block.
//
// Deliberately NOT MediaUploader: that component is a gallery manager (grid,
// reorder, kind labels) whose ownerId must be a real project/blog doc id and
// whose local MediaOwnerType union excludes settings. This is one file, one
// value, one preview.
//
// Upload is two steps, mirroring the project/blog flow:
//   1. POST the bytes to /admin/api/media/upload (Cloudinary key/secret stay
//      server-side) with ownerType 'settings' -> folder media/settings/global.
//   2. Hold the returned identity in form state; the Settings save PATCHes it to
//      /admin/api/settings, which is what actually writes Firestore.

import { useRef, useState } from 'react'

import { cloudinaryUrl } from '@/src/lib/cloudinary/url'
import { cls } from './ui'

const ACCEPTED_MIME = /^image\/(png|jpe?g|webp|gif|avif|svg\+xml)$/i
const MAX_FILE_BYTES = 25 * 1024 * 1024

/** The Cloudinary identity of the selected logo, or null when none is set. */
export interface BrandLogoValue {
  publicId: string
  resourceType: 'image' | 'video'
}

export function BrandLogoField({
  value,
  onChange,
}: {
  value: BrandLogoValue | null
  onChange: (next: BrandLogoValue | null) => void
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const previewUrl = value ? cloudinaryUrl(value.publicId, value.resourceType) : ''

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
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('ownerType', 'settings')
      // Fixed owner id: the settings singleton has exactly one logo.
      form.append('ownerId', 'global')

      const res = await fetch('/admin/api/media/upload', { method: 'POST', body: form })
      if (!res.ok) {
        const data = (await res.json()) as { error?: string }
        throw new Error(data.error ?? 'Upload failed.')
      }
      const uploaded = (await res.json()) as {
        publicId: string
        resourceType: 'image' | 'video'
      }
      onChange({ publicId: uploaded.publicId, resourceType: uploaded.resourceType })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed.')
    } finally {
      setBusy(false)
      // Allow re-selecting the same file after a failure.
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  return (
    <div className="space-y-2">
      <span className={cls.label}>Brand logo</span>

      <div className="flex items-center gap-4">
        <div className="flex h-16 w-40 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--card)]">
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewUrl} alt="Current brand logo" className="max-h-14 max-w-36 object-contain" />
          ) : (
            <span className="text-[11px] text-[var(--muted-foreground)]">No logo set</span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) void upload(file)
            }}
          />
          <button
            type="button"
            className={cls.btnGhost + ' px-3 py-1.5 text-[12px]'}
            disabled={busy}
            onClick={() => fileRef.current?.click()}
          >
            {busy ? 'Uploading…' : value ? 'Replace logo' : 'Upload logo'}
          </button>
          {value ? (
            <button
              type="button"
              className="text-left text-[11px] text-[var(--muted-foreground)] underline hover:text-[var(--foreground)]"
              disabled={busy}
              onClick={() => onChange(null)}
            >
              Remove logo
            </button>
          ) : null}
        </div>
      </div>

      <p className="text-[11px] text-[var(--muted-foreground)]/80">
        Shown in the navbar. Leave empty to use the default mark.
      </p>
      {error ? <p className="text-[11px] text-red-400">{error}</p> : null}
    </div>
  )
}
