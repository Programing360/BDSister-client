import { NextResponse } from "next/server";
import { successResponse, errorResponse } from "@/lib/api/response";
import { getCategories } from "@/lib/services/category-service";

export async function GET() {
  try {
    const categories = await getCategories();
    return successResponse(categories);
  } catch (err) {
    return errorResponse(
      { message: (err as Error).message || "Failed to load product categories" },
      500
    );
  }
}
