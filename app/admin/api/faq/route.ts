import { NextResponse } from 'next/server'

import { verifySession } from '@/src/lib/admin/session'
import {
  ApiError,
  createFaq,
  getAllFaqs,
} from '@/src/lib/admin/faq'

// Admin FAQ collection route: GET (list) and POST (create).

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
    const faqs = await getAllFaqs(session)
    return NextResponse.json({ faqs })
  } catch (e) {
    return toError(e)
  }
}

export async function POST(request: Request) {
  const session = await verifySession()
  try {
    const body = (await request.json()) as Parameters<typeof createFaq>[1]
    const faq = await createFaq(session, body)
    return NextResponse.json({ faq }, { status: 201 })
  } catch (e) {
    return toError(e)
  }
}
