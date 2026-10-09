'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminTable } from '@/components/admin/AdminTable'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import type { TestimonialRecord } from '@/src/lib/admin/testimonials'

interface TestimonialsTableClientProps {
  testimonials: TestimonialRecord[]
}

export default function TestimonialsTableClient({ testimonials }: TestimonialsTableClientProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    setBusy(true)
    setDeleteError(null)
    try {
      const res = await fetch(`/admin/api/testimonials/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete testimonial')
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
        <h1 className="text-sm font-semibold tracking-tight text-[var(--foreground)]">Testimonials</h1>
        <a
          href="/admin/testimonials/new"
          className="admin-btn-primary inline-flex h-8 items-center justify-center rounded-lg px-3 text-[13px]"
        >
          New testimonial
        </a>
      </div>

      {deleteError && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-3 text-[13px] text-red-400">
          {deleteError}
        </div>
      )}

      <AdminTable
        columns={[
          { key: 'personName', header: 'Name', width: '22%' },
          { key: 'quote', header: 'Quote', width: '33%' },
          { key: 'status', header: 'Status', width: '12%' },
          { key: 'featured', header: 'Featured', width: '10%' },
          { key: 'sortOrder', header: 'Order', width: '8%' },
          { key: 'actions', header: '', width: '15%' },
        ]}
        rows={testimonials.map((t) => ({
          id: t.id,
          cells: [
            { key: 'personName', content: <span className="font-medium">{t.personName || '—'}</span> },
            { key: 'quote', content: <span className="text-[var(--muted-foreground)] line-clamp-1">{t.quote?.en ?? '—'}</span> },
            {
              key: 'status',
              content: (
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    statusColors[t.status] || 'bg-gray-500/15 text-gray-400'
                  }`}
                >
                  {t.status}
                </span>
              ),
            },
            {
              key: 'featured',
              content: t.featured ? (
                <span className="text-green-400">âœ“</span>
              ) : (
                <span className="text-[var(--muted-foreground)]/50">—</span>
              ),
            },
            { key: 'sortOrder', content: <span className="font-mono text-[12px] text-[var(--muted-foreground)]">{t.sortOrder}</span> },
            {
              key: 'actions',
              content: (
                <div className="flex items-center gap-2">
                  <a
                    href={`/admin/testimonials/${t.id}`}
                    className="rounded border border-[var(--border)] px-2.5 py-1 text-[11px] text-[var(--muted-foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                  >
                    Edit
                  </a>
                  <button
                    type="button"
                    onClick={() => setDeletingId(t.id)}
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
        title="Delete testimonial"
        body="This will permanently remove the testimonial. This action cannot be undone."
        confirmLabel="Delete"
        busy={busy}
        onConfirm={() => deletingId && handleDelete(deletingId)}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  )
}




