import { NextRequest } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import { queryPublicBusinesses, insertBusiness } from "@/lib/db/repositories/business-repository";
import { businessRegistrationSchema } from "@/lib/validations/business";
import {
  successResponse,
  unauthorizedResponse,
  validationErrorResponse,
  errorResponse,
} from "@/lib/api/response";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") || undefined;
  const division = searchParams.get("division") || undefined;
  const search = searchParams.get("search") || undefined;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);

  try {
    const allBusinesses = await queryPublicBusinesses({ category, division, search });
    const startIndex = (page - 1) * limit;
    const paginated = allBusinesses.slice(startIndex, startIndex + limit);

    return successResponse(
      {
        businesses: paginated,
        total: allBusinesses.length,
        page,
        limit,
        totalPages: Math.ceil(allBusinesses.length / limit),
      },
      undefined,
      {
        page,
        pageSize: limit,
        total: allBusinesses.length,
        totalPages: Math.ceil(allBusinesses.length / limit),
      }
    );
  } catch (err) {
    return errorResponse({
      message: (err as Error).message || "Failed to load public business directory.",
    });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return unauthorizedResponse("Authentication required to register a business.");
  }

  try {
    const body = await req.json();
    const parseResult = businessRegistrationSchema.safeParse(body);

    if (!parseResult.success) {
      const details: Record<string, string[]> = {};
      for (const issue of parseResult.error.issues) {
        const path = issue.path.join(".");
        if (!details[path]) details[path] = [];
        details[path].push(issue.message);
      }
      return validationErrorResponse(details);
    }

    const business = await insertBusiness(
      session.user.id,
      parseResult.data,
      session.user.name
    );

    return successResponse(
      { business },
      "Business registered successfully.",
      undefined,
      201
    );
  } catch (err) {
    return errorResponse({
      message: (err as Error).message || "Failed to register business.",
    });
  }
}
