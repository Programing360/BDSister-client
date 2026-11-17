import { NextRequest, NextResponse } from "next/server";
import { verifyAndFinalizePayment } from "@/lib/services/order-service";

export async function POST(req: NextRequest) {
  try {
    let invoiceId: string | null = null;

    // Check JSON body
    try {
      const body = await req.json();
      invoiceId = body.invoice_id || body.invoiceId || body.id || null;
    } catch {
      // Body might be empty or url-encoded
    }

    // Check query params if not found in body
    if (!invoiceId) {
      const { searchParams } = new URL(req.url);
      invoiceId = searchParams.get("invoice_id") || searchParams.get("invoiceId");
    }

    if (!invoiceId) {
      console.warn("[ZiniPay Webhook] Received webhook without invoice_id.");
      return NextResponse.json(
        { success: false, message: "Missing invoice_id parameter." },
        { status: 400 }
      );
    }

    console.log(`[ZiniPay Webhook] Processing invoice verification for: ${invoiceId}`);

    // Strictly verify with ZiniPay server and atomically update order/inventory
    const result = await verifyAndFinalizePayment(invoiceId);

    return NextResponse.json({
      success: result.success,
      status: result.status,
      message: result.message || "Webhook processed.",
    });
  } catch (err: any) {
    console.error("[ZiniPay Webhook Error]", err.message);
    return NextResponse.json(
      { success: false, message: err.message || "Internal webhook error." },
      { status: 500 }
    );
  }
}
