'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminTable } from '@/components/admin/AdminTable'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import type { InquiryRecord } from '@/src/lib/admin/inquiry'

interface InquiryTableClientProps {
  inquiries: InquiryRecord[]
}

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-500/15 text-blue-400',
  contacted: 'bg-cyan-500/15 text-cyan-400',
  qualified: 'bg-purple-500/15 text-purple-400',
  proposal: 'bg-indigo-500/15 text-indigo-400',
  won: 'bg-green-500/15 text-green-400',
  lost: 'bg-red-500/15 text-red-400',
  spam: 'bg-gray-500/15 text-gray-400',
  archived: 'bg-gray-500/15 text-gray-400',
}

const PRIORITY_COLORS: Record<string, string> = {
  high: 'bg-red-500/15 text-red-400',
  medium: 'bg-yellow-500/15 text-yellow-400',
  low: 'bg-gray-500/15 text-gray-400',
}

function formatDate(iso: string): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

export default function InquiryTableClient({ inquiries }: InquiryTableClientProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    setBusy(true)
    setDeleteError(null)
    try {
      const res = await fetch(`/admin/api/inquiry/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete inquiry')
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
        <h1 className="text-[20px] font-bold text-[var(--foreground)]">Inquiries</h1>
      </div>

      {deleteError && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-3 text-[13px] text-red-400">
          {deleteError}
        </div>
      )}

      <AdminTable
        columns={[
          { key: 'status', header: 'Status', width: '10%' },
          { key: 'priority', header: 'Priority', width: '9%' },
          { key: 'name', header: 'Name', width: '18%' },
          { key: 'company', header: 'Company', width: '14%' },
          { key: 'service', header: 'Service', width: '12%' },
          { key: 'createdAt', header: 'Received', width: '13%' },
          { key: 'assignee', header: 'Assignee', width: '12%' },
          { key: 'actions', header: '', width: '12%' },
        ]}
        rows={inquiries.map((q) => ({
          id: q.id,
          cells: [
            {
              key: 'status',
              content: (
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    STATUS_COLORS[q.status] || 'bg-gray-500/15 text-gray-400'
                  }`}
                >
                  {q.status}
                </span>
              ),
            },
            {
              key: 'priority',
              content: (
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    PRIORITY_COLORS[q.priority] || 'bg-gray-500/15 text-gray-400'
                  }`}
                >
                  {q.priority}
                </span>
              ),
            },
            {
              key: 'name',
              content: <span className="font-medium line-clamp-1">{q.name || '—'}</span>,
            },
            {
              key: 'company',
              content: q.company ? (
                <span className="text-[var(--muted-foreground)] line-clamp-1">{q.company}</span>
              ) : (
                <span className="text-[var(--muted-foreground)]/50">—</span>
              ),
            },
            {
              key: 'service',
              content: <span className="text-[var(--muted-foreground)]">{q.service || '—'}</span>,
            },
            {
              key: 'createdAt',
              content: (
                <span className="font-mono text-[12px] text-[var(--muted-foreground)]">
                  {formatDate(q.createdAt)}
                </span>
              ),
            },
            {
              key: 'assignee',
              content: q.assignedTo ? (
                <span className="text-[var(--muted-foreground)]">{q.assignedTo}</span>
              ) : (
                <span className="text-[var(--muted-foreground)]/50">Unassigned</span>
              ),
            },
            {
              key: 'actions',
              content: (
                <div className="flex items-center gap-2">
                  <a
                    href={`/admin/inquiries/${q.id}`}
                    className="rounded border border-[var(--border)] px-2.5 py-1 text-[11px] text-[var(--muted-foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                  >
                    Open
                  </a>
                  <button
                    type="button"
                    onClick={() => setDeletingId(q.id)}
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
        title="Delete inquiry"
        body="This will permanently remove the inquiry. This action cannot be undone."
        confirmLabel="Delete"
        busy={busy}
        onConfirm={() => deletingId && handleDelete(deletingId)}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  )
}
