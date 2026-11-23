import { NextRequest } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import { addBusinessVerificationDoc as submitBusinessVerification } from "@/lib/db/repositories/business-repository";
import { businessVerificationSchema } from "@/lib/validations/business";
import {
  successResponse,
  unauthorizedResponse,
  validationErrorResponse,
  errorResponse,
} from "@/lib/api/response";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return unauthorizedResponse("Authentication required for verification submission.");
  }

  const { id } = await context.params;

  try {
    const body = await req.json();
    const parseResult = businessVerificationSchema.safeParse({
      ...body,
      businessId: id,
    });

    if (!parseResult.success) {
      const details: Record<string, string[]> = {};
      for (const issue of parseResult.error.issues) {
        const path = issue.path.join(".");
        if (!details[path]) details[path] = [];
        details[path].push(issue.message);
      }
      return validationErrorResponse(details);
    }

    const business = await submitBusinessVerification(
      id,
      session.user.id,
      parseResult.data
    );

    return successResponse(
      { business },
      "Verification documents submitted for review."
    );
  } catch (err) {
    return errorResponse({
      message: (err as Error).message || "Failed to submit verification.",
    });
  }
}
