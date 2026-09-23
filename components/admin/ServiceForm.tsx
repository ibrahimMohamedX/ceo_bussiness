'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import {
  LocalizedTextField,
  TagEditor,
  Select,
  Toggle,
  Field,
  cls,
} from '@/components/admin/ui'
import type { ServiceRecord, ServiceStatus } from '@/src/lib/admin/services'

const STATUSES: { value: ServiceStatus; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
]

interface ServiceFormProps {
  serviceId?: string
}

export default function ServiceForm({ serviceId }: ServiceFormProps) {
  const router = useRouter()
  const params = useParams()
  const id = serviceId ?? (params.id as string)
  const isNew = id === 'new'

  const [service, setService] = useState<ServiceRecord | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [slug, setSlug] = useState('')
  const [title, setTitle] = useState({ en: '', ar: '' })
  const [summary, setSummary] = useState({ en: '', ar: '' })
  const [description, setDescription] = useState<{ en: string; ar: string }>({ en: '', ar: '' })
  const [tags, setTags] = useState<string[]>([])
  const [icon, setIcon] = useState('')
  const [featured, setFeatured] = useState(false)
  const [status, setStatus] = useState<ServiceStatus>('draft')
  const [sortOrder, setSortOrder] = useState(0)

  // Load service on edit
  useEffect(() => {
    if (!isNew) {
      loadService()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isNew])

  const loadService = async () => {
    setBusy(true)
    try {
      const res = await fetch(`/admin/api/services/${id}`)
      if (!res.ok) throw new Error('Failed to load service')
      const data = (await res.json()) as { service: ServiceRecord }
      const s = data.service
      setService(s)
      setSlug(s.slug)
      setTitle(s.title)
      setSummary(s.summary)
      setDescription({ en: s.description?.en ?? '', ar: s.description?.ar ?? '' })
      setTags(s.tags ?? [])
      setIcon(s.icon ?? '')
      setFeatured(s.featured)
      setStatus(s.status)
      setSortOrder(s.sortOrder)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load')
    } finally {
      setBusy(false)
    }
  }

  const handleSave = async () => {
    if (!slug.trim()) return setError('Slug is required')
    if (!title.en.trim() || !title.ar.trim()) return setError('Title required in both EN and AR')
    if (!summary.en.trim() || !summary.ar.trim()) return setError('Summary required in both EN and AR')

    setError(null)
    setBusy(true)
    try {
      const input = {
        slug: slug.trim(),
        title: { en: title.en.trim(), ar: title.ar.trim() },
        summary: { en: summary.en.trim(), ar: summary.ar.trim() },
        description: {
          en: description.en.trim() || undefined,
          ar: description.ar.trim() || undefined,
        },
        tags: tags.map((t) => t.trim()).filter(Boolean),
        icon: icon.trim() || undefined,
        featured,
        status,
        sortOrder,
      }

      const url = isNew ? '/admin/api/services' : `/admin/api/services/${id}`
      const method = isNew ? 'POST' : 'PATCH'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      if (!res.ok) {
        const data = (await res.json()) as { error?: string }
        throw new Error(data.error ?? 'Save failed')
      }
      router.push('/admin/services')
      router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed')
    } finally {
      setBusy(false)
    }
  }

  if (busy && !service && !isNew) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--primary)] border-t-transparent" />
      </div>
    )
  }

  if (error && !isNew && !service) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-6 text-red-400">
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-[20px] font-bold text-[var(--foreground)]">
          {isNew ? 'New service' : 'Edit service'}
        </h1>
        {!isNew && (
          <a
            href="/admin/services"
            className="rounded border border-[var(--border)] px-3 py-1.5 text-[12px] text-[var(--muted-foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
          >
            ← Back
          </a>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-3 text-[13px] text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={(e) => { e.preventDefault(); handleSave() }} className="space-y-6">
        <fieldset className={cls.fieldset}>
          <legend className={cls.legend}>Basic info</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Slug" htmlFor="slug" hint="URL-safe identifier (e.g. custom-software)">
              <input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className={cls.input}
                placeholder="service-slug"
                required
              />
            </Field>
            <Field label="Status" htmlFor="status">
              <Select
                id="status"
                label=""
                value={status}
                options={STATUSES}
                onChange={setStatus}
              />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Sort order" htmlFor="sortOrder">
              <input
                id="sortOrder"
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
                className={cls.input}
              />
            </Field>
            <Field label="Icon" htmlFor="icon" hint="Lucide icon name (e.g. Code2, Cpu, Brain)">
              <input
                id="icon"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className={cls.input}
                placeholder="Code2"
              />
            </Field>
          </div>
        </fieldset>

        <fieldset className={cls.fieldset}>
          <legend className={cls.legend}>Title</legend>
          <LocalizedTextField
            id="title"
            label="Title"
            en={title.en}
            ar={title.ar}
            dir="ltr"
            onChange={setTitle}
            required
          />
        </fieldset>

        <fieldset className={cls.fieldset}>
          <legend className={cls.legend}>Summary</legend>
          <LocalizedTextField
            id="summary"
            label="Summary"
            en={summary.en}
            ar={summary.ar}
            dir="ltr"
            onChange={setSummary}
            required
            area
          />
        </fieldset>

        <fieldset className={cls.fieldset}>
          <legend className={cls.legend}>Description</legend>
          <LocalizedTextField
            id="description"
            label="Description"
            en={description.en}
            ar={description.ar}
            dir="ltr"
            onChange={setDescription}
            area
          />
        </fieldset>

        <fieldset className={cls.fieldset}>
          <legend className={cls.legend}>Tags</legend>
          <TagEditor
            id="tags"
            label="Tags"
            values={tags}
            onChange={setTags}
          />
        </fieldset>

        <fieldset className={cls.fieldset}>
          <legend className={cls.legend}>Options</legend>
          <div className="flex flex-wrap items-center gap-6">
            <Field label="Featured" htmlFor="featured" hint="Show on homepage featured section">
              <Toggle id="featured" label="" checked={featured} onChange={setFeatured} />
            </Field>
          </div>
        </fieldset>

        <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)]">
          <a
            href="/admin/services"
            className={cls.btnGhost}
          >
            Cancel
          </a>
          <button type="submit" className={cls.btnPrimary} disabled={busy}>
            {busy ? 'Saving…' : isNew ? 'Create service' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  )
}