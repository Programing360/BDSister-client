# BDSisters.org — Comprehensive NID, Referral Gate & Identity Verification Flow Audit

**Document Version:** 1.0.0  
**Audit Date:** November 19, 2026  
**Auditor:** Senior Full-Stack QA Auditor & Security Architect  
**Scope:** End-to-End Registration, Referral Gate, Member Identity Verification, Admin Verification Desk, and Storage Security across Frontend and Backend.

---

## 1. End-to-End Flow Status Summary

```mermaid
flowchart TD
    A[Visitor with ?ref=SISTER26] -->|Visit /register| B[Registration Form]
    B -->|Current State| B1[Captures Name, Email, Password, ReferrerCode]
    B -.->|CRITICAL GAP| B2[NID/Passport Upload MISSING on /register]
    B1 -->|POST /api/auth/register| C[Backend Auth API]
    C -->|Creates User & Referral| D[Verify Email Notice]
    D -->|Login to Member Area| E[/member/profile/verification]
    E -->|Uploads NID Front/Back| F[VerificationUploadForm]
    F -->|POST /api/member/verification| G{Endpoint Status}
    G -->|BROKEN / 404| H[Silent Fail -> Local State Fakes 'PENDING_REVIEW']
    G -.->|TARGET ARCHITECTURE| I[Private Encrypted Vault S3/GCS]
    I --> J[/admin/verifications]
    J -->|CURRENT STATUS: 404| K[Route Missing; Uses Mock Data in Feature Module]
```

### High-Level Verdict:
| Flow Stage | Current Implementation Status | Security / Functional Verdict |
| :--- | :--- | :--- |
| **1. Registration & Referral Gate** (`/register`) | Referral code input with `?ref=` prefill is functional; referral records in DB. | **PARTIALLY COMPLIANT / CRITICAL GAP:** Mandatory NID/Passport upload is **completely absent from `/register`**. |
| **2. Post-Registration Member Verification** (`/member/profile/verification`) | Frontend UI with dual-side dropzones and AES-256 female officer notice exists. | **BROKEN ENDPOINT:** Form posts to `/api/member/verification` which returns **404 (Route does not exist)**; error is silently caught and state is faked in-memory. |
| **3. Member Status & Rejection Visibility** | Only receives `isVerified` boolean from server session/profile. | **NON-COMPLIANT:** Rejection reasons, admin feedback notes, and resubmission workflows are **not wired to server state**. |
| **4. Admin Verification Desk** (`/admin/verifications`) | Feature components and mock datasets built in `src/features/admin/verifications`. | **MISSING ROUTE:** Route `src/app/admin/verifications/page.tsx` **does not exist (404)**; admin review runs entirely on synthetic demo arrays. |
| **5. NID Storage & Data Privacy Security** | Avatar/product upload exists in `/api/member/upload` via public Cloudinary. | **CRITICAL SECURITY RISK:** No private, encrypted upload mechanism exists. Using the current upload service for NID would leak identity documents into public Cloudinary folders. |

---

## 2. Step-by-Step Codebase Audit Table

| Flow Step | File / Component Path | Current Code Behavior | Master Requirement & Expected Behavior | Gap / Severity |
| :--- | :--- | :--- | :--- | :--- |
| **REG-01** | `src/features/auth/components/register-form.tsx` | Extracts `searchParams.get("ref")` and pre-fills `referrerCode`. | Autofill `?ref=...` into input field with referral validation. | **Compliant** (UI Autofill works) |
| **REG-02** | `src/lib/validations/auth.ts`<br>`registerSchema` | `referrerCode: z.string().trim().min(3).max(30)` | Enforce referral code syntax and verify referrer existence. | **Medium Risk:** Accepts any arbitrary 3-character string without verifying referrer validity in the database. |
| **REG-03** | `src/features/auth/components/register-form.tsx` | Form fields: Name, Email, Password, Confirm Password, Referrer Code, Terms/Privacy checkboxes. | **Mandatory NID or Passport upload** (Front + Back image or multi-page PDF). | **CRITICAL GAP:** Zero file upload inputs exist on the registration form. Form states that verification occurs *after* registration. |
| **REG-04** | `src/features/auth/components/register-form.tsx` | Card with title *"Identity Confidentiality & Safe Space Disclosure"*. | Mandatory disclaimer directly beneath NID upload input: *"Only Admin will have access to ID documents..."*. | **Partial Gap:** Disclaimer text exists, but is detached from an actual upload input. |
| **REG-05** | `src/app/api/auth/register/route.ts` | Handles `name, email, password, referrerCode`; writes to `users` and `referrals` collections. | Must receive uploaded document reference/token, validate file MIME/size, and attach to pending verification record. | **High Gap:** API payload has no document upload schema or encrypted attachment handler. |
| **MEM-01** | `src/app/member/profile/verification/page.tsx` | Queries profile: `profile = await getProfileByUserId(session.user.id);` and computes `isVerified: boolean`. | Fetch full verification status record: `status` (`PENDING`, `APPROVED`, `REJECTED`, `ACTION_REQUIRED`), `idNumber`, `rejectionReason`, `submittedAt`. | **High Gap:** Drops all verification metadata; only passes `isVerified={isVerified}` to client component. |
| **MEM-02** | `src/features/profile/components/verification-upload-form.tsx` | Shows `VERIFIED` banner if verified; shows `PENDING_REVIEW` if pending; otherwise renders upload form. | If `REJECTED` or `ACTION_REQUIRED`, prominently display admin rejection note/reason with immediate **"Re-submit Documents"** workflow. | **High Gap:** Rejection reason is ignored; user cannot see why their document was rejected or what correction is required. |
| **MEM-03** | `src/features/profile/components/verification-upload-form.tsx` (Line 91) | `await apiClient.post("/api/member/verification", formData)` | Backend API route must receive multipart form or pre-signed URL, validate NID front/back, encrypt file, and save to database. | **CRITICAL BUG:** `/api/member/verification` **DOES NOT EXIST**. Request triggers 404, caught silently, creating an illusion of submission. |
| **ADM-01** | `src/app/admin/verifications` | Route folder does not exist. Navigating to `/admin/verifications` gives Next.js 404 page. | Dedicated administrative dashboard for female verification officers to review queue. | **CRITICAL BUG:** Missing page route `src/app/admin/verifications/page.tsx`. |
| **ADM-02** | `src/features/admin/verifications/data/admin-verifications-data.ts` | 8 hardcoded synthetic demo submissions (`DEMO_VERIFICATION_SUBMISSIONS`). | Connect to `GET /api/admin/verifications?status=PENDING` and `GET /api/admin/verifications/:id`. | **High Gap:** 100% reliant on static mock data; no database queries. |
| **ADM-03** | `src/features/admin/verifications/components/verification-review-panel.tsx` | Action buttons (Approve, Reject, Request More Info) update local React state. | `POST /api/admin/verifications/:id/approve`<br>`POST /api/admin/verifications/:id/reject`<br>`POST /api/admin/verifications/:id/request-info` | **High Gap:** No live backend mutations wired. |
| **SEC-01** | Database User / Member Profile Projection | Raw MongoDB queries in `getProfileByUserId` and `public-service.ts`. | NID numbers, document file keys, and raw images must be strictly excluded (`select: false` / `projection: { nidDocuments: 0 }`) from public member queries. | **HIGH SECURITY RISK:** If NID fields are added to user/profile documents without projection guards, `/api/users/:id` would leak PII to peers. |
| **SEC-02** | File Upload & Cloud Storage Driver | `src/app/api/member/upload/route.ts` uploads to public Cloudinary (`bdsisters/avatars`, `bdsisters/covers`). | NID/Passport files must be stored in private, server-side encrypted (AES-256) buckets with short-lived (15-minute) signed read URLs. | **CRITICAL SECURITY RISK:** Storing NID in standard Cloudinary or public bucket creates severe GDPR / Bangladesh Digital Security Act liabilities. |
| **SEC-03** | Audit Logging & Admin Tracking | `mock-security.ts` with static mock logs. | Every single time an admin officer views, zooms, or downloads an NID document, an immutable log entry must be written: `{ adminId, action: "VIEW_NID", targetUserId, timestamp, ip }`. | **High Gap:** Zero audit logging for identity document views. |

---

## 3. Critical Gaps & Security Risks Found

### Risk 1: The "Ghost Submission" Flaw (Missing `/api/member/verification` Route)
In `src/features/profile/components/verification-upload-form.tsx`:
```typescript
try {
  await apiClient.post("/api/member/verification", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
} catch {
  // Fallback or demo confirmation
}
setStatus("PENDING_REVIEW");
```
- **Finding:** The endpoint `/api/member/verification` does not exist in `src/app/api/member/`.
- **Impact:** Any user submitting their National ID receives a green success banner stating *"Verification submitted successfully!"*, but **no data or files are sent anywhere**. Upon page refresh, their status reverts back to unverified.

---

### Risk 2: Architectural Ambiguity — Sign-Up Upload vs. Post-Registration Verification
- **Finding:** 
  - The Master Requirement states: *"Check if mandatory NID or Passport upload (Front/Back or PDF/Image) is present on the registration form."*
  - The current codebase implements a **Post-Registration Verification Pattern** (`/member/profile/verification`), where registration only requires basic credentials (Name, Email, Password, Referral Code), and document upload occurs inside the member dashboard.
- **Analysis:**
  - Requiring dual-sided high-resolution ID uploads at `/register` on mobile devices causes a high registration drop-off rate (60–75%).
  - However, if the community policy strictly enforces a **"Gated Sanctuary"** where an account cannot be activated without an ID upload, `/register` must either include the file upload inputs directly or automatically redirect to a mandatory onboarding gate `/onboarding/verify-identity` prior to dashboard entry.

---

### Risk 3: Public Storage & Document Exposure Vulnerability
- **Finding:** The only existing upload route in the application (`src/app/api/member/upload/route.ts`) stores files in public Cloudinary image folders (`image/upload`).
- **Impact:** If NID documents are uploaded via this pipeline:
  1. The URLs are publicly indexable and accessible to anyone without authentication.
  2. PDF files are rejected by the MIME validator.
  3. No encryption-at-rest (AES-256) is applied.
- **Remediation:** Private storage architecture is required:
  - AWS S3 or Google Cloud Storage with **Bucket-Level Block Public Access**.
  - Document access mediated exclusively via presigned URLs with 15-minute TTL issued only to authenticated female verification officers.

---

### Risk 4: Missing Admin Desk Page Route (`/admin/verifications`)
- **Finding:** The entire Admin Step 3 Verification Suite was built inside `src/features/admin/verifications/`, but **no route file was created under `src/app/admin/verifications/page.tsx`**.
- **Impact:** Administrators clicking "Verifications" in the admin sidebar land on a 404 page.

---

### Risk 5: Rejection Feedback Black Hole
- **Finding:** If an administrator marks a verification as `REJECTED` or `ACTION_REQUIRED` (e.g., *"Photo is blurred, please upload clear Smart NID"*), the member's verification page does not display this message.
- **Impact:** Members have no visibility into why their application failed and cannot rectify issues.

---

## 4. Exact Implementation & Fix Plan

To make the complete Referral, NID Verification, and Admin Moderation flow 100% functional, secure, and compliant, the following phased changes must be executed:

### Phase A: Database Models & Encryption Layer
1. **Create `src/lib/db/repositories/verification-repository.ts`:**
   - Define collection `member_verifications`:
     ```typescript
     interface MemberVerificationRecord {
       id: string;
       userId: string;
       userEmail: string;
       userName: string;
       docType: "NID" | "PASSPORT" | "ACADEMIC";
       idNumberEncrypted: string; // AES-256 encrypted
       idNumberMasked: string;    // e.g. "1994********3108"
       frontDocumentKey: string;  // Private S3/GCS Object Key (Never public URL)
       backDocumentKey?: string;
       status: "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "ACTION_REQUIRED";
       rejectionReason?: string;
       adminNotes?: string;
       assignedOfficerId?: string;
       assignedOfficerName?: string;
       submittedAt: Date;
       reviewedAt?: Date;
       createdAt: Date;
       updatedAt: Date;
     }
     ```
2. **Field Masking & Projection Rules:**
   - In all public user services (`src/lib/services/profile-service.ts`, `public-service.ts`), strictly omit `idNumberEncrypted`, `frontDocumentKey`, and `backDocumentKey`.

---

### Phase B: Private Encrypted Storage Service
1. **Create `src/lib/storage/secure-vault.ts`:**
   - Implement upload handler writing to private cloud storage (AWS S3 / GCS / Cloudinary Private Authenticated).
   - Implement `generatePrivatePresignedUrl(objectKey: string, ttlSeconds: number = 900)`:
     Generates temporary signed URL expiring in 15 minutes.
   - Restrict generation strictly to sessions with role `FEMALE_VERIFICATION_OFFICER`, `ADMIN`, or `SUPER_ADMIN`.

---

### Phase C: Backend API Route Handlers
1. **Create `src/app/api/member/verification/route.ts`:**
   - `GET`: Returns the active member's verification status, masked ID number, submission date, and admin feedback/rejection notes.
   - `POST`: Accepts multipart form (`docType`, `idNumber`, `frontImage`, `backImage`), encrypts `idNumber`, stores files in secure vault, creates `member_verifications` document, updates `users.verificationStatus = "PENDING"`, and logs action in `audit_logs`.
2. **Create Admin Verification APIs:**
   - `src/app/api/admin/verifications/route.ts` (`GET` list with filters for `status`, `search`, `page`, `limit`).
   - `src/app/api/admin/verifications/[id]/route.ts` (`GET` single submission with 15-min signed document URLs).
   - `src/app/api/admin/verifications/[id]/review/route.ts` (`POST` approve, reject, or request info + audit log entry).

---

### Phase D: Member Verification UI Enhancements (`/member/profile/verification`)
1. **Update `src/app/member/profile/verification/page.tsx`:**
   - Fetch real verification state from `verification-repository`.
   - Pass `initialStatus`, `rejectionReason`, `idNumberMasked`, and `submittedAt` to `VerificationUploadForm`.
2. **Update `src/features/profile/components/verification-upload-form.tsx`:**
   - Add explicit **Rejection / Action Required Alert Card**:
     - Red warning box displaying Admin Note: *"Document was rejected because: [Reason]"*.
     - One-click **"Re-submit New Documents"** button that unlocks the dropzones.
   - Connect live form submission to `POST /api/member/verification` without silent catch.

---

### Phase E: Admin Verification Route Creation (`/admin/verifications`)
1. **Create `src/app/admin/verifications/page.tsx`:**
   - Mount `<VerificationsListView />`.
2. **Create `src/app/admin/verifications/[id]/page.tsx`:**
   - Mount `<VerificationDetailsView verificationId={id} />`.
3. **Wire Live TanStack Query / `apiClient` hooks:**
   - Replace static imports from `admin-verifications-data.ts` with calls to `/api/admin/verifications`.

---

### Phase F: Sign-Up Form Alignment (`/register`)
- **Option 1 (Two-Stage Registration — Recommended):**
  - Keep `/register` lightweight for maximum conversion (Name, Email, Password, Referral Code).
  - Add explicit step progress indicator: *"Step 1 of 2: Create Account"*.
  - Upon registration, automatically route the new member to `/member/profile/verification` with banner: *"Welcome sister! Upload your NID or Passport to complete your identity authentication and unlock seller features"*.
- **Option 2 (Strict Gated Registration):**
  - Integrate NID Front/Back file inputs directly into `register-form.tsx` and `registerSchema`.
  - Pass files through a pre-upload step to `/api/upload/secure-temp` before calling `POST /api/auth/register`.

---

## 5. Security & Compliance Checklist

| Security Control | Current State | Required Target State |
| :--- | :--- | :--- |
| **AES-256 ID Encryption** | Claimed in UI banner only | Implemented in backend repository via Node `crypto` (`aes-256-gcm`) before database insert. |
| **Access Control (RBAC)** | General Admin role check | Strict restriction to `female_verification_officer`, `ADMIN`, `SUPER_ADMIN`. |
| **Document URL Exposure** | Public Cloudinary URLs in upload route | Private S3/GCS keys; pre-signed URLs expiring in 15 minutes. |
| **Audit Logging** | UI demonstration tables | Database-backed audit trail logging every view, zoom, and decision on NID files. |
| **Referral Code Integrity** | Syntactic length check only (3–30 chars) | Validates that referral code belongs to an active, verified BDSisters member. |

---

## 6. Verification & Sign-Off
- **Report Status:** Finalized & published.
- **Codebase Integrity:** 100% untouched during this audit turn (Strict Read-Only mode preserved).
- **Next Step:** Awaiting user instruction to implement **Phase A through Phase F**.
