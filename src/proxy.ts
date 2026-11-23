import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Route prefixes to protect
const ADMIN_PREFIX = "/admin";
const MEMBER_PREFIX = "/member";
const ADMIN_LOGIN = "/admin/login";

// Auth routes that should redirect authenticated users to their dashboard
const PUBLIC_AUTH_ROUTES = ["/login", "/register"];

// শুধুমাত্র Admin ও SuperAdmin রোলগুলো (এখান থেকে "member" সরানো হয়েছে)
const ADMIN_NORMALIZED_SET = new Set([
  "superadmin",
  "admin",
  "moderator",
  "financeadmin",
  "contentmanager",
  "supportagent",
]);

// Member এবং Admin উভয়েই যেন /member অ্যাক্সেস করতে পারে তার জন্য সেট
const MEMBER_ACCESS_SET = new Set([
  "member",
  "user",
  ...ADMIN_NORMALIZED_SET,
]);

function normalizeRole(role?: string | null): string {
  if (!role) return "";
  return role.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
}

function isUserAdmin(role?: string | null): boolean {
  return ADMIN_NORMALIZED_SET.has(normalizeRole(role));
}

function canAccessMember(role?: string | null): boolean {
  return MEMBER_ACCESS_SET.has(normalizeRole(role));
}

/**
 * Express JWT কুকি থেকে পেলোড ডিকোড করার হেল্পার
 */
function getJwtUserFromRequest(request: NextRequest): {
  id?: string;
  role?: string;
  status?: string;
} | null {
  try {
    const token = request.cookies.get("token")?.value ?? request.cookies.get("auth_token")?.value;

    if (!token) return null;

    const parts = token.split(".");
    if (parts.length !== 3 || !parts[1]) return null;

    // Base64Url ডিকোড
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64)) as {
      id?: string;
      role?: string;
      status?: string;
      exp?: number;
    };

    // টোকেনের মেয়াদ শেষ হয়েছে কি না চেক করা
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/_next") || pathname.startsWith("/api/auth") || pathname.includes(".")) {
    return NextResponse.next();
  }

  const isAdminRoute = pathname.startsWith(ADMIN_PREFIX);
  const isMemberRoute = pathname.startsWith(MEMBER_PREFIX);
  const isAdminLoginRoute = pathname === ADMIN_LOGIN;
  const isAuthRoute = PUBLIC_AUTH_ROUTES.includes(pathname);

  if (!isAdminRoute && !isMemberRoute && !isAuthRoute) {
    return NextResponse.next();
  }

  if (isAdminLoginRoute) {
    return NextResponse.next();
  }

  const user = getJwtUserFromRequest(request);
  const userRole = user?.role;
  const hasAdminRole = isUserAdmin(userRole);
  const hasMemberAccess = canAccessMember(userRole);

  // --- Auth routes redirect for already authenticated users ---
  if (isAuthRoute) {
    const hasAuthError = request.nextUrl.searchParams.has("error");
    if (user && userRole && !hasAuthError) {
      const destination = hasAdminRole ? "/admin" : "/member";
      return NextResponse.redirect(new URL(destination, request.url));
    }
    return NextResponse.next();
  }

  // --- Admin route protection (Only Admin / SuperAdmin) ---
  if (isAdminRoute) {
    if (!user || !userRole) {
      const loginUrl = new URL(ADMIN_LOGIN, request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (!hasAdminRole) {
      return NextResponse.redirect(new URL("/member", request.url));
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-pathname", pathname);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // --- Member route protection (Member, User, Admin & SuperAdmin all allowed) ---
  if (isMemberRoute) {
    if (!user || !userRole) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (!hasMemberAccess) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/member/:path*", "/login", "/register"],
};