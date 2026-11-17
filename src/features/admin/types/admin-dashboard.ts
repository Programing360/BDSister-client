/**
 * BDSisters.org - Admin Dashboard TypeScript Definitions
 * Step 1: Admin Dashboard Foundation, Layout & Navigation
 */

export interface AdminKpiMetric {
  id: string;
  label: string;
  value: string;
  rawNumber: number;
  changePercent: number;
  trend: "up" | "down" | "neutral";
  comparisonText: string;
  iconName: "users" | "userCheck" | "shieldAlert" | "briefcase" | "store" | "package" | "shoppingBag" | "banknote";
  category: "users" | "commerce" | "trust";
}

export interface AdminGrowthDataPoint {
  month: string;
  registeredMembers: number;
  activeMembers: number;
  businesses: number;
}

export interface AdminRevenueDataPoint {
  month: string;
  totalRevenue: number;
  ordersCount: number;
}

export interface AdminRecentOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  businessName: string;
  itemCount: number;
  totalAmount: number;
  paymentStatus: "PAID" | "PENDING" | "FAILED" | "REFUNDED";
  orderStatus: "CONFIRMED" | "PROCESSING" | "READY_TO_SHIP" | "SHIPPED" | "DELIVERED";
  createdAt: string;
}

export interface AdminPendingApproval {
  id: string;
  type: "MEMBER_VERIFICATION" | "BUSINESS_REGISTRATION" | "SHOP_BRANDING" | "CONTENT_REPORT";
  title: string;
  subtitle: string;
  applicantName: string;
  applicantPhone?: string;
  submittedAt: string;
  priority: "HIGH" | "NORMAL" | "LOW";
  badgeText: string;
}

export interface AdminActivityItem {
  id: string;
  actorName: string;
  actorRole: string;
  action: string;
  target: string;
  timestamp: string;
  type: "SECURITY" | "VERIFICATION" | "SHOP" | "COMMERCE" | "SYSTEM";
}

export interface AdminQuickAction {
  id: string;
  label: string;
  description: string;
  href: string;
  iconName: string;
  badge?: string;
}
