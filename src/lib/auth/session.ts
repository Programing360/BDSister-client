import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";
import type { AuthSession, AuthUser, UserRole } from "@/types/auth";

export const ADMIN_ROLES: UserRole[] = [
  "SUPER_ADMIN",
  "ADMIN",
  "MODERATOR",
  "FINANCE_ADMIN",
  "CONTENT_MANAGER",
  "SUPPORT_AGENT",
];

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3 || !parts[1]) return null;
    const decoded = Buffer.from(parts[1], "base64url").toString("utf-8");
    return JSON.parse(decoded) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function normalizeUserRole(rawRole?: string): UserRole {
  const cleaned = (rawRole || "MEMBER").replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  const roleMap: Record<string, UserRole> = {
    SUPERADMIN: "SUPER_ADMIN",
    ADMIN: "ADMIN",
    MODERATOR: "MODERATOR",
    FINANCEADMIN: "FINANCE_ADMIN",
    CONTENTMANAGER: "CONTENT_MANAGER",
    SUPPORTAGENT: "SUPPORT_AGENT",
    MEMBER: "MEMBER",
    USER: "MEMBER",
  };
  return roleMap[cleaned] || "MEMBER";
}

/**
 * Get the current session on the server.
 * Checks Better Auth first, then falls back to Express JWT cookie (`token` / `auth_token`).
 */
export async function getServerSession(): Promise<AuthSession | null> {
  // 1. Try Better Auth session
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (session?.user && session.session) {
      return session as unknown as AuthSession;
    }
  } catch {
    // Continue to JWT cookie fallback
  }

  // 2. Fallback: Decode Express JWT token from cookies
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value ?? cookieStore.get("auth_token")?.value;

    if (!token) return null;

    const payload = decodeJwtPayload(token);
    if (!payload) return null;

    const exp = typeof payload.exp === "number" ? payload.exp : undefined;
    if (exp && exp * 1000 < Date.now()) {
      return null;
    }

    const nestedUser = (payload.user as Record<string, unknown> | undefined) ?? {};
    const id = String(payload.id ?? payload._id ?? payload.sub ?? nestedUser.id ?? "");
    if (!id) return null;

    const rawRole = String(payload.role ?? nestedUser.role ?? "MEMBER");
    const role = normalizeUserRole(rawRole);
    const rawStatus = String(payload.status ?? nestedUser.status ?? "ACTIVE").toUpperCase();

    const user = {
      id,
      name: String(payload.name ?? payload.fullName ?? nestedUser.name ?? "Sister Member"),
      fullName: String(payload.fullName ?? payload.name ?? nestedUser.fullName ?? "Sister Member"),
      email: String(payload.email ?? nestedUser.email ?? ""),
      role,
      status: rawStatus,
      image: (payload.image ?? payload.profilePicture ?? nestedUser.image ?? null) as string | null,
      profilePicture: (payload.profilePicture ?? payload.image ?? nestedUser.profilePicture ?? null) as
        | string
        | null,
    } as unknown as AuthUser;

    return {
      user,
      session: {
        id: `jwt_${id}`,
        userId: id,
        token,
        expiresAt: exp ? new Date(exp * 1000) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    } as unknown as AuthSession;
  } catch {
    return null;
  }
}

/**
 * Get the current user on the server.
 * Returns null if not authenticated.
 */
export async function getServerUser(): Promise<AuthUser | null> {
  const session = await getServerSession();
  return session?.user ?? null;
}

/**
 * Require an authenticated session on the server.
 * Enforces account status checks and redirects to /login if unauthorized.
 */
export async function requireServerSession(callbackUrl?: string): Promise<AuthSession> {
  const session = await getServerSession();

  if (!session?.user) {
    const redirectUrl = callbackUrl
      ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
      : "/login";
    redirect(redirectUrl);
  }

  // Suspended or deactivated accounts cannot access protected areas
  if (session.user.status === "SUSPENDED" || session.user.status === "DEACTIVATED") {
    redirect(`/login?error=account_${session.user.status.toLowerCase()}`);
  }

  return session;
}

/**
 * Require specific user role(s).
 * Redirects to /login if unauthenticated, or to appropriate dashboard if insufficient permissions.
 */
export async function requireRole(allowedRoles: UserRole[], callbackUrl?: string): Promise<AuthSession> {
  const session = await requireServerSession(callbackUrl);

  if (!allowedRoles.includes(session.user.role)) {
    // If an authenticated member tries to access admin, redirect to member dashboard
    if (session.user.role === "MEMBER") {
      redirect("/member");
    }
    // Otherwise redirect to root
    redirect("/");
  }

  return session;
}

/**
 * Require admin privileges (any admin/moderation staff role).
 */
export async function requireAdmin(callbackUrl?: string): Promise<AuthSession> {
  return requireRole(ADMIN_ROLES, callbackUrl);
}

/**
 * Check if the current user has a specific role.
 */
export async function hasRole(role: UserRole): Promise<boolean> {
  const user = await getServerUser();
  return user?.role === role;
}

/**
 * Check if the current user has any of the specified roles.
 */
export async function hasAnyRole(roles: UserRole[]): Promise<boolean> {
  const user = await getServerUser();
  if (!user) return false;
  return roles.includes(user.role);
}

/**
 * Check if the current user is an admin (any admin role).
 */
export async function isAdmin(): Promise<boolean> {
  return hasAnyRole(ADMIN_ROLES);
}

/**
 * Check if the current user is a member.
 */
export async function isMember(): Promise<boolean> {
  const user = await getServerUser();
  return user?.role === "MEMBER";
}