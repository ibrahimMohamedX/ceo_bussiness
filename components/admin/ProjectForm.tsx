'use client'

// Reusable project create/edit form. Shared by /admin/projects/new (create mode,
// no existing record is loaded) and /admin/projects/[id] (edit mode, requires a
// valid id). The id is passed explicitly rather than read from useParams(), so the
// component is not bound to a specific route — the Finding 1.6 root cause was the
// old dynamic-import of the [id] page, whose useParams().id resolved to undefined
// on /new.

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { MediaUploader } from '@/components/admin/MediaUploader'
import {
  LocalizedTextField,
  TagEditor,
  Select,
  Toggle,
  Field,
  cls,
} from '@/components/admin/ui'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import type { ProjectRecord, ProjectStatus, ProjectCategory, ProjectMedia } from '@/src/lib/admin/projects'

const CATEGORIES: { value: ProjectCategory; label: string }[] = [
  { value: 'software', label: 'Software' },
  { value: 'embedded', label: 'Embedded' },
  { value: 'ai', label: 'AI / ML' },
  { value: 'hybrid', label: 'Hybrid' },
]

const STATUSES: { value: ProjectStatus; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
]

export function ProjectForm({ projectId }: { projectId: string }) {
  const router = useRouter()

  // After a create POST, the DAL returns the new doc id. We hold it here so the
  // MediaUploader (which needs a real Firestore doc id for the projects/{id}/media
  // subcollection) can bind immediately, without leaving the page.
  const [createdId, setCreatedId] = useState<string | null>(null)

  const isNew = projectId === 'new' && !createdId
  // The id to bind media operations to: the route id in edit mode, or the id
  // assigned at create time. Media can only be managed once a doc id exists.
  const effectiveProjectId = createdId ?? projectId

  const [project, setProject] = useState<ProjectRecord | null>(null)
  const [media, setMedia] = useState<ProjectMedia[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [coverMediaId, setCoverMediaId] = useState<string | undefined>()
  const [deletingMediaId, setDeletingMediaId] = useState<string | null>(null)
  const [busyMedia, setBusyMedia] = useState(false)

  // Form state
  const [slug, setSlug] = useState('')
  const [title, setTitle] = useState({ en: '', ar: '' })
  const [summary, setSummary] = useState({ en: '', ar: '' })
  const [description, setDescription] = useState<{ en: string; ar: string }>({ en: '', ar: '' })
  const [category, setCategory] = useState<ProjectCategory>('software')
  const [technologies, setTechnologies] = useState<string[]>([])
  const [industries, setIndustries] = useState<string[]>([])
  const [featured, setFeatured] = useState(false)
  const [status, setStatus] = useState<ProjectStatus>('draft')
  const [sortOrder, setSortOrder] = useState(0)
  const [mediaError, setMediaError] = useState<string | null>(null)

  // Load project on edit. During create the effective id is still 'new', so
  // nothing is fetched; once a create POST returns the real doc id we switch to
  // edit mode in place and skip this loader (state is already populated).
  useEffect(() => {
    if (!isNew) {
      loadProject()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveProjectId, isNew])

  const loadProject = async () => {
    setBusy(true)
    try {
      const res = await fetch(`/admin/api/projects/${effectiveProjectId}`)
      if (!res.ok) throw new Error('Failed to load project')
      const data = (await res.json()) as { project: ProjectRecord }
      const p = data.project
      setProject(p)
      setMedia(p.media)
      setSlug(p.slug)
      setTitle(p.title)
      setSummary(p.summary)
      setDescription({ en: p.description?.en ?? '', ar: p.description?.ar ?? '' })
      setCategory(p.category)
      setTechnologies(p.technologies)
      setIndustries(p.industries)
      setFeatured(p.featured)
      setStatus(p.status)
      setSortOrder(p.sortOrder ?? 0)
      setCoverMediaId(p.coverMediaId)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load')
    } finally {
      setBusy(false)
    }
  }

  const handleMediaChange = async () => {
    const res = await fetch(`/admin/api/projects/${effectiveProjectId}`)
    if (res.ok) {
      const data = (await res.json()) as { project: ProjectRecord }
      setMedia(data.project.media)
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
        category,
        technologies: technologies.map((t) => t.trim()).filter(Boolean),
        industries: industries.map((t) => t.trim()).filter(Boolean),
        featured,
        status,
        coverMediaId,
        sortOrder,
      }

      const url = isNew ? '/admin/api/projects' : `/admin/api/projects/${effectiveProjectId}`
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
      if (isNew) {
        // POST returns { project } with the new doc id. Stay on the page and
        // switch into edit mode so the MediaUploader can be used immediately.
        const data = (await res.json()) as { project?: ProjectRecord }
        if (data.project?.id) {
          setProject(data.project)
          setCreatedId(data.project.id)
          return
        }
      }
      router.push('/admin/projects')
      router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed')
    } finally {
      setBusy(false)
    }
  }

  const handleMediaDelete = async (mediaId: string) => {
    setBusyMedia(true)
    setMediaError(null)
    try {
      const res = await fetch(`/admin/api/projects/${effectiveProjectId}/media/${mediaId}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = (await res.json()) as { error?: string }
        throw new Error(data.error ?? 'Failed to delete media')
      }
      await handleMediaChange()
    } catch (e) {
      setMediaError(e instanceof Error ? e.message : 'Delete failed')
    } finally {
      setBusyMedia(false)
      setDeletingMediaId(null)
    }
  }

  const handleReorder = async (orderedIds: string[]) => {
    setMediaError(null)
    try {
      const res = await fetch(`/admin/api/projects/${effectiveProjectId}/media/reorder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedMediaIds: orderedIds }),
      })
      if (!res.ok) throw new Error('Reorder failed')
      await handleMediaChange()
    } catch (e) {
      setMediaError(e instanceof Error ? e.message : 'Reorder failed')
    }
  }

  if (busy && !project && !isNew) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--primary)] border-t-transparent" />
      </div>
    )
  }

  if (error && !isNew && !project) {
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
          {isNew ? 'New project' : 'Edit project'}
        </h1>
        {!isNew && (
          <a
            href="/admin/projects"
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

      {mediaError && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-3 text-[13px] text-red-400">
          {mediaError}
        </div>
      )}

      <form onSubmit={(e) => { e.preventDefault(); handleSave() }} className="space-y-6">
        <fieldset className={cls.fieldset}>
          <legend className={cls.legend}>Basic info</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Slug" htmlFor="slug" hint="URL-safe identifier (e.g. smart-home-controller)">
              <input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className={cls.input}
                placeholder="project-slug"
                required
              />
            </Field>
            <Field label="Category" htmlFor="category">
              <Select
                id="category"
                label=""
                value={category}
                options={CATEGORIES}
                onChange={setCategory}
              />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Status" htmlFor="status">
              <Select
                id="status"
                label=""
                value={status}
                options={STATUSES}
                onChange={setStatus}
              />
            </Field>
            <Field label="Sort order" htmlFor="sortOrder">
              <input
                id="sortOrder"
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value) || 0)}
                className={cls.input}
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
          <legend className={cls.legend}>Technologies</legend>
          <TagEditor
            id="technologies"
            label="Technologies"
            values={technologies}
            onChange={setTechnologies}
          />
        </fieldset>

        <fieldset className={cls.fieldset}>
          <legend className={cls.legend}>Industries</legend>
          <TagEditor
            id="industries"
            label="Industries"
            values={industries}
            onChange={setIndustries}
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

        {!isNew && (
          <fieldset className={cls.fieldset}>
            <legend className={cls.legend}>Media</legend>
            {media.length > 0 && (
              <div className="space-y-1">
                <span className={cls.label}>Cover image</span>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {media
                    .slice()
                    .sort((a, b) => a.sortOrder - b.sortOrder)
                    .map((m) => (
                      <label
                        key={m.id}
                        className={[
                          'flex cursor-pointer items-center gap-2 rounded-lg border p-2 text-[12px] transition-colors',
                          coverMediaId === m.id
                            ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--foreground)]'
                            : 'border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] hover:border-[var(--primary)]/50',
                        ].join(' ')}
                      >
                        <input
                          type="radio"
                          name="coverMedia"
                          checked={coverMediaId === m.id}
                          onChange={() => setCoverMediaId(m.id)}
                          className="accent-[var(--primary)]"
                        />
                        <span className="min-w-0 flex-1 truncate font-mono text-[10px]">
                          {m.fileName ?? m.id}
                        </span>
                      </label>
                    ))}
                </div>
                {coverMediaId && (
                  <button
                    type="button"
                    onClick={() => setCoverMediaId(undefined)}
                    className="text-[11px] text-[var(--muted-foreground)] underline hover:text-[var(--foreground)]"
                  >
                    Clear cover
                  </button>
                )}
              </div>
            )}
            <MediaUploader
              ownerType="project"
              ownerId={effectiveProjectId}
              media={media}
              onChanged={handleMediaChange}
              onReorder={handleReorder}
              onDelete={setDeletingMediaId}
            />
          </fieldset>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)]">
          <a
            href="/admin/projects"
            className={cls.btnGhost}
          >
            Cancel
          </a>
          <button type="submit" className={cls.btnPrimary} disabled={busy}>
            {busy ? 'Saving…' : isNew ? 'Create project' : 'Save changes'}
          </button>
        </div>
      </form>

      <ConfirmDialog
        open={!!deletingMediaId}
        title="Delete media"
        body="This will permanently remove the media item and its storage file. This action cannot be undone."
        confirmLabel="Delete"
        busy={busyMedia}
        onConfirm={() => deletingMediaId && handleMediaDelete(deletingMediaId)}
        onCancel={() => setDeletingMediaId(null)}
      />
    </div>
  )
}