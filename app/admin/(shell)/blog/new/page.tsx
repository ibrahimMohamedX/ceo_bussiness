import { requireAdmin } from '@/src/lib/admin/session'
import { BlogPostForm } from '@/components/admin/BlogPostForm'

export const dynamic = 'force-dynamic'

export default async function NewBlogPostPage() {
  await requireAdmin()
  // Create mode: pass "new" so the form does NOT load an existing record.
  return <BlogPostForm postId="new" />
}