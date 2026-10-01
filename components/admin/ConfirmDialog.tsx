'use client'

// Small confirmation modal used for destructive admin actions (delete project,
// delete media, etc.). Renders an overlay + dialog, never unmounting while the
// confirm handler is busy, and cancels on Escape or overlay click.

import { useEffect } from 'react'
import { cls } from './ui'

export function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel = 'Delete',
  busy = false,
  danger = true,
  onConfirm,
  onCancel,
}: {
  open: boolean
  title: string
  body?: string
  confirmLabel?: string
  busy?: boolean
  danger?: boolean
  onConfirm: () => void
  onCancel: () => void
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancel()
      }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="w-full max-w-sm rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-xl">
        <p className="text-[14px] font-semibold text-[var(--foreground)]">{title}</p>
        {body ? <p className="mt-1.5 text-[12px] leading-relaxed text-[var(--muted-foreground)]">{body}</p> : null}
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" className={cls.btnGhost} onClick={onCancel} disabled={busy}>
            Cancel
          </button>
          <button
            type="button"
            className={danger ? cls.btnDanger : cls.btnPrimary}
            onClick={onConfirm}
            disabled={busy}
          >
            {busy ? 'Workingâ€¦' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}




