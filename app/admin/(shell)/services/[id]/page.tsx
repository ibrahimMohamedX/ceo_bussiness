'use client'

import { useParams } from 'next/navigation'
import ServiceForm from '@/components/admin/ServiceForm'

export default function ServiceEditPage() {
  const params = useParams()
  return <ServiceForm serviceId={params.id as string} />
}