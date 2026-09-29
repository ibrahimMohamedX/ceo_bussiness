// TEMPORARY diagnostic: dumps the real project documents + media subcollection
// so the homepage regression can be reproduced against actual data.
// Delete this file once the investigation is closed.
import fs from 'fs'

const env = fs.readFileSync('.env.local', 'utf8')
function get(k) {
  const re = new RegExp('^' + k + '=([\\s\\S]*?)(?=\\n[A-Z_]+=|$)', 'm')
  const m = env.match(re)
  if (!m) return null
  let v = m[1].trim()
  if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1)
  return v
}

process.env.FIREBASE_PROJECT_ID = get('FIREBASE_PROJECT_ID')
process.env.FIREBASE_CLIENT_EMAIL = get('FIREBASE_CLIENT_EMAIL')
process.env.FIREBASE_PRIVATE_KEY = (get('FIREBASE_PRIVATE_KEY') || '').replace(/\\n/g, '\n')

const { initializeApp, cert } = await import('firebase-admin/app')
const { getFirestore } = await import('firebase-admin/firestore')

const app = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
  }),
})
const db = getFirestore(app)

const snap = await db.collection('projects').get()
console.log('TOTAL project docs:', snap.size)
console.log('--- top-level docs ---')
for (const d of snap.docs) {
  const x = d.data()
  console.log(
    JSON.stringify({
      id: d.id,
      slug: x.slug,
      status: x.status,
      featured: x.featured,
      featuredType: typeof x.featured,
      sortOrder: x.sortOrder,
      coverMediaId: x.coverMediaId,
      createdAtType: x.createdAt?.constructor?.name,
      hasInlineMediaField: Array.isArray(x.media),
    }),
  )
}

console.log('--- subcollection media ---')
for (const d of snap.docs) {
  const ms = await d.ref.collection('media').get()
  if (ms.size === 0) continue
  console.log('project', d.id, 'media docs:', ms.size)
  for (const md of ms.docs) {
    const m = md.data()
    console.log(
      '   ',
      JSON.stringify({
        id: md.id,
        publicId: m.publicId,
        storagePath: m.storagePath,
        resourceType: m.resourceType,
        kind: m.kind,
        createdAtType: m.createdAt?.constructor?.name,
      }),
    )
  }
}

console.log('--- simulating getFeaturedProjects query ---')
try {
  const q = await db
    .collection('projects')
    .where('status', '==', 'published')
    .where('featured', '==', true)
    .orderBy('sortOrder', 'asc')
    .orderBy('createdAt', 'desc')
    .limit(3)
    .get()
  console.log('FEATURED QUERY OK, docs:', q.size)
  for (const d of q.docs) console.log('   featured:', d.id, d.data().slug)
} catch (e) {
  console.log('FEATURED QUERY FAILED:', e.constructor.name)
  console.log('  message:', e.message)
  console.log('  code:', e.code)
}
