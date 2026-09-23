import { NextResponse } from 'next/server'

import { verifySession } from '@/src/lib/admin/session'
import {
  ApiError,
  createInquiry,
  getAllInquiries,
} from '@/src/lib/admin/inquiry'

// Admin inquiry routes: GET (list) and POST (create) on the collection.

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
    const inquiries = await getAllInquiries(session)
    return NextResponse.json({ inquiries })
  } catch (e) {
    return toError(e)
  }
}

export async function POST(request: Request) {
  const session = await verifySession()
  try {
    const body = (await request.json()) as Parameters<typeof createInquiry>[1]
    const inquiry = await createInquiry(session, body)
    return NextResponse.json({ inquiry }, { status: 201 })
  } catch (e) {
    return toError(e)
  }
}