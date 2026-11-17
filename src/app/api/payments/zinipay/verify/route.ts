import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/api/response";
import { verifyAndFinalizePayment } from "@/lib/services/order-service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const invoiceId = body.invoice_id || body.invoiceId;

    if (!invoiceId) {
      return errorResponse({ message: "Invoice ID is required for verification." }, 400);
    }

    const result = await verifyAndFinalizePayment(invoiceId);

    if (result.success && result.order) {
      return successResponse({
        orderId: result.order.id,
        orderNumber: result.order.orderNumber,
        status: result.status,
        totalAmount: result.order.totalAmount,
        customerName: result.order.customerName,
        itemsCount: result.order.items.length,
      });
    }

    return errorResponse(
      {
        message: result.message || "Payment has not completed yet or could not be verified.",
        details: { status: [result.status || "UNKNOWN"] },
      },
      400
    );
  } catch (err: any) {
    return errorResponse({ message: err.message || "Verification failed." }, 500);
  }
}
