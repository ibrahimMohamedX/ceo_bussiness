'use client'

// Shared styling helpers for the admin CRUD forms. Keeps field + button styling
// consistent across projects/blog/etc. without a design framework — no deps.

const inputBase =
  'w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-[13px] text-[var(--foreground)] ' +
  'placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:outline-none ' +
  'focus:ring-2 focus:ring-[var(--primary)]/30 transition-colors'

export const cls = {
  input: inputBase,
  label: 'mb-1 block text-[12px] font-semibold text-[var(--muted-foreground)]',
  fieldset: 'space-y-4 rounded-xl border border-[var(--border)] bg-[var(--card)]/40 p-4',
  legend: 'mb-3 block text-[12px] font-bold uppercase tracking-[0.12em] text-[var(--muted-foreground)]',
  btnPrimary:
    'inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2 text-[13px] font-semibold text-[var(--card)] ' +
    'hover:opacity-90 disabled:opacity-50 transition-opacity',
  btnGhost:
    'inline-flex items-center gap-2 rounded-lg border border-[var(--border)] px-4 py-2 text-[13px] font-medium ' +
    'text-[var(--muted-foreground)] hover:border-[var(--primary)]/50 hover:text-[var(--foreground)] transition-colors',
  btnDanger:
    'inline-flex items-center gap-2 rounded-lg border border-red-500/30 px-4 py-2 text-[13px] font-medium ' +
    'text-red-400 hover:bg-red-500/10 transition-colors',
}

export function Field({ label, htmlFor, hint, error, children }: {
  label: string
  htmlFor: string
  hint?: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={htmlFor} className={cls.label}>
        {label}
      </label>
      {children}
      {hint && !error ? (
        <p className="text-[11px] text-[var(--muted-foreground)]/80">{hint}</p>
      ) : null}
      {error ? <p className="text-[11px] text-red-400">{error}</p> : null}
    </div>
  )
}

export function LocalizedTextField({
  id,
  label,
  en,
  ar,
  dir,
  onChange,
  required,
  area,
}: {
  id: string
  label: string
  en: string
  ar: string
  dir: 'ltr' | 'rtl'
  onChange: (next: { en: string; ar: string }) => void
  required?: boolean
  area?: boolean
}) {
  const on = (lang: 'en' | 'ar', value: string) =>
    onChange({ en: lang === 'en' ? value : en, ar: lang === 'ar' ? value : ar })

  const base = {
    en: `${cls.input} ${area ? 'min-h-[90px] resize-y' : ''}`,
    ar: `${cls.input} ${area ? 'min-h-[90px] resize-y' : ''} text-right`,
  }

  return (
    <div className="space-y-1">
      {label ? (
        <span className={cls.label}>
          {label} {required ? '*' : ''}
        </span>
      ) : null}
      <div className="space-y-2">
        <div>
          <Tag label="EN" />
          {area ? (
            <textarea id={id} dir={dir} value={en} onChange={(e) => on('en', e.target.value)} className={base.en} />
          ) : (
            <input id={id} dir={dir} value={en} onChange={(e) => on('en', e.target.value)} className={base.en} />
          )}
        </div>
        <div>
          <Tag label="ع" />
          {area ? (
            <textarea id={id + '-ar'} dir="rtl" value={ar} onChange={(e) => on('ar', e.target.value)} className={base.ar} />
          ) : (
            <input id={id + '-ar'} dir="rtl" value={ar} onChange={(e) => on('ar', e.target.value)} className={base.ar} />
          )}
        </div>
      </div>
    </div>
  )
}

export function TagEditor({ id, label, values, onChange }: {
  id: string
  label: string
  values: string[]
  onChange: (next: string[]) => void
}) {
  return (
    <div className="space-y-2">
      <span className={cls.label}>{label}</span>
      <div className="flex flex-wrap gap-1.5">
        {values.map((v) => (
          <span
            key={v}
            className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--card)] px-2 py-1 text-[12px] text-[var(--foreground)]"
          >
            {v}
            <button
              type="button"
              aria-label={`Remove ${v}`}
              onClick={() => onChange(values.filter((x) => x !== v))}
              className="text-[var(--muted-foreground)] hover:text-red-400"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <input
        id={id}
        className={cls.input}
        placeholder="Type and press Enter to add"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            const value = (e.target as HTMLInputElement).value.trim()
            if (value && !values.includes(value)) onChange([...values, value])
            ;(e.target as HTMLInputElement).value = ''
          }
        }}
      />
    </div>
  )
}

export function Select<T extends string>({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string
  label: string
  value: T
  options: { value: T; label: string }[]
  onChange: (v: T) => void
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className={cls.label}>
        {label}
      </label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value as T)} className={cls.input}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export function Toggle({
  id,
  label,
  checked,
  onChange,
}: {
  id: string
  label: string
  checked: boolean
  onChange: (next: boolean) => void
}) {
  return (
    <div className="flex cursor-pointer items-center justify-between gap-3">
      <span className="text-[13px] text-[var(--foreground)]">{label}</span>
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={[
          'relative h-5 w-9 rounded-full transition-colors',
          checked ? 'bg-[var(--primary)]' : 'bg-[var(--border)]',
        ].join(' ')}
      >
        <span
          className={[
            'absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform',
            checked ? 'translate-x-[18px]' : 'translate-x-0.5',
          ].join(' ')}
        />
      </button>
    </div>
  )
}

export function Tag({ label }: { label: string }) {
  return (
    <span className="mb-1 mr-1 inline-block rounded bg-[var(--border)]/40 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--muted-foreground)]">
      {label}
    </span>
  )
}