import { requireAdmin } from '@/src/lib/admin/session'
import { getSiteSettings } from '@/src/lib/admin/settings'
import SettingsEditorClient from '@/components/admin/SettingsEditorClient'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const session = await requireAdmin()
  const settings = await getSiteSettings(session)

  return <SettingsEditorClient initial={settings} />
}




