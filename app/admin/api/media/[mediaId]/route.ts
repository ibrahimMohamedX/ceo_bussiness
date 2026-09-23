import { NextResponse } from 'next/server'

import { verifySession } from '@/src/lib/admin/session'
import { getAdminStorage } from '@/src/lib/firebase/admin'
import { ApiError, deleteMediaLibrary } from '@/src/lib/admin/media'

interface Ctx {
  params: Promise<{ mediaId: string }>
}

function toError(e: unknown) {
  if (e instanceof ApiError) {
    return NextResponse.json({ error: e.message }, { status: e.status })
  }
  return NextResponse.json({ error: 'Internal error' }, { status: 500 })
}

export const dynamic = 'force-dynamic'

export async function DELETE(_request: Request, ctx: Ctx) {
  const session = await verifySession()
  try {
    const { mediaId } = await ctx.params
    const { storagePath } = await deleteMediaLibrary(session, mediaId)
    // Remove the storage binary referenced by the deleted metadata. Reference
    // checks (cover, second library index doc) run inside deleteMediaLibrary.
    if (storagePath) {
      await getAdminStorage().bucket().file(storagePath).delete().catch(() => {})
    }
    return NextResponse.json({ ok: true })
  } catch (e) {
    return toError(e)
  }
}