'use client'

// Reusable admin table component for listing CRUD resources.
// Keeps column/row rendering consistent across Projects, Blog, Services, etc.

import { cls } from './ui'

interface Column {
  key: string
  header: string
  width?: string
}

interface Row<T> {
  id: string
  cells: Array<{
    key: string
    content: React.ReactNode
  }>
}

export function AdminTable<T>({
  columns,
  rows,
}: {
  columns: Column[]
  rows: Row<T>[]
}) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse" role="table">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--card)]/40">
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{ width: col.width }}
                  className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--muted-foreground)]"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-[var(--border)]/50 last:border-b-0 hover:bg-[var(--card)]/40">
                {row.cells.map((cell) => (
                  <td key={cell.key} className="px-4 py-3 text-[13px] text-[var(--foreground)]">
                    {cell.content}
                  </td>
                ))}
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-[var(--muted-foreground)]">
                  No records yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}




