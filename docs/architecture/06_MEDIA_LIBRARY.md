# PROJEX — Media Library Specification

## 1. Purpose

Centralize uploaded media so Projects, Blog, About, Testimonials, and other content can reuse assets without scattering files through the repository.

## 2. Storage

Firebase Storage is the binary asset store.
Firestore holds metadata and relationships.

## 3. Recommended Paths

```text
media/projects/{projectId}/...
media/blog/{postId}/...
media/about/...
media/testimonials/{testimonialId}/...
media/inquiries/{inquiryId}/...
media/general/...
```

## 4. Media Document

```ts
media/{mediaId}
{
  storagePath: string,
  public: boolean,
  ownerType: 'project' | 'blog' | 'about' | 'testimonial' | 'inquiry' | 'general',
  ownerId?: string,
  fileName: string,
  mimeType: string,
  sizeBytes: number,
  width?: number,
  height?: number,
  alt: { en?: string, ar?: string },
  caption: { en?: string, ar?: string },
  createdBy: string,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

## 5. Project Images

Projects can have many images.

The preferred pattern is:

```text
projects/{projectId}/media/{mediaId}
```

plus the optional global `media` index for library/search purposes.

## 6. Cover vs Gallery

A project has:

- one optional cover reference
- many gallery items

Do not store the entire gallery as a single comma-separated field.

## 7. Upload Rules

Dashboard should validate:

- accepted image MIME types
- maximum file size
- dimensions when needed
- duplicate selection where useful

## 8. Cleanup

When deleting a media item:

1. confirm it is not the current cover
2. confirm it is not referenced by another entity
3. remove Firestore metadata
4. remove storage file

Use a Cloud Function/server-side cleanup process when consistency matters.
