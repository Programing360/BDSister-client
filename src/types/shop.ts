/**
 * BDSisters.org - Shop Management Types
 * Step 7: Business Management, Business Profile & Shop Management
 */

export type ShopStatus =
  | "NOT_CONFIGURED"
  | "DRAFT"
  | "PENDING_REVIEW"
  | "ACTIVE"
  | "PAUSED"
  | "SUSPENDED";

export interface ShopPolicies {
  shippingPolicy?: string;
  returnPolicy?: string;
  exchangePolicy?: string;
  privacyPolicy?: string;
  customerSupportHours?: string;
}

export interface ShopDocument {
  _id?: any;
  id: string;
  businessId: string; // foreign key to BusinessDocument.id
  ownerId: string;    // foreign key to User.id
  businessName?: string;
  businessSlug?: string;
  name: string;
  slug: string;
  shortDescription?: string;
  logo?: string | null;
  banner?: string | null;
  supportEmail?: string;
  supportPhone?: string;
  policies: ShopPolicies;
  status: ShopStatus;
  productCount?: number;
  totalOrdersCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PublicShopProfile {
  id: string;
  businessId: string;
  businessName: string;
  businessSlug: string;
  name: string;
  slug: string;
  shortDescription?: string;
  logo?: string | null;
  banner?: string | null;
  supportEmail?: string;
  supportPhone?: string;
  policies: ShopPolicies;
  status: ShopStatus;
  isBusinessVerified?: boolean;
  createdAt: string | Date;
}
