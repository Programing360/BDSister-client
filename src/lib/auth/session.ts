import { headers } from "next/headers";
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

/**
 * Get the current session on the server.
 * Returns null if no active session exists or token is invalid.
 */
export async function getServerSession(): Promise<AuthSession | null> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || !session.session) {
      return null;
    }

    return session as unknown as AuthSession;
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
