/**
 * BDSisters.org - Product & Inventory Types
 * Step 8: Product Management, Inventory & Marketplace Foundation
 */

export type ProductStatus =
  | "DRAFT"
  | "PENDING_REVIEW"
  | "ACTIVE"
  | "REJECTED"
  | "ARCHIVED";

export type InventoryStatus =
  | "IN_STOCK"
  | "LOW_STOCK"
  | "OUT_OF_STOCK"
  | "NOT_TRACKED";

export type ProductVisibility = "PUBLIC" | "PRIVATE" | "UNLISTED";

export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  order: number;
  isPrimary: boolean;
}

export interface ProductPricing {
  regularPrice: number;
  salePrice?: number;
  discountPercent?: number;
  costPrice?: number; // Private, owner/admin only
  currency: "BDT";
}

export interface ProductInventory {
  sku: string;
  quantity: number;
  lowStockThreshold: number;
  trackInventory: boolean;
  status: InventoryStatus;
  backorderPolicy?: "DENY" | "ALLOW";
}

export interface ProductDocument {
  _id?: any;
  id: string;
  ownerId: string; // Foreign key to User.id
  businessId: string; // Foreign key to BusinessDocument.id
  shopId?: string; // Foreign key to ShopDocument.id
  businessName: string;
  businessSlug: string;
  shopName?: string;
  shopSlug?: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  category: string;
  subcategory?: string;
  tags: string[];
  pricing: ProductPricing;
  images: ProductImage[];
  primaryImage: string;
  inventory: ProductInventory;
  status: ProductStatus;
  visibility: ProductVisibility;
  featured: boolean;
  viewsCount?: number;
  rating?: number;
  reviewsCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PublicProductProfile {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  category: string;
  subcategory?: string;
  tags: string[];
  pricing: {
    regularPrice: number;
    salePrice?: number;
    discountPercent?: number;
    currency: "BDT";
  };
  primaryImage: string;
  images: Array<{
    id: string;
    url: string;
    alt?: string;
    isPrimary: boolean;
  }>;
  inventory: {
    inStock: boolean;
    status: InventoryStatus;
    availableQuantity?: number;
  };
  business: {
    id: string;
    name: string;
    slug: string;
    isVerified?: boolean;
    location?: string;
  };
  shop?: {
    id: string;
    name: string;
    slug: string;
  };
  rating: number;
  reviewsCount: number;
  featured?: boolean;
  createdAt: string | Date;
}

export interface ProductStatsSummary {
  total: number;
  published: number;
  draft: number;
  pendingReview: number;
  lowStock: number;
  outOfStock: number;
}
