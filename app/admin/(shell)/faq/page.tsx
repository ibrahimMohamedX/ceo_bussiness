import { requireAdmin } from '@/src/lib/admin/session'
import { getAllFaqs } from '@/src/lib/admin/faq'
import FaqTableClient from './FaqTableClient'

export const dynamic = 'force-dynamic'

export default async function FaqPage() {
  const session = await requireAdmin()
  const faqs = await getAllFaqs(session)

  return <FaqTableClient faqs={faqs} />
}
