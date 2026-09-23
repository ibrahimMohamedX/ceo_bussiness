import { NextResponse } from 'next/server'

import { verifySession } from '@/src/lib/admin/session'
import {
  ApiError,
  deleteProject,
  getProject,
  updateProject,
} from '@/src/lib/admin/projects'

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
    const project = await getProject(session, id)
    return NextResponse.json({ project })
  } catch (e) {
    return toError(e)
  }
}

export async function PATCH(request: Request, ctx: Ctx) {
  const session = await verifySession()
  try {
    const { id } = await ctx.params
    const body = (await request.json()) as Parameters<typeof updateProject>[2]
    const project = await updateProject(session, id, body)
    return NextResponse.json({ project })
  } catch (e) {
    return toError(e)
  }
}

export async function DELETE(_request: Request, ctx: Ctx) {
  const session = await verifySession()
  try {
    const { id } = await ctx.params
    await deleteProject(session, id)
    return NextResponse.json({ ok: true })
  } catch (e) {
    return toError(e)
  }
}