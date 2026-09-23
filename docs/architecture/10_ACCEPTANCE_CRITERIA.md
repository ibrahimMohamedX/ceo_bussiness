# PROJEX — Acceptance Criteria

## Public Website

- Existing visual design remains intact.
- EN/AR switching works.
- RTL/LTR works.
- Dark/light works.
- Dynamic content renders only when published.
- Missing data has graceful fallbacks.

## Admin

- Unauthenticated users cannot access dashboard pages.
- Roles are enforced.
- CRUD operations require authorization.
- Media uploads are restricted.
- Inquiry data is private.

## Projects

- Multiple images per project are supported.
- One cover can be selected.
- Gallery order is editable.
- EN/AR text exists.
- Project publish state works.

## Blog

- Posts can be drafted and published.
- EN/AR text exists.
- Categories/tags are editable.
- Cover media works.

## Inquiries

- Public form submits successfully.
- Server-side validation exists.
- Data reaches Firestore.
- Admin can view and update status.
- Notifications work when configured.

## Security

- No admin secrets in client code.
- Firestore rules deny unauthorized writes.
- Storage rules protect private files.
- Public users cannot read inquiries.

## Production Readiness

- Build passes.
- Security rules are tested.
- Admin authorization is tested.
- Dynamic public pages are tested in EN/AR.
- Media upload/delete is tested.
- Inquiry submission is tested.
