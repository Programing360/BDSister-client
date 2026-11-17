import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Better Auth session validation endpoint
const AUTH_SESSION_ENDPOINT = "/api/auth/get-session";

// Route prefixes to protect
const ADMIN_PREFIX = "/admin";
const MEMBER_PREFIX = "/member";
const ADMIN_LOGIN = "/admin/login";

// Auth routes that should redirect authenticated users to their dashboard
const PUBLIC_AUTH_ROUTES = ["/login", "/register"];

const ADMIN_ROLES = [
  "SUPER_ADMIN",
  "ADMIN",
  "MODERATOR",
  "FINANCE_ADMIN",
  "CONTENT_MANAGER",
  "SUPPORT_AGENT",
];

/**
 * Lightweight session check via Better Auth's cookie.
 * Full server-side session verification happens in layout/page server components.
 * Middleware acts as an early navigation guard only.
 */
async function getSessionFromRequest(request: NextRequest): Promise<{
  user?: { role?: string; status?: string };
} | null> {
  try {
    const sessionCookie =
      request.cookies.get("better-auth.session_token") ??
      request.cookies.get("__Secure-better-auth.session_token");

    if (!sessionCookie) return null;

    // Call Better Auth's session API to validate
    const sessionUrl = new URL(AUTH_SESSION_ENDPOINT, request.url);
    const response = await fetch(sessionUrl.toString(), {
      headers: {
        cookie: request.headers.get("cookie") ?? "",
      },
    });

    if (!response.ok) return null;

    const data = (await response.json()) as { user?: { role?: string; status?: string } } | null;
    return data;
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files and internal Next.js assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const isAdminRoute = pathname.startsWith(ADMIN_PREFIX);
  const isMemberRoute = pathname.startsWith(MEMBER_PREFIX);
  const isAdminLoginRoute = pathname === ADMIN_LOGIN;
  const isAuthRoute = PUBLIC_AUTH_ROUTES.includes(pathname);

  // If not a protected route or auth route, let it pass immediately
  if (!isAdminRoute && !isMemberRoute && !isAuthRoute) {
    return NextResponse.next();
  }

  // Allow admin login page without active session check
  if (isAdminLoginRoute) {
    return NextResponse.next();
  }

  const session = await getSessionFromRequest(request);
  const userRole = session?.user?.role;

  // --- Auth routes redirect for already authenticated users ---
  if (isAuthRoute) {
    if (session?.user) {
      const destination = userRole && ADMIN_ROLES.includes(userRole) ? "/admin" : "/member";
      return NextResponse.redirect(new URL(destination, request.url));
    }
    return NextResponse.next();
  }

  // --- Admin route protection ---
  if (isAdminRoute) {
    if (!session || !userRole) {
      const loginUrl = new URL(ADMIN_LOGIN, request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (!ADMIN_ROLES.includes(userRole)) {
      // Authenticated but not an admin — redirect to member dashboard
      return NextResponse.redirect(new URL("/member", request.url));
    }

    return NextResponse.next();
  }

  // --- Member route protection ---
  if (isMemberRoute) {
    if (!session || !userRole) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/member/:path*",
    "/login",
    "/register",
  ],
};
