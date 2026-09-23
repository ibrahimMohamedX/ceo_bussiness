import { NextResponse } from 'next/server'

import { verifySession } from '@/src/lib/admin/session'
import {
  ApiError,
  deleteBlogPost,
  getBlogPost,
  updateBlogPost,
} from '@/src/lib/admin/blog'

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

export async function GET(_request: Request, ctx: Ctx) {
  const session = await verifySession()
  try {
    const { id } = await ctx.params
    const post = await getBlogPost(session, id)
    return NextResponse.json({ post })
  } catch (e) {
    return toError(e)
  }
}

export async function PATCH(request: Request, ctx: Ctx) {
  const session = await verifySession()
  try {
    const { id } = await ctx.params
    const body = (await request.json()) as Parameters<typeof updateBlogPost>[2]
    const post = await updateBlogPost(session, id, body)
    return NextResponse.json({ post })
  } catch (e) {
    return toError(e)
  }
}

export async function DELETE(_request: Request, ctx: Ctx) {
  const session = await verifySession()
  try {
    const { id } = await ctx.params
    await deleteBlogPost(session, id)
    return NextResponse.json({ ok: true })
  } catch (e) {
    return toError(e)
  }
}