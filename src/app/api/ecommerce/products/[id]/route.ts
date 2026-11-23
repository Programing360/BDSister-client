import { NextRequest } from "next/server";
import { successResponse, notFoundResponse, errorResponse } from "@/lib/api/response";
import {
  getProductById,
  getPublicProductBySlug,
} from "@/lib/services/product-service";
import { getServerSession } from "@/lib/auth/session";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const session = await getServerSession();

  try {
    let product = await getPublicProductBySlug(id, session?.user?.id);
    if (!product) {
      const doc = await getProductById(id, session?.user?.id);
      if (doc) {
        product = doc as any;
      }
    }

    if (!product) {
      return notFoundResponse("Product not found");
    }

    return successResponse({ product });
  } catch (err) {
    return errorResponse({
      message: (err as Error).message || "Failed to load product details",
    });
  }
}
