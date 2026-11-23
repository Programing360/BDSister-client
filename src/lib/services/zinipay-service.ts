import type {
  ZiniPayCreateInvoiceRequest,
  ZiniPayCreateInvoiceResponse,
  ZiniPayVerifyInvoiceResponse,
} from "@/types/payment";
import type { PaymentStatus } from "@/types/order";

const ZINIPAY_BASE_URL = process.env.ZINIPAY_API_BASE_URL || "https://api.zinipay.com";
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
        "[ZiniPay] ZINIPAY_API_KEY is not configured in environment. Using Sandbox payment gateway simulator.",
      );
      const mockInvoiceId = `ZINI-SANDBOX-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:5000";
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

      const invoiceId = data.invoice_id || extractInvoiceIdFromUrl(data.payment_url);

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

  /**
   * Client-side / REST API helper: Initiates a ZiniPay payment session
   * Invokes POST /api/payment/zinipay/init, returning hosted GatewayPageURL / paymentUrl
   * Auto-redirects browser if autoRedirect: true
   */
  static async initiatePayment(params: {
    amount: number;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    purpose?: "ORDER" | "MEMBERSHIP" | "SUBSCRIPTION" | "EVENT";
    redirectUrl?: string;
    cancelUrl?: string;
    autoRedirect?: boolean;
    metadata?: Record<string, any>;
  }): Promise<{
    success: boolean;
    invoiceId?: string;
    paymentUrl?: string;
    GatewayPageURL?: string;
    error?: string;
  }> {
    const appUrl =
      typeof window !== "undefined"
        ? window.location.origin
        : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:5000";

    const redirectUrl = params.redirectUrl || `${appUrl}/checkout/success`;
    const cancelUrl = params.cancelUrl || `${appUrl}/checkout/failed`;

    try {
      // 1. First attempt to call the backend endpoint /api/payment/zinipay/init
      try {
        const { apiClient } = await import("@/lib/api/client");
        const { API_ENDPOINTS } = await import("@/lib/api/endpoints");

        const res = await apiClient.post<{
          success?: boolean;
          paymentUrl?: string;
          GatewayPageURL?: string;
          invoiceId?: string;
          invoice_id?: string;
          error?: string;
          message?: string;
        }>(API_ENDPOINTS.payment.zinipayInit, {
          amount: params.amount,
          customerName: params.customerName,
          customerEmail: params.customerEmail,
          customerPhone: params.customerPhone,
          purpose: params.purpose || "ORDER",
          redirectUrl,
          cancelUrl,
          metadata: params.metadata,
        });

        const targetUrl = res.data?.paymentUrl || res.data?.GatewayPageURL;
        const invId = res.data?.invoiceId || res.data?.invoice_id;

        if (targetUrl) {
          if (params.autoRedirect && typeof window !== "undefined") {
            window.location.href = targetUrl;
          }
          return {
            success: true,
            invoiceId: invId,
            paymentUrl: targetUrl,
            GatewayPageURL: targetUrl,
          };
        }
      } catch (apiErr) {
        // Backend endpoint not yet running or offline; proceed to fallback
        console.warn(
          "[ZiniPayService] Backend init call deferred to client fallback:",
          (apiErr as Error).message,
        );
      }

      // 2. High-fidelity Sandbox / Direct Invoice Fallback
      const invoice = await this.createInvoice({
        amount: params.amount,
        redirectUrl,
        cancelUrl,
        customerName: params.customerName,
        customerEmail: params.customerEmail,
        metadata: {
          purpose: params.purpose,
          ...params.metadata,
        },
      });

      if (invoice.success && invoice.paymentUrl) {
        if (params.autoRedirect && typeof window !== "undefined") {
          window.location.href = invoice.paymentUrl;
        }
        return {
          success: true,
          invoiceId: invoice.invoiceId,
          paymentUrl: invoice.paymentUrl,
          GatewayPageURL: invoice.paymentUrl,
        };
      }

      return {
        success: false,
        error: invoice.error || "Failed to initialize payment gateway.",
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || "Failed to initiate payment.",
      };
    }
  }

  /**
   * Client-side / REST API helper: Validates payment status
   * Queries GET /api/payment/zinipay/validate or POST /api/payment/zinipay/verify
   */
  static async validatePayment(
    invoiceId: string,
    orderId?: string,
  ): Promise<{
    success: boolean;
    status: PaymentStatus;
    transactionId?: string;
    amount?: number;
    error?: string;
    order?: any;
  }> {
    if (!invoiceId) {
      return {
        success: false,
        status: "FAILED",
        error: "Missing invoice identifier for verification.",
      };
    }

    try {
      // 1. First attempt to call the REST validation endpoint
      try {
        const { apiClient } = await import("@/lib/api/client");
        const res = await apiClient.get<{
          success: boolean;
          status?: string;
          transactionId?: string;
          amount?: number;
          order?: any;
          data?: any;
          message?: string;
        }>("/api/payment/zinipay/validate", {
          params: { invoice_id: invoiceId, order_id: orderId },
        });

        if (res.data?.success) {
          const rawStatus = res.data.status || res.data.data?.status || "PAID";
          return {
            success: true,
            status: normalizeZiniPayStatus(rawStatus),
            transactionId: res.data.transactionId || res.data.data?.transactionId,
            amount: res.data.amount || res.data.data?.totalAmount,
            order: res.data.order || res.data.data?.order,
          };
        }
      } catch (validateErr) {
        // Fallback to POST /api/payments/zinipay/verify
        const verifyRes = await fetch("/api/payments/zinipay/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ invoiceId, orderId }),
        });
        const json = await verifyRes.json();
        if (json.success && json.data) {
          return {
            success: true,
            status: normalizeZiniPayStatus(json.data.status || "COMPLETED"),
            transactionId: json.data.transactionId,
            amount: json.data.totalAmount,
            order: json.data.order,
          };
        }
      }

      // 2. Fallback to direct verification
      const direct = await this.verifyInvoice(invoiceId);
      return {
        success: direct.success,
        status: normalizeZiniPayStatus(direct.status),
        transactionId: direct.transactionId,
        amount: direct.amount,
        error: direct.error,
      };
    } catch (err: any) {
      return {
        success: false,
        status: "FAILED",
        error: err.message || "Failed to validate payment transaction.",
      };
    }
  }
}
