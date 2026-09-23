# PROJEX — Contact / Inquiry System

## 1. Public Form

Suggested fields:

- Name — required
- Company — optional
- Email — required
- Phone — optional
- Service — required
- Project type — optional
- Budget — optional
- Message — required
- Attachment — optional

## 2. Submission Flow

```text
Public Contact Form
        ↓
client validation
        ↓
secure server endpoint / HTTPS function
        ↓
validation + anti-spam + normalization
        ↓
Firestore: inquiries/{id}
        ↓
notification function
        ↓
Admin dashboard
```

## 3. Status Workflow

```text
New
 ↓
Contacted
 ↓
Qualified
 ↓
Proposal
 ↓
Won / Lost
```

Side paths:

```text
New → Spam
Any open status → Archived
```

## 4. Priority

- Low
- Medium
- High

## 5. Dashboard Actions

- Assign owner
- Update status
- Set priority
- Add internal note
- Archive
- Restore
- Open attachments

## 6. Notifications

First version:

- new inquiry notification to the configured admin email

Later:

- Telegram
- Slack
- WhatsApp Business integration if operationally required

## 7. Email Confirmation

Optional public confirmation email:

"We received your request and will get back to you."

Do not include sensitive internal data in user-facing confirmation emails.

## 8. Validation

Server-side validate:

- email format
- max message length
- allowed service values
- attachment count
- attachment MIME types
- attachment size
- locale

## 9. Anti-Spam

Layer options:

1. honeypot field
2. server-side request throttling
3. App Check where appropriate
4. CAPTCHA/challenge if spam appears

Do not rely on client-side validation as the security boundary.
