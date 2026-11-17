/**
 * BDSisters.org - Admin Profile Management TypeScript Definitions
 * Step 5: Member Profile Management & Approval System (Frontend Only)
 */

import type {
  LocationData,
  EducationItem,
  ExperienceItem,
  SkillItem,
  LanguageItem,
  SocialLinks,
  PrivacySettings,
  ProfileVisibility,
} from "../../../../types/profile.ts";

export type { ProfileVisibility, SkillItem, EducationItem, ExperienceItem, LanguageItem, SocialLinks, PrivacySettings, LocationData };

// Approval Status for Member Public Profiles (Separate from Identity Verification)
export type ProfileApprovalStatus =
  | "DRAFT"
  | "PENDING_REVIEW"
  | "UNDER_REVIEW"
  | "PUBLISHED"
  | "CHANGES_REQUESTED"
  | "REJECTED"
  | "SUSPENDED";

// Identity Verification badge indicator (from Step 3)
export type ProfileVerificationBadge =
  | "VERIFIED"
  | "PENDING"
  | "UNDER_REVIEW"
  | "NOT_SUBMITTED"
  | "REJECTED";

// Review Priority
export type ProfileReviewPriority = "LOW" | "NORMAL" | "HIGH" | "URGENT";

// Profile Skill Groups
export type ProfileSkillCategory =
  | "Professional"
  | "Technical"
  | "Software"
  | "Vocational & Crafts"
  | "Business & Entrepreneurship"
  | "Subject Expertise"
  | "Interests & Passions";

export interface GroupedSkillItem {
  id: string;
  name: string;
  category: ProfileSkillCategory;
  level?: "BEGINNER" | "INTERMEDIATE" | "EXPERT";
  endorsedCount?: number;
}

// Associated Entrepreneurship & Business info
export interface ProfileBusinessSummary {
  hasBusiness: boolean;
  businessId?: string;
  businessName?: string;
  businessCategory?: string;
  businessSlug?: string;
  tradeLicenseVerified?: boolean;
  businessLogo?: string | null;
  shopUrl?: string;
}

// Full Admin Profile Record
export interface AdminProfileItem {
  id: string; // e.g. "prof_301"
  memberId: string; // e.g. "BDS-MEM-10492"
  userId: string;
  fullName: string;
  professionalName?: string;
  headline: string;
  profession: string;
  occupation: string;
  industry: string;
  category: string; // e.g. "Fashion & Lifestyle", "Creative & Design"
  avatar: string | null;
  coverImage?: string | null;
  bio: string;
  email: string;
  phone: string; // Masked for overview, unmasked in details
  location: LocationData;
  education: EducationItem[];
  experience: ExperienceItem[];
  skills: GroupedSkillItem[];
  interests: string[];
  languages: LanguageItem[];
  socialLinks: SocialLinks;
  privacySettings: PrivacySettings;
  
  // Statuses
  approvalStatus: ProfileApprovalStatus;
  verificationStatus: ProfileVerificationBadge;
  profileVisibility: ProfileVisibility;
  isFeatured: boolean;
  featuredOrder?: number;
  featuredDate?: string;
  reviewPriority: ProfileReviewPriority;

  // Business linkage
  business: ProfileBusinessSummary;

  // Metadata & Metrics
  profileCompletion: number; // 0-100%
  submittedAt: string;
  lastUpdated: string;
  approvedAt?: string;
  approvedBy?: string;
  rejectionReason?: string;
  rejectionDate?: string;
  rejectedBy?: string;
  changesRequestedNote?: string;
  changesRequestedDate?: string;
  suspendedReason?: string;
  internalNotes?: string;
  reportsCount: number;
}

// Profile Category Definition
export interface ProfileCategoryItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  iconName: string;
  isActive: boolean;
  profileCount: number;
  createdAt: string;
  displayOrder: number;
}

// Profile Report & Flag Item
export type ProfileReportReason =
  | "FAKE_INFORMATION"
  | "MISLEADING_CREDENTIALS"
  | "INAPPROPRIATE_CONTENT"
  | "HARASSMENT"
  | "SPAM"
  | "IMPERSONATION"
  | "PRIVACY_VIOLATION"
  | "OTHER";

export type ProfileReportStatus = "PENDING" | "UNDER_REVIEW" | "RESOLVED" | "DISMISSED";

export interface ProfileReportItem {
  id: string; // e.g. "rep_401"
  profileId: string;
  profileMemberId: string;
  profileName: string;
  profileAvatar: string | null;
  profileProfession: string;
  reportingMemberName: string;
  reportingMemberId: string;
  reason: ProfileReportReason;
  description: string;
  submittedAt: string;
  priority: "LOW" | "NORMAL" | "HIGH" | "URGENT";
  status: ProfileReportStatus;
  assignedModerator?: string;
  resolutionNote?: string;
  resolvedAt?: string;
}

// KPI Overview
export interface ProfileKpiData {
  totalProfiles: number;
  publishedProfiles: number;
  pendingApproval: number;
  rejectedProfiles: number;
  draftProfiles: number;
  reportedProfiles: number;
  featuredProfiles: number;
  changesRequestedCount: number;
}

// Filter States
export interface ProfileFilterState {
  query: string;
  approvalStatus: "ALL" | ProfileApprovalStatus;
  verificationStatus: "ALL" | ProfileVerificationBadge;
  category: "ALL" | string;
  visibility: "ALL" | ProfileVisibility;
  isFeatured: "ALL" | "FEATURED" | "NOT_FEATURED";
  sortBy: "lastUpdated" | "fullName" | "profileCompletion" | "submittedAt";
  sortDirection: "asc" | "desc";
  page: number;
  pageSize: number;
}
