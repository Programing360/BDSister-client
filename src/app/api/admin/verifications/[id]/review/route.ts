import { NextRequest } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import {
  findVerificationById,
  reviewVerification,
  recordAuditLog,
  sanitizeVerification,
  type VerificationStatus,
} from "@/lib/db/repositories/verification-repository";
import { AUTHORIZED_VERIFICATION_ROLES } from "@/lib/storage/secure-vault";
import {
  successResponse,
  unauthorizedResponse,
  forbiddenResponse,
  notFoundResponse,
  errorResponse,
} from "@/lib/api/response";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return unauthorizedResponse("Authentication required to review verification submission.");
  }

  if (!AUTHORIZED_VERIFICATION_ROLES.includes(session.user.role)) {
    return forbiddenResponse("Access restricted to certified verification officers and administrators.");
  }

  const { id } = await context.params;

  try {
    const existing = await findVerificationById(id);
    if (!existing) {
      return notFoundResponse("Verification record not found.");
    }

    const body = (await req.json()) as {
      action?: "APPROVE" | "REJECT" | "REQUEST_INFO";
      reason?: string;
      notes?: string;
    };

    const action = body.action;
    if (!action || !["APPROVE", "REJECT", "REQUEST_INFO"].includes(action)) {
      return errorResponse(
        {
          code: "VALIDATION_ERROR",
          message: "Valid action ('APPROVE', 'REJECT', or 'REQUEST_INFO') is required.",
        },
        400
      );
    }

    let targetStatus: VerificationStatus = "UNDER_REVIEW";
    if (action === "APPROVE") targetStatus = "APPROVED";
    if (action === "REJECT") targetStatus = "REJECTED";
    if (action === "REQUEST_INFO") targetStatus = "ACTION_REQUIRED";

    if ((action === "REJECT" || action === "REQUEST_INFO") && !body.reason?.trim()) {
      return errorResponse(
        {
          code: "VALIDATION_ERROR",
          message: "A specific rejection or clarification reason is required when not approving.",
        },
        400
      );
    }

    const updated = await reviewVerification(id, {
      status: targetStatus,
      rejectionReason: body.reason?.trim(),
      adminNotes: body.notes?.trim(),
      officerId: session.user.id,
      officerName: session.user.name || "Female Verification Officer",
    });

    if (!updated) {
      return errorResponse({ message: "Failed to update verification record." }, 500);
    }

    // Record immutable audit log entry
    const clientIp = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";

    const auditAction =
      action === "APPROVE"
        ? "APPROVE_NID"
        : action === "REJECT"
          ? "REJECT_NID"
          : "REQUEST_INFO_NID";

    await recordAuditLog({
      action: auditAction,
      actorId: session.user.id,
      actorEmail: session.user.email,
      actorRole: session.user.role,
      targetId: updated.id,
      targetUserId: updated.userId,
      details: {
        action,
        newStatus: targetStatus,
        reason: body.reason?.trim(),
        notes: body.notes?.trim(),
        officerName: session.user.name,
      },
      ipAddress: clientIp,
      userAgent,
    });

    return successResponse(
      sanitizeVerification(updated),
      `Verification ${action.toLowerCase()}ed successfully.`
    );
  } catch (err) {
    console.error("[AdminVerificationReviewAPI] Review failed:", err);
    return errorResponse(
      {
        code: "INTERNAL_ERROR",
        message: (err as Error).message || "Failed to process verification review.",
      },
      500
    );
  }
}
