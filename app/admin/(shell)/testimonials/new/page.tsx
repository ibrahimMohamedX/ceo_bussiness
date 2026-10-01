import { requireAdmin } from '@/src/lib/admin/session'
import TestimonialForm from '@/components/admin/TestimonialForm'

export const dynamic = 'force-dynamic'

export default async function NewTestimonialPage() {
  await requireAdmin()
  return <TestimonialForm testimonialId="new" />
}




