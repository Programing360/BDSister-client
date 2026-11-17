import { NextRequest } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import {
  successResponse,
  unauthorizedResponse,
  errorResponse,
} from "@/lib/api/response";
import {
  getProductsByOwnerId,
  createProduct,
} from "@/lib/services/product-service";
import { productCreateSchema } from "@/lib/validations/product";

export async function GET(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return unauthorizedResponse("Authentication required to access member products.");
  }

  const { searchParams } = new URL(req.url);
  const businessId = searchParams.get("businessId") || undefined;
  const category = searchParams.get("category") || undefined;
  const status = searchParams.get("status") || undefined;
  const search = searchParams.get("search") || undefined;
  const stockStatus = searchParams.get("stockStatus") || undefined;
  const sort = searchParams.get("sort") || undefined;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "12", 10);

  try {
    const result = await getProductsByOwnerId(session.user.id, {
      businessId,
      category,
      status,
      search,
      stockStatus,
      sort,
      page,
      limit,
    });

    return successResponse(result);
  } catch (err) {
    return errorResponse(
      { message: (err as Error).message || "Failed to load member products." },
      500
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return unauthorizedResponse("Authentication required to create products.");
  }

  try {
    const body = await req.json();
    const validated = productCreateSchema.parse(body);

    const created = await createProduct(session.user.id, validated);
    return successResponse(created, "Product created successfully", undefined, 201);
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
    return errorResponse({ message: err.message || "Failed to create product" }, 400);
  }
}
