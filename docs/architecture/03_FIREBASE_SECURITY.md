# PROJEX — Firebase Security Model

## 1. Security Goals

- Public users can read published public content.
- Public users cannot mutate business content.
- Public users can submit inquiries through a controlled path.
- Admin users can manage content according to role.
- Sensitive inquiry data is never publicly queryable.
- Storage is protected by path and role.

## 2. Roles

### super_admin

- full admin access
- manage admins
- manage all content
- manage inquiries
- manage media
- manage settings

### admin

- manage content
- manage projects/blog/services/testimonials/FAQ
- view and update inquiries
- manage media
- cannot create/delete super_admins

### editor

- create/update content
- publish content if permitted by workflow
- manage media
- cannot manage admins
- cannot access sensitive settings

### support

- view/update inquiries
- add internal notes
- change inquiry status
- limited content read access

## 3. Firestore Rules Strategy

Never use broad rules such as:

```text
allow read, write: if true;
```

Public content should be queryable only when its `status == 'published'` and the collection is intended for public access.

Admin content must require authenticated identity plus role validation.

## 4. Recommended Rule Concepts

Conceptual rules:

```text
public published content → read
admin/editor → manage content
support → inquiry access only
anonymous → create inquiry through controlled server path only
```

## 5. Inquiries

The public site should NOT expose unrestricted Firestore write access to `inquiries`.

Preferred flow:

```text
Browser form
    ↓
Next.js server endpoint OR HTTPS Cloud Function
    ↓
validation + anti-spam
    ↓
Firestore inquiry create
```

This allows server-side checks before writing.

## 6. Storage Rules

Recommended access:

### Public assets

Published project/blog media may be readable to the public when necessary for the website.

### Admin uploads

Upload/update/delete requires authenticated admin/editor permissions according to the resource.

### Inquiry attachments

Treat as private by default.

Access only to authorized admin/support roles.

## 7. App Check

Consider Firebase App Check for public-facing Firebase resources where supported.

Use it after the base auth/rules architecture is stable; do not make it a dependency for the first local prototype if it blocks development.

## 8. Rate Limiting / Anti-Spam

Inquiry submission should include:

- server-side validation
- request size limits
- basic rate limiting strategy
- honeypot or equivalent anti-bot measure
- attachment size/type validation

For serious production traffic, add an external anti-abuse layer if needed.

## 9. Secrets

Never expose:

- Firebase Admin SDK private keys
- service-account credentials
- server secrets
- privileged function secrets

Use server environment variables / secret management.

Public Firebase web config values are not substitutes for security rules.
