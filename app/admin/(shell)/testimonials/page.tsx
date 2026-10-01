import { requireAdmin } from '@/src/lib/admin/session'
import { getAllTestimonials } from '@/src/lib/admin/testimonials'
import TestimonialsTableClient from './TestimonialsTableClient'

export const dynamic = 'force-dynamic'

export default async function TestimonialsPage() {
  const session = await requireAdmin()
  const testimonials = await getAllTestimonials(session)

  return <TestimonialsTableClient testimonials={testimonials} />
}




