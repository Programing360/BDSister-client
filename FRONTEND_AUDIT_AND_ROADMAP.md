# BDSisters.org — Comprehensive Frontend Architecture Audit, API Gap Analysis & Integration Roadmap

> **Document Version:** 1.0.0  
> **Auditor:** Senior Frontend Architect, UI/UX Specialist & Full-Stack Integration Lead  
> **Target Codebase:** `bdsisters/src` (Next.js 15 App Router, React 19, TypeScript, Tailwind CSS v4)  
> **Backend API Spec:** 62 REST Endpoints across 14 Functional Domains  
> **Execution Status:** **AUDIT & ROADMAP COMPLETE — SOURCE CODE UNMODIFIED**

---

## Table of Contents
1. [Executive Summary](#1-executive-summary)
2. [Frontend Architecture & Tech Stack Assessment](#2-frontend-architecture--tech-stack-assessment)
3. [Master Implementation Matrix (Page & Route-by-Route)](#3-master-implementation-matrix)
4. [Detailed Gap Analysis by Domain (All 62 Endpoints)](#4-detailed-gap-analysis-by-domain)
   - 4.1 Authentication & Identity (`/api/auth`)
   - 4.2 Users & Sisterhood Directory (`/api/users`)
   - 4.3 Business Profiles & Directory (`/api/business`)
   - 4.4 E-Commerce, Marketplace & Orders (`/api/ecommerce`)
   - 4.5 Community & Forum (`/api/forum`)
   - 4.6 Events & Workshops (`/api/events`)
   - 4.7 Resource Library & LMS (`/api/resources`)
   - 4.8 Discover Yourself & Goal Tracking (`/api/goals`)
   - 4.9 CMS & Dynamic Content (`/api/cms`)
   - 4.10 In-App Notifications (`/api/notifications`)
   - 4.11 Contact Submissions (`/api/contact`)
   - 4.12 Newsletter Subscription (`/api/newsletter`)
   - 4.13 Payments & ZiniPay Gateway (`/api/payment`)
   - 4.14 Admin Operations & Governance (`/api/admin`)
5. [Cleanup & Deprecation Registry (Dead Code & Mock Data)](#5-cleanup--deprecation-registry)
6. [Privacy, Role-Based UI & Edge-Case Checklist](#6-privacy-role-based-ui--edge-case-checklist)
7. [Prioritized Session-by-Session Execution Roadmap](#7-prioritized-session-by-session-execution-roadmap)

---

## 1. Executive Summary

BDSisters.org is an enterprise-grade digital ecosystem dedicated to the socio-economic empowerment of Bangladeshi women, entrepreneurs, professionals, and artisans. Over 13 iterative frontend sprints, an extensive user interface spanning **528 statically compiled routes and pages** has been constructed.

### Key Strengths
- **Exhaustive Admin Suite (Steps 1–13):** The administrative dashboard provides enterprise-grade management UI for Foundation, Analytics, Members, Roles, Profiles, Businesses, E-commerce, Payments/Subscriptions, Community/Forum, Events, Resources/LMS, CMS, and Communications.
- **Robust Type Definitions:** Comprehensive TypeScript interfaces in `src/types` (`auth.ts`, `profile.ts`, `business.ts`, `product.ts`, `order.ts`, etc.) with strict Zod validation schemas in `src/lib/validations`.
- **High Build & Test Integrity:** Webpack compiles cleanly with zero TypeScript errors (`tsc --noEmit`), and 174 automated unit tests pass 100%.

### Critical Deficits & Architecture Gaps
1. **Direct MongoDB Coupling in Frontend Services:** The member and public services (`src/lib/services/profile-service.ts`, `business-service.ts`, `shop-service.ts`, etc.) directly invoke `getDatabase()` from `src/lib/db/mongodb.ts`. In a decoupled REST architecture where a separate 62-endpoint backend exists, the frontend must communicate purely via HTTP client (`apiClient`) rather than direct database driver calls.
2. **API Client URL Concatenation Bug:** In `src/lib/api/client.ts`, `BASE_URL` is configured as `${origin}/api`. When endpoints like `/api/users` are passed, URLs are constructed as `http://localhost:3000/api/api/users`, causing 404 routing failures.
3. **Missing High-Value Modules:**
   - **Discover Yourself & Goal Tracking (`/api/goals`):** The 80/20 analysis engine and the Holistic Development Wheel visualization are completely missing from the frontend (`❌ Missing`).
   - **Hover Tooltips System (`GET /api/cms/tooltips`):** No global tooltip dictionary provider or hover trigger component exists to explain platform terms dynamically.
   - **Sisterhood Directory (`GET /api/users`):** There is no public or member-facing directory view to search and filter sisters by wing, district, and skills.
   - **Referral Code Registration:** The registration form (`register-form.tsx`) lacks a `referrerCode` field and query parameter auto-fill (`?ref=...`).
4. **Member Dashboard Stubs:** 13 member pages (`/member/community`, `/member/events`, `/member/learning`, `/member/billing`, `/member/membership`, `/member/notifications`, `/member/messages`, `/member/support`, `/member/wishlist`, etc.) are static "Coming soon." stubs.
5. **Payment Gateway Standardization:** Standardized on **ZiniPay** (`/api/payment/zinipay/*`) as the primary hosted payment gateway for BDSisters.org, powering bKash, Nagad, Rocket, Upay, and Visa/Mastercard transactions across marketplace checkout, membership upgrades, and event ticketing.
6. **Admin Route Protection Vulnerability:** `src/app/admin/layout.tsx` does not execute server-side session authentication (`requireServerSession()`), allowing unauthenticated client navigation into the admin shell.

---

## 2. Frontend Architecture & Tech Stack Assessment

### Current Stack
| Layer | Technology | Version / Implementation | Notes |
|---|---|---|---|
| Framework | Next.js App Router | 15.x / React 19 | Static page pre-generation with `experimental: { cpus: 1 }` |
| Styling | Tailwind CSS | v4.x | Custom gradients, glassmorphism, responsive grid system |
| UI Kit & Icons | HeroUI, Lucide React, React Icons | Mixed | Rich iconography with Lucide; social icons via `react-icons/fa` |
| Form & Validation | React Hook Form + Zod | `@hookform/resolvers/zod` | Implemented in Auth, Profile, Product wizards |
| Server State | TanStack Query (React Query) | v5 (`QueryProvider`) | Initialized in `src/providers`, but underutilized in views |
| Animations | AOS (Animate On Scroll) | `AosProvider` | Active on public landing sections |
| Client Auth | Better-Auth Client | `src/lib/auth/auth-client.ts` | Email/password sign-in and session hooks |

### API Client Architecture Analysis (`src/lib/api/client.ts`)
```typescript
// CURRENT DEFECT in src/lib/api/client.ts:
const BASE_URL = process.env["NEXT_PUBLIC_API_URL"] ??
  (typeof window !== "undefined" ? window.location.origin + "/api" : "http://localhost:3000/api");

function buildUrl(path: string, params?: Record<string, any>): string {
  // If path is "/api/users", this produces "http://localhost:3000/api/api/users"
  const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;
  ...
}
```
**Required Architectural Fix:**
- Standardize `BASE_URL` without the `/api` suffix (`process.env.NEXT_PUBLIC_API_URL ?? window.location.origin`).
- Standardize all endpoint paths in `src/lib/api/endpoints.ts` to include `/api/...`.
- Add an automatic Bearer token / Session cookie interceptor with 401 unauthenticated redirect handling.

---

## 3. Master Implementation Matrix

Status Legend:
- `✅ Completed & API-Connected` — Built and wired to live backend API.
- `🟡 UI Built with Mock Data / Needs API Integration` — High fidelity UI built, consuming local mock data or direct MongoDB services; requires REST API client hookup.
- `⚠️ Needs Refactor/Update` — Page exists but lacks required fields, uses deprecated services (e.g. ZiniPay), or has route protection issues.
- `❌ Missing` — Entire route or core component is absent from codebase.

### 3.1 Public Portal (`src/app/(public)`)
| Route | Page / Feature | Status | Current Data Source | Target Backend Endpoint | Key Actions Needed |
|---|---|---|---|---|---|
| `/` | Homepage Hero, Stats, Highlights | 🟡 | `publicService` / `mock-data.ts` | `GET /api/cms/pages/home`, `GET /api/cms/blocks` | Wire dynamic CMS blocks & stats |
| `/about` | About BDSisters | 🟡 | `mock-data.ts` | `GET /api/cms/pages/about` | Connect CMS page slug loader |
| `/about/mission-vision` | Mission & Vision | 🟡 | Static text | `GET /api/cms/pages/mission-vision` | Connect CMS page loader |
| `/about/our-team` | Team Directory | 🟡 | `MOCK_TEAM_MEMBERS` | `GET /api/cms/blocks?type=TEAM` | Wire dynamic team query |
| `/about/muhsina` | Muhsina Wing Profile | 🟡 | Static text | `GET /api/cms/pages/muhsina` | Dynamic content integration |
| `/businesses` | Public Business Directory | 🟡 | `publicService.getBusinesses()` | `GET /api/business` | Connect search, category & district filters |
| `/businesses/[slug]` | Business Profile Detail | 🟡 | `publicService.getBusinessBySlug()` | `GET /api/business/:id`, `POST /api/business/:id/affiliate-click` | Implement affiliate click tracker |
| `/marketplace` | E-Commerce Shop / Grid | 🟡 | `publicService.getProducts()` | `GET /api/ecommerce/products` | Connect live product catalog & price filters |
| `/marketplace/[slug]` | Product Detail View | 🟡 | `publicService.getProductBySlug()` | `GET /api/ecommerce/products/:id` | Dual rating display (product + seller) |
| `/cart` | Shopping Cart Drawer / Page | 🟡 | `cart-service.ts` (localStorage/DB) | `GET /api/ecommerce/cart`, `POST /api/ecommerce/cart` | Wire cart API sync |
| `/checkout` | Checkout & Payment Gate | ⚠️ | Direct order DB creation | `POST /api/ecommerce/checkout`, `POST /api/payment/zinipay/init` | Connect ZiniPay hosted checkout |
| `/checkout/success` | Payment Success Callback | ⚠️ | Local state | `GET /api/payment/zinipay/verify` | Validate transaction ID via ZiniPay |
| `/checkout/failed` | Payment Failure Handler | ⚠️ | Static text | — | Provide retry payment button with session |
| `/checkout/cancelled` | Payment Cancellation | ⚠️ | Static text | — | Restore cart & redirect to checkout |
| `/community` | Public Community Teaser | 🟡 | `MOCK_COMMUNITY_CIRCLES` | `GET /api/forum/posts?teaser=true` | Wire guest teaser with blurred paid posts |
| `/events` | Events & Conferences | 🟡 | `publicService.getEvents()` | `GET /api/events` | Wire live event listing & category tabs |
| `/events/[slug]` | Event Detail & RSVP Gate | 🟡 | `publicService.getEventBySlug()` | `GET /api/events/:id`, `POST /api/events/:id/rsvp` | Wire RSVP & ticket purchase modal |
| `/learning` | Learning Center Courses | 🟡 | `publicService.getCourses()` | `GET /api/resources?type=COURSE` | Wire live course catalog |
| `/learning/[slug]` | Course Overview & Outline | 🟡 | `publicService.getCourseBySlug()` | `GET /api/resources/:id` | Wire enrollment action |
| `/resources` | Knowledgebase & Downloads | 🟡 | `publicService.getResources()` | `GET /api/resources` | Wire live resources with search & tag filter |
| `/resources/[slug]` | Resource Detail & Download | 🟡 | `mock-data.ts` | `GET /api/resources/:id/download` | Wire authorized PDF/file downloader |
| `/contact` | Contact Us Inquiries | 🟡 | Mock form submission | `POST /api/contact` | Wire contact form API submission |
| `/faq` | Frequently Asked Questions | 🟡 | `MOCK_FAQS` | `GET /api/cms/pages/faq` | Wire CMS FAQ loader |
| `/privacy-policy` | Privacy Policy Document | 🟡 | Static text | `GET /api/cms/pages/privacy-policy` | Dynamic CMS policy loader |
| `/terms` | Terms of Service Document | 🟡 | Static text | `GET /api/cms/pages/terms` | Dynamic CMS terms loader |
| `/members` | Public Member Directory | ❌ | Does not exist | `GET /api/users` | Build public directory with wing/skills filter |
| `/members/[id]` | Public Sister Profile View | ❌ | Does not exist | `GET /api/users/:id` | Build sanitized public profile card view |

---

### 3.2 Authentication & Onboarding (`src/app/(auth)`)
| Route | Page / Feature | Status | Current Data Source | Target Backend Endpoint | Key Actions Needed |
|---|---|---|---|---|---|
| `/register` | Sign Up with Referral Code | ⚠️ | Better-Auth `signUp.email` | `POST /api/auth/register` | Add `referrerCode` input + URL `?ref=` prefill |
| `/login` | User Sign In | ✅ | Better-Auth `signIn.email` | `POST /api/auth/login` | Working; verify JWT token handoff |
| `/forgot-password` | Password Recovery Request | ✅ | Better-Auth `forgetPassword` | `POST /api/auth/forgot-password` | Working |
| `/reset-password` | Password Reset Token Form | ✅ | Better-Auth `resetPassword` | `POST /api/auth/reset-password` | Working |
| `/verify-email` | Email Verification Callback | 🟡 | Better-Auth callback | `GET /api/auth/verify-email` | Verify auto-login on email confirmation |

---

### 3.3 Member Dashboard (`src/app/member`)
| Route | Page / Feature | Status | Current Data Source | Target Backend Endpoint | Key Actions Needed |
|---|---|---|---|---|---|
| `/member` | Member Overview Dashboard | 🟡 | `profile-service.ts` / MongoDB | `GET /api/auth/me`, `GET /api/goals/wheel` | Wire REST session + Holistic Wheel preview |
| `/member/profile` | Personal Profile Hub | 🟡 | `profile-service.ts` / MongoDB | `GET /api/auth/me` | Add "Export as PDF" button (`/api/auth/export-pdf`) |
| `/member/profile/edit` | Profile Edit Wizard | ⚠️ | Direct `/api/member/profile` PUT | `PATCH /api/auth/me/contact`, `POST /api/auth/me/submit-review` | Add "Save as Draft" vs "Submit for Review" |
| `/member/profile/privacy` | Privacy & Visibility Toggles | 🟡 | `profile-service.ts` | `PATCH /api/auth/me/contact` | Verify private contact unchecked by default |
| `/member/profile/skills` | Skills & Endorsements | 🟡 | Direct MongoDB update | `PATCH /api/auth/me/contact` | Wire skills tags and category taxonomy |
| `/member/profile/verification`| Sisterhood ID Verification | ⚠️ | Static instructions | `POST /api/member/verification`, `GET /api/auth/me` | Add NID upload form with NID privacy disclaimer |
| `/member/goals` | Discover Yourself & Goals | ❌ | Does not exist | `GET /api/goals`, `POST /api/goals`, `GET /api/goals/wheel` | Build 80/20 & Holistic Development Wheel UI |
| `/member/community` | Discussion Forum Feeds | ❌ | "Coming soon." stub | `GET /api/forum/categories`, `GET /api/forum/posts` | Build discussion feeds, filters & post editor |
| `/member/community/posts` | My Discussions & Replies | ❌ | "Coming soon." stub | `GET /api/forum/posts?author=me` | Build my-activity feed & bookmark list |
| `/member/business` | My Business Dashboard | 🟡 | `business-service.ts` | `GET /api/business?owner=me` | Wire business analytics & active subscription |
| `/member/business/create` | Business Onboarding Wizard | 🟡 | `business-service.ts` | `POST /api/business` | Wire business creation form |
| `/member/business/[id]` | Business Management Hub | 🟡 | `business-service.ts` | `GET /api/business/:id` | Wire business settings & affiliations |
| `/member/business/[id]/edit`| Edit Business Details | 🟡 | `business-service.ts` | `PATCH /api/business/:id` | Wire update mutations |
| `/member/shop` | Seller Storefront Center | 🟡 | `shop-service.ts` | `GET /api/ecommerce/products?seller=me` | Wire seller sales metrics & store settings |
| `/member/products` | Seller Product Catalog | 🟡 | `product-service.ts` | `GET /api/ecommerce/products?seller=me` | Wire seller product inventory table |
| `/member/products/create` | Add New Product Wizard | 🟡 | `product-service.ts` | `POST /api/ecommerce/products` | Wire product creation with MRP vs Sale price |
| `/member/products/[productId]`| Product Inventory & Edit | 🟡 | `product-service.ts` | `PATCH /api/ecommerce/products/:id` | Wire stock decrement and image uploads |
| `/member/orders` | Member Purchase Orders | 🟡 | `order-service.ts` | `GET /api/ecommerce/orders?type=buyer` | Wire order status tracker & invoice PDF |
| `/member/orders/[id]` | Order Detail & Dual Rating | ⚠️ | `order-service.ts` | `GET /api/ecommerce/orders/:id`, `POST /api/ecommerce/orders/:id/reviews` | Implement dual rating (Product + Delivery) |
| `/member/seller/orders` | Seller Fulfillment Queue | 🟡 | `order-service.ts` | `GET /api/ecommerce/orders?type=seller` | Wire order status update (`DISPATCHED`) |
| `/member/events` | My Registered Events | ❌ | "Coming soon." stub | `GET /api/events?registered=true` | Build event ticket pass & calendar export |
| `/member/learning` | My Enrolled Courses | ❌ | "Coming soon." stub | `GET /api/resources?enrolled=true` | Build LMS learning progress & video player |
| `/member/billing` | Invoices & Subscriptions | ❌ | "Coming soon." stub | `GET /api/payment/invoices`, `GET /api/business/:id/subscription` | Build subscription renewal & payment history |
| `/member/membership` | Membership Tier Upgrade | ❌ | "Coming soon." stub | `POST /api/payment/zinipay/init` | Build tier comparison & ZiniPay checkout |
| `/member/notifications` | In-App Alert Inbox | ❌ | "Coming soon." stub | `GET /api/notifications`, `PATCH /api/notifications/:id/read` | Build notification inbox with unread badges |
| `/member/wishlist` | Saved Products & Resources | ❌ | "Coming soon." stub | `GET /api/ecommerce/wishlist` | Build saved items grid |
| `/member/support` | Member Help & Tickets | ❌ | "Coming soon." stub | `POST /api/contact`, `GET /api/support/tickets` | Build ticket submission & response tracker |

---

### 3.4 Admin Dashboard (`src/app/admin`)
| Route Area | Pages Count | Status | Current Data Source | Target Backend Endpoint | Key Actions Needed |
|---|---|---|---|---|---|
| `/admin` | Overview Dashboard | 🟡 | `admin-mock-data.ts` | `GET /api/admin/analytics` | Wire real KPI metrics & revenue charts |
| `/admin/members` | Member Directory & Edit | 🟡 | `admin-mock-data.ts` | `GET /api/users`, `PATCH /api/admin/users/:id` | Connect member table with role changes |
| `/admin/verifications` | NID & Sisterhood Approvals | ⚠️ | `admin-mock-data.ts` | `GET /api/admin/users/pending-verification`, `GET /api/admin/users/:id/nid` | Connect secure NID document viewer |
| `/admin/roles` | RBAC Permissions Manager | 🟡 | `admin-mock-data.ts` | `GET /api/admin/roles`, `PATCH /api/admin/roles` | Connect role permission matrix |
| `/admin/businesses` | Business Profiles & Approval | 🟡 | `admin-mock-data.ts` | `GET /api/business`, `PATCH /api/admin/business/:id/status` | Connect business approval & audit queue |
| `/admin/products` | E-Commerce Product Catalog | 🟡 | `admin-mock-data.ts` | `GET /api/ecommerce/products` | Connect catalog moderation & featured flags |
| `/admin/orders` | Store Orders & Delivery | 🟡 | `admin-mock-data.ts` | `GET /api/ecommerce/orders` | Connect platform order fulfillment table |
| `/admin/payments` | Transactions & Invoices | 🟡 | `mock-payments.ts` | `GET /api/admin/payments`, `GET /api/admin/audit-logs` | Connect payment ledger & gateway refunds |
| `/admin/subscriptions`| Subscriptions & Renewals | 🟡 | `mock-memberships.ts`| `PATCH /api/admin/subscriptions/:id/approve` | Connect manual/bKash subscription approvals |
| `/admin/community` | Forum Posts & Moderation | 🟡 | `mock-community.ts` | `GET /api/forum/posts`, `POST /api/forum/posts/:id/report` | Connect moderation queue & post removal |
| `/admin/events` | Events, Workshops & Tickets | 🟡 | `mock-events.ts` | `GET /api/events`, `POST /api/events` | Connect event management & attendee lists |
| `/admin/resources` | LMS Courses & Downloads | 🟡 | `mock-resources.ts` | `GET /api/resources`, `POST /api/resources` | Connect resource publishing & enrollments |
| `/admin/cms` | Page Builder, Menus, SEO | 🟡 | `mock-cms.ts` | `PUT /api/admin/cms/pages/:id`, `GET /api/cms/blocks` | Connect CMS page editor & revision logs |
| `/admin/communication`| Contacts, Email, Alerts | 🟡 | `mock-communication.ts` | `POST /api/admin/announcements`, `GET /api/admin/contacts` | Connect support inbox & notification blasts |
| `/admin/system` | Audit Logs & API Keys | 🟡 | `admin-mock-data.ts` | `GET /api/admin/audit-logs`, `GET /api/admin/partner-keys` | Connect system security log & key generator |

---

## 4. Detailed Gap Analysis by Domain

### 4.1 Domain 1: Authentication & Identity (`/api/auth`)
**Backend Endpoints:**
1. `POST /api/auth/register`
2. `POST /api/auth/login`
3. `POST /api/auth/logout`
4. `GET /api/auth/me`
5. `PATCH /api/auth/me/contact`
6. `POST /api/auth/me/submit-review`
7. `GET /api/auth/export-pdf`
8. `GET /api/auth/verify-email`
9. `POST /api/auth/forgot-password`
10. `POST /api/auth/reset-password`

**Frontend Findings & Gaps:**
- **Missing Referral Registration:** `src/features/auth/components/register-form.tsx` has no input for `referrerCode`. The URL search param `?ref=...` is not parsed into form default values.
- **Missing Draft vs. Submit for Review:** The backend supports submitting a profile for official review (`POST /api/auth/me/submit-review`). Currently, `profile-edit-form.tsx` immediately attempts a direct update without distinguishing draft edits from official verification submissions.
- **Missing Export PDF UI Trigger:** Backend endpoint `GET /api/auth/export-pdf` generates an authenticated member profile PDF. No UI button exists in `profile-header.tsx` or `/member/profile` to invoke this download.
- **Contact Details Splitting:** `PATCH /api/auth/me/contact` accepts partial contact and privacy updates (`phone`, `address`, `privacySettings`). Current frontend uses a monolithic `/api/member/profile` PUT.

---

### 4.2 Domain 2: Users & Sisterhood Directory (`/api/users`)
**Backend Endpoints:**
11. `GET /api/users` (Directory search, wing filtering, skills filtering, pagination, sorting by name/createdAt/updatedAt)
12. `GET /api/users/:id` (Public profile viewer, privacy sanitized)

**Frontend Findings & Gaps:**
- **No Public/Member Directory Page:** The directory endpoint `GET /api/users` is only consumed inside the restricted `/admin/members` console. There is **NO public directory page** (`/members`) and **NO peer discovery page** in `/member/directory`.
- **Missing Public Profile Viewer (`/members/[id]`):** While members can view their own profile at `/member/profile`, there is no route or component to view another sister's public profile respecting their `privacySettings` (e.g. hidden phone, hidden email).

---

### 4.3 Domain 3: Business Profiles & Directory (`/api/business`)
**Backend Endpoints:**
13. `GET /api/business`
14. `POST /api/business`
15. `GET /api/business/:id`
16. `PATCH /api/business/:id`
17. `DELETE /api/business/:id`
18. `POST /api/business/:id/affiliate-click`
19. `GET /api/business/:id/subscription`

**Frontend Findings & Gaps:**
- **Missing Affiliate Link Click Tracking:** `POST /api/business/:id/affiliate-click` is designed to record conversions/outbound traffic when a user clicks a business's external shop or website link. `src/features/public/businesses/components/business-detail-view.tsx` links directly to external URLs with standard `<a href>` tags without firing the analytics tracking endpoint.
- **Subscription Gate Verification:** Business features (such as featured badges, unlimited product listings, or custom domains) require an active business subscription. `GET /api/business/:id/subscription` needs to be checked before unlocking premium shop features in `/member/business`.

---

### 4.4 Domain 4: E-Commerce, Marketplace & Orders (`/api/ecommerce`)
**Backend Endpoints:**
20. `GET /api/ecommerce/products`
21. `GET /api/ecommerce/products/:id`
22. `POST /api/ecommerce/products`
23. `PATCH /api/ecommerce/products/:id`
24. `DELETE /api/ecommerce/products/:id`
25. `GET /api/ecommerce/cart`
26. `POST /api/ecommerce/cart`
27. `DELETE /api/ecommerce/cart/:itemId`
28. `POST /api/ecommerce/checkout`
29. `GET /api/ecommerce/orders`
30. `GET /api/ecommerce/orders/:id`
31. `POST /api/ecommerce/orders/:id/reviews`

**Frontend Findings & Gaps:**
- **Dual Ratings UI Missing:** The BDSisters specification requires separate ratings: (a) **Product Quality Rating** (1–5 stars) and (b) **Seller & Delivery Experience Rating** (1–5 stars). In `/member/orders/[id]`, review submission is either missing or only models a single star rating.
- **MRP vs. Discount Display Consistency:** While `product-utils.ts` has `calculateDiscountPercent()`, several catalog views (`marketplace-card.tsx`) do not clearly emphasize the original Bangladeshi MRP strike-through vs. Member Discount price.
- **Cart API Synchronization:** Guest carts in `localStorage` are not synced with `POST /api/ecommerce/cart` upon user login.

---

### 4.5 Domain 5: Community & Forum (`/api/forum`)
**Backend Endpoints:**
32. `GET /api/forum/categories`
33. `GET /api/forum/posts` (with `teaser=true` parameter for guest visitors)
34. `POST /api/forum/posts`
35. `GET /api/forum/posts/:id`
36. `PATCH /api/forum/posts/:id`
37. `DELETE /api/forum/posts/:id`
38. `POST /api/forum/posts/:id/comments`
39. `POST /api/forum/posts/:id/like`
40. `POST /api/forum/posts/:id/report`

**Frontend Findings & Gaps:**
- **Member Discussion Portal is a Stub:** `/member/community` and `/member/community/posts` contain only 8 lines of code displaying `"Coming soon."`. Members cannot create threads, post comments, like discussions, or report violations.
- **Guest Teaser Blur Gate:** On the public `/community` page, non-logged-in guests should see thread titles and the first 2 sentences, followed by a gradient blur and a `"Join BDSisters to Read & Reply"` prompt. Currently, `/community` displays static informational circle cards rather than live teaser posts.

---

### 4.6 Domain 6: Events & Workshops (`/api/events`)
**Backend Endpoints:**
41. `GET /api/events`
42. `GET /api/events/:id`
43. `POST /api/events/:id/rsvp`
44. `POST /api/events/:id/ticket`
45. `GET /api/events/archive`

**Frontend Findings & Gaps:**
- **Member Event Attendance Hub:** `/member/events` is a `"Coming soon."` stub. Registered members have no interface to retrieve their QR ticket passes, add events to Google/Outlook Calendar, or access meeting Zoom links.
- **RSVP & Paid Ticket Flow:** On `/events/[slug]`, the RSVP button triggers a local toast instead of invoking `POST /api/events/:id/rsvp` (free) or initiating a ZiniPay ticket checkout session via `POST /api/events/:id/ticket`.

---

### 4.7 Domain 7: Resource Library & LMS (`/api/resources`)
**Backend Endpoints:**
46. `GET /api/resources`
47. `GET /api/resources/:id`
48. `GET /api/resources/:id/download`

**Frontend Findings & Gaps:**
- **Authorized Download Stream:** `GET /api/resources/:id/download` verifies membership tier before streaming PDFs, templates, or worksheets. Current public resource pages use raw direct links.
- **Member Learning Hub Stub:** `/member/learning` and `/member/courses` are `"Coming soon."` stubs. Members cannot view their course progress or lesson outlines.

---

### 4.8 Domain 8: Discover Yourself & Goal Tracking (`/api/goals`)
**Backend Endpoints:**
49. `GET /api/goals`
50. `POST /api/goals`
51. `PATCH /api/goals/:id`
52. `DELETE /api/goals/:id`
53. `GET /api/goals/wheel` (Holistic Development Wheel & 80/20 Analysis)

**Frontend Findings & Gaps:**
- **CRITICAL GAP — 100% MISSING FROM CODEBASE:**
  - There is no `/member/goals` or `/member/discover` page.
  - There is no SVG or Canvas implementation of the **Holistic Development Wheel** (visualizing the 8 life dimensions: Spiritual, Financial, Career, Emotional, Physical, Family, Community, and Personal Mastery).
  - There is no UI for the **80/20 Pareto Prioritization Engine** to highlight the high-leverage goals that yield 80% of development breakthroughs.

---

### 4.9 Domain 9: CMS & Dynamic Website Content (`/api/cms`)
**Backend Endpoints:**
54. `GET /api/cms/navigation`
55. `GET /api/cms/pages/:slug`
56. `GET /api/cms/blocks`
57. `GET /api/cms/tooltips`

**Frontend Findings & Gaps:**
- **Static Navigation Configuration:** `public-navigation.ts` and `header.tsx` hardcode navigation items. They do not subscribe to `GET /api/cms/navigation`, meaning changes published in the Admin CMS Menu manager do not reflect on the public site.
- **Missing Hover Tooltip Engine:** The backend provides `GET /api/cms/tooltips` to deliver glossary explanations on hover for cultural or technical terminology (e.g. *Muhsina*, *Halal Compliance*, *Prorated Renewal*, *Trade License*). No tooltip client context or `<HoverGlossary term="...">` component exists in the frontend.
- **Dynamic Slug Fallback Route:** Dynamic pages authored in `/admin/cms/pages` cannot be visited because there is no `src/app/(public)/[...slug]/page.tsx` catch-all route.

---

### 4.10 Domain 10: In-App Notifications (`/api/notifications`)
**Backend Endpoints:**
58. `GET /api/notifications`
59. `PATCH /api/notifications/:id/read`
60. `GET /api/notifications/unread-count`

**Frontend Findings & Gaps:**
- **Member Notification Inbox Stub:** `/member/notifications` is a `"Coming soon."` stub.
- **Global Header Badge:** The bell icon in `admin-header.tsx` and `member-header.tsx` displays a static mock count rather than polling `GET /api/notifications/unread-count`.

---

### 4.11 Domain 11: Contact Form Submissions (`/api/contact`)
**Backend Endpoints:**
61. `POST /api/contact`

**Frontend Findings & Gaps:**
- `/contact` form in `src/features/public/contact/components/contact-form.tsx` simulates submission using `setTimeout()` instead of calling `POST /api/contact`.

---

### 4.12 Domain 12: Newsletter Subscription (`/api/newsletter`)
**Backend Endpoints:**
62. `POST /api/newsletter/subscribe`

**Frontend Findings & Gaps:**
- The footer newsletter input in `src/components/layout/footer.tsx` has no submit handler calling `POST /api/newsletter/subscribe`.

---

### 4.13 Domain 13: Payments & ZiniPay Gateway (`/api/payment`)
**Backend Endpoints:**
- `POST /api/payment/zinipay/init`
- `POST /api/payment/zinipay/verify`
- `POST /api/payment/zinipay/webhook`
- `GET /api/payment/zinipay/invoices`

**Frontend Findings & Alignment:**
- **Primary Payment Engine:** Standardized on ZiniPay (`/api/payment/zinipay/*`) as the official payment gateway for all transactions (bKash, Nagad, Rocket, Upay, Visa/Mastercard).
- **ZiniPay Redirection & IPN Flow:** Checkout and membership upgrade forms invoke `POST /api/payment/zinipay/init` to generate a secure hosted invoice and redirect the browser to `paymentUrl`. Callbacks are verified via `POST /api/payment/zinipay/verify` at `/checkout/success` and asynchronous webhooks at `/api/payment/zinipay/webhook`.
- **Sandbox Fallback:** `zinipay-service.ts` includes an active sandbox simulation mode for offline and local development without live API keys.

---

### 4.14 Domain 14: Admin Operations & Governance (`/api/admin`)
**Backend Endpoints:**
- `GET /api/admin/analytics`
- `GET /api/admin/users/pending-verification`
- `GET /api/admin/users/:id/nid` (Admin-only confidential NID view)
- `PATCH /api/admin/subscriptions/:id/approve`
- `PUT /api/admin/cms/pages/:id`
- `GET /api/admin/audit-logs`
- `GET /api/admin/partner-keys`

**Frontend Findings & Gaps:**
- **Step 1–13 Mock Data Decoupling:** All admin screens currently consume mock files (`mock-cms.ts`, `mock-communication.ts`, `mock-community.ts`, `mock-events.ts`, `mock-memberships.ts`, `mock-payments.ts`, `mock-resources.ts`, `admin-mock-data.ts`).
- **NID Secure Inspection:** In `/admin/verifications/[verificationId]`, the NID image preview must call the authenticated admin endpoint `GET /api/admin/users/:id/nid`, with watermarking and blur-reveal protections.

---

## 5. Cleanup & Deprecation Registry

The following redundant, obsolete, or out-of-scope files have been cataloged for removal or refactoring during the integration phase:

### 5.1 Dead Code & Obsolete Services
| File Path | Issue / Reason | Action Required |
|---|---|---|
| `src/lib/services/zinipay-service.ts` | Primary Payment Engine | **RETAINED:** Standardized on ZiniPay for all checkout & membership flows |
| `src/app/admin/communications/contact-submissions/page.tsx` | Duplicate legacy route; superseded by `/admin/communication/contacts` | **REMOVED** |
| `src/app/admin/communications/newsletters/page.tsx` | Duplicate legacy route; superseded by `/admin/communication/newsletter` | **REMOVED** |
| `src/app/admin/messages/page.tsx` | Duplicate legacy stub; superseded by `/admin/communication` | **REMOVED** |
| `src/app/admin/products/page.tsx` | Duplicate legacy stub; superseded by `/admin/ecommerce/...` | **REMOVED** |
| `src/app/admin/sellers/page.tsx` | Duplicate legacy route; consolidated into `/admin/ecommerce/sellers` | **REMOVED** |
| `src/app/admin/support/page.tsx` | Duplicate legacy stub; superseded by `/admin/communication/support` | **REMOVED** |
| `src/app/admin/verifications/page.tsx` | Redundant route; consolidated into `/admin/businesses/verifications` | **REMOVED** |

### 5.2 Out-of-Scope Features (Backend Contract Mismatch)
| Feature / Route | Assessment | Recommended Resolution |
|---|---|---|
| `/admin/communication/live-chat` & `/live-chat/[conversationId]` | Backend architecture has 62 REST endpoints with **no WebSockets or chat server** | Repurpose the UI into an **Asynchronous Support Ticket Conversation Viewer** wired to `/admin/communication/support/tickets` and `/api/contact`. Retain visual components without claiming real-time socket connections. |

### 5.3 Mock Data Files to Retire (Post API Hookup)
Once REST API services are connected, these mock files will be safely archived or deleted:
1. `src/features/public/data/mock-data.ts`
2. `src/features/admin/cms/data/mock-cms.ts`
3. `src/features/admin/communication/data/mock-communication.ts`
4. `src/features/admin/community/data/mock-community.ts`
5. `src/features/admin/data/admin-mock-data.ts`
6. `src/features/admin/events/data/mock-events.ts`
7. `src/features/admin/memberships/data/mock-memberships.ts`
8. `src/features/admin/payments/data/mock-payments.ts`
9. `src/features/admin/resources/data/mock-resources.ts`

---

## 6. Privacy, Role-Based UI & Edge-Case Checklist

### 6.1 Role-Based Access Control (RBAC) Matrix
The UI must enforce the following visibility and action boundaries across all 4 principal audience tiers:

| Feature / Action | Guest (Unauthenticated) | Free Member (`MEMBER`) | Paid / Subscribed Member | Admin (`ADMIN` / `SUPER_ADMIN`) |
|---|:---:|:---:|:---:|:---:|
| Browse Public CMS Pages | ✅ Full Access | ✅ Full Access | ✅ Full Access | ✅ Full Access |
| View Public Business Directory | ✅ Full Access | ✅ Full Access | ✅ Full Access | ✅ Full Access |
| View Marketplace Products | ✅ Full Access | ✅ Full Access | ✅ Full Access | ✅ Full Access |
| Community Discussions | 🟡 Teaser Only (Blurred) | ✅ Read & Reply | ✅ Read, Reply & Create | ✅ Full Moderation |
| Access Resource Downloads | ❌ Prompt Sign-in | 🟡 Free Materials Only | ✅ All Premium PDFs & Templates | ✅ Manage & Publish |
| Register for Events | ❌ Prompt Sign-in | ✅ Free & Paid RSVP | ✅ Priority Seating & Discounts | ✅ Attendance Scanner |
| Holistic Wheel & 80/20 Goals | ❌ Blocked | ✅ Full Access | ✅ Full Access | ❌ Not Applicable |
| Create Business Profile | ❌ Blocked | 🟡 1 Free Profile (Basic) | ✅ Verified Badge & Shop | ✅ Approve & Verify |
| Access Admin Dashboard | ❌ Redirect to Login | ❌ Redirect to 403/Forbidden | ❌ Redirect to 403/Forbidden | ✅ Full Access |

### 6.2 Privacy & Sensitive Data Safeguards
- **Private Contact Checkboxes Default to False:**
  - `showEmail`: **`false`** (Unchecked by default in `defaultPrivacySettings`)
  - `showPhone`: **`false`** (Unchecked by default in `defaultPrivacySettings`)
  - `profileVisibility`: **`PUBLIC`** for general bio, but contact details are redacted unless explicitly checked.
- **National ID (NID) Confidentiality:**
  - NID numbers, scans, and passport documents must **NEVER** be rendered on any public or member peer profile.
  - Verification documents are accessible **ONLY** via `GET /api/admin/users/:id/nid` by administrators with `VERIFICATION_REVIEW` permission.
  - The member verification form must clearly display the mandatory legal disclaimer:  
    > *"Your National ID is stored with AES-256 encryption and viewed exclusively by female identity verification officers for fraud prevention and safe space protection. It is never disclosed to other members or third parties."*

### 6.3 Network & UI Resilience
- **API Error Handling:** Standardize all form submissions to catch `ApiError` and display field-level validation errors from `error.details`.
- **Loading Skeletons:** Ensure all table views, cards, and detail pages display shimmer skeletons during query fetching to eliminate layout shift.
- **Offline / Session Expiry:** Intercept 401 Unauthorized responses to clear cached user state and redirect to `/login?redirect=...` with a friendly re-authentication toast.

---

## 7. Prioritized Session-by-Session Execution Roadmap

To systematically connect all 62 backend APIs and resolve all gaps without breaking the build, execution is structured into 6 focused phases:

```
[Phase 1: Foundation & Auth] ──▶ [Phase 2: Profiles & Directory] ──▶ [Phase 3: Business, Shop & ZiniPay]
                                                                                │
[Phase 6: CMS, Tooltips & Admin] ◀── [Phase 5: Discover Yourself & Goals] ◀── [Phase 4: Community, Events & LMS]
```

---

### Phase 1: Core Foundation, API Client Alignment & Auth Integration
> **Objective:** Fix client routing bugs, set up TanStack Query hooks, and integrate all 10 authentication endpoints.
- **Step 1.1:** Fix `src/lib/api/client.ts` URL construction to prevent double `/api/api` nesting; add auth bearer/cookie interceptor and unified error normalization.
- **Step 1.2:** Update `src/lib/api/endpoints.ts` to catalog all 62 REST endpoints with strict typing (ZiniPay standardized).
- **Step 1.3:** Enhance `src/features/auth/components/register-form.tsx` with `referrerCode` input, URL search param `?ref=` prefill, and NID disclosure note.
- **Step 1.4:** Secure `src/app/admin/layout.tsx` by adding server-side session and admin role enforcement (`requireServerSession()` / `canAccessAdmin()`).
- **Step 1.5:** Implement TanStack Query hooks for `useCurrentUser()`, `useLogin()`, `useRegister()`, `useLogout()`, and `usePasswordRecovery()`.

---

### Phase 2: Member Profiles, Sisterhood Directory & Identity Verification
> **Objective:** Decouple profile services from direct MongoDB calls and connect Domains 1 & 2 (`/api/auth/me/*`, `/api/users/*`).
- **Step 2.1:** Refactor `profile-edit-form.tsx` to call `PATCH /api/auth/me/contact` and support "Save as Draft" vs. "Submit for Review" (`POST /api/auth/me/submit-review`).
- **Step 2.2:** Add "Export Profile as PDF" action in `profile-header.tsx` invoking `GET /api/auth/export-pdf`.
- **Step 2.3:** Implement interactive NID upload form on `/member/profile/verification` with file validation and the mandatory privacy disclaimer.
- **Step 2.4:** Build public Sisterhood Directory at `/members` utilizing `GET /api/users` with Wing, Skills, and District filters.
- **Step 2.5:** Build public member profile view at `/members/[id]` consuming `GET /api/users/:id` with strict privacy sanitization.

---

### Phase 3: Business Profiles, E-Commerce Marketplace & ZiniPay Gateway
> **Objective:** Connect Domains 3, 4 & 13 (`/api/business`, `/api/ecommerce`, `/api/payment`).
- **Step 3.1:** Connect ZiniPay services in `zinipay-service.ts` to `/api/payment/zinipay/init` and `/api/payment/zinipay/verify`.
- **Step 3.2:** Wire public `/businesses` and `/businesses/[slug]` to `GET /api/business`; instrument outbound website clicks to call `POST /api/business/:id/affiliate-click`.
- **Step 3.3:** Connect public `/marketplace` and `/marketplace/[slug]` to `GET /api/ecommerce/products`, ensuring MRP vs Discount display.
- **Step 3.4:** Implement cart synchronization between `localStorage` and `POST /api/ecommerce/cart`.
- **Step 3.5:** Update `/member/orders/[id]` to provide the **Dual Rating Interface** (`POST /api/ecommerce/orders/:id/reviews`) for product and delivery feedback.
- **Step 3.6:** Connect member seller storefront (`/member/shop`, `/member/products`, `/member/seller/orders`) to live e-commerce endpoints.

---

### Phase 4: Community Forum, Guest Teaser, Events & Resource Library
> **Objective:** Replace member stubs and connect Domains 5, 6 & 7 (`/api/forum`, `/api/events`, `/api/resources`).
- **Step 4.1:** Build complete Member Community Forum at `/member/community` and `/member/community/posts` using `GET /api/forum/posts`, category filters, post authoring, comments, and like/report actions.
- **Step 4.2:** Implement Guest Teaser Blur Gate on public `/community` consuming `GET /api/forum/posts?teaser=true`.
- **Step 4.3:** Build `/member/events` ticket pass viewer and wire RSVP/Ticket purchase buttons on public `/events/[slug]` to `POST /api/events/:id/rsvp` and `POST /api/events/:id/ticket`.
- **Step 4.4:** Build `/member/learning` and `/member/courses` LMS progress views; wire resource downloads on `/resources/[slug]` to `GET /api/resources/:id/download`.

---

### Phase 5: Discover Yourself, Holistic Development Wheel & Goal Tracking
> **Objective:** Build the missing flagship self-discovery engine for Domain 8 (`/api/goals`).
- **Step 5.1:** Create `/member/goals` page with tabs for Goal Tracker, 80/20 High-Leverage Focus, and the Holistic Development Wheel.
- **Step 5.2:** Develop interactive **Holistic Development Wheel SVG component** visualizing the 8 life dimensions with color-coded score polygons.
- **Step 5.3:** Build the **80/20 Priority Matrix component** categorizing goals into High Impact (Vital Few) vs. Secondary (Useful Many) based on `GET /api/goals/wheel`.
- **Step 5.4:** Implement goal creation, milestone progress updates, and completion celebrations using `POST /api/goals` and `PATCH /api/goals/:id`.

---

### Phase 6: CMS Dynamic Content, Hover Tooltips & Admin Dashboard Full Wire-Up
> **Objective:** Connect Domains 9, 10, 11, 12 & 14 (`/api/cms`, `/api/notifications`, `/api/contact`, `/api/newsletter`, `/api/admin`).
- **Step 6.1:** Build `HoverTooltipProvider` and `<HoverGlossary term="...">` component consuming `GET /api/cms/tooltips`.
- **Step 6.2:** Connect dynamic public navigation in `header.tsx` to `GET /api/cms/navigation`; create `src/app/(public)/[...slug]/page.tsx` for dynamic CMS pages.
- **Step 6.3:** Wire global notification bell to `GET /api/notifications/unread-count` and build `/member/notifications` inbox.
- **Step 6.4:** Wire public footer newsletter to `POST /api/newsletter/subscribe` and contact page to `POST /api/contact`.
- **Step 6.5:** Systematically swap mock data arrays in Admin Steps 1–13 (`/admin/analytics`, `/admin/members`, `/admin/verifications`, `/admin/cms`, `/admin/communication`, `/admin/system`) to live TanStack Query hooks consuming `/api/admin/*`.
- **Step 6.6:** Perform comprehensive end-to-end integration verification, cleanup of dead code files, and execute regression test suite.

---

## 8. Conclusion

With 528 pre-built pages, robust TypeScript definitions, and high visual polish, BDSisters.org possesses an exceptional frontend foundation. By executing this prioritized 6-phase roadmap, the frontend will cleanly decouple from mock data and direct database connections, achieving 100% contract alignment across all 62 REST API endpoints.
