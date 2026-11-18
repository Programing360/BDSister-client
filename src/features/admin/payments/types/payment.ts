/**
 * BDSisters.org - Step 8: Payment, Membership & Subscription Management
 * TypeScript Domain Types for Admin Payment Infrastructure
 */

export type PaymentStatus =
  | "INITIATED"
  | "PENDING"
  | "PROCESSING"
  | "SUCCESSFUL"
  | "FAILED"
  | "CANCELLED"
  | "EXPIRED"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED";

export type PaymentType =
  | "MEMBERSHIP_SUBSCRIPTION"
  | "MARKETPLACE_ORDER"
  | "FEATURED_LISTING"
  | "COURSE_ENROLLMENT";

export type PaymentMethod =
  | "ZINIPAY_BKASH"
  | "ZINIPAY_NAGAD"
  | "ZINIPAY_ROCKET"
  | "ZINIPAY_CARD"
  | "ZINIPAY_INTERNET_BANKING";

export interface PaymentTimelineEntry {
  status: PaymentStatus;
  timestamp: string;
  note: string;
}

export interface PaymentTransaction {
  id: string;
  transactionId: string;
  gatewayTrxId: string;
  paymentReference: string;
  memberId: string;
  memberName: string;
  memberEmail: string;
  memberPhone: string;
  amountBDT: number;
  feeBDT: number;
  netAmountBDT: number;
  currency: "BDT";
  paymentType: PaymentType;
  relatedEntity: {
    type: "SUBSCRIPTION" | "ORDER" | "LISTING" | "COURSE";
    id: string;
    name: string;
  };
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  gateway: "ZINIPAY";
  initiatedAt: string;
  completedAt?: string;
  timeline: PaymentTimelineEntry[];
  internalNotes?: string;
  refundAmountBDT?: number;
  ipAddress?: string;
}

export interface PaymentOverviewKpis {
  totalPayments: number;
  successfulPayments: number;
  pendingPayments: number;
  failedPayments: number;
  refundedAmountBDT: number;
  totalCollectedRevenueBDT: number;
  membershipRevenueBDT: number;
  marketplaceRevenueBDT: number;
}

export interface PaymentFilterState {
  query: string;
  status: "ALL" | PaymentStatus;
  paymentType: "ALL" | PaymentType;
  paymentMethod: "ALL" | PaymentMethod;
  dateRange: "all" | "today" | "7d" | "30d" | "90d" | "year";
  sortBy: "date" | "amount" | "member";
  sortDirection: "asc" | "desc";
  page: number;
  pageSize: number;
}

export type RefundStatus =
  | "REQUESTED"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED";

export interface RefundItem {
  id: string;
  refundCode: string;
  originalTransactionId: string;
  originalTrxCode: string;
  memberId: string;
  memberName: string;
  relatedEntity: {
    type: "ORDER" | "SUBSCRIPTION";
    id: string;
    name: string;
  };
  requestedAmountBDT: number;
  refundReason: string;
  status: RefundStatus;
  requestDate: string;
  processedDate?: string;
  internalNote?: string;
  rejectionReason?: string;
  approvedBy?: string;
}

export type InvoiceStatus = "DRAFT" | "ISSUED" | "PAID" | "OVERDUE" | "CANCELLED";

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unitPriceBDT: number;
  totalBDT: number;
}

export interface InvoiceItem {
  id: string;
  invoiceNumber: string;
  memberId: string;
  memberName: string;
  memberEmail: string;
  memberAddress: string;
  memberPhone?: string;
  relatedEntity: {
    type: "SUBSCRIPTION" | "ORDER";
    id: string;
    name: string;
  };
  subtotalBDT: number;
  taxBDT: number;
  totalAmountBDT: number;
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  status: InvoiceStatus;
  paymentMethod?: PaymentMethod;
  transactionReference?: string;
  items: InvoiceLineItem[];
  notes?: string;
}

export interface ZiniPayGatewayConfig {
  gatewayName: string;
  provider: "ZINIPAY";
  environment: "SANDBOX" | "PRODUCTION";
  isEnabled: boolean;
  merchantId: string;
  apiKey: string;
  apiSecret: string;
  callbackUrl: string;
  webhookUrl: string;
  supportedChannels: string[];
  lastConnectionCheck: string;
  connectionStatus: "CONNECTED" | "DISCONNECTED" | "DEGRADED";
  ipnStatus: "ACTIVE" | "PENDING";
  apiVersion: string;
}

export interface MonthlyRevenueMetric {
  month: string;
  membershipRevenueBDT: number;
  marketplaceRevenueBDT: number;
  refundsBDT: number;
  netRevenueBDT: number;
  transactionCount: number;
}
