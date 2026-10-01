import { requireAdmin } from '@/src/lib/admin/session'
import { listProjects } from '@/src/lib/admin/projects'
import ProjectsTableClient from './ProjectsTableClient'

export const dynamic = 'force-dynamic'

export default async function ProjectsPage() {
  const session = await requireAdmin()
  const projects = await listProjects(session)

  return <ProjectsTableClient projects={projects} />
}




