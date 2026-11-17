/**
 * BDSisters.org - Shopping Cart Types
 * Step 9: Shopping Cart, Checkout, ZiniPay Payment Integration & Order Management
 */

export interface CartItem {
  id: string;
  productId: string;
  productSlug: string;
  productName: string;
  productImage: string;
  sku: string;
  regularPrice: number;
  salePrice?: number;
  price: number; // Effective unit price in BDT
  quantity: number;
  lineTotal: number;
  businessId: string;
  businessName: string;
  businessSlug: string;
  shopId?: string;
  shopName?: string;
  inStock: boolean;
  maxQuantity: number;
}

export interface CartDocument {
  _id?: any;
  id: string;
  userId?: string; // Authenticated member ID
  sessionId?: string; // Secure guest cart session identifier
  items: CartItem[];
  subtotal: number;
  itemCount: number;
  createdAt: Date;
  updatedAt: Date;
}
