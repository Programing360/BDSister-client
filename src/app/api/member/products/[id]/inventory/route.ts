import { NextRequest } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import {
  successResponse,
  unauthorizedResponse,
  errorResponse,
} from "@/lib/api/response";
import {
  updateProductInventory,
  adjustProductStock,
} from "@/lib/services/product-service";
import {
  inventoryUpdateSchema,
  inventoryQuickAdjustmentSchema,
} from "@/lib/validations/product";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return unauthorizedResponse("Authentication required to manage product inventory.");
  }

  const { id } = await params;

  try {
    const body = await req.json();

    if (body.adjustment !== undefined) {
      const parsed = inventoryQuickAdjustmentSchema.parse({
        ...body,
        productId: id,
      });
      const updated = await adjustProductStock(
        id,
        session.user.id,
        parsed.adjustment,
        parsed.mode
      );
      return successResponse(updated);
    }

    const validated = inventoryUpdateSchema.parse(body);
    const updated = await updateProductInventory(id, session.user.id, validated);
    return successResponse(updated);
  } catch (err: any) {
    if (err.name === "ZodError") {
      return errorResponse(
        {
          message: "Invalid inventory payload",
          details: err.issues.map((i: any) => ({
            field: i.path.join("."),
            message: i.message,
          })),
        },
        400
      );
    }
    return errorResponse(
      { message: err.message || "Failed to update inventory" },
      400
    );
  }
}
