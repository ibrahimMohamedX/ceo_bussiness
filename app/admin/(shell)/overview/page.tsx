// Archai workspace overview — a real dashboard: live counts pulled from
// the same admin DAL the CRUD pages use (no fake numbers, per the Phase 2
// rule). Each stat card links straight to its section. The page is
// super_admin-gated by the (shell) layout's requireAdmin() boundary.

import { requireAdmin } from '@/src/lib/admin/session'
import { listProjects } from '@/src/lib/admin/projects'
import { listBlogPosts } from '@/src/lib/admin/blog'
import { getAllServices } from '@/src/lib/admin/services'
import { getAllTestimonials } from '@/src/lib/admin/testimonials'
import { getAllFaqs } from '@/src/lib/admin/faq'
import { getAllInquiries } from '@/src/lib/admin/inquiry'
import { listMediaLibrary } from '@/src/lib/admin/media'
import {
  Briefcase,
  FileText,
  HelpCircle,
  Image as ImageIcon,
  Inbox,
  Quote,
  Wrench,
  type LucideIcon,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

interface StatCard {
  label: string
  value: number
  icon: LucideIcon
  href: string
  hint?: string
}

export default async function OverviewPage() {
  const session = await requireAdmin()

  const [projects, posts, services, testimonials, faqs, inquiries, media] =
    await Promise.all([
      listProjects(session),
      listBlogPosts(session),
      getAllServices(session),
      getAllTestimonials(session),
      getAllFaqs(session),
      getAllInquiries(session),
      listMediaLibrary(session),
    ])

  const newInquiries = inquiries.filter((i) => i.status === 'new').length

  const stats: StatCard[] = [
    {
      label: 'New inquiries',
      value: newInquiries,
      icon: Inbox,
      href: '/admin/inquiries',
      hint: `${inquiries.length} total`,
    },
    { label: 'Projects', value: projects.length, icon: Briefcase, href: '/admin/projects' },
    { label: 'Blog posts', value: posts.length, icon: FileText, href: '/admin/blog' },
    { label: 'Services', value: services.length, icon: Wrench, href: '/admin/services' },
    {
      label: 'Testimonials',
      value: testimonials.length,
      icon: Quote,
      href: '/admin/testimonials',
    },
    { label: 'FAQ entries', value: faqs.length, icon: HelpCircle, href: '/admin/faq' },
    { label: 'Media assets', value: media.length, icon: ImageIcon, href: '/admin/media' },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-sm font-semibold tracking-tight text-[var(--foreground)]">
          Workspace overview
        </h1>
        <p className="mt-1 text-[13px] text-[var(--muted-foreground)]">
          Live counts from the Archai workspace — content, leads and assets.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <a
            key={s.label}
            href={s.href}
            className="admin-card group flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 transition-transform hover:-translate-y-0.5"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[var(--primary)]/12 text-[var(--primary)] transition-transform group-hover:scale-105">
              <s.icon size={18} strokeWidth={1.5} />
            </span>
            <span className="min-w-0">
              <span className="block text-xl font-semibold tabular-nums text-[var(--foreground)]">
                {s.value}
              </span>
              <span className="block truncate text-xs text-[var(--muted-foreground)]">
                {s.label}
                {s.hint ? ` · ${s.hint}` : ''}
              </span>
            </span>
          </a>
        ))}
      </div>
    </div>
  )
}
