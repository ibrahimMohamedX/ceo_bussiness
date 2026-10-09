'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminTable } from '@/components/admin/AdminTable'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import type { BlogPostRecord } from '@/src/lib/admin/blog'

interface BlogPostsTableClientProps {
  posts: BlogPostRecord[]
}

export default function BlogPostsTableClient({ posts }: BlogPostsTableClientProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    setBusy(true)
    setDeleteError(null)
    try {
      const res = await fetch(`/admin/api/blog/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete blog post')
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
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.13em] text-[var(--primary)]">
            PROJEX Console
          </p>
          <h1 className="text-[22px] font-bold tracking-tight text-[var(--foreground)]">Blog Posts</h1>
        </div>
        <a
          href="/admin/blog/new"
          className="admin-btn-primary inline-flex min-h-[40px] items-center justify-center rounded-lg px-4 text-[13px]"
        >
          New post
        </a>
      </div>

      {deleteError && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-3 text-[13px] text-red-400">
          {deleteError}
        </div>
      )}

      <AdminTable
        columns={[
          { key: 'title', header: 'Title', width: '30%' },
          { key: 'category', header: 'Category', width: '15%' },
          { key: 'status', header: 'Status', width: '15%' },
          { key: 'publishedAt', header: 'Published', width: '15%' },
          { key: 'actions', header: '', width: '25%' },
        ]}
        rows={posts.map((p) => ({
          id: p.id,
          cells: [
            { key: 'title', content: <span className="font-medium">{p.title.en}</span> },
            {
              key: 'category',
              content: (
                <span className="rounded bg-[var(--border)]/40 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--muted-foreground)]">
                  {p.category}
                </span>
              ),
            },
            {
              key: 'status',
              content: (
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    p.status === 'published'
                      ? 'bg-green-500/15 text-green-400'
                      : p.status === 'archived'
                      ? 'bg-gray-500/15 text-gray-400'
                      : 'bg-yellow-500/15 text-yellow-400'
                  }`}
                >
                  {p.status}
                </span>
              ),
            },
            {
              key: 'publishedAt',
              content: p.publishedAt
                ? new Date(p.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })
                : <span className="text-[var(--muted-foreground)]/50">—</span>,
            },
            {
              key: 'actions',
              content: (
                <div className="flex items-center gap-2">
                  <a
                    href={`/admin/blog/${p.id}`}
                    className="rounded border border-[var(--border)] px-2.5 py-1 text-[11px] text-[var(--muted-foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                  >
                    Edit
                  </a>
                  <button
                    type="button"
                    onClick={() => setDeletingId(p.id)}
                    className="rounded border border-red-500/30 px-2.5 py-1 text-[11px] text-red-400 hover:bg-red-500/10"
                  >
                    Delete
                  </button>
                </div>
              ),
            },
          ],
        }))}
      />

      <ConfirmDialog
        open={!!deletingId}
        title="Delete blog post"
        body="This will permanently remove the blog post and all its media. This action cannot be undone."
        confirmLabel="Delete"
        busy={busy}
        onConfirm={() => deletingId && handleDelete(deletingId)}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  )
}




