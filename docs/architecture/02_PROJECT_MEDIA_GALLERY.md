# PROJEX — Project Media & Gallery Specification

## 1. Requirement

A project may contain multiple images. The data model MUST NOT use a single `imageUrl` field as the only visual representation.

## 2. Media Strategy

Recommended relationship:

```text
Project
  ├── coverMediaId
  └── media subcollection
       ├── image 01 — cover
       ├── image 02 — gallery
       ├── image 03 — gallery
       ├── image 04 — screenshot
       ├── image 05 — diagram
       └── ...
```

## 3. Why a Subcollection

Benefits:

- unlimited gallery size without making the parent project document large
- independent ordering
- per-image alt text/caption
- simple reordering from the dashboard
- easier upload/delete operations
- easier future case-study galleries

## 4. Recommended UI Model

### Portfolio card

Use only the `cover` image.

### Project details / case study

Use:

- cover image
- gallery
- screenshots
- diagrams
- optional video/embed later

## 5. Dashboard Gallery UX

Project editor should contain a Media section:

```text
Cover
[ Upload / Choose ]

Gallery
[ + Add images ]

┌──────────┐ ┌──────────┐ ┌──────────┐
│ image 01 │ │ image 02 │ │ image 03 │
│  Cover   │ │ Gallery  │ │ Gallery  │
└──────────┘ └──────────┘ └──────────┘

Drag to reorder
Set as cover
Edit alt text
Edit caption
Delete
```

## 6. Storage Path

Recommended:

```text
projects/{projectId}/cover/{fileName}
projects/{projectId}/gallery/{mediaId}-{fileName}
projects/{projectId}/screenshots/{mediaId}-{fileName}
projects/{projectId}/diagrams/{mediaId}-{fileName}
```

Do not rely on random top-level filenames.

## 7. Image Metadata

Store metadata in Firestore, but do not duplicate binary data in Firestore.

Use:

- `storagePath`
- `fileName`
- `mimeType`
- `sizeBytes`
- `width`
- `height`
- `kind`
- `alt.en`
- `alt.ar`
- `caption.en`
- `caption.ar`
- `sortOrder`

## 8. Localization

The image itself is shared, while text metadata is localized.

Do not upload duplicate English/Arabic copies of the same image unless the actual visual differs by language.

## 9. Future Case Studies

When case-study detail pages are added, the same gallery can be reused.

Potential blocks:

- Overview
- Challenge
- Approach
- Architecture
- Implementation
- Results
- Gallery

The gallery model already supports this without schema migration.
