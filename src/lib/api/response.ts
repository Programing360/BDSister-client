import type { ApiResponse, ApiError, ApiMeta } from "@/types/api";
import { NextResponse } from "next/server";

export function successResponse<T>(
  data: T,
  message?: string,
  meta?: ApiMeta,
  status: number = 200,
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    { success: true, data, message, meta },
    { status },
  );
}

export function errorResponse(
  error: Partial<ApiError>,
  status: number = 500,
): NextResponse<ApiResponse<never>> {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: error.code ?? "INTERNAL_ERROR",
        message: error.message ?? "An unexpected error occurred.",
        details: error.details,
      },
    },
    { status },
  );
}

export function notFoundResponse(message = "Resource not found"): NextResponse<ApiResponse<never>> {
  return errorResponse({ code: "NOT_FOUND", message }, 404);
}

export function unauthorizedResponse(message = "Unauthorized"): NextResponse<ApiResponse<never>> {
  return errorResponse({ code: "UNAUTHORIZED", message }, 401);
}

export function forbiddenResponse(message = "Forbidden"): NextResponse<ApiResponse<never>> {
  return errorResponse({ code: "FORBIDDEN", message }, 403);
}

export function validationErrorResponse(
  details: Record<string, string[]>,
): NextResponse<ApiResponse<never>> {
  return errorResponse({ code: "VALIDATION_ERROR", message: "Validation failed.", details }, 422);
}
