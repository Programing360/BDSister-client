/**
 * BDSisters.org - Admin Dashboard & Platform Analytics TypeScript Definitions
 * Step 2: Admin Dashboard Overview & Platform Analytics
 */

export type AdminTimeframe = "today" | "7d" | "30d" | "90d" | "year" | "custom";

export interface CustomDateRange {
  startDate: string;
  endDate: string;
}

export type AdminKpiCategory = "overview" | "members" | "business" | "ecommerce" | "financial";

export interface AdminKpiMetricItem {
  id: string;
  label: string;
  value: string;
  rawNumber: number;
  changePercent: number;
  trend: "up" | "down" | "neutral";
  comparisonText: string;
  tooltipText: string;
  category: AdminKpiCategory;
  isPrimary: boolean;
  statusColor?: "primary" | "success" | "warning" | "danger" | "info" | "neutral";
  iconName:
    | "users"
    | "userCheck"
    | "userPlus"
    | "crown"
    | "shieldAlert"
    | "briefcase"
    | "store"
    | "clock"
    | "package"
    | "shoppingBag"
    | "creditCard"
    | "banknote"
    | "checkCircle"
    | "xCircle"
    | "refreshCw";
}

// -------------------------------------------------------------
// Member Analytics Types
// -------------------------------------------------------------
export interface MemberGrowthPoint {
  period: string;
  newRegistrations: number;
  activeMembers: number;
  paidMembers: number;
  freeMembers: number;
}

export interface MemberDistribution {
  freeMembers: number;
  freePercentage: number;
  paidMembers: number;
  paidPercentage: number;
  activeMembers: number;
  activePercentage: number;
  inactiveMembers: number;
  inactivePercentage: number;
}

export interface MemberActivitySummary {
  newRegistrationsThisPeriod: number;
  profileCompletionAverage: number; // percentage
  pendingVerifications: number;
  recentlyActiveMembers: number;
}

// -------------------------------------------------------------
// Business Analytics Types
// -------------------------------------------------------------
export interface BusinessCategoryStat {
  id: string;
  categoryName: string;
  count: number;
  percentage: number;
  color: string;
}

export interface RecentBusinessSubmission {
  id: string;
  businessName: string;
  ownerName: string;
  category: string;
  submittedAt: string;
  status: "PENDING_VERIFICATION" | "APPROVED" | "UNDER_REVIEW";
  verificationDocs: string[];
}

export interface BusinessVerificationSummary {
  totalSubmitted: number;
  tradeLicenseVerifiedRate: number; // percentage
  tinVerifiedRate: number; // percentage
  nidVerifiedRate: number; // percentage
  averageReviewTimeHours: number;
}

// -------------------------------------------------------------
// E-commerce Analytics Types
// -------------------------------------------------------------
export interface OrderStatusBreakdown {
  total: number;
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
}

export interface ProductInventoryBreakdown {
  total: number;
  published: number;
  pendingApproval: number;
  outOfStock: number;
  lowStock: number;
}

export interface TopSellingProduct {
  id: string;
  rank: number;
  name: string;
  businessName: string;
  category: string;
  unitsSold: number;
  revenue: number;
  stockRemaining: number;
  imageUrl?: string;
}

export interface TopPerformingSeller {
  id: string;
  rank: number;
  shopName: string;
  artisanName: string;
  district: string;
  ordersFulfilled: number;
  totalSales: number;
  rating: number;
  verifiedBadge: boolean;
}

// -------------------------------------------------------------
// Revenue & Payment Analytics Types
// -------------------------------------------------------------
export interface RevenueTrendPoint {
  period: string;
  grossRevenue: number;
  netRevenue: number;
  refunds: number;
  successfulTransactions: number;
}

export interface PaymentBreakdown {
  successfulAmount: number;
  successfulCount: number;
  successfulPercentage: number;
  pendingAmount: number;
  pendingCount: number;
  pendingPercentage: number;
  failedAmount: number;
  failedCount: number;
  failedPercentage: number;
  refundedAmount: number;
  refundedCount: number;
  refundedPercentage: number;
}

export interface FinancialSummary {
  grossRevenue: number;
  refundedAmount: number;
  netRevenue: number;
  successfulPaymentsCount: number;
  failedPaymentsCount: number;
  pendingPaymentsCount: number;
  averageOrderValue: number;
}

// -------------------------------------------------------------
// Recent Activities Types
// -------------------------------------------------------------
export type AdminActivityCategory =
  | "ALL"
  | "MEMBERS"
  | "COMMERCE"
  | "VERIFICATION"
  | "SUPPORT"
  | "SYSTEM";

export type AdminActivityType =
  | "MEMBER_REGISTERED"
  | "PROFILE_SUBMITTED"
  | "VERIFICATION_SUBMITTED"
  | "BUSINESS_CREATED"
  | "BUSINESS_APPROVED"
  | "PRODUCT_SUBMITTED"
  | "ORDER_PLACED"
  | "PAYMENT_RECEIVED"
  | "SUPPORT_TICKET";

export interface DetailedAdminActivity {
  id: string;
  type: AdminActivityType;
  category: AdminActivityCategory;
  title: string;
  description: string;
  actor: {
    name: string;
    role: string;
    avatarUrl?: string;
  };
  timestamp: string;
  relatedEntity: {
    label: string;
    href?: string;
  };
  statusBadge?: {
    text: string;
    variant: "success" | "warning" | "danger" | "info" | "primary" | "neutral";
  };
}

// -------------------------------------------------------------
// Recent Orders Table Types
// -------------------------------------------------------------
export interface AdminOrderListItem {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    location: string;
  };
  items: {
    title: string;
    quantity: number;
    shopName: string;
  }[];
  totalAmount: number;
  paymentStatus: "PAID" | "PENDING" | "FAILED" | "REFUNDED";
  orderStatus: "CONFIRMED" | "PROCESSING" | "READY_TO_SHIP" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  paymentMethod: "ZINIPAY_BKASH" | "ZINIPAY_NAGAD" | "ZINIPAY_CARD" | "CASH_ON_DELIVERY";
  createdAt: string;
}

// -------------------------------------------------------------
// Pending Approvals Types
// -------------------------------------------------------------
export interface PendingApprovalCategoryItem {
  id: string;
  category: "MEMBER_VERIFICATIONS" | "PROFILE_APPROVALS" | "BUSINESS_APPROVALS" | "PRODUCT_APPROVALS" | "REPORTED_CONTENT";
  title: string;
  pendingCount: number;
  urgentCount: number;
  description: string;
  href: string;
  iconName: "userCheck" | "badgeAlert" | "store" | "package" | "flag";
  priority: "HIGH" | "NORMAL";
}

// -------------------------------------------------------------
// Quick Actions Types
// -------------------------------------------------------------
export interface AdminQuickActionItem {
  id: string;
  label: string;
  description: string;
  href: string;
  iconName: string;
  badge?: string;
  isAvailable: boolean;
  category: "users" | "commerce" | "content" | "system";
}
