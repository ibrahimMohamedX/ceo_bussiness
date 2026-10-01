import { requireAdmin } from '@/src/lib/admin/session'
import { listMediaLibrary } from '@/src/lib/admin/media'
import MediaLibraryClient from './MediaLibraryClient'

export const dynamic = 'force-dynamic'

export default async function MediaPage() {
  const session = await requireAdmin()
  // listMediaLibrary enforces requireRole(session, 'media') internally and reads
  // the global media/ index (server-only). The client only renders + deletes;
  // delete keeps its reference-check safety in the DAL.
  const media = await listMediaLibrary(session)
  return <MediaLibraryClient media={media} />
}




