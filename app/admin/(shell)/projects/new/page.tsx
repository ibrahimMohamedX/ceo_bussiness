import { requireAdmin } from '@/src/lib/admin/session'
import { ProjectForm } from '@/components/admin/ProjectForm'

export const dynamic = 'force-dynamic'

export default async function NewProjectPage() {
  await requireAdmin()
  // Create mode: pass "new" so the form does NOT load an existing record.
  return <ProjectForm projectId="new" />
}




