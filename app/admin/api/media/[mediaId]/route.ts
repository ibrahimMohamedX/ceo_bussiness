import { NextResponse } from 'next/server'

import { verifySession } from '@/src/lib/admin/session'
import { getAdminStorage } from '@/src/lib/firebase/admin'
import { ApiError, deleteMediaLibrary } from '@/src/lib/admin/media'
import { deleteMedia } from '@/src/lib/cloudinary/media'

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
    const asset = await deleteMediaLibrary(session, mediaId)
    // Remove the underlying binary. Cloudinary is the primary store; the Firebase
    // object is only touched for legacy records that still carry a storagePath.
    if (asset.publicId) {
      await deleteMedia(asset.publicId, asset.resourceType).catch(() => {})
    }
    if (asset.storagePath) {
      await getAdminStorage().bucket().file(asset.storagePath).delete().catch(() => {})
    }
    return NextResponse.json({ ok: true })
  } catch (e) {
    return toError(e)
  }
}