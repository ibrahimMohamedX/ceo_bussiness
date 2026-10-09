'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminTable } from '@/components/admin/AdminTable'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import type { FaqRecord } from '@/src/lib/admin/faq'

interface FaqTableClientProps {
  faqs: FaqRecord[]
}

export default function FaqTableClient({ faqs }: FaqTableClientProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    setBusy(true)
    setDeleteError(null)
    try {
      const res = await fetch(`/admin/api/faq/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete FAQ')
      setDeletingId(null)
      router.refresh()
    } catch (e) {
      setDeleteError(e instanceof Error ? e.message : 'Delete failed')
    } finally {
      setBusy(false)
    }
  }

  const statusColors: Record<string, string> = {
    published: 'bg-green-500/15 text-green-400',
    draft: 'bg-yellow-500/15 text-yellow-400',
    archived: 'bg-gray-500/15 text-gray-400',
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-sm font-semibold tracking-tight text-[var(--foreground)]">FAQ</h1>
        <a
          href="/admin/faq/new"
          className="admin-btn-primary inline-flex h-8 items-center justify-center rounded-lg px-3 text-[13px]"
        >
          New FAQ
        </a>
      </div>

      {deleteError && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-3 text-[13px] text-red-400">
          {deleteError}
        </div>
      )}

      <AdminTable
        columns={[
          { key: 'question', header: 'Question', width: '33%' },
          { key: 'category', header: 'Category', width: '15%' },
          { key: 'status', header: 'Status', width: '12%' },
          { key: 'sortOrder', header: 'Order', width: '8%' },
          { key: 'actions', header: '', width: '15%' },
        ]}
        rows={faqs.map((f) => ({
          id: f.id,
          cells: [
            { key: 'question', content: <span className="font-medium line-clamp-1">{f.question?.en ?? '—'}</span> },
            {
              key: 'category',
              content: f.category ? (
                <span className="text-[var(--muted-foreground)]">{f.category}</span>
              ) : (
                <span className="text-[var(--muted-foreground)]/50">—</span>
              ),
            },
            {
              key: 'status',
              content: (
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    statusColors[f.status] || 'bg-gray-500/15 text-gray-400'
                  }`}
                >
                  {f.status}
                </span>
              ),
            },
            { key: 'sortOrder', content: <span className="font-mono text-[12px] text-[var(--muted-foreground)]">{f.sortOrder}</span> },
            {
              key: 'actions',
              content: (
                <div className="flex items-center gap-2">
                  <a
                    href={`/admin/faq/${f.id}`}
                    className="rounded border border-[var(--border)] px-2.5 py-1 text-[11px] text-[var(--muted-foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                  >
                    Edit
                  </a>
                  <button
                    type="button"
                    onClick={() => setDeletingId(f.id)}
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
        title="Delete FAQ"
        body="This will permanently remove the FAQ entry. This action cannot be undone."
        confirmLabel="Delete"
        busy={busy}
        onConfirm={() => deletingId && handleDelete(deletingId)}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  )
}





