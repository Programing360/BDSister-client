import { NextRequest } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import {
  successResponse,
  unauthorizedResponse,
  errorResponse,
} from "@/lib/api/response";
import { requestOrderCancellation } from "@/lib/services/order-service";
import { orderCancelRequestSchema } from "@/lib/validations/checkout";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return unauthorizedResponse("Authentication required.");
  }

  const { id } = await params;

  try {
    const body = await req.json();
    const validated = orderCancelRequestSchema.parse(body);

    const updated = await requestOrderCancellation(
      id,
      session.user.id,
      validated.reason
    );

    return successResponse(
      updated,
      "Order cancellation request has been submitted."
    );
  } catch (err: any) {
    return errorResponse(
      { message: err.message || "Failed to submit cancellation request." },
      400
    );
  }
}
