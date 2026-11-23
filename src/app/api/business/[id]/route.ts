import { NextRequest } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import {
  findBusinessById,
  findBusinessBySlug,
  modifyBusiness,
} from "@/lib/db/repositories/business-repository";
import { businessUpdateSchema } from "@/lib/validations/business";
import { filterBusinessForPublic } from "@/features/business/utils/business-utils";
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
  const { id } = await context.params;
  const session = await getServerSession();

  let business = await findBusinessById(id);
  if (!business) {
    business = await findBusinessBySlug(id);
  }

  if (!business) {
    return notFoundResponse("Business not found.");
  }

  const isOwner = session?.user?.id && business.ownerId === session.user.id;
  const isAdmin = session?.user?.role === "ADMIN" || session?.user?.role === "SUPER_ADMIN";

  if (isOwner || isAdmin) {
    return successResponse({ business });
  }

  if (business.status !== "APPROVED" && business.visibility !== "PUBLIC") {
    return forbiddenResponse("This business profile is not publicly available.");
  }

  const publicProfile = filterBusinessForPublic(business, {
    viewerUserId: session?.user?.id,
    isAdmin: Boolean(isAdmin),
  });

  return successResponse({ business: publicProfile });
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
  let existing = await findBusinessById(id);
  if (!existing) {
    existing = await findBusinessBySlug(id);
  }

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

    const updated = await modifyBusiness(existing.id, session.user.id, parseResult.data);
    return successResponse({ business: updated }, "Business updated successfully.");
  } catch (err) {
    return errorResponse({
      message: (err as Error).message || "Failed to update business.",
    });
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return PUT(req, context);
}
