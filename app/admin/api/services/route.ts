import { NextResponse } from 'next/server'

import { verifySession } from '@/src/lib/admin/session'
import {
  ApiError,
  createApiError,
  createService,
  getAllServices,
} from '@/src/lib/admin/services'

// Admin Services collection route: GET (list) and POST (create).

function toError(e: unknown) {
  if (e && typeof e === 'object' && 'status' in e && 'message' in e && (e as ApiError).name === 'ApiError') {
    const apiError = e as ApiError
    return NextResponse.json({ error: apiError.message }, { status: apiError.status })
  }
  return NextResponse.json({ error: 'Internal error' }, { status: 500 })
}

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await verifySession()
  try {
    const services = await getAllServices(session)
    return NextResponse.json({ services })
  } catch (e) {
    return toError(e)
  }
}

export async function POST(request: Request) {
  const session = await verifySession()
  try {
    const body = (await request.json()) as Parameters<typeof createService>[1]
    const service = await createService(session, body)
    return NextResponse.json({ service }, { status: 201 })
  } catch (e) {
    return toError(e)
  }
}




