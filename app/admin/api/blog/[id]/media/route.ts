import { NextResponse } from 'next/server'

import { verifySession } from '@/src/lib/admin/session'
import { getBlogPost } from '@/src/lib/admin/blog'
import { ApiError, createBlogMedia } from '@/src/lib/admin/media'

interface Ctx {
  params: Promise<{ id: string }>
}

function toError(e: unknown) {
  if (e instanceof ApiError) {
    return NextResponse.json({ error: e.message }, { status: e.status })
  }
  return NextResponse.json({ error: 'Internal error' }, { status: 500 })
}

export const dynamic = 'force-dynamic'

// List a blog post's media subcollection (returned hydrated on the post record
// itself by GET /admin/api/blog/:id; this route exists for completeness).
export async function GET(_request: Request, ctx: Ctx) {
  const session = await verifySession()
  try {
    const { id } = await ctx.params
    const post = await getBlogPost(session, id)
    return NextResponse.json({ media: post.media })
  } catch (e) {
    return toError(e)
  }
}

// Register metadata for a blog post image the client already uploaded to Storage
// under media/blog/{postId}/... (enforced by storage.rules + the DAL).
export async function POST(request: Request, ctx: Ctx) {
  const session = await verifySession()
  try {
    const { id } = await ctx.params
    const body = (await request.json()) as Parameters<typeof createBlogMedia>[1]
    const result = await createBlogMedia(session, { ...body, postId: id })
    return NextResponse.json(result, { status: 201 })
  } catch (e) {
    return toError(e)
  }
}