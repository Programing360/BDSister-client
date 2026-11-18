/**
 * BDSisters.org - Admin Business Management TypeScript Definitions
 * Step 6: Business Management & Seller Administration (Frontend Only)
 */

import type {
  BusinessStatus,
  BusinessVerificationStatus,
  BusinessType,
  BusinessLocation,
  BusinessContactInfo,
} from "../../../../types/business.ts";

export type { BusinessStatus, BusinessVerificationStatus, BusinessType, BusinessLocation, BusinessContactInfo };

export type BusinessApprovalStatus =
  | "DRAFT"
  | "PENDING_REVIEW"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "SUSPENDED";

export type BusinessVerificationType =
  | "TRADE_LICENSE"
  | "TIN_CERTIFICATE"
  | "NATIONAL_ID"
  | "OWNERSHIP_DEED"
  | "UTILITY_BILL"
  | "BRAND_REGISTRATION"
  | "OTHER";

export type BusinessReviewPriority = "LOW" | "NORMAL" | "HIGH" | "URGENT";

export interface BusinessVerificationRecord {
  id: string;
  businessId: string;
  businessCode: string;
  businessName: string;
  businessSlug: string;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  documentType: BusinessVerificationType;
  documentNumber: string;
  issuingAuthority?: string;
  issueDate?: string;
  expiryDate?: string;
  documentUrl: string;
  previewWatermark: string;
  status: BusinessVerificationStatus;
  submissionDate: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewerNotes?: string;
  rejectionReason?: string;
}

export interface BusinessReviewItem {
  id: string;
  businessId: string;
  businessName: string;
  businessSlug: string;
  reviewerId: string;
  reviewerName: string;
  reviewerEmail: string;
  reviewerAvatar?: string;
  rating: number; // 1 to 5
  title: string;
  comment: string;
  status: "PUBLISHED" | "PENDING" | "HIDDEN" | "REJECTED" | "REPORTED";
  createdAt: string;
  responseText?: string;
  responseDate?: string;
}

export type BusinessReportReason =
  | "FAKE_INFORMATION"
  | "IMPERSONATION"
  | "FRAUD_SCAM"
  | "MISLEADING_CONTENT"
  | "COPYRIGHT_VIOLATION"
  | "OFFENSIVE_CONTENT"
  | "OTHER";

export interface BusinessReportItem {
  id: string;
  businessId: string;
  businessCode: string;
  businessName: string;
  reporterId: string;
  reporterName: string;
  reporterEmail: string;
  reason: BusinessReportReason;
  description: string;
  priority: "LOW" | "NORMAL" | "HIGH" | "URGENT";
  status: "PENDING" | "INVESTIGATING" | "RESOLVED" | "DISMISSED";
  resolutionNotes?: string;
  createdAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface BusinessCategoryItem {
  id: string;
  name: string;
  nameBn?: string;
  slug: string;
  description: string;
  icon: string;
  businessCount: number;
  isActive: boolean;
  sortOrder: number;
}

export interface AdminBusinessItem {
  id: string;
  businessCode: string;
  name: string;
  nameBn?: string;
  slug: string;
  tagline: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  subcategory?: string;
  businessType: BusinessType;
  status: BusinessApprovalStatus;
  verificationStatus: BusinessVerificationStatus;
  visibility: "PUBLIC" | "PRIVATE";
  logo?: string | null;
  coverImage?: string | null;
  galleryImages?: string[];
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  contact: BusinessContactInfo;
  location: BusinessLocation;
  yearEstablished?: number;
  employeeRange?: "1-5" | "6-15" | "16-50" | "50+";
  shopId?: string | null;
  hasActiveShop: boolean;
  productCount: number;
  orderCount: number;
  totalRevenueBDT: number;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  featuredOrder?: number;
  reviewPriority: BusinessReviewPriority;
  submittedAt: string;
  approvedAt?: string;
  approvedBy?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  suspendedAt?: string;
  suspensionReason?: string;
  tags: string[];
  moderationNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessKpiData {
  totalBusinesses: number;
  pendingApprovals: number;
  approvedBusinesses: number;
  rejectedBusinesses: number;
  suspendedBusinesses: number;
  verifiedBusinesses: number;
  totalProducts: number;
  totalRevenueBDT: number;
}

export interface BusinessFilterState {
  search: string;
  status: string;
  verificationStatus: string;
  category: string;
  businessType: string;
  isFeatured: string;
  sortBy: "name" | "createdAt" | "rating" | "revenue" | "products";
  sortDirection: "asc" | "desc";
  page: number;
  pageSize: number;
}
