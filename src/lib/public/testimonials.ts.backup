'use server'

import { getPublicFirestore } from '@/src/lib/firebase/admin'
import { Timestamp } from 'firebase-admin/firestore'
import type { TestimonialRecord, BilingualText, BilingualTextOptional } from '@/src/lib/admin/testimonials'

/**
 * Public-facing testimonial record
 * Used by public pages (homepage testimonials section) - only published testimonials
 */
export interface PublicTestimonial {
  id: string
  quote: BilingualText
  personName: string
  role: BilingualTextOptional
  company: string
  avatarMediaId: string
  featured: boolean
  status: 'published'
  sortOrder: number
}

/**
 * Converts admin TestimonialRecord to public PublicTestimonial
 * Filters and transforms data for public consumption
 */
function toPublicTestimonial(record: TestimonialRecord): PublicTestimonial {
  return {
    id: record.id,
    quote: record.quote,
    personName: record.personName ?? '',
    role: record.role ?? { en: '', ar: '' },
    company: record.company ?? '',
    avatarMediaId: record.avatarMediaId ?? '',
    featured: record.featured,
    status: 'published' as const,
    sortOrder: record.sortOrder,
  }
}

/**
 * Fetches all published testimonials for public pages
 * Ordered by sortOrder asc
 * Server-side only - uses Admin SDK via firebase-admin
 */
export async function getPublishedTestimonials(): Promise<PublicTestimonial[]> {
  const db = getPublicFirestore()
  if (!db) return []
  const snapshot = await db
    .collection('testimonials')
    .where('status', '==', 'published')
    .orderBy('sortOrder', 'asc')
    .get()

  const testimonials: PublicTestimonial[] = []
  for (const doc of snapshot.docs) {
    const data = doc.data() as TestimonialRecord
    testimonials.push(toPublicTestimonial({ ...data, id: doc.id }))
  }
  return testimonials
}

/**
 * Fetches featured published testimonials for homepage
 * Limited to featured posts, ordered by sortOrder
 */
export async function getFeaturedTestimonials(limitCount = 3): Promise<PublicTestimonial[]> {
  const db = getPublicFirestore()
  if (!db) return []
  const snapshot = await db
    .collection('testimonials')
    .where('status', '==', 'published')
    .where('featured', '==', true)
    .orderBy('sortOrder', 'asc')
    .limit(limitCount)
    .get()

  const testimonials: PublicTestimonial[] = []
  for (const doc of snapshot.docs) {
    const data = doc.data() as TestimonialRecord
    testimonials.push(toPublicTestimonial({ ...data, id: doc.id }))
  }
  return testimonials
}