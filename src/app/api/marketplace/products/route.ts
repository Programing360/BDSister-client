import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/api/response";
import { getPublicProducts } from "@/lib/services/product-service";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || undefined;
  const category = searchParams.get("category") || undefined;
  const inStockOnly = searchParams.get("inStock") === "true";
  const minPrice = searchParams.get("minPrice")
    ? Number(searchParams.get("minPrice"))
    : undefined;
  const maxPrice = searchParams.get("maxPrice")
    ? Number(searchParams.get("maxPrice"))
    : undefined;
  const sort = searchParams.get("sort") || undefined;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "12", 10);

  try {
    const result = await getPublicProducts({
      search,
      category,
      inStockOnly,
      minPrice,
      maxPrice,
      sort,
      page,
      limit,
    });

    return successResponse(result);
  } catch (err) {
    return errorResponse(
      { message: (err as Error).message || "Failed to query marketplace products" },
      500
    );
  }
}
