/**
 * BDSisters.org - Category Types
 * Step 8: Product Management, Inventory & Marketplace Foundation
 */

export interface CategoryDocument {
  _id?: any;
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  image?: string;
  subcategories: string[];
  isActive: boolean;
  displayOrder: number;
  productCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PublicCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  image?: string;
  subcategories: string[];
  productCount?: number;
}
