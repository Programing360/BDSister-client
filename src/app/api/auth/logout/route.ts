import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { errorResponse } from "@/lib/api/response";

export async function POST(req: NextRequest) {
  try {
    const authResponse = await auth.api.signOut({
      headers: req.headers,
      asResponse: true,
    });

    const response = NextResponse.json({
      success: true,
      message: "Successfully signed out.",
    });

    // Copy Set-Cookie headers from Better-Auth response to clear the session cookie
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
      message: (err as Error).message || "An unexpected error occurred during sign out.",
    });
  }
}
