'use server'

import { getPublicFirestore } from '@/src/lib/firebase/admin'
import type { FaqRecord } from '@/src/lib/admin/faq'

/**
 * Public-facing FAQ entry — published only
 */
export interface PublicFaq {
  id: string
  question: { en: string; ar: string }
  answer: { en: string; ar: string }
  category?: string
  sortOrder: number
  status: 'published'
}

function toPublicFaq(faq: FaqRecord): PublicFaq {
  return {
    id: faq.id,
    question: { en: faq.question.en, ar: faq.question.ar },
    answer: { en: faq.answer.en, ar: faq.answer.ar },
    category: faq.category,
    sortOrder: faq.sortOrder,
    status: 'published',
  }
}

/**
 * Returns all published FAQs, ordered by sortOrder ascending
 * Used by the public homepage FAQ section
 */
export async function getPublishedFaqs(): Promise<PublicFaq[]> {
  const db = getPublicFirestore()
  if (!db) return []
  const snapshot = await db
    .collection('faqs')
    .where('status', '==', 'published')
    .orderBy('sortOrder', 'asc')
    .get()

  return snapshot.docs.map((doc) =>
    toPublicFaq({ ...(doc.data() as FaqRecord), id: doc.id }),
  )
}