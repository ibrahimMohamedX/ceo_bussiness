import { NextResponse } from 'next/server'

import { verifySession } from '@/src/lib/admin/session'
import { ApiError, reorderProjectMedia } from '@/src/lib/admin/media'

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

export async function POST(request: Request, ctx: Ctx) {
  const session = await verifySession()
  try {
    const { id } = await ctx.params
    const body = (await request.json()) as { orderedMediaIds: string[] }
    await reorderProjectMedia(session, id, body.orderedMediaIds)
    return NextResponse.json({ ok: true })
  } catch (e) {
    return toError(e)
  }
}