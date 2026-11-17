import { NextRequest } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import { updateShopPolicies } from "@/lib/services/shop-service";
import { shopPoliciesSchema } from "@/lib/validations/shop";
import {
  successResponse,
  unauthorizedResponse,
  validationErrorResponse,
  errorResponse,
} from "@/lib/api/response";

export async function PUT(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return unauthorizedResponse("Authentication required to update shop policies.");
  }

  try {
    const body = await req.json();
    const { businessId, ...policiesData } = body;

    if (!businessId) {
      return validationErrorResponse({ businessId: ["Associated business ID is required."] });
    }

    const parseResult = shopPoliciesSchema.safeParse(policiesData);
    if (!parseResult.success) {
      const details: Record<string, string[]> = {};
      for (const issue of parseResult.error.issues) {
        const path = issue.path.join(".");
        if (!details[path]) details[path] = [];
        details[path].push(issue.message);
      }
      return validationErrorResponse(details);
    }

    const shop = await updateShopPolicies(
      businessId,
      session.user.id,
      parseResult.data
    );

    return successResponse({ shop }, "Shop policies updated successfully.");
  } catch (err) {
    return errorResponse({
      message: (err as Error).message || "Failed to update policies.",
    });
  }
}
