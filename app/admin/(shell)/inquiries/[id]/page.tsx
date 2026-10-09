'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Field, Select, cls } from '@/components/admin/ui'
import type {
  InquiryPriority,
  InquiryRecord,
  InquiryStatus,
} from '@/src/lib/admin/inquiry'

const STATUSES: { value: InquiryStatus; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'proposal', label: 'Proposal' },
  { value: 'won', label: 'Won' },
  { value: 'lost', label: 'Lost' },
  { value: 'spam', label: 'Spam' },
  { value: 'archived', label: 'Archived' },
]

const PRIORITIES: { value: InquiryPriority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
]

function formatDateTime(iso?: string): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function InquiryEditPage() {
  const router = useRouter()
  const params = useParams()
  const inquiryId = params.id as string

  const [inquiry, setInquiry] = useState<InquiryRecord | null>(null)
  const [busy, setBusy] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Editable state
  const [status, setStatus] = useState<InquiryStatus>('new')
  const [priority, setPriority] = useState<InquiryPriority>('medium')
  const [assignedTo, setAssignedTo] = useState('')
  const [internalNotes, setInternalNotes] = useState('')

  useEffect(() => {
    loadInquiry()
  }, [inquiryId])

  const loadInquiry = async () => {
    setBusy(true)
    try {
      const res = await fetch(`/admin/api/inquiry/${inquiryId}`)
      if (!res.ok) throw new Error('Failed to load inquiry')
      const data = (await res.json()) as { inquiry: InquiryRecord }
      const q = data.inquiry
      setInquiry(q)
      setStatus(q.status)
      setPriority(q.priority)
      setAssignedTo(q.assignedTo ?? '')
      setInternalNotes(q.internalNotes ?? '')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load')
    } finally {
      setBusy(false)
    }
  }

  const handleSave = async () => {
    setError(null)
    setSaving(true)
    try {
      const input = {
        status,
        priority,
        assignedTo: assignedTo.trim() || undefined,
        internalNotes: internalNotes.trim() || undefined,
      }

      const res = await fetch(`/admin/api/inquiry/${inquiryId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      if (!res.ok) {
        const data = (await res.json()) as { error?: string }
        throw new Error(data.error ?? 'Save failed')
      }
      router.push('/admin/inquiries')
      router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (busy && !inquiry) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--primary)] border-t-transparent" />
      </div>
    )
  }

  if (error && !inquiry) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-6 text-red-400">
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.13em] text-[var(--primary)]">
            PROJEX Console
          </p>
          <h1 className="text-[22px] font-bold tracking-tight text-[var(--foreground)]">
            Inquiry from {inquiry?.name || '…'}
          </h1>
        </div>
        <a
          href="/admin/inquiries"
          className="rounded border border-[var(--border)] px-3 py-1.5 text-[12px] text-[var(--muted-foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
        >
          ← Back
        </a>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-3 text-[13px] text-red-400">
          {error}
        </div>
      )}

      {/* Read-only contact details */}
      <fieldset className={cls.fieldset}>
        <legend className={cls.legend}>Contact</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name" htmlFor="view-name">
            <div id="view-name" className="text-[13px] text-[var(--foreground)]">
              {inquiry?.name || '—'}
            </div>
          </Field>
          <Field label="Company" htmlFor="view-company">
            <div id="view-company" className="text-[13px] text-[var(--foreground)]">
              {inquiry?.company || '—'}
            </div>
          </Field>
          <Field label="Email" htmlFor="view-email">
            <a
              id="view-email"
              href={inquiry?.email ? `mailto:${inquiry.email}` : undefined}
              className="text-[13px] text-[var(--primary)] hover:underline"
            >
              {inquiry?.email || '—'}
            </a>
          </Field>
          <Field label="Phone" htmlFor="view-phone">
            <div id="view-phone" className="text-[13px] text-[var(--foreground)]">
              {inquiry?.phone || '—'}
            </div>
          </Field>
          <Field label="Service" htmlFor="view-service">
            <div id="view-service" className="text-[13px] text-[var(--foreground)]">
              {inquiry?.service || '—'}
            </div>
          </Field>
          <Field label="Project type" htmlFor="view-projectType">
            <div id="view-projectType" className="text-[13px] text-[var(--foreground)]">
              {inquiry?.projectType || '—'}
            </div>
          </Field>
          <Field label="Budget" htmlFor="view-budget">
            <div id="view-budget" className="text-[13px] text-[var(--foreground)]">
              {inquiry?.budget || '—'}
            </div>
          </Field>
          <Field label="Locale" htmlFor="view-locale">
            <div id="view-locale" className="font-mono text-[13px] text-[var(--foreground)]">
              {inquiry?.locale || '—'}
            </div>
          </Field>
        </div>
      </fieldset>

      {/* Message */}
      <fieldset className={cls.fieldset}>
        <legend className={cls.legend}>Message</legend>
        <p className="whitespace-pre-wrap text-[13px] leading-relaxed text-[var(--foreground)]">
          {inquiry?.message || '—'}
        </p>
        <div className="pt-2 text-[11px] text-[var(--muted-foreground)]">
          Received {formatDateTime(inquiry?.createdAt)}
          {inquiry?.sourcePath ? ` · ${inquiry.sourcePath}` : ''}
        </div>
      </fieldset>

      {/* Workflow */}
      <fieldset className={cls.fieldset}>
        <legend className={cls.legend}>Workflow</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Select id="status" label="Status" value={status} options={STATUSES} onChange={setStatus} />
          <Select
            id="priority"
            label="Priority"
            value={priority}
            options={PRIORITIES}
            onChange={setPriority}
          />
          <Field label="Assignee" htmlFor="assignedTo" hint="Admin email or display name">
            <input
              id="assignedTo"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className={cls.input}
              placeholder="Unassigned"
            />
          </Field>
        </div>
        <Field label="Internal notes" htmlFor="internalNotes" hint="Not visible to the submitter">
          <textarea
            id="internalNotes"
            value={internalNotes}
            onChange={(e) => setInternalNotes(e.target.value)}
            className={`${cls.input} min-h-[100px] resize-y`}
            placeholder="Add context, next steps, or outcomes…"
          />
        </Field>
        {inquiry?.lastContactedAt ? (
          <div className="text-[11px] text-[var(--muted-foreground)]">
            Last contacted {formatDateTime(inquiry.lastContactedAt)}
          </div>
        ) : null}
      </fieldset>

      <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)]">
        <a href="/admin/inquiries" className={cls.btnGhost}>
          Cancel
        </a>
        <button type="button" className={cls.btnPrimary} disabled={saving} onClick={handleSave}>
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </div>
  )
}