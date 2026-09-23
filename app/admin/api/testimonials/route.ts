import { NextResponse } from 'next/server'

import { verifySession } from '@/src/lib/admin/session'
import {
  ApiError,
  createTestimonial,
  getAllTestimonials,
} from '@/src/lib/admin/testimonials'

// Admin Testimonials collection route: GET (list) and POST (create).

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
    const testimonials = await getAllTestimonials(session)
    return NextResponse.json({ testimonials })
  } catch (e) {
    return toError(e)
  }
}

export async function POST(request: Request) {
  const session = await verifySession()
  try {
    const body = (await request.json()) as Parameters<typeof createTestimonial>[1]
    const testimonial = await createTestimonial(session, body)
    return NextResponse.json({ testimonial }, { status: 201 })
  } catch (e) {
    return toError(e)
  }
}