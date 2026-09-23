'use client'

// Blog post create/edit page. Renders the shared BlogPostForm with the route id.
// The id is passed explicitly so /admin/blog/new (id = "new") enters create mode
// without loading an existing record.

import { useParams } from 'next/navigation'
import { BlogPostForm } from '@/components/admin/BlogPostForm'

export default function BlogPostFormPage() {
  const params = useParams()
  return <BlogPostForm postId={params.id as string} />
}