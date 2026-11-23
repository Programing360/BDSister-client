import { NextRequest } from "next/server";
import { getDatabase } from "@/lib/db/mongodb";
import { successResponse, notFoundResponse, errorResponse } from "@/lib/api/response";
import { findBusinessById, findBusinessBySlug } from "@/lib/db/repositories/business-repository";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    let business = await findBusinessById(id);
    if (!business) {
      business = await findBusinessBySlug(id);
    }

    if (!business) {
      return notFoundResponse("Business not found for affiliate tracking.");
    }

    const userAgent = req.headers.get("user-agent") || "unknown";
    const referer = req.headers.get("referer") || "direct";

    let bodyData: any = {};
    try {
      bodyData = await req.json();
    } catch {
      // Beacon calls or empty bodies
    }

    // Record click event in background
    try {
      const db = await getDatabase();
      await db.collection("business_affiliate_clicks").insertOne({
        businessId: business.id,
        businessSlug: business.slug,
        timestamp: new Date(),
        userAgent,
        referer,
        metadata: bodyData,
      });

      // Increment click counter on business document
      await db.collection("businesses").updateOne(
        { id: business.id },
        { $inc: { affiliateClicksCount: 1 }, $set: { lastAffiliateClickAt: new Date() } }
      );
    } catch (dbErr) {
      console.warn("[AffiliateClick] DB write deferred:", (dbErr as Error).message);
    }

    return successResponse(
      { tracked: true, businessId: business.id },
      "Affiliate click tracked successfully."
    );
  } catch (err) {
    return errorResponse({
      message: (err as Error).message || "Failed to record affiliate click.",
    });
  }
}
