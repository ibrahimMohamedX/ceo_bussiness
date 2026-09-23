'use client'

import { useParams } from 'next/navigation'
import TestimonialForm from '@/components/admin/TestimonialForm'

export default function TestimonialEditPage() {
  const params = useParams()
  return <TestimonialForm testimonialId={params.id as string} />
}