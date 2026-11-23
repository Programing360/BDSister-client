import { NextRequest } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import {
  listVerifications,
  type VerificationStatus,
} from "@/lib/db/repositories/verification-repository";
import { AUTHORIZED_VERIFICATION_ROLES } from "@/lib/storage/secure-vault";
import {
  successResponse,
  unauthorizedResponse,
  forbiddenResponse,
  errorResponse,
} from "@/lib/api/response";

export async function GET(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return unauthorizedResponse("Authentication required to access verification desk.");
  }

  if (!AUTHORIZED_VERIFICATION_ROLES.includes(session.user.role)) {
    return forbiddenResponse("Access restricted to certified verification officers and administrators.");
  }

  try {
    const searchParams = req.nextUrl.searchParams;
    const status = (searchParams.get("status") as VerificationStatus) || undefined;
    const search = searchParams.get("search") || undefined;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    const result = await listVerifications({
      status,
      search,
      page,
      limit,
    });

    return successResponse(result.data, undefined, {
      total: result.total,
      page: result.page,
      pageSize: result.limit,
      totalPages: result.totalPages,
    });
  } catch (err) {
    console.error("[AdminVerificationsAPI] List failed:", err);
    return errorResponse(
      {
        code: "INTERNAL_ERROR",
        message: (err as Error).message || "Failed to retrieve verifications list.",
      },
      500
    );
  }
}
