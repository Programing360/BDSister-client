import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import {
  errorResponse,
  validationErrorResponse,
} from "@/lib/api/response";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return validationErrorResponse({
        ...(!email ? { email: ["Email address is required."] } : {}),
        ...(!password ? { password: ["Password is required."] } : {}),
      });
    }

    // Call Better-Auth with asResponse to ensure cookies (better-auth.session_token) are preserved
    const authResponse = await auth.api.signInEmail({
      body: {
        email: email.trim().toLowerCase(),
        password,
      },
      headers: req.headers,
      asResponse: true,
    });

    if (!authResponse.ok) {
      let errorData: any = {};
      try {
        errorData = await authResponse.json();
      } catch {
        // Ignored
      }

      const msg = (errorData?.message || "").toLowerCase();
      if (msg.includes("credential") || msg.includes("password") || msg.includes("email")) {
        return errorResponse(
          {
            code: "INVALID_CREDENTIALS",
            message: "Invalid email or password. Please verify your credentials and try again.",
          },
          401
        );
      }

      if (msg.includes("verify") || msg.includes("verification")) {
        return errorResponse(
          {
            code: "EMAIL_NOT_VERIFIED",
            message: "Your email address is not verified yet. Please check your inbox for the verification link.",
          },
          403
        );
      }

      return errorResponse(
        {
          code: errorData?.code || "AUTH_FAILED",
          message: errorData?.message || "Sign in failed. Please try again.",
        },
        authResponse.status || 400
      );
    }

    const data = await authResponse.json();
    const response = NextResponse.json({
      success: true,
      data,
      message: "Sign in successful.",
    });

    // Copy Set-Cookie headers from Better-Auth response
    const setCookieHeaders = authResponse.headers.getSetCookie();
    if (setCookieHeaders && setCookieHeaders.length > 0) {
      for (const cookieStr of setCookieHeaders) {
        response.headers.append("Set-Cookie", cookieStr);
      }
    } else {
      const singleCookie = authResponse.headers.get("set-cookie");
      if (singleCookie) {
        response.headers.set("Set-Cookie", singleCookie);
      }
    }

    return response;
  } catch (err) {
    return errorResponse({
      message: (err as Error).message || "An unexpected error occurred during sign in.",
    });
  }
}
