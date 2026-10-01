import { NextResponse } from 'next/server'

import { verifySession } from '@/src/lib/admin/session'
import { ApiError, listMediaLibrary, type MediaOwnerType } from '@/src/lib/admin/media'

// Admin media library route: GET (list). Items are read from the global media/
// index; the binary itself lives in Storage under media/{ownerType}/{ownerId}.

function toError(e: unknown) {
  if (e instanceof ApiError) {
    return NextResponse.json({ error: e.message }, { status: e.status })
  }
  return NextResponse.json({ error: 'Internal error' }, { status: 500 })
}

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const session = await verifySession()
  try {
    const { searchParams } = new URL(request.url)
    const raw = searchParams.get('ownerType')
    const valid: MediaOwnerType[] = ['project', 'blog', 'about', 'testimonial', 'inquiry', 'general']
    const ownerType = valid.includes(raw as MediaOwnerType) ? (raw as MediaOwnerType) : undefined
    const media = await listMediaLibrary(session, ownerType)
    return NextResponse.json({ media })
  } catch (e) {
    return toError(e)
  }
}




