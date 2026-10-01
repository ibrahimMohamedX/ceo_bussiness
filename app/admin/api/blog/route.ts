import { NextResponse } from 'next/server'

import { verifySession } from '@/src/lib/admin/session'
import { ApiError, createBlogPost, listBlogPosts } from '@/src/lib/admin/blog'

// Admin Blog Posts collection route: GET (list) and POST (create).
// Authorization is enforced inside the DAL via requireAdminForBlog()
// (editor+). Read-only GET is also behind admin auth â€” drafts/archived must not
// leak to an unauthenticated client even in list responses.

function toError(e: unknown) {
  if (e instanceof ApiError) {
    return NextResponse.json({ error: e.message }, { status: e.status })
  }
  return NextResponse.json({ error: 'Internal error' }, { status: 500 })
}

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await verifySession()
  try {
    const posts = await listBlogPosts(session)
    return NextResponse.json({ posts })
  } catch (e) {
    return toError(e)
  }
}

export async function POST(request: Request) {
  const session = await verifySession()
  try {
    const body = (await request.json()) as Parameters<typeof createBlogPost>[1]
    const post = await createBlogPost(session, body)
    return NextResponse.json({ post }, { status: 201 })
  } catch (e) {
    return toError(e)
  }
}




