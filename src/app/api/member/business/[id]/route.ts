import { NextRequest } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import { getBusinessById, updateBusiness } from "@/lib/services/business-service";
import { businessUpdateSchema } from "@/lib/validations/business";
import {
  successResponse,
  unauthorizedResponse,
  forbiddenResponse,
  notFoundResponse,
  validationErrorResponse,
  errorResponse,
} from "@/lib/api/response";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return unauthorizedResponse("Authentication required.");
  }

  const { id } = await context.params;
  const business = await getBusinessById(id);

  if (!business) {
    return notFoundResponse("Business not found.");
  }

  const isOwner = business.ownerId === session.user.id;
  const isAdmin = session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN";

  if (!isOwner && !isAdmin) {
    return forbiddenResponse("You do not have permission to view this business.");
  }

  return successResponse({ business });
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return unauthorizedResponse("Authentication required to update business.");
  }

  const { id } = await context.params;
  const existing = await getBusinessById(id);

  if (!existing) {
    return notFoundResponse("Business not found.");
  }

  if (existing.ownerId !== session.user.id) {
    return forbiddenResponse("Unauthorized: You do not own this business.");
  }

  try {
    const body = await req.json();
    const parseResult = businessUpdateSchema.safeParse(body);

    if (!parseResult.success) {
      const details: Record<string, string[]> = {};
      for (const issue of parseResult.error.issues) {
        const path = issue.path.join(".");
        if (!details[path]) details[path] = [];
        details[path].push(issue.message);
      }
      return validationErrorResponse(details);
    }

    const updated = await updateBusiness(id, session.user.id, parseResult.data);
    return successResponse({ business: updated }, "Business updated successfully.");
  } catch (err) {
    return errorResponse({
      message: (err as Error).message || "Failed to update business.",
    });
  }
}
