/**
 * BDSisters.org - Admin Seller Management TypeScript Definitions
 * Step 6: Business Management & Seller Administration (Frontend Only)
 */

export type SellerType = "INDIVIDUAL" | "BUSINESS" | "SERVICE_PROVIDER";

export type SellerApprovalStatus =
  | "PENDING_APPROVAL"
  | "APPROVED"
  | "UNDER_REVIEW"
  | "SUSPENDED"
  | "REJECTED";

export type SellerVerificationStatus =
  | "UNVERIFIED"
  | "PENDING"
  | "VERIFIED"
  | "REJECTED";

export interface AdminSellerItem {
  id: string;
  sellerCode: string;
  memberId: string;
  memberName: string;
  memberEmail: string;
  memberPhone: string;
  memberAvatar?: string;
  businessId?: string;
  businessName?: string;
  businessCode?: string;
  shopName: string;
  shopSlug: string;
  sellerType: SellerType;
  status: SellerApprovalStatus;
  verificationStatus: SellerVerificationStatus;
  commissionRatePercent: number;
  productCount: number;
  orderCount: number;
  totalEarningsBDT: number;
  rating: number;
  reviewCount: number;
  joinedDate: string;
  approvedAt?: string;
  approvedBy?: string;
  suspendedAt?: string;
  suspensionReason?: string;
  rejectionReason?: string;
  payoutAccountType: "bKash" | "Nagad" | "Bank Transfer";
  payoutAccountNumber: string;
  isTopSeller: boolean;
}

export interface SellerKpiData {
  totalSellers: number;
  pendingSellers: number;
  approvedSellers: number;
  suspendedSellers: number;
  verifiedSellers: number;
  totalMarketplaceRevenueBDT: number;
}

export interface SellerFilterState {
  search: string;
  status: string;
  verificationStatus: string;
  sellerType: string;
  sortBy: "name" | "joinedDate" | "rating" | "earnings" | "products";
  sortDirection: "asc" | "desc";
  page: number;
  pageSize: number;
}
