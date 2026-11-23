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
    const token = body.token;
    const newPassword = body.newPassword || body.password;

    if (!token || !newPassword) {
      return validationErrorResponse({
        ...(!token ? { token: ["Reset verification token is required."] } : {}),
        ...(!newPassword ? { newPassword: ["New password is required (minimum 8 characters)."] } : {}),
      });
    }

    try {
      await auth.api.resetPassword({
        body: {
          token,
          newPassword,
        },
        headers: req.headers,
      });
    } catch (authErr: any) {
      return errorResponse(
        {
          code: "INVALID_TOKEN",
          message: authErr?.message || "Invalid or expired password reset link. Please request a new one.",
        },
        400
      );
    }

    return successResponse(
      { reset: true },
      "Your password has been reset successfully. You can now sign in."
    );
  } catch (err) {
    return errorResponse({
      message: (err as Error).message || "An unexpected error occurred during password reset.",
    });
  }
}
