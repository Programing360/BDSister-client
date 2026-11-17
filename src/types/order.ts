/**
 * BDSisters.org - Order & E-commerce Types
 * Step 9: Shopping Cart, Checkout, ZiniPay Payment Integration & Order Management
 */

export type PaymentStatus =
  | "PENDING"
  | "PROCESSING"
  | "PAID"
  | "FAILED"
  | "CANCELLED"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED";

export type OrderStatus =
  | "PENDING_PAYMENT"
  | "CONFIRMED"
  | "PROCESSING"
  | "READY_TO_SHIP"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLATION_REQUESTED"
  | "CANCELLED";

export type ItemFulfillmentStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  division: string;
  district: string;
  city: string; // Thana / Upazila / City Area
  streetAddress: string;
  postalCode?: string | null;
  deliveryInstructions?: string | null;
}

export interface OrderItemSnapshot {
  id: string;
  productId: string;
  productSlug: string;
  productName: string;
  productImage: string;
  sku: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  businessId: string;
  businessName: string;
  businessSlug: string;
  shopId?: string;
  shopName?: string;
  fulfillmentStatus: ItemFulfillmentStatus;
  trackingNumber?: string;
  carrier?: string;
  updatedAt?: Date;
}

export interface OrderDocument {
  _id?: any;
  id: string;
  orderNumber: string; // e.g. BDS-202611-10492
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: ShippingAddress;
  items: OrderItemSnapshot[];
  sellerBusinessIds: string[]; // Indexed for seller querying
  subtotal: number;
  discount: number;
  shippingCharge: number;
  totalAmount: number;
  currency: "BDT";
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  paymentTransactionId?: string;
  zinipayInvoiceId?: string;
  zinipayTransactionId?: string;
  cancellationReason?: string;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
