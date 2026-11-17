/**
 * BDSisters.org - Admin Verification Demonstration Data
 * Step 3: Member Management & Verification System
 *
 * NOTE: STRICT SYNTHETIC DEMONSTRATION RECORDS
 * All document numbers, images, and reviewer logs in this dataset are synthetic
 * mock previews for administrative UI verification. No genuine national identity
 * documents or credentials are used.
 */

import type {
  AdminVerificationSubmission,
  VerificationKpiData,
} from "../types/admin-verification.ts";

export const DEMO_VERIFICATION_DISCLAIMER =
  "SYNTHETIC VERIFICATION DATASET: Documents, National ID numbers, and review logs displayed here are simulated mock placeholders for frontend verification. No real NID cards, passports, or PII are exposed.";

export const DEMO_VERIFICATION_KPIS: VerificationKpiData = {
  totalSubmissions: 1984,
  pendingReview: 38,
  underReview: 18,
  verified: 1876,
  rejected: 34,
  actionRequired: 18,
};

export const DEMO_VERIFICATION_SUBMISSIONS: AdminVerificationSubmission[] = [
  {
    id: "ver_201",
    submissionId: "BDS-VER-2026-081",
    memberId: "BDS-MEM-10490",
    memberName: "Sabrina Akter",
    memberEmail: "sabrina.akter@clayart.com",
    memberPhone: "+880 1934-567890",
    memberAvatar: null,
    memberLocation: "Bogura, Rajshahi Division",
    documentType: "NATIONAL_ID",
    documentNumberMasked: "Smart NID: 1994********3108",
    submittedAt: "25 mins ago",
    status: "PENDING",
    assignedReviewer: {
      name: "Admin Salma",
      role: "Compliance Lead",
    },
    priority: "HIGH",
    isUrgent: true,
    documents: [
      {
        id: "doc_1",
        type: "NID_FRONT",
        title: "Smart National ID (Front)",
        samplePreviewWatermark: "DEMO SAMPLE / BDSISTERS NID PREVIEW",
        uploadedAt: "2026-11-17 14:45",
        fileSize: "2.4 MB",
        fileFormat: "image/jpeg",
      },
      {
        id: "doc_2",
        type: "NID_BACK",
        title: "Smart National ID (Back)",
        samplePreviewWatermark: "DEMO SAMPLE / BDSISTERS NID PREVIEW",
        uploadedAt: "2026-11-17 14:46",
        fileSize: "2.1 MB",
        fileFormat: "image/jpeg",
      },
    ],
    reviewHistory: [
      {
        id: "rh_1",
        action: "Verification Submitted",
        actor: "Sabrina Akter",
        actorRole: "Member",
        timestamp: "25 mins ago",
        notes: "Uploaded dual-side Smart NID card for artisan seller verification.",
      },
    ],
  },
  {
    id: "ver_202",
    submissionId: "BDS-VER-2026-080",
    memberId: "BDS-MEM-10491",
    memberName: "Farzana Yasmin",
    memberEmail: "farzana.y@organics.bd",
    memberPhone: "+880 1823-456789",
    memberAvatar: null,
    memberLocation: "Panchlaish, Chittagong",
    documentType: "NATIONAL_ID",
    documentNumberMasked: "Smart NID: 1988********9014",
    submittedAt: "1 hour ago",
    status: "UNDER_REVIEW",
    assignedReviewer: {
      name: "Moderator Tasnim",
      role: "Identity Auditor",
    },
    priority: "HIGH",
    isUrgent: true,
    documents: [
      {
        id: "doc_3",
        type: "NID_FRONT",
        title: "Smart National ID (Front)",
        samplePreviewWatermark: "DEMO SAMPLE / BDSISTERS NID PREVIEW",
        uploadedAt: "2026-11-17 13:20",
        fileSize: "3.1 MB",
        fileFormat: "image/png",
      },
      {
        id: "doc_4",
        type: "NID_BACK",
        title: "Smart National ID (Back)",
        samplePreviewWatermark: "DEMO SAMPLE / BDSISTERS NID PREVIEW",
        uploadedAt: "2026-11-17 13:21",
        fileSize: "2.8 MB",
        fileFormat: "image/png",
      },
    ],
    reviewHistory: [
      {
        id: "rh_2",
        action: "Verification Submitted",
        actor: "Farzana Yasmin",
        actorRole: "Member",
        timestamp: "1 hour ago",
      },
      {
        id: "rh_3",
        action: "Marked Under Review",
        actor: "Moderator Tasnim",
        actorRole: "Identity Auditor",
        timestamp: "30 mins ago",
        notes: "Auditing Chittagong address and cross-checking trade license.",
      },
    ],
  },
  {
    id: "ver_203",
    submissionId: "BDS-VER-2026-079",
    memberId: "BDS-MEM-10487",
    memberName: "Roksana Begum",
    memberEmail: "roksana.weavers@gmail.com",
    memberPhone: "+880 1812-349876",
    memberAvatar: null,
    memberLocation: "Rupganj, Narayanganj",
    documentType: "NATIONAL_ID",
    documentNumberMasked: "Paper NID: 1979********4512",
    submittedAt: "3 hours ago",
    status: "ACTION_REQUIRED",
    assignedReviewer: {
      name: "Admin Salma",
      role: "Compliance Lead",
    },
    priority: "HIGH",
    isUrgent: false,
    documents: [
      {
        id: "doc_5",
        type: "NID_FRONT",
        title: "NID Document (Front)",
        samplePreviewWatermark: "DEMO SAMPLE / BDSISTERS NID PREVIEW",
        uploadedAt: "2026-11-17 11:30",
        fileSize: "1.2 MB",
        fileFormat: "image/jpeg",
      },
    ],
    reviewHistory: [
      {
        id: "rh_4",
        action: "Verification Submitted",
        actor: "Roksana Begum",
        actorRole: "Member",
        timestamp: "3 hours ago",
      },
      {
        id: "rh_5",
        action: "Action Requested",
        actor: "Admin Salma",
        actorRole: "Compliance Lead",
        timestamp: "1 hour ago",
        notes: "Front document image is blurry. Back side of National ID was not uploaded. Requested high-resolution re-upload.",
      },
    ],
    additionalInfoRequest:
      "Please re-upload a clear, high-resolution photo of both the front and back of your National ID card.",
  },
  {
    id: "ver_204",
    submissionId: "BDS-VER-2026-078",
    memberId: "BDS-MEM-10484",
    memberName: "Parvin Sultana",
    memberEmail: "parvin.sultana@chittagongclay.com",
    memberPhone: "+880 1734-987654",
    memberAvatar: null,
    memberLocation: "Chittagong",
    documentType: "PASSPORT",
    documentNumberMasked: "Passport: BD-E08******",
    submittedAt: "5 hours ago",
    status: "PENDING",
    priority: "NORMAL",
    isUrgent: false,
    documents: [
      {
        id: "doc_6",
        type: "PASSPORT_PAGE",
        title: "Passport Bio Page",
        samplePreviewWatermark: "DEMO SAMPLE / BDSISTERS PASSPORT PREVIEW",
        uploadedAt: "2026-11-17 09:15",
        fileSize: "3.5 MB",
        fileFormat: "image/jpeg",
      },
    ],
    reviewHistory: [
      {
        id: "rh_6",
        action: "Verification Submitted",
        actor: "Parvin Sultana",
        actorRole: "Member",
        timestamp: "5 hours ago",
      },
    ],
  },
  {
    id: "ver_205",
    submissionId: "BDS-VER-2026-077",
    memberId: "BDS-MEM-10483",
    memberName: "Shamima Begum",
    memberEmail: "shamima.begum@rupganjweavers.org",
    memberPhone: "+880 1845-678901",
    memberAvatar: null,
    memberLocation: "Rupganj, Narayanganj",
    documentType: "NATIONAL_ID",
    documentNumberMasked: "Smart NID: 1985********1209",
    submittedAt: "6 hours ago",
    status: "UNDER_REVIEW",
    assignedReviewer: {
      name: "Admin Salma",
      role: "Compliance Lead",
    },
    priority: "HIGH",
    isUrgent: true,
    documents: [
      {
        id: "doc_7",
        type: "NID_FRONT",
        title: "Smart National ID (Front)",
        samplePreviewWatermark: "DEMO SAMPLE / BDSISTERS NID PREVIEW",
        uploadedAt: "2026-11-17 08:00",
        fileSize: "2.7 MB",
        fileFormat: "image/jpeg",
      },
      {
        id: "doc_8",
        type: "NID_BACK",
        title: "Smart National ID (Back)",
        samplePreviewWatermark: "DEMO SAMPLE / BDSISTERS NID PREVIEW",
        uploadedAt: "2026-11-17 08:01",
        fileSize: "2.4 MB",
        fileFormat: "image/jpeg",
      },
    ],
    reviewHistory: [
      {
        id: "rh_7",
        action: "Verification Submitted",
        actor: "Shamima Begum",
        actorRole: "Member",
        timestamp: "6 hours ago",
      },
      {
        id: "rh_8",
        action: "Under Review",
        actor: "Admin Salma",
        actorRole: "Compliance Lead",
        timestamp: "4 hours ago",
      },
    ],
  },
  {
    id: "ver_206",
    submissionId: "BDS-VER-2026-076",
    memberId: "BDS-MEM-10485",
    memberName: "Naila Kabeer",
    memberEmail: "naila.kabeer@outlook.com",
    memberPhone: "+880 1512-345678",
    memberAvatar: null,
    memberLocation: "Khulna",
    documentType: "NATIONAL_ID",
    documentNumberMasked: "Smart NID: 1982********6712",
    submittedAt: "2 days ago",
    status: "REJECTED",
    assignedReviewer: {
      name: "Moderator Tasnim",
      role: "Identity Auditor",
    },
    priority: "LOW",
    isUrgent: false,
    documents: [
      {
        id: "doc_9",
        type: "NID_FRONT",
        title: "Document Front",
        samplePreviewWatermark: "DEMO SAMPLE / BDSISTERS NID PREVIEW",
        uploadedAt: "2026-11-15 10:00",
        fileSize: "1.1 MB",
        fileFormat: "image/jpeg",
      },
    ],
    reviewHistory: [
      {
        id: "rh_9",
        action: "Verification Submitted",
        actor: "Naila Kabeer",
        actorRole: "Member",
        timestamp: "2 days ago",
      },
      {
        id: "rh_10",
        action: "Verification Rejected",
        actor: "Moderator Tasnim",
        actorRole: "Identity Auditor",
        timestamp: "1 day ago",
        notes: "Identity document name does not match platform registration name. Suspected credential mismatch.",
      },
    ],
    rejectionReason:
      "Document name does not match the BDSisters account name. Please provide an identity document belonging to the account holder.",
  },
  {
    id: "ver_207",
    submissionId: "BDS-VER-2026-075",
    memberId: "BDS-MEM-10492",
    memberName: "Nusrat Jahan Chowdhury",
    memberEmail: "nusrat.jahan@nilambari.bd",
    memberPhone: "+880 1712-345678",
    memberAvatar: null,
    memberLocation: "Dhaka",
    documentType: "NATIONAL_ID",
    documentNumberMasked: "Smart NID: 1992********8812",
    submittedAt: "2026-03-16",
    status: "VERIFIED",
    assignedReviewer: {
      name: "Admin Salma",
      role: "Compliance Lead",
    },
    priority: "NORMAL",
    isUrgent: false,
    documents: [
      {
        id: "doc_10",
        type: "NID_FRONT",
        title: "Smart National ID (Front)",
        samplePreviewWatermark: "DEMO SAMPLE / BDSISTERS NID PREVIEW",
        uploadedAt: "2026-03-16 11:00",
        fileSize: "2.4 MB",
        fileFormat: "image/jpeg",
      },
      {
        id: "doc_11",
        type: "NID_BACK",
        title: "Smart National ID (Back)",
        samplePreviewWatermark: "DEMO SAMPLE / BDSISTERS NID PREVIEW",
        uploadedAt: "2026-03-16 11:02",
        fileSize: "2.1 MB",
        fileFormat: "image/jpeg",
      },
    ],
    reviewHistory: [
      {
        id: "rh_11",
        action: "Verification Approved",
        actor: "Admin Salma",
        actorRole: "Compliance Lead",
        timestamp: "2026-03-17 15:30",
        notes: "Approved and verified artisan seller badge awarded.",
      },
    ],
  },
  {
    id: "ver_208",
    submissionId: "BDS-VER-2026-074",
    memberId: "BDS-MEM-10488",
    memberName: "Sadia Rahman",
    memberEmail: "sadia.rahman@botanicals.bd",
    memberPhone: "+880 1998-765432",
    memberAvatar: null,
    memberLocation: "Dhaka",
    documentType: "NATIONAL_ID",
    documentNumberMasked: "Smart NID: 1991********4490",
    submittedAt: "2026-04-02",
    status: "VERIFIED",
    assignedReviewer: {
      name: "Moderator Tasnim",
      role: "Identity Auditor",
    },
    priority: "NORMAL",
    isUrgent: false,
    documents: [
      {
        id: "doc_12",
        type: "NID_FRONT",
        title: "Smart National ID (Front)",
        samplePreviewWatermark: "DEMO SAMPLE / BDSISTERS NID PREVIEW",
        uploadedAt: "2026-04-02 10:15",
        fileSize: "2.6 MB",
        fileFormat: "image/jpeg",
      },
    ],
    reviewHistory: [
      {
        id: "rh_12",
        action: "Verification Approved",
        actor: "Moderator Tasnim",
        actorRole: "Identity Auditor",
        timestamp: "2026-04-03 12:00",
      },
    ],
  },
];

export function getAdminVerificationById(idOrSubmissionId: string): AdminVerificationSubmission | undefined {
  if (!idOrSubmissionId) return undefined;
  const normalized = idOrSubmissionId.toLowerCase();
  return DEMO_VERIFICATION_SUBMISSIONS.find(
    (v) =>
      v.id.toLowerCase() === normalized ||
      v.submissionId.toLowerCase() === normalized ||
      v.memberId.toLowerCase() === normalized
  );
}

