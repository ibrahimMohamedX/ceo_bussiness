import { requireAdmin } from '@/src/lib/admin/session'
import { getAllServices } from '@/src/lib/admin/services'
import ServicesTableClient from './ServicesTableClient'

export const dynamic = 'force-dynamic'

export default async function ServicesPage() {
  const session = await requireAdmin()
  const services = await getAllServices(session)

  return <ServicesTableClient services={services} />
}




