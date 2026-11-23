import { NextRequest } from "next/server";
import { auth } from "@/lib/auth/auth";
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
} from "@/lib/api/response";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || typeof email !== "string") {
      return validationErrorResponse({
        email: ["A valid email address is required."],
      });
    }

    try {
      await auth.api.requestPasswordReset({
        body: {
          email: email.trim().toLowerCase(),
          redirectTo: "/reset-password",
        },
        headers: req.headers,
      });
    } catch (authErr) {
      console.warn("[ForgotPassword] Process notice:", (authErr as Error).message);
    }

    // Always return success to prevent email enumeration attacks
    return successResponse(
      { email: email.trim().toLowerCase() },
      "If an account exists with this email, password reset instructions have been dispatched."
    );
  } catch (err) {
    return errorResponse({
      message: (err as Error).message || "Failed to process password reset request.",
    });
  }
}
