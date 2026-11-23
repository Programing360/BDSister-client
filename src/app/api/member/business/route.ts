import { NextRequest } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import {
  findBusinessesByOwnerId as getBusinessesByOwnerId,
  insertBusiness as createBusiness,
} from "@/lib/db/repositories/business-repository";
import { businessRegistrationSchema } from "@/lib/validations/business";
import {
  successResponse,
  unauthorizedResponse,
  validationErrorResponse,
  errorResponse,
} from "@/lib/api/response";

export async function GET() {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return unauthorizedResponse("Authentication required to view businesses.");
  }

  try {
    const businesses = await getBusinessesByOwnerId(session.user.id);
    return successResponse({ businesses });
  } catch (err) {
    return errorResponse({
      message: (err as Error).message || "Failed to load businesses.",
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

    const business = await createBusiness(
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
