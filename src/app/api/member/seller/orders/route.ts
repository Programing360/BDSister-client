import { NextRequest } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import {
  successResponse,
  unauthorizedResponse,
  errorResponse,
} from "@/lib/api/response";
import { getSellerOrders } from "@/lib/services/order-service";

export async function GET(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return unauthorizedResponse("Authentication required for seller orders.");
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || undefined;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  try {
    const result = await getSellerOrders(session.user.id, {
      status,
      page,
      limit,
    });
    return successResponse(result);
  } catch (err: any) {
    return errorResponse({ message: err.message || "Failed to load seller orders" }, 500);
  }
}
