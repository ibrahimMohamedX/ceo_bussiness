import { requireAdmin } from '@/src/lib/admin/session'
import { listBlogPosts } from '@/src/lib/admin/blog'
import BlogPostsTableClient from './BlogPostsTableClient'

export const dynamic = 'force-dynamic'

export default async function BlogPostsPage() {
  const session = await requireAdmin()
  const posts = await listBlogPosts(session)

  return <BlogPostsTableClient posts={posts} />
}