import { NextRequest } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import {
  findVerificationByUserId,
  createOrUpdateVerification,
  recordAuditLog,
  type VerificationDocType,
} from "@/lib/db/repositories/verification-repository";
import {
  uploadPrivateDocument,
  ALLOWED_DOC_MIME_TYPES,
  MAX_DOCUMENT_BYTES,
} from "@/lib/storage/secure-vault";
import {
  successResponse,
  unauthorizedResponse,
  errorResponse,
} from "@/lib/api/response";

export async function GET() {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return unauthorizedResponse("Authentication required to view verification status.");
  }

  const record = await findVerificationByUserId(session.user.id);

  if (!record) {
    return successResponse({
      status: "UNVERIFIED",
      idNumberMasked: null,
      docType: null,
      submittedAt: null,
      reviewedAt: null,
      rejectionReason: null,
    });
  }

  const isRejectedOrAction =
    record.status === "REJECTED" || record.status === "ACTION_REQUIRED";

  return successResponse({
    id: record.id,
    status: record.status,
    idNumberMasked: record.idNumberMasked,
    docType: record.docType,
    submittedAt: record.submittedAt,
    reviewedAt: record.reviewedAt,
    rejectionReason: isRejectedOrAction ? record.rejectionReason : null,
    adminNotes: isRejectedOrAction ? record.adminNotes : null,
  });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return unauthorizedResponse("Authentication required to submit identity verification.");
  }

  try {
    const formData = await req.formData();
    const docTypeRaw = (formData.get("docType") as string) || "NID";
    const idNumber = (formData.get("idNumber") as string)?.trim() || "";
    const frontFile = formData.get("frontImage") as File | null;
    const backFile = formData.get("backImage") as File | null;

    // 1. Validate docType
    const validDocTypes: VerificationDocType[] = ["NID", "PASSPORT", "ACADEMIC"];
    const docType: VerificationDocType = validDocTypes.includes(
      docTypeRaw as VerificationDocType
    )
      ? (docTypeRaw as VerificationDocType)
      : "NID";

    // 2. Validate ID number
    if (!idNumber || idNumber.length < 5 || idNumber.length > 40) {
      return errorResponse(
        {
          code: "VALIDATION_ERROR",
          message: "Please enter a valid document identification number (5–40 characters).",
        },
        400
      );
    }

    // 3. Validate Front Document
    if (!frontFile || !(frontFile instanceof File)) {
      return errorResponse(
        {
          code: "VALIDATION_ERROR",
          message: "Front image or scan of your identity document is required.",
        },
        400
      );
    }

    if (!ALLOWED_DOC_MIME_TYPES.includes(frontFile.type)) {
      return errorResponse(
        {
          code: "INVALID_FILE_TYPE",
          message: "Front document must be an image (JPEG, PNG, WebP) or PDF file.",
        },
        400
      );
    }

    if (frontFile.size > MAX_DOCUMENT_BYTES) {
      return errorResponse(
        {
          code: "FILE_TOO_LARGE",
          message: "Front document exceeds the maximum 10MB limit.",
        },
        400
      );
    }

    // 4. Validate Back Document if provided
    if (backFile && backFile instanceof File && backFile.size > 0) {
      if (!ALLOWED_DOC_MIME_TYPES.includes(backFile.type)) {
        return errorResponse(
          {
            code: "INVALID_FILE_TYPE",
            message: "Back document must be an image (JPEG, PNG, WebP) or PDF file.",
          },
          400
        );
      }
      if (backFile.size > MAX_DOCUMENT_BYTES) {
        return errorResponse(
          {
            code: "FILE_TOO_LARGE",
            message: "Back document exceeds the maximum 10MB limit.",
          },
          400
        );
      }
    }

    // 5. Read buffers and upload to secure vault
    const frontBuffer = Buffer.from(await frontFile.arrayBuffer());
    const { objectKey: frontDocumentKey } = await uploadPrivateDocument(
      {
        buffer: frontBuffer,
        fileName: frontFile.name,
        mimeType: frontFile.type,
        size: frontFile.size,
      },
      session.user.id
    );

    let backDocumentKey: string | undefined;
    if (backFile && backFile instanceof File && backFile.size > 0) {
      const backBuffer = Buffer.from(await backFile.arrayBuffer());
      const res = await uploadPrivateDocument(
        {
          buffer: backBuffer,
          fileName: backFile.name,
          mimeType: backFile.type,
          size: backFile.size,
        },
        session.user.id
      );
      backDocumentKey = res.objectKey;
    }

    // 6. Save verification record (AES-256 encrypted ID number)
    const verification = await createOrUpdateVerification({
      userId: session.user.id,
      userEmail: session.user.email,
      userName: session.user.name || "Sister Member",
      docType,
      idNumber,
      frontDocumentKey,
      backDocumentKey,
    });

    // 7. Write immutable audit log
    const clientIp = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";

    await recordAuditLog({
      action: "SUBMIT_NID",
      actorId: session.user.id,
      actorEmail: session.user.email,
      actorRole: session.user.role,
      targetId: verification.id,
      targetUserId: session.user.id,
      details: {
        docType: verification.docType,
        idNumberMasked: verification.idNumberMasked,
        hasBackDocument: Boolean(backDocumentKey),
      },
      ipAddress: clientIp,
      userAgent,
    });

    return successResponse(
      {
        id: verification.id,
        status: verification.status,
        idNumberMasked: verification.idNumberMasked,
        docType: verification.docType,
        submittedAt: verification.submittedAt,
      },
      "Verification submitted successfully! Our certified female moderation officers will review your documents within 24–48 hours."
    );
  } catch (err) {
    console.error("[MemberVerificationAPI] Submission failed:", err);
    return errorResponse(
      {
        code: "INTERNAL_ERROR",
        message: (err as Error).message || "Failed to process verification submission.",
      },
      500
    );
  }
}
