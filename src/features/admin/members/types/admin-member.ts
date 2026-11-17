/**
 * BDSisters.org - Admin Member Management TypeScript Definitions
 * Step 3: Member Management & Verification System
 */

import type {
  LocationData,
  EducationItem,
  ExperienceItem,
  SkillItem,
  LanguageItem,
  SocialLinks,
} from "../../../../types/profile.ts";

export type MembershipType = "FREE" | "PAID";

export type AdminAccountStatus = "ACTIVE" | "SUSPENDED" | "BANNED" | "PENDING";

export type IdentityVerificationStatus =
  | "NOT_SUBMITTED"
  | "PENDING"
  | "UNDER_REVIEW"
  | "VERIFIED"
  | "REJECTED"
  | "ACTION_REQUIRED";

export interface AdminMemberListItem {
  id: string;
  memberId: string; // e.g. BDS-MEM-10492
  name: string;
  email: string;
  phone: string;
  avatar: string | null;
  location?: LocationData;
  membershipType: MembershipType;
  membershipPlan: string; // e.g. "Free Community" | "Pro Entrepreneur"
  accountStatus: AdminAccountStatus;
  emailVerified: boolean;
  verificationStatus: IdentityVerificationStatus;
  joinedDate: string; // Formatted YYYY-MM-DD
  lastLogin: string;
  profileCompletion: number; // 0-100%
  businessesCount: number;
  ordersCount: number;
}

export interface AdminMemberDetail extends AdminMemberListItem {
  dateOfBirth?: string;
  gender?: string;
  headline?: string;
  bio?: string;
  coverImage?: string | null;
  education?: EducationItem[];
  experience?: ExperienceItem[];
  skills?: SkillItem[];
  interests?: string[];
  languages?: LanguageItem[];
  socialLinks?: SocialLinks;
  subscription?: {
    planName: string;
    tier: MembershipType;
    status: "ACTIVE" | "EXPIRED" | "CANCELLED" | "TRIAL";
    startDate: string;
    expiryDate: string;
    autoRenew: boolean;
    amount: number;
  };
  identityVerificationDetails?: {
    submissionId: string;
    documentType: "NATIONAL_ID" | "PASSPORT";
    documentNumberMasked: string;
    status: IdentityVerificationStatus;
    submittedAt: string;
    reviewedAt?: string;
    reviewedBy?: string;
    rejectionReason?: string;
    reviewNotes?: string;
    documents: {
      type: "NID_FRONT" | "NID_BACK" | "PASSPORT_PAGE";
      title: string;
      previewPlaceholder: string;
      isSynthetic: true;
    }[];
  };
  activityHistory?: {
    id: string;
    action: string;
    timestamp: string;
    ipAddress?: string;
  }[];
  adminNotes?: {
    id: string;
    author: string;
    note: string;
    createdAt: string;
  }[];
}

export interface MemberKpiData {
  totalMembers: number;
  activeMembers: number;
  freeMembers: number;
  paidMembers: number;
  suspendedMembers: number;
  pendingVerifications: number;
}

export interface MemberFilterState {
  query: string;
  accountStatus: string;
  membershipType: string;
  verificationStatus: string;
  sortBy: "joinedDate" | "name" | "profileCompletion";
  sortOrder: "asc" | "desc";
  page: number;
  pageSize: number;
}

export interface CreateMemberInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  membershipType: MembershipType;
  country: string;
  city: string;
  adminNote?: string;
}

export interface EditMemberInput {
  name: string;
  phone: string;
  membershipType: MembershipType;
  accountStatus: AdminAccountStatus;
  city: string;
  district?: string;
  adminNote?: string;
}
