import { NextRequest } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import {
  successResponse,
  unauthorizedResponse,
  notFoundResponse,
  errorResponse,
} from "@/lib/api/response";
import {
  getProductById,
  updateProduct,
  archiveProduct,
  submitProductForReview,
} from "@/lib/services/product-service";
import { productCreateSchema } from "@/lib/validations/product";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return unauthorizedResponse("Authentication required.");
  }

  const { id } = await params;
  const product = await getProductById(id, session.user.id);
  if (!product) {
    return notFoundResponse("Product not found or access unauthorized.");
  }

  return successResponse(product);
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return unauthorizedResponse("Authentication required.");
  }

  const { id } = await params;

  try {
    const body = await req.json();

    // Check action if submitting for review
    if (body.action === "SUBMIT_FOR_REVIEW") {
      const updated = await submitProductForReview(id, session.user.id);
      return successResponse(updated);
    }

    const validated = productCreateSchema.partial().parse(body);
    const updated = await updateProduct(id, session.user.id, validated);
    return successResponse(updated);
  } catch (err: any) {
    if (err.name === "ZodError") {
      return errorResponse(
        {
          message: "Validation failed",
          details: err.issues.map((i: any) => ({
            field: i.path.join("."),
            message: i.message,
          })),
        },
        400
      );
    }
    return errorResponse({ message: err.message || "Failed to update product" }, 400);
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return unauthorizedResponse("Authentication required.");
  }

  const { id } = await params;

  try {
    const archived = await archiveProduct(id, session.user.id);
    if (!archived) {
      return notFoundResponse("Product not found or could not be archived.");
    }
    return successResponse({ message: "Product archived successfully." });
  } catch (err: any) {
    return errorResponse({ message: err.message || "Failed to archive product" }, 400);
  }
}
