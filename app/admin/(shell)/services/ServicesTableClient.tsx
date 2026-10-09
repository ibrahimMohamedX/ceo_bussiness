'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminTable } from '@/components/admin/AdminTable'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import type { ServiceRecord } from '@/src/lib/admin/services'

interface ServicesTableClientProps {
  services: ServiceRecord[]
}

export default function ServicesTableClient({ services }: ServicesTableClientProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    setBusy(true)
    setDeleteError(null)
    try {
      const res = await fetch(`/admin/api/services/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete service')
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
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.13em] text-[var(--primary)]">
            PROJEX Console
          </p>
          <h1 className="text-[22px] font-bold tracking-tight text-[var(--foreground)]">Services</h1>
        </div>
        <a
          href="/admin/services/new"
          className="admin-btn-primary inline-flex min-h-[40px] items-center justify-center rounded-lg px-4 text-[13px]"
        >
          New service
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
          { key: 'slug', header: 'Slug', width: '15%' },
          { key: 'status', header: 'Status', width: '12%' },
          { key: 'featured', header: 'Featured', width: '10%' },
          { key: 'sortOrder', header: 'Order', width: '8%' },
          { key: 'actions', header: '', width: '25%' },
        ]}
        rows={services.map((s) => ({
          id: s.id,
          cells: [
            { key: 'title', content: <span className="font-medium">{s.title.en}</span> },
            { key: 'slug', content: <span className="font-mono text-[12px] text-[var(--muted-foreground)]">{s.slug}</span> },
            {
              key: 'status',
              content: (
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    statusColors[s.status] || 'bg-gray-500/15 text-gray-400'
                  }`}
                >
                  {s.status}
                </span>
              ),
            },
            {
              key: 'featured',
              content: s.featured ? (
                <span className="text-green-400">âœ“</span>
              ) : (
                <span className="text-[var(--muted-foreground)]/50">—</span>
              ),
            },
            { key: 'sortOrder', content: <span className="font-mono text-[12px] text-[var(--muted-foreground)]">{s.sortOrder}</span> },
            {
              key: 'actions',
              content: (
                <div className="flex items-center gap-2">
                  <a
                    href={`/admin/services/${s.id}`}
                    className="rounded border border-[var(--border)] px-2.5 py-1 text-[11px] text-[var(--muted-foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                  >
                    Edit
                  </a>
                  <button
                    type="button"
                    onClick={() => setDeletingId(s.id)}
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
        title="Delete service"
        body="This will permanently remove the service. This action cannot be undone."
        confirmLabel="Delete"
        busy={busy}
        onConfirm={() => deletingId && handleDelete(deletingId)}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  )
}




