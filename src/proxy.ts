import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_PREFIX = "/admin";
const MEMBER_PREFIX = "/member";
const ADMIN_LOGIN = "/admin/login";
const PUBLIC_AUTH_ROUTES = ["/login", "/register", "/verify-email", "/forgot-password", "/reset-password"];

const ADMIN_ROLES = new Set([
  "superadmin",
  "super_admin",
  "admin",
  "moderator",
  "financeadmin",
  "contentmanager",
  "supportagent",
]);

function normalizeRole(role?: string | null): string {
  return (role || "").replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
}

function decodeJwtPayload(token: string): Record<string, any> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3 || !parts[1]) return null;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(base64);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function getAuthTokenFromRequest(request: NextRequest): string | null {
  const cookieNames = [
    "token",
    "auth_token",
    "jwt",
    "accessToken",
    "bdsisters_token",
    "better-auth.session_token",
  ];

  for (const name of cookieNames) {
    const cookie = request.cookies.get(name);
    if (cookie?.value) {
      return cookie.value;
    }
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader?.toLowerCase().startsWith("bearer ")) {
    return authHeader.slice(7).trim();
  }

  return null;
}

async function resolveUser(request: NextRequest) {
  const token = getAuthTokenFromRequest(request);
  if (!token) return null;

  // 1. Fast local verification: decode payload and check exp
  const payload = decodeJwtPayload(token);
  if (payload) {
    const exp = typeof payload.exp === "number" ? payload.exp : undefined;
    if (exp && exp * 1000 < Date.now()) {
      return null;
    }

    const nestedUser = (payload.user as Record<string, unknown> | undefined) ?? {};
    const id = payload.id ?? payload._id ?? payload.sub ?? nestedUser.id;
    if (id) {
      const rawRole = payload.role ?? nestedUser.role ?? "Member";
      const status = payload.status ?? nestedUser.status ?? "Active";
      return {
        id,
        role: rawRole,
        status,
        email: payload.email ?? nestedUser.email,
        fullName: payload.fullName ?? payload.name ?? nestedUser.fullName,
      };
    }
  }

  // 2. Fallback to API check
  try {
    const apiBase =
      process.env.INTERNAL_API_URL ||
      process.env.BACKEND_INTERNAL_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:5000";

    const res = await fetch(`${apiBase}/api/auth/me`, {
      method: "GET",
      headers: {
        Cookie: `token=${token}`,
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) return null;
    const json = await res.json();
    return json?.data || json?.user || null;
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname, searchParams } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
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

  // Check if session is explicitly marked expired or error is present
  const isExpired = searchParams.get("expired") === "true";
  const hasError = searchParams.has("error");

  // Resolve user
  const user = await resolveUser(request);
  const normalizedRole = normalizeRole(user?.role);
  const isAdmin = ADMIN_ROLES.has(normalizedRole);

  // If user visits an auth page (/login, /register, etc.)
  if (isAuthRoute) {
    // If expired or error query is present, do NOT redirect to member/admin dashboard
    if (isExpired || hasError) {
      return NextResponse.next();
    }

    if (user) {
      const destination = isAdmin ? "/admin" : "/member";
      return NextResponse.redirect(new URL(destination, request.url));
    }
    return NextResponse.next();
  }

  // If user visits /admin/*
  if (isAdminRoute) {
    if (!user) {
      const loginUrl = new URL(ADMIN_LOGIN, request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/member", request.url));
    }
    return NextResponse.next();
  }

  // If user visits /member/*
  if (isMemberRoute) {
    if (!user) {
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
    "/verify-email",
    "/forgot-password",
    "/reset-password",
  ],
};
