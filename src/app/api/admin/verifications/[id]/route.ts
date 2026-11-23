import { NextRequest } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import {
  findVerificationById,
  recordAuditLog,
  decryptIdNumber,
  sanitizeVerification,
} from "@/lib/db/repositories/verification-repository";
import {
  AUTHORIZED_VERIFICATION_ROLES,
  generatePrivatePresignedUrl,
} from "@/lib/storage/secure-vault";
import {
  successResponse,
  unauthorizedResponse,
  forbiddenResponse,
  notFoundResponse,
  errorResponse,
} from "@/lib/api/response";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return unauthorizedResponse("Authentication required to access verification record.");
  }

  if (!AUTHORIZED_VERIFICATION_ROLES.includes(session.user.role)) {
    return forbiddenResponse("Access restricted to certified verification officers and administrators.");
  }

  const { id } = await context.params;

  try {
    const record = await findVerificationById(id);
    if (!record) {
      return notFoundResponse("Verification record not found.");
    }

    // Generate short-lived (15-minute / 900s) presigned URLs for document scans
    const frontDocumentUrl = generatePrivatePresignedUrl(record.frontDocumentKey, 900);
    const backDocumentUrl = record.backDocumentKey
      ? generatePrivatePresignedUrl(record.backDocumentKey, 900)
      : null;

    // Decrypt the ID number for the authorized verification officer to match against scan
    const decryptedId = decryptIdNumber(record.idNumberEncrypted) || record.idNumberMasked;

    // Mandatory immutable audit log entry for NID inspection
    const clientIp = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";

    await recordAuditLog({
      action: "VIEW_NID",
      actorId: session.user.id,
      actorEmail: session.user.email,
      actorRole: session.user.role,
      targetId: record.id,
      targetUserId: record.userId,
      details: {
        docType: record.docType,
        idNumberMasked: record.idNumberMasked,
        officerName: session.user.name,
      },
      ipAddress: clientIp,
      userAgent,
    });

    const safeBase = sanitizeVerification(record);

    return successResponse({
      ...safeBase,
      idNumber: decryptedId,
      frontDocumentUrl,
      backDocumentUrl,
    });
  } catch (err) {
    console.error("[AdminVerificationDetailAPI] Fetch failed:", err);
    return errorResponse(
      {
        code: "INTERNAL_ERROR",
        message: (err as Error).message || "Failed to retrieve verification details.",
      },
      500
    );
  }
}
