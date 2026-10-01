import { requireAdmin } from '@/src/lib/admin/session'
import { AdminShell } from '@/components/admin/AdminShell'
import type { AdminIdentity } from '@/components/admin/AdminTopbar'

export const dynamic = 'force-dynamic'

// This layout only wraps the DASHBOARD subtree (group (shell)). /admin/login sits
// outside the group, so the guard here never redirects the login page back onto
// itself. requireAdmin() enforces the server-side auth boundary: unauth users are
// sent to /admin/login, avoiding redirect loops.
export default async function AdminShellLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin()

  const identity: AdminIdentity = {
    displayName: session?.displayName ?? null,
    email: session?.email ?? null,
    role: session?.role ?? '',
  }

  return <AdminShell identity={identity}>{children}</AdminShell>
}




