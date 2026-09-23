import { NextResponse } from 'next/server'

import { verifySession } from '@/src/lib/admin/session'
import {
  ApiError,
  deleteInquiry,
  getInquiryById,
  updateInquiry,
} from '@/src/lib/admin/inquiry'

// Admin inquiry item routes: GET (read), PATCH (update), DELETE.

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
    const inquiry = await getInquiryById(session, id)
    if (!inquiry) return NextResponse.json({ error: 'Inquiry not found.' }, { status: 404 })
    return NextResponse.json({ inquiry })
  } catch (e) {
    return toError(e)
  }
}

export async function PATCH(request: Request, ctx: Ctx) {
  const session = await verifySession()
  try {
    const { id } = await ctx.params
    const body = (await request.json()) as Parameters<typeof updateInquiry>[2]
    const inquiry = await updateInquiry(session, id, body)
    return NextResponse.json({ inquiry })
  } catch (e) {
    return toError(e)
  }
}

export async function DELETE(_request: Request, ctx: Ctx) {
  const session = await verifySession()
  try {
    const { id } = await ctx.params
    await deleteInquiry(session, id)
    return NextResponse.json({ ok: true })
  } catch (e) {
    return toError(e)
  }
}