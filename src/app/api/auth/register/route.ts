import crypto from "node:crypto";
import { NextRequest } from "next/server";
import { auth } from "@/lib/auth/auth";
import { getDatabase } from "@/lib/db/mongodb";
import {
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
  errorResponse,
  validationErrorResponse,
} from "@/lib/api/response";

const BOOTSTRAP_REFERRAL_CODES = new Set([
  "SISTER-2026",
  "SISTER2026",
  "FOUNDER",
  "FOUNDER2026",
  "BDSISTERS",
  "BDSISTERS2026",
  "REF-BDSISTER-100",
]);

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let name = "";
    let email = "";
    let password = "";
    let referrerCode = "";
    let docTypeRaw = "NID";
    let idNumber = "";
    let frontFile: File | null = null;
    let backFile: File | null = null;

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      name = (formData.get("name") as string)?.trim() || "";
      email = (formData.get("email") as string)?.trim().toLowerCase() || "";
      password = (formData.get("password") as string) || "";
      referrerCode = (formData.get("referrerCode") as string)?.trim() || "";
      docTypeRaw = (formData.get("docType") as string) || "NID";
      idNumber = (formData.get("idNumber") as string)?.trim() || "";
      frontFile = formData.get("frontImage") as File | null;
      backFile = formData.get("backImage") as File | null;
    } else {
      const body = await req.json();
      name = body.name?.trim() || "";
      email = body.email?.trim().toLowerCase() || "";
      password = body.password || "";
      referrerCode = body.referrerCode?.trim() || "";
      docTypeRaw = body.docType || "NID";
      idNumber = body.idNumber?.trim() || "";
    }

    if (!email || !password || !name) {
      return validationErrorResponse({
        ...(!name ? { name: ["Full name is required."] } : {}),
        ...(!email ? { email: ["Email address is required."] } : {}),
        ...(!password ? { password: ["Password is required."] } : {}),
      });
    }

    const db = await getDatabase();

    // 1. Validate Sisterhood Referral Code against database
    const normalizedRef = referrerCode.toUpperCase();
    const isBootstrapCode = BOOTSTRAP_REFERRAL_CODES.has(normalizedRef);

    if (!isBootstrapCode) {
      const totalUsers = await db.collection("users").countDocuments();
      if (totalUsers > 0) {
        const referrerUser = await db.collection("users").findOne({
          $or: [
            { referralCode: normalizedRef },
            { referrerCode: normalizedRef },
            { id: referrerCode },
          ],
        });

        if (!referrerUser) {
          return errorResponse(
            {
              code: "INVALID_REFERRAL_CODE",
              message:
                "Invalid sisterhood referral code. Registration requires an active referral invitation from an existing BDSisters member or official founder code.",
            },
            400
          );
        }
      }
    }

    // 2. Validate NID/Passport if provided
    const validDocTypes: VerificationDocType[] = ["NID", "PASSPORT", "ACADEMIC"];
    const docType: VerificationDocType = validDocTypes.includes(docTypeRaw as VerificationDocType)
      ? (docTypeRaw as VerificationDocType)
      : "NID";

    if (frontFile && frontFile instanceof File) {
      if (!ALLOWED_DOC_MIME_TYPES.includes(frontFile.type)) {
        return errorResponse(
          {
            code: "INVALID_DOCUMENT_FORMAT",
            message: "NID / Passport front scan must be JPEG, PNG, WebP, or PDF.",
          },
          400
        );
      }
      if (frontFile.size > MAX_DOCUMENT_BYTES) {
        return errorResponse(
          {
            code: "DOCUMENT_TOO_LARGE",
            message: "Front document exceeds the maximum 10MB limit.",
          },
          400
        );
      }
    }

    if (backFile && backFile instanceof File && backFile.size > 0) {
      if (!ALLOWED_DOC_MIME_TYPES.includes(backFile.type)) {
        return errorResponse(
          {
            code: "INVALID_DOCUMENT_FORMAT",
            message: "Back document scan must be JPEG, PNG, WebP, or PDF.",
          },
          400
        );
      }
      if (backFile.size > MAX_DOCUMENT_BYTES) {
        return errorResponse(
          {
            code: "DOCUMENT_TOO_LARGE",
            message: "Back document exceeds the maximum 10MB limit.",
          },
          400
        );
      }
    }

    // 3. Attempt Better-Auth user signup
    let signUpResult: any = null;
    try {
      signUpResult = await auth.api.signUpEmail({
        body: {
          email,
          password,
          name,
        },
        headers: req.headers,
      });
    } catch (authErr: any) {
      const msg = (authErr?.message || "").toLowerCase();
      if (msg.includes("already exists") || msg.includes("duplicate") || msg.includes("taken")) {
        return errorResponse(
          {
            code: "EMAIL_ALREADY_EXISTS",
            message: "An account with this email address already exists. Please sign in instead.",
          },
          409
        );
      }
      return errorResponse(
        {
          code: "SIGNUP_FAILED",
          message: authErr?.message || "Failed to create account.",
        },
        400
      );
    }

    const userId = signUpResult?.user?.id || signUpResult?.id;

    // 4. Generate unique referral code for the new member
    const newMemberReferralCode = `BDS-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;

    // 5. If identity documents were uploaded, process through private secure vault
    let hasVerification = false;
    if (frontFile && frontFile instanceof File && userId && idNumber) {
      try {
        const frontBuffer = Buffer.from(await frontFile.arrayBuffer());
        const { objectKey: frontDocumentKey } = await uploadPrivateDocument(
          {
            buffer: frontBuffer,
            fileName: frontFile.name,
            mimeType: frontFile.type,
            size: frontFile.size,
          },
          userId
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
            userId
          );
          backDocumentKey = res.objectKey;
        }

        const verification = await createOrUpdateVerification({
          userId,
          userEmail: email,
          userName: name,
          docType,
          idNumber,
          frontDocumentKey,
          backDocumentKey,
        });

        hasVerification = true;

        const clientIp = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
        const userAgent = req.headers.get("user-agent") || "unknown";

        await recordAuditLog({
          action: "SUBMIT_NID",
          actorId: userId,
          actorEmail: email,
          actorRole: "MEMBER",
          targetId: verification.id,
          targetUserId: userId,
          details: {
            source: "REGISTRATION_FLOW",
            docType,
            idNumberMasked: verification.idNumberMasked,
          },
          ipAddress: clientIp,
          userAgent,
        });
      } catch (vaultErr) {
        console.warn("[Register] Document vault upload error:", (vaultErr as Error).message);
      }
    }

    // 6. Update user metadata (referral code, attribution, and verification status)
    if (userId) {
      await db.collection("users").updateOne(
        { id: userId },
        {
          $set: {
            referralCode: newMemberReferralCode,
            referrerCode: normalizedRef || null,
            verificationStatus: hasVerification ? "PENDING" : "UNVERIFIED",
            updatedAt: new Date(),
          },
        }
      );
    }

    // 7. Track referral attribution
    if (normalizedRef) {
      try {
        await db.collection("referrals").insertOne({
          referrerCode: normalizedRef,
          referredUserId: userId,
          referredUserEmail: email,
          referredUserName: name,
          status: hasVerification ? "PENDING_VERIFICATION" : "REGISTERED",
          createdAt: new Date(),
        });
      } catch (refErr) {
        console.warn("[Register] Referral attribution record deferred:", (refErr as Error).message);
      }
    }

    return successResponse(
      {
        user: signUpResult?.user || { email, name, id: userId },
        email,
        referralCode: newMemberReferralCode,
        referrerAttributed: Boolean(normalizedRef),
        verificationSubmitted: hasVerification,
      },
      "Account registered successfully. Please check your inbox to verify your email.",
      undefined,
      201
    );
  } catch (err) {
    console.error("[RegisterAPI] Unexpected error:", err);
    return errorResponse({
      message: (err as Error).message || "An unexpected error occurred during registration.",
    });
  }
}
