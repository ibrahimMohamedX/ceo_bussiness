import { AdminEmptyState } from '@/components/admin/AdminPlaceholder'

const SECTIONS = [
  {
    title: 'Inquiries',
    summary: 'Incoming contact and project inquiries from the public site.',
  },
  {
    title: 'Projects',
    summary: 'Portfolio projects and the case studies displayed publicly.',
  },
  {
    title: 'Blog',
    summary: 'Written articles and engineering posts.',
  },
  {
    title: 'Media',
    summary: 'Uploaded images, assets, and brand files.',
  },
  {
    title: 'Settings',
    summary: 'Team access, roles, and console configuration.',
  },
]

export default function OverviewPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-[var(--foreground)]">Workspace overview</h2>
        <p className="mt-1 text-[13px] text-[var(--muted-foreground)]">
          PROJEX Console is set up and ready. Sections below list what each area will hold — no data
          has been migrated yet.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SECTIONS.map((s) => (
          <div
            key={s.title}
            className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.13em] text-[var(--primary)]">
              {s.title}
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-[var(--muted-foreground)]">
              {s.summary}
            </p>
          </div>
        ))}
      </div>

      <AdminEmptyState
        title="Nothing here yet"
        description="This is an empty state — real figures will appear once content and inquiry data have been wired up in a later phase."
      />
    </div>
  )
}