/**
 * BDSisters.org - Step 8: Payment, Membership & Subscription Management
 * TypeScript Domain Types for Admin Membership & Subscription Management
 */

export type PlanBillingDuration =
  | "MONTHLY"
  | "QUARTERLY"
  | "HALF_YEARLY"
  | "YEARLY"
  | "LIFETIME"
  | "CUSTOM";

export type PlanStatus = "ACTIVE" | "INACTIVE" | "ARCHIVED";

export interface MembershipPlan {
  id: string;
  name: string;
  type: "FREE" | "PAID";
  description: string;
  priceBDT: number;
  billingDuration: PlanBillingDuration;
  durationLabel: string;
  billingPeriodDays: number;
  benefits: string[];
  memberCount: number;
  activeSubscriptions: number;
  status: PlanStatus;
  isFeatured: boolean;
  badgeText?: string;
  colorScheme: "purple" | "emerald" | "amber" | "indigo" | "rose";
  createdAt: string;
  updatedAt: string;
}

export type SubscriptionStatus =
  | "PENDING"
  | "ACTIVE"
  | "EXPIRING_SOON"
  | "EXPIRED"
  | "CANCELLED"
  | "SUSPENDED";

export type RenewalType = "MANUAL" | "ASSISTED_REVIEW";

export interface SubscriptionTimelineEntry {
  status: SubscriptionStatus;
  timestamp: string;
  note: string;
}

export interface SubscriptionPaymentRecord {
  trxId: string;
  amountBDT: number;
  date: string;
  method: string;
  status: string;
}

export interface MembershipSubscription {
  id: string;
  subscriptionCode: string;
  memberId: string;
  memberName: string;
  memberEmail: string;
  memberPhone: string;
  planId: string;
  planName: string;
  startDate: string;
  expiryDate: string;
  amountBDT: number;
  status: SubscriptionStatus;
  renewalType: RenewalType;
  paymentReference: string;
  autoRenewEnabled: boolean;
  renewalAttempts: number;
  lastPaymentDate: string;
  nextRenewalNotice: string;
  timeline: SubscriptionTimelineEntry[];
  paymentHistory: SubscriptionPaymentRecord[];
  notes?: string;
}

export interface SubscriptionOverviewKpis {
  totalSubscriptions: number;
  activeSubscriptions: number;
  pendingSubscriptions: number;
  expiringSoon: number;
  expiredSubscriptions: number;
  cancelledSubscriptions: number;
}

export interface RenewalReviewItem {
  id: string;
  subscriptionId: string;
  subscriptionCode: string;
  memberId: string;
  memberName: string;
  memberEmail: string;
  memberPhone: string;
  planName: string;
  amountBDT: number;
  currentExpiryDate: string;
  daysRemaining: number;
  status: "UPCOMING" | "EXPIRING_SOON" | "EXPIRED" | "RENEWAL_REQUESTED" | "MANUAL_REVIEW";
  requestedDuration: PlanBillingDuration;
  paymentReference?: string;
  adminNotes?: string;
}
