import { NextRequest } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import {
  findShopByBusinessId as getShopByBusinessId,
  findShopsByOwnerId as getShopsByOwnerId,
  saveShop as createOrUpdateShop,
} from "@/lib/db/repositories/shop-repository";
import { fullShopUpdateSchema } from "@/lib/validations/shop";
import {
  successResponse,
  unauthorizedResponse,
  validationErrorResponse,
  errorResponse,
} from "@/lib/api/response";

export async function GET(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return unauthorizedResponse("Authentication required to access shop details.");
  }

  const { searchParams } = new URL(req.url);
  const businessId = searchParams.get("businessId");

  try {
    if (businessId) {
      const shop = await getShopByBusinessId(businessId);
      return successResponse({ shop });
    }

    const shops = await getShopsByOwnerId(session.user.id);
    return successResponse({ shops, primaryShop: shops[0] || null });
  } catch (err) {
    return errorResponse({
      message: (err as Error).message || "Failed to retrieve shop information.",
    });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return unauthorizedResponse("Authentication required to update shop.");
  }

  try {
    const body = await req.json();
    const { businessId, ...shopData } = body;

    if (!businessId) {
      return validationErrorResponse({ businessId: ["Associated business ID is required."] });
    }

    const parseResult = fullShopUpdateSchema.safeParse(shopData);
    if (!parseResult.success) {
      const details: Record<string, string[]> = {};
      for (const issue of parseResult.error.issues) {
        const path = issue.path.join(".");
        if (!details[path]) details[path] = [];
        details[path].push(issue.message);
      }
      return validationErrorResponse(details);
    }

    const shop = await createOrUpdateShop(
      session.user.id,
      businessId,
      parseResult.data
    );

    return successResponse({ shop }, "Shop settings saved successfully.");
  } catch (err) {
    return errorResponse({
      message: (err as Error).message || "Failed to save shop settings.",
    });
  }
}
