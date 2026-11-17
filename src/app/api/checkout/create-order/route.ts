import { NextRequest } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import {
  successResponse,
  unauthorizedResponse,
  errorResponse,
} from "@/lib/api/response";
import { createOrderFromCart } from "@/lib/services/order-service";
import { checkoutOrderCreateSchema } from "@/lib/validations/checkout";

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return unauthorizedResponse("Please log in to complete your checkout.");
  }

  const sessionId = req.headers.get("x-cart-session") || undefined;

  try {
    const body = await req.json();
    const validated = checkoutOrderCreateSchema.parse(body);

    const result = await createOrderFromCart({
      customerId: session.user.id,
      customerName: session.user.name || validated.shippingAddress.fullName,
      customerEmail: session.user.email || validated.shippingAddress.email,
      customerPhone: validated.shippingAddress.phone,
      shippingAddress: validated.shippingAddress,
      sessionId,
    });

    return successResponse({
      orderId: result.order.id,
      orderNumber: result.order.orderNumber,
      totalAmount: result.order.totalAmount,
      paymentUrl: result.paymentUrl,
    });
  } catch (err: any) {
    if (err.name === "ZodError") {
      return errorResponse(
        {
          message: "Shipping address validation failed",
          details: err.issues.map((i: any) => ({
            field: i.path.join("."),
            message: i.message,
          })),
        },
        400
      );
    }
    return errorResponse({ message: err.message || "Failed to process order" }, 400);
  }
}
