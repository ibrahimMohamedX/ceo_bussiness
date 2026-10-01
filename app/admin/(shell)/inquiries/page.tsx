import { requireAdmin } from '@/src/lib/admin/session'
import { getAllInquiries } from '@/src/lib/admin/inquiry'
import InquiryTableClient from './InquiryTableClient'

export const dynamic = 'force-dynamic'

export default async function InquiriesPage() {
  const session = await requireAdmin()
  const inquiries = await getAllInquiries(session)

  return <InquiryTableClient inquiries={inquiries} />
}





