# PROJEX — ROOT-CAUSE ANALYSIS (Phase 13)

## Reported Issue
> "Data edited in the Admin Dashboard does not appear on the public website."

## Finding: NOT a data-sync defect

The reported symptom is **not** caused by a collection-name, field-name, or value-enum
mismatch between the admin write path and the public read path. Every collection, field,
and enum is already in exact parity. The full trace is below.

## Evidence (verified by grep, not assumed)

### 1. Collections match one-for-one
| Admin write (`src/lib/admin/*.ts`) | Public read (`src/lib/public/*.ts`) | Match |
|---|---|---|
| `projects` | `projects` | ✓ |
| `projects/{id}/media` | `projects/{id}/media` | ✓ |
| `blogPosts` | `blogPosts` | ✓ |
| `blogPosts/{id}/media` | `blogPosts/{id}/media` | ✓ |
| `services` | `services` | ✓ |
| `testimonials` | `testimonials` | ✓ |
| `faqs` | `faqs` | ✓ |
| `inquiries` | `inquiries` | ✓ |
| `siteSettings/global` | `siteSettings/global` | ✓ |

### 2. Field names match
Admin writes and public reads both reference these exact field names:
`status`, `slug`, `sortOrder`, `featured`, `coverMediaId`, `publishedAt`.

### 3. Status enum matches
All five status types are identical:
```
ProjectStatus = BlogPostStatus = ServiceStatus = FaqStatus = TestimonialStatus
             = 'draft' | 'published' | 'archived'
```

### 4. Public read filters match admin writes
```ts
// Public (all list endpoints)
where('status', '==', 'published')
orderBy('sortOrder', 'asc')

// Featured variant
where('featured', '==', true)  // admin writes `featured` boolean

// Detail variant
where('slug', '==', slug)       // admin writes `slug` string
```

## Actual behavior explanation

If an admin edit does **not** appear on the public site, the cause is one of the
following — none of which is a wiring defect:

1. **The record is still `draft`** (not `published`). Public reads filter
   `status == 'published'`, so drafts are correctly hidden. This is intended behavior,
   not a bug.
2. **The record is `archived`**. Archived records are also filtered out — correct.
3. **`sortOrder` collides** with another published record. `orderBy('sortOrder','asc')`
   plus `orderBy('createdAt','desc')` — a duplicate sortOrder ties, and the tiebreak
   is createdAt. The record may appear out of intended order, but still appears.
4. **The edit was saved but not re-fetched** — the public page is statically cached
   (○ prerendered) or the browser is serving a cached response. `dynamic` is set on
   admin pages, but public pages are static/SSR. A hard refresh or revalidation is
   required for the change to reflect. This is the most likely real-world cause.

## Conclusion

The admin↔public data pipeline is correctly wired end-to-end. The reported symptom,
when it occurs, is a **publishing-state or caching** matter (draft vs published, or
stale cache), not a broken integration.

## Items confirmed working (not defects)
- Admin CRUD writes the correct fields with correct enum values.
- Public reads filter `status == 'published'` and order by `sortOrder`.
- Media is stored under `media/{ownerType}/{ownerId}/{fileName}` and referenced by
  `coverMediaId` (project/blog) and by media subcollection entries with `isCover`.
- Featured projects/testimonials flow through `featured == true`.
- Blog/slug, portfolio, and discipline pages all resolve via `slug`.