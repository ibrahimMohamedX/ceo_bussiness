'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import {
  LocalizedTextField,
  Select,
  Field,
  cls,
} from '@/components/admin/ui'
import type { FaqRecord, FaqStatus } from '@/src/lib/admin/faq'

const STATUSES: { value: FaqStatus; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
]

export default function FaqFormPage() {
  const router = useRouter()
  const params = useParams()
  const faqId = params.id as string

  const [faq, setFaq] = useState<FaqRecord | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [question, setQuestion] = useState({ en: '', ar: '' })
  const [answer, setAnswer] = useState({ en: '', ar: '' })
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState<FaqStatus>('draft')
  const [sortOrder, setSortOrder] = useState(0)

  useEffect(() => {
    loadFaq()
  }, [faqId])

  const loadFaq = async () => {
    setBusy(true)
    try {
      const res = await fetch(`/admin/api/faq/${faqId}`)
      if (!res.ok) throw new Error('Failed to load FAQ')
      const data = (await res.json()) as { faq: FaqRecord }
      const f = data.faq
      setFaq(f)
      setQuestion(f.question)
      setAnswer(f.answer)
      setCategory(f.category ?? '')
      setStatus(f.status)
      setSortOrder(f.sortOrder)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load')
    } finally {
      setBusy(false)
    }
  }

  const handleSave = async () => {
    if (!question.en.trim() || !question.ar.trim())
      return setError('Question required in both EN and AR')
    if (!answer.en.trim() || !answer.ar.trim())
      return setError('Answer required in both EN and AR')

    setError(null)
    setBusy(true)
    try {
      const input = {
        question: { en: question.en.trim(), ar: question.ar.trim() },
        answer: { en: answer.en.trim(), ar: answer.ar.trim() },
        category: category.trim() || undefined,
        status,
        sortOrder,
      }

      const res = await fetch(`/admin/api/faq/${faqId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      if (!res.ok) {
        const data = (await res.json()) as { error?: string }
        throw new Error(data.error ?? 'Save failed')
      }
      router.push('/admin/faq')
      router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed')
    } finally {
      setBusy(false)
    }
  }

  if (busy && !faq) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--primary)] border-t-transparent" />
      </div>
    )
  }

  if (error && !faq) {
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
          <h1 className="text-[22px] font-bold tracking-tight text-[var(--foreground)]">Edit FAQ</h1>
        </div>
        <a
          href="/admin/faq"
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

      <form onSubmit={(e) => { e.preventDefault(); handleSave() }} className="space-y-6">
        <fieldset className={cls.fieldset}>
          <legend className={cls.legend}>Question</legend>
          <LocalizedTextField
            id="question"
            label="Question"
            en={question.en}
            ar={question.ar}
            dir="ltr"
            onChange={setQuestion}
            required
          />
        </fieldset>

        <fieldset className={cls.fieldset}>
          <legend className={cls.legend}>Answer</legend>
          <LocalizedTextField
            id="answer"
            label="Answer"
            en={answer.en}
            ar={answer.ar}
            dir="ltr"
            onChange={setAnswer}
            required
            area
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
          <Field label="Category" htmlFor="category" hint="Optional grouping label">
            <input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={cls.input}
              placeholder="Billing"
            />
          </Field>
        </fieldset>

        <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)]">
          <a
            href="/admin/faq"
            className={cls.btnGhost}
          >
            Cancel
          </a>
          <button type="submit" className={cls.btnPrimary} disabled={busy}>
            {busy ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
