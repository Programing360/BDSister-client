import { NextRequest } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import {
  successResponse,
  unauthorizedResponse,
  notFoundResponse,
  errorResponse,
} from "@/lib/api/response";
import { getOrderById } from "@/lib/services/order-service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return unauthorizedResponse("Authentication required.");
  }

  const { id } = await params;

  try {
    const order = await getOrderById(id, session.user.id);
    if (!order) {
      return notFoundResponse("Order not found or unauthorized.");
    }
    return successResponse(order);
  } catch (err: any) {
    return errorResponse({ message: err.message || "Failed to load order" }, 500);
  }
}
