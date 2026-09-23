import { requireAdmin } from '@/src/lib/admin/session'
import ServiceForm from '@/components/admin/ServiceForm'

export const dynamic = 'force-dynamic'

export default async function NewServicePage() {
  await requireAdmin()
  return <ServiceForm serviceId="new" />
}