'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import {
  LocalizedTextField,
  Select,
  Toggle,
  Field,
  cls,
} from '@/components/admin/ui'
import type { TestimonialRecord, TestimonialStatus } from '@/src/lib/admin/testimonials'

const STATUSES: { value: TestimonialStatus; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
]

interface TestimonialFormProps {
  testimonialId?: string
}

export default function TestimonialForm({ testimonialId }: TestimonialFormProps) {
  const router = useRouter()
  const params = useParams()
  const id = testimonialId ?? (params.id as string)
  const isNew = id === 'new'

  const [testimonial, setTestimonial] = useState<TestimonialRecord | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [quote, setQuote] = useState({ en: '', ar: '' })
  const [personName, setPersonName] = useState('')
  const [role, setRole] = useState<{ en: string; ar: string }>({ en: '', ar: '' })
  const [company, setCompany] = useState('')
  const [avatarMediaId, setAvatarMediaId] = useState('')
  const [featured, setFeatured] = useState(false)
  const [status, setStatus] = useState<TestimonialStatus>('draft')
  const [sortOrder, setSortOrder] = useState(0)

  // Load testimonial on edit
  useEffect(() => {
    if (!isNew) {
      loadTestimonial()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isNew])

  const loadTestimonial = async () => {
    setBusy(true)
    try {
      const res = await fetch(`/admin/api/testimonials/${id}`)
      if (!res.ok) throw new Error('Failed to load testimonial')
      const data = (await res.json()) as { testimonial: TestimonialRecord }
      const t = data.testimonial
      setTestimonial(t)
      setQuote(t.quote)
      setPersonName(t.personName ?? '')
      setRole({ en: t.role?.en ?? '', ar: t.role?.ar ?? '' })
      setCompany(t.company ?? '')
      setAvatarMediaId(t.avatarMediaId ?? '')
      setFeatured(t.featured)
      setStatus(t.status)
      setSortOrder(t.sortOrder)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load')
    } finally {
      setBusy(false)
    }
  }

  const handleSave = async () => {
    if (!quote.en.trim() || !quote.ar.trim()) return setError('Quote required in both EN and AR')

    setError(null)
    setBusy(true)
    try {
      const input = {
        quote: { en: quote.en.trim(), ar: quote.ar.trim() },
        personName: personName.trim() || undefined,
        role: {
          en: role.en.trim() || undefined,
          ar: role.ar.trim() || undefined,
        },
        company: company.trim() || undefined,
        avatarMediaId: avatarMediaId.trim() || undefined,
        featured,
        status,
        sortOrder,
      }

      const url = isNew ? '/admin/api/testimonials' : `/admin/api/testimonials/${id}`
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
      router.push('/admin/testimonials')
      router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed')
    } finally {
      setBusy(false)
    }
  }

  if (busy && !testimonial && !isNew) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--primary)] border-t-transparent" />
      </div>
    )
  }

  if (error && !isNew && !testimonial) {
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
          {isNew ? 'New testimonial' : 'Edit testimonial'}
        </h1>
        {!isNew && (
          <a
            href="/admin/testimonials"
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
          <legend className={cls.legend}>Quote</legend>
          <LocalizedTextField
            id="quote"
            label="Quote"
            en={quote.en}
            ar={quote.ar}
            dir="ltr"
            onChange={setQuote}
            required
            area
          />
        </fieldset>

        <fieldset className={cls.fieldset}>
          <legend className={cls.legend}>Author</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Person name" htmlFor="personName">
              <input
                id="personName"
                value={personName}
                onChange={(e) => setPersonName(e.target.value)}
                className={cls.input}
                placeholder="Jane Doe"
              />
            </Field>
            <Field label="Company" htmlFor="company">
              <input
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className={cls.input}
                placeholder="Acme Inc."
              />
            </Field>
          </div>
          <LocalizedTextField
            id="role"
            label="Role"
            en={role.en}
            ar={role.ar}
            dir="ltr"
            onChange={setRole}
          />
        </fieldset>

        <fieldset className={cls.fieldset}>
          <legend className={cls.legend}>Options</legend>
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
                onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
                className={cls.input}
              />
            </Field>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <Field label="Featured" htmlFor="featured" hint="Show on homepage featured testimonials">
              <Toggle id="featured" label="" checked={featured} onChange={setFeatured} />
            </Field>
          </div>
        </fieldset>

        <fieldset className={cls.fieldset}>
          <legend className={cls.legend}>Media</legend>
          <Field label="Avatar media ID" htmlFor="avatarMediaId" hint="Firebase Storage media ID (optional)">
            <input
              id="avatarMediaId"
              value={avatarMediaId}
              onChange={(e) => setAvatarMediaId(e.target.value)}
              className={cls.input}
              placeholder="media-id"
            />
          </Field>
        </fieldset>

        <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)]">
          <a
            href="/admin/testimonials"
            className={cls.btnGhost}
          >
            Cancel
          </a>
          <button type="submit" className={cls.btnPrimary} disabled={busy}>
            {busy ? 'Saving…' : isNew ? 'Create testimonial' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  )
}