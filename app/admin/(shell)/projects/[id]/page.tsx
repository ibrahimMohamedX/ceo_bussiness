'use client'

// Project create/edit page. Renders the shared ProjectForm with the route id.
// The id is passed explicitly so /admin/projects/new (id = "new") enters create
// mode without loading an existing record.

import { useParams } from 'next/navigation'
import { ProjectForm } from '@/components/admin/ProjectForm'

export default function ProjectFormPage() {
  const params = useParams()
  return <ProjectForm projectId={params.id as string} />
}