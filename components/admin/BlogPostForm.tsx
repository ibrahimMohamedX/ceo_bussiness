'use client'

// Reusable blog post create/edit form. Shared by /admin/blog/new (create mode,
// no existing record is loaded) and /admin/blog/[id] (edit mode, requires a valid
// id). The id is passed explicitly rather than read from useParams(), so the
// component is not bound to a specific route â€” the Finding 1.6 root cause was the
// old dynamic-import of the [id] page, whose useParams().id resolved to undefined
// on /new.

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { MediaUploader } from '@/components/admin/MediaUploader'
import {
  LocalizedTextField,
  TagEditor,
  Select,
  Field,
  cls,
} from '@/components/admin/ui'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import type { BlogPostRecord, BlogPostStatus, BlogPostMedia } from '@/src/lib/admin/blog'

const STATUSES: { value: BlogPostStatus; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
]

export function BlogPostForm({ postId }: { postId: string }) {
  const router = useRouter()

  // After a create POST, the DAL returns the new doc id. We hold it here so the
  // MediaUploader (which needs a real Firestore doc id for the blogPosts/{id}/media
  // subcollection) can bind immediately, without leaving the page.
  const [createdId, setCreatedId] = useState<string | null>(null)

  const isNew = postId === 'new' && !createdId
  // The id to bind media operations to: the route id in edit mode, or the id
  // assigned at create time. Media can only be managed once a doc id exists.
  const effectivePostId = createdId ?? postId

  const [post, setPost] = useState<BlogPostRecord | null>(null)
  const [media, setMedia] = useState<BlogPostMedia[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [coverMediaId, setCoverMediaId] = useState<string | undefined>()
  const [deletingMediaId, setDeletingMediaId] = useState<string | null>(null)
  const [busyMedia, setBusyMedia] = useState(false)

  // Form state
  const [slug, setSlug] = useState('')
  const [title, setTitle] = useState({ en: '', ar: '' })
  const [excerpt, setExcerpt] = useState({ en: '', ar: '' })
  const [content, setContent] = useState<{ en: string; ar: string }>({ en: '', ar: '' })
  const [category, setCategory] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [authorName, setAuthorName] = useState('')
  const [status, setStatus] = useState<BlogPostStatus>('draft')
  const [publishedAt, setPublishedAt] = useState<Date | null>(null)
  const [sortOrder, setSortOrder] = useState(0)
  const [mediaError, setMediaError] = useState<string | null>(null)

  // Load post on edit. During create the effective id is still 'new', so nothing
  // is fetched; once a create POST returns the real doc id we switch to edit mode
  // in place and skip this loader (state is already populated).
  useEffect(() => {
    if (!isNew) {
      loadPost()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectivePostId, isNew])

  const loadPost = async () => {
    setBusy(true)
    try {
      const res = await fetch(`/admin/api/blog/${effectivePostId}`)
      if (!res.ok) throw new Error('Failed to load blog post')
      const data = (await res.json()) as { post: BlogPostRecord }
      const p = data.post
      setPost(p)
      setMedia(p.media)
      setSlug(p.slug)
      setTitle(p.title)
      setExcerpt(p.excerpt)
      setContent({ en: p.content?.en ?? '', ar: p.content?.ar ?? '' })
      setCategory(p.category)
      setTags(p.tags)
      setAuthorName(p.authorName)
      setStatus(p.status)
      setSortOrder(p.sortOrder ?? 0)
      setCoverMediaId(p.coverMediaId)
      if (p.publishedAt) {
        setPublishedAt(new Date(p.publishedAt))
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load')
    } finally {
      setBusy(false)
    }
  }

  const handleMediaChange = async () => {
    const res = await fetch(`/admin/api/blog/${effectivePostId}`)
    if (res.ok) {
      const data = (await res.json()) as { post: BlogPostRecord }
      setMedia(data.post.media)
    }
  }

  const handleSave = async () => {
    if (!slug.trim()) return setError('Slug is required')
    if (!title.en.trim() || !title.ar.trim()) return setError('Title required in both EN and AR')
    if (!excerpt.en.trim() || !excerpt.ar.trim()) return setError('Excerpt required in both EN and AR')
    if (!category.trim()) return setError('Category is required')
    if (!authorName.trim()) return setError('Author name is required')

    setError(null)
    setBusy(true)
    try {
      const input = {
        slug: slug.trim(),
        title: { en: title.en.trim(), ar: title.ar.trim() },
        excerpt: { en: excerpt.en.trim(), ar: excerpt.ar.trim() },
        content: {
          en: content.en.trim() || undefined,
          ar: content.ar.trim() || undefined,
        },
        category: category.trim(),
        tags: tags.map((t) => t.trim()).filter(Boolean),
        authorName: authorName.trim(),
        status,
        coverMediaId,
        sortOrder,
        publishedAt: status === 'published' ? (publishedAt ?? new Date()) : null,
      }

      const url = isNew ? '/admin/api/blog' : `/admin/api/blog/${effectivePostId}`
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
        // POST returns { post } with the new doc id. Stay on the page and switch
        // into edit mode so the MediaUploader can be used immediately.
        const data = (await res.json()) as { post?: BlogPostRecord }
        if (data.post?.id) {
          setPost(data.post)
          setCreatedId(data.post.id)
          return
        }
      }
      router.push('/admin/blog')
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
      const res = await fetch(`/admin/api/blog/${effectivePostId}/media/${mediaId}`, { method: 'DELETE' })
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
      const res = await fetch(`/admin/api/blog/${effectivePostId}/media/reorder`, {
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

  if (busy && !post && !isNew) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--primary)] border-t-transparent" />
      </div>
    )
  }

  if (error && !isNew && !post) {
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
          {isNew ? 'New blog post' : 'Edit blog post'}
        </h1>
        {!isNew && (
          <a
            href="/admin/blog"
            className="rounded border border-[var(--border)] px-3 py-1.5 text-[12px] text-[var(--muted-foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
          >
            â† Back
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
            <Field label="Slug" htmlFor="slug" hint="URL-safe identifier (e.g. getting-started-nextjs)">
              <input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className={cls.input}
                placeholder="post-slug"
                required
              />
            </Field>
            <Field label="Category" htmlFor="category" hint="e.g. Engineering, Design, Company News">
              <input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={cls.input}
                placeholder="Category"
                required
              />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Author name" htmlFor="authorName">
              <input
                id="authorName"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className={cls.input}
                placeholder="Author name"
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
            <Field label="Published at" htmlFor="publishedAt" hint="Only used when status is Published">
              <input
                id="publishedAt"
                type="datetime-local"
                value={publishedAt ? publishedAt.toISOString().slice(0, 16) : ''}
                onChange={(e) => setPublishedAt(e.target.value ? new Date(e.target.value) : null)}
                className={cls.input}
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
          <legend className={cls.legend}>Excerpt</legend>
          <LocalizedTextField
            id="excerpt"
            label="Excerpt"
            en={excerpt.en}
            ar={excerpt.ar}
            dir="ltr"
            onChange={setExcerpt}
            required
            area
          />
        </fieldset>

        <fieldset className={cls.fieldset}>
          <legend className={cls.legend}>Content</legend>
          <LocalizedTextField
            id="content"
            label="Content"
            en={content.en}
            ar={content.ar}
            dir="ltr"
            onChange={setContent}
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
              ownerType="blog"
              ownerId={effectivePostId}
              media={media}
              onChanged={handleMediaChange}
              onReorder={handleReorder}
              onDelete={setDeletingMediaId}
            />
          </fieldset>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)]">
          <a
            href="/admin/blog"
            className={cls.btnGhost}
          >
            Cancel
          </a>
          <button type="submit" className={cls.btnPrimary} disabled={busy}>
            {busy ? 'Savingâ€¦' : isNew ? 'Create post' : 'Save changes'}
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




