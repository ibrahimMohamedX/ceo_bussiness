import { NextResponse } from 'next/server'

import { verifySession } from '@/src/lib/admin/session'
import { getProject } from '@/src/lib/admin/projects'
import { ApiError, createProjectMedia } from '@/src/lib/admin/media'

interface Ctx {
  params: Promise<{ id: string }>
}

function toError(e: unknown) {
  if (e instanceof ApiError) {
    return NextResponse.json({ error: e.message }, { status: e.status })
  }
  return NextResponse.json({ error: 'Internal error' }, { status: 500 })
}

export const dynamic = 'force-dynamic'

// List a project's media subcollection (returned hydrated on the project record
// itself by GET /admin/api/projects/:id; this route exists for completeness).
export async function GET(_request: Request, ctx: Ctx) {
  const session = await verifySession()
  try {
    const { id } = await ctx.params
    const project = await getProject(session, id)
    return NextResponse.json({ media: project.media })
  } catch (e) {
    return toError(e)
  }
}

// Register metadata for a project image the client already uploaded to Storage
// under media/projects/{projectId}/... (enforced by storage.rules + the DAL).
export async function POST(request: Request, ctx: Ctx) {
  const session = await verifySession()
  try {
    const { id } = await ctx.params
    const body = (await request.json()) as Parameters<typeof createProjectMedia>[1]
    const result = await createProjectMedia(session, { ...body, projectId: id })
    return NextResponse.json(result, { status: 201 })
  } catch (e) {
    return toError(e)
  }
}