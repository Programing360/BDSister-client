import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import {
  AUTHORIZED_VERIFICATION_ROLES,
  verifyPresignedUrlSignature,
  retrievePrivateDocument,
} from "@/lib/storage/secure-vault";

export async function GET(req: NextRequest) {
  // 1. RBAC Guard: caller must be an authorized officer or admin
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Authentication required." } },
      { status: 401 }
    );
  }

  const userRole = session.user.role;
  if (!AUTHORIZED_VERIFICATION_ROLES.includes(userRole)) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "FORBIDDEN",
          message: "Access restricted to certified verification officers and administrators.",
        },
      },
      { status: 403 }
    );
  }

  // 2. Query param validation
  const searchParams = req.nextUrl.searchParams;
  const key = searchParams.get("key");
  const expiresStr = searchParams.get("expires");
  const sig = searchParams.get("sig");

  if (!key || !expiresStr || !sig) {
    return NextResponse.json(
      { success: false, error: { code: "BAD_REQUEST", message: "Missing document access signature." } },
      { status: 400 }
    );
  }

  const expires = parseInt(expiresStr, 10);
  if (isNaN(expires)) {
    return NextResponse.json(
      { success: false, error: { code: "BAD_REQUEST", message: "Invalid expiration timestamp." } },
      { status: 400 }
    );
  }

  // 3. Cryptographic signature and expiration check
  const isValid = verifyPresignedUrlSignature(key, expires, sig);
  if (!isValid) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "ACCESS_EXPIRED_OR_INVALID",
          message: "Signed access link has expired or has an invalid signature. Please refresh the review desk.",
        },
      },
      { status: 403 }
    );
  }

  // 4. Decrypt and stream from private vault
  const document = await retrievePrivateDocument(key);
  if (!document) {
    return NextResponse.json(
      { success: false, error: { code: "NOT_FOUND", message: "Document not found in vault." } },
      { status: 404 }
    );
  }

  return new NextResponse(new Uint8Array(document.buffer), {
    status: 200,
    headers: {
      "Content-Type": document.mimeType,
      "Content-Disposition": `inline; filename="${document.originalName}"`,
      "Cache-Control": "private, no-cache, no-store, must-revalidate",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
