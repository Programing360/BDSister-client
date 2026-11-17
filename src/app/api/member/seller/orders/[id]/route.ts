import { NextRequest } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import {
  successResponse,
  unauthorizedResponse,
  errorResponse,
} from "@/lib/api/response";
import { updateSellerItemFulfillment } from "@/lib/services/order-service";
import { updateFulfillmentStatusSchema } from "@/lib/validations/checkout";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return unauthorizedResponse("Authentication required.");
  }

  const { id } = await params;

  try {
    const body = await req.json();
    const validated = updateFulfillmentStatusSchema.parse(body);

    const updated = await updateSellerItemFulfillment({
      orderId: id,
      sellerUserId: session.user.id,
      itemId: validated.itemId,
      fulfillmentStatus: validated.fulfillmentStatus,
      carrier: validated.carrier || undefined,
      trackingNumber: validated.trackingNumber || undefined,
    });

    return successResponse(updated, "Item fulfillment status updated successfully.");
  } catch (err: any) {
    return errorResponse(
      { message: err.message || "Failed to update fulfillment status." },
      400
    );
  }
}
