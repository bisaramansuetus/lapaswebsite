# LapAs Security Specification & Verification Plan

## 1. Data Invariants
1. **Published-Only Public Reads**: Unauthenticated visitors and non-admin readers can only read `articles` and `contributors` where `status == 'published'`. Drafts remain inaccessible.
2. **PII Isolation (`users`, `consultations`, `artwork_submissions`)**:
   - `consultations` (containing email, WhatsApp, legal problem description) is write-once (`create` with `status == 'baru'`, `consentPrivacy == true`, `adminNotes == ''`) and strictly readable/updatable/deletable ONLY by verified Admins.
   - `artwork_submissions` (containing submitter email and unmoderated content) is write-once (`create` with `status == 'pending'`, `moderatorNote == ''`) and strictly readable/updatable/deletable ONLY by verified Admins.
   - `users` documents are readable only by the document owner or verified Admins. Self-registration forces `role == 'reader'`.
3. **Admin Authorization & Verification**: Admin status requires `request.auth != null && request.auth.token.email_verified == true` and either the bootstrapped owner email (`mansuetobisara@gmail.com`) or an explicit `role == 'admin'` document in `/users/{uid}`.
4. **Immutable Audit Timestamps & Strict Keys**: Every document enforces exact key allowlists (`hasAll` + `hasOnly`), bounded string sizes, regex-validated IDs (`^[a-zA-Z0-9_-]+$`), and server-verified timestamps (`request.time`).

## 2. Adversarial "Dirty Dozen" Payloads (Expected: PERMISSION_DENIED)
1. **Unauthenticated Draft Read**: `GET /articles/draft-id` where `status == 'draft'` -> DENIED.
2. **Unfiltered Article List Scrape**: `LIST /articles` without `where('status', '==', 'published')` -> DENIED by `allow list: if existing().status == 'published' || isAdmin()`.
3. **Consultation Leak**: Authenticated non-admin `GET /consultations/any-id` or `LIST /consultations` -> DENIED.
4. **Submission Pre-Approval Bypass**: Public `POST /artwork_submissions/{id}` with `status: 'approved'` -> DENIED (`incoming().status == 'pending'` enforced).
5. **Consultation Ghost Field Injection**: Public `POST /consultations/{id}` with extra field `isAdmin: true` -> DENIED (`hasOnly` check).
6. **Self-Privilege Escalation**: Authenticated user `POST /users/{uid}` with `role: 'admin'` -> DENIED (`incoming().role == 'reader'` enforced for non-admins).
7. **Profile Role Tampering**: Authenticated user `PATCH /users/{uid}` changing `role` to `'admin'` -> DENIED (`affectedKeys().hasOnly(['displayName', 'photoUrl', 'updatedAt'])`).
8. **Unverified Email Spoofing**: Token with `email: 'mansuetobisara@gmail.com'` and `email_verified: false` -> DENIED (`email_verified == true` enforced).
9. **ID Poisoning**: `POST /books/..%2Fadmin` or 200-char ID -> DENIED (`isValidId` regex + max length 128).
10. **Denial-of-Wallet Oversized Content**: `POST /consultations/{id}` with 100KB `description` -> DENIED (`description.size() <= 5000`).
11. **Backdated Timestamp Injection**: `POST /consultations/{id}` with client-supplied past `createdAt` -> DENIED (`createdAt == request.time`).
12. **Public Mutation of Site Settings or Books**: Unauthenticated or non-admin `PUT /site_settings/general` or `POST /books/{id}` -> DENIED.
