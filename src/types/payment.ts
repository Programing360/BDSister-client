/**
 * BDSisters.org - ZiniPay Payment Integration Types
 * Step 9: Shopping Cart, Checkout, ZiniPay Payment Integration & Order Management
 */

import type { PaymentStatus } from "./order";

export interface ZiniPayCreateInvoiceRequest {
  amount: number;
  redirect_url: string;
  cancel_url?: string;
  webhook_url?: string;
  cus_name?: string;
  cus_email?: string;
  cus_telegram?: string;
  metadata?: Record<string, any>;
}

export interface ZiniPayCreateInvoiceResponse {
  status: boolean;
  message?: string;
  payment_url?: string;
  invoice_id?: string;
  error?: string;
}

export interface ZiniPayVerifyInvoiceRequest {
  invoice_id: string;
}

export interface ZiniPayVerifyInvoiceResponse {
  cus_name?: string;
  cus_email?: string;
  amount: number;
  invoice_id: string;
  payment_method?: string;
  transaction_id?: string;
  status: "PENDING" | "COMPLETED" | "FAILED" | string;
  message?: string;
}

export interface PaymentTransactionDocument {
  _id?: any;
  id: string;
  orderId: string;
  orderNumber: string;
  customerId: string;
  provider: "ZINIPAY";
  invoiceId: string;
  paymentUrl: string;
  amount: number;
  currency: "BDT";
  status: PaymentStatus;
  paymentMethod?: string;
  zinipayTrxId?: string;
  rawResponse?: Record<string, any>;
  verifiedAt?: Date;
  idempotencyKey: string;
  createdAt: Date;
  updatedAt: Date;
}
