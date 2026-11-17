import type {
  ZiniPayCreateInvoiceRequest,
  ZiniPayCreateInvoiceResponse,
  ZiniPayVerifyInvoiceResponse,
} from "@/types/payment";
import type { PaymentStatus } from "@/types/order";

const ZINIPAY_BASE_URL =
  process.env.ZINIPAY_API_BASE_URL || "https://api.zinipay.com";
const ZINIPAY_API_KEY = process.env.ZINIPAY_API_KEY || "";

/**
 * Checks whether live ZiniPay API credentials are configured in the environment
 */
export function isZiniPayConfigured(): boolean {
  return Boolean(ZINIPAY_API_KEY && ZINIPAY_API_KEY.trim().length > 0);
}

/**
 * Extracts invoice ID from a ZiniPay payment URL if not provided directly
 * e.g., https://secure.zinipay.com/payment/INV_12345678 -> INV_12345678
 */
export function extractInvoiceIdFromUrl(url: string): string {
  try {
    const parsed = new URL(url);
    const queryId =
      parsed.searchParams.get("invoice_id") ||
      parsed.searchParams.get("invoiceId") ||
      parsed.searchParams.get("id");
    if (queryId) return queryId;

    const parts = parsed.pathname.split("/").filter(Boolean);
    return parts[parts.length - 1] || "";
  } catch {
    const parts = url.split("/").filter(Boolean);
    return parts[parts.length - 1] || "";
  }
}

/**
 * Normalizes ZiniPay verification status to internal PaymentStatus
 */
export function normalizeZiniPayStatus(zinipayStatus: string): PaymentStatus {
  switch (zinipayStatus?.toUpperCase()) {
    case "COMPLETED":
    case "PAID":
    case "SUCCESS":
      return "PAID";
    case "PENDING":
      return "PROCESSING";
    case "FAILED":
    case "ERROR":
      return "FAILED";
    case "CANCELLED":
    case "CANCELED":
      return "CANCELLED";
    case "REFUNDED":
      return "REFUNDED";
    default:
      return "PROCESSING";
  }
}

export class ZiniPayService {
  /**
   * Generates a hosted payment invoice and returns the secure payment URL
   */
  static async createInvoice(params: {
    amount: number;
    redirectUrl: string;
    cancelUrl?: string;
    webhookUrl?: string;
    customerName: string;
    customerEmail: string;
    metadata?: Record<string, any>;
  }): Promise<{
    success: boolean;
    invoiceId: string;
    paymentUrl: string;
    error?: string;
  }> {
    if (params.amount <= 0) {
      return {
        success: false,
        invoiceId: "",
        paymentUrl: "",
        error: "Invoice amount must be greater than 0 BDT.",
      };
    }

    // High-fidelity development / sandbox fallback if no API key is configured
    if (!isZiniPayConfigured()) {
      console.warn(
        "[ZiniPay] ZINIPAY_API_KEY is not configured in environment. Using Sandbox payment gateway simulator."
      );
      const mockInvoiceId = `ZINI-SANDBOX-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const mockPaymentUrl = `${appUrl}/checkout/success?invoice_id=${mockInvoiceId}&mode=sandbox`;

      return {
        success: true,
        invoiceId: mockInvoiceId,
        paymentUrl: mockPaymentUrl,
      };
    }

    try {
      const payload: ZiniPayCreateInvoiceRequest = {
        amount: params.amount,
        redirect_url: params.redirectUrl,
        cancel_url: params.cancelUrl,
        webhook_url: params.webhookUrl,
        cus_name: params.customerName,
        cus_email: params.customerEmail,
        metadata: params.metadata,
      };

      const res = await fetch(`${ZINIPAY_BASE_URL}/v1/payment/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "zini-api-key": ZINIPAY_API_KEY,
        },
        body: JSON.stringify(payload),
      });

      const data: ZiniPayCreateInvoiceResponse = await res.json();

      if (!res.ok || !data.status || !data.payment_url) {
        return {
          success: false,
          invoiceId: "",
          paymentUrl: "",
          error:
            data.message ||
            data.error ||
            `ZiniPay API error (HTTP ${res.status}): Failed to create hosted invoice.`,
        };
      }

      const invoiceId =
        data.invoice_id || extractInvoiceIdFromUrl(data.payment_url);

      return {
        success: true,
        invoiceId,
        paymentUrl: data.payment_url,
      };
    } catch (err: any) {
      console.error("[ZiniPay] Invoice creation request failed:", err.message);
      return {
        success: false,
        invoiceId: "",
        paymentUrl: "",
        error: `Network error reaching ZiniPay payment server: ${err.message}`,
      };
    }
  }

  /**
   * Verifies payment status of an invoice directly with ZiniPay server
   */
  static async verifyInvoice(invoiceId: string): Promise<{
    success: boolean;
    status: string;
    amount?: number;
    transactionId?: string;
    paymentMethod?: string;
    raw: any;
    error?: string;
  }> {
    if (!invoiceId) {
      return {
        success: false,
        status: "FAILED",
        raw: null,
        error: "Missing invoice ID for verification.",
      };
    }

    // Sandbox simulated verification fallback
    if (!isZiniPayConfigured() || invoiceId.startsWith("ZINI-SANDBOX-")) {
      return {
        success: true,
        status: "COMPLETED",
        amount: undefined, // Matched with order amount in caller
        transactionId: `TRX-${Date.now().toString().slice(-8)}`,
        paymentMethod: "bkash-sandbox",
        raw: {
          invoice_id: invoiceId,
          status: "COMPLETED",
          payment_method: "bkash",
          simulated: true,
        },
      };
    }

    try {
      const res = await fetch(`${ZINIPAY_BASE_URL}/v1/payment/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "zini-api-key": ZINIPAY_API_KEY,
        },
        body: JSON.stringify({ invoice_id: invoiceId }),
      });

      const data: ZiniPayVerifyInvoiceResponse = await res.json();

      if (!res.ok) {
        return {
          success: false,
          status: "FAILED",
          raw: data,
          error: data.message || `ZiniPay verification failed (HTTP ${res.status})`,
        };
      }

      return {
        success: true,
        status: data.status,
        amount: data.amount,
        transactionId: data.transaction_id,
        paymentMethod: data.payment_method,
        raw: data,
      };
    } catch (err: any) {
      console.error("[ZiniPay] Verification request failed:", err.message);
      return {
        success: false,
        status: "FAILED",
        raw: null,
        error: `Network error verifying invoice with ZiniPay: ${err.message}`,
      };
    }
  }
}
