// Structural placeholder presentational card. Phase 2 ships the dashboard shell
// only â€” every section renders an empty state, never fake data or fake numbers.

export function AdminEmptyState({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--card)]/40 px-6 py-16 text-center">
      <p className="text-sm font-semibold text-[var(--foreground)]">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-[13px] leading-relaxed text-[var(--muted-foreground)]">
        {description}
      </p>
    </div>
  )
}




