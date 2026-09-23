import { NextResponse } from 'next/server'

import { verifySession } from '@/src/lib/admin/session'
import {
  ApiError,
  deleteService,
  getServiceById,
  updateService,
} from '@/src/lib/admin/services'

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
    const service = await getServiceById(session, id)
    return NextResponse.json({ service })
  } catch (e) {
    return toError(e)
  }
}

export async function PATCH(request: Request, ctx: Ctx) {
  const session = await verifySession()
  try {
    const { id } = await ctx.params
    const body = (await request.json()) as Parameters<typeof updateService>[2]
    const service = await updateService(session, id, body)
    return NextResponse.json({ service })
  } catch (e) {
    return toError(e)
  }
}

export async function DELETE(_request: Request, ctx: Ctx) {
  const session = await verifySession()
  try {
    const { id } = await ctx.params
    await deleteService(session, id)
    return NextResponse.json({ ok: true })
  } catch (e) {
    return toError(e)
  }
}