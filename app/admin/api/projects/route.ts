import { NextResponse } from 'next/server'

import { verifySession } from '@/src/lib/admin/session'
import { ApiError, createProject, listProjects } from '@/src/lib/admin/projects'

// Admin Projects collection route: GET (list) and POST (create).
// Authorization is enforced inside the DAL via requireAdminForProjects()
// (editor+). Read-only GET is also behind admin auth — drafts/archived must not
// leak to an unauthenticated client even in list responses.

function toError(e: unknown) {
  if (e instanceof ApiError) {
    return NextResponse.json({ error: e.message }, { status: e.status })
  }
  return NextResponse.json({ error: 'Internal error' }, { status: 500 })
}

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await verifySession()
  try {
    const projects = await listProjects(session)
    return NextResponse.json({ projects })
  } catch (e) {
    return toError(e)
  }
}

export async function POST(request: Request) {
  const session = await verifySession()
  try {
    const body = (await request.json()) as Parameters<typeof createProject>[1]
    const project = await createProject(session, body)
    return NextResponse.json({ project }, { status: 201 })
  } catch (e) {
    return toError(e)
  }
}