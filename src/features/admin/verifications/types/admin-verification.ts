/**
 * BDSisters.org - Admin Verification TypeScript Definitions
 * Step 3: Member Management & Verification System
 */

import type { IdentityVerificationStatus } from "../../members/types/admin-member.ts";

export type VerificationDocumentType = "NATIONAL_ID" | "PASSPORT";

export interface SyntheticDocumentItem {
  id: string;
  type: "NID_FRONT" | "NID_BACK" | "PASSPORT_PAGE";
  title: string;
  samplePreviewWatermark: string;
  uploadedAt: string;
  fileSize: string;
  fileFormat: string;
}

export interface VerificationReviewHistoryItem {
  id: string;
  action: string;
  actor: string;
  actorRole: string;
  timestamp: string;
  notes?: string;
}

export interface AdminVerificationSubmission {
  id: string; // e.g. "ver_201"
  submissionId: string; // e.g. "BDS-VER-2026-081"
  memberId: string; // e.g. "BDS-MEM-10492"
  memberName: string;
  memberEmail: string;
  memberPhone: string;
  memberAvatar: string | null;
  memberLocation: string;
  documentType: VerificationDocumentType;
  documentNumberMasked: string; // e.g. "NID: 1989********4210"
  submittedAt: string;
  status: IdentityVerificationStatus;
  assignedReviewer?: {
    name: string;
    role: string;
  };
  priority: "HIGH" | "NORMAL" | "LOW";
  isUrgent: boolean;
  documents: SyntheticDocumentItem[];
  reviewHistory: VerificationReviewHistoryItem[];
  rejectionReason?: string;
  additionalInfoRequest?: string;
  adminReviewNotes?: string;
}

export interface VerificationKpiData {
  totalSubmissions: number;
  pendingReview: number;
  underReview: number;
  verified: number;
  rejected: number;
  actionRequired: number;
}

export interface VerificationFilterState {
  query: string;
  status: string;
  documentType: string;
  sortBy: "submittedAt" | "priority" | "memberName";
  sortOrder: "asc" | "desc";
  page: number;
  pageSize: number;
}
