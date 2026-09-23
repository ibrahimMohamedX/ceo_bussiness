import { NextResponse } from 'next/server'

import { verifySession } from '@/src/lib/admin/session'
import {
  ApiError,
  deleteFaq,
  getFaqById,
  updateFaq,
} from '@/src/lib/admin/faq'

interface Ctx {
  params: Promise<{ id: string }>
}

function toError(e: unknown) {
  if (e && typeof e === 'object' && 'status' in e && 'message' in e && (e as ApiError).name === 'ApiError') {
    const apiError = e as ApiError
    return NextResponse.json({ error: apiError.message }, { status: apiError.status })
  }
  return NextResponse.json({ error: 'Internal error' }, { status: 500 })
}

export const dynamic = 'force-dynamic'

export async function GET(_request: Request, ctx: Ctx) {
  const session = await verifySession()
  try {
    const { id } = await ctx.params
    const faq = await getFaqById(session, id)
    return NextResponse.json({ faq })
  } catch (e) {
    return toError(e)
  }
}

export async function PATCH(request: Request, ctx: Ctx) {
  const session = await verifySession()
  try {
    const { id } = await ctx.params
    const body = (await request.json()) as Parameters<typeof updateFaq>[2]
    const faq = await updateFaq(session, id, body)
    return NextResponse.json({ faq })
  } catch (e) {
    return toError(e)
  }
}

export async function DELETE(_request: Request, ctx: Ctx) {
  const session = await verifySession()
  try {
    const { id } = await ctx.params
    await deleteFaq(session, id)
    return NextResponse.json({ ok: true })
  } catch (e) {
    return toError(e)
  }
}
