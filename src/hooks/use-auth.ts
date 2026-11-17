"use client";

import { useSession } from "@/lib/auth/auth-client";
import type { AuthUser, UserRole } from "@/types/auth";

export interface UseAuthReturn {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isMember: boolean;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
}

export function useAuth(): UseAuthReturn {
  const { data: session, isPending: isLoading } = useSession();

  const user = session?.user as AuthUser | null | undefined;

  const hasRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  const adminRoles: UserRole[] = [
    "SUPER_ADMIN", "ADMIN", "MODERATOR",
    "FINANCE_ADMIN", "CONTENT_MANAGER", "SUPPORT_AGENT",
  ];

  return {
    user: user ?? null,
    isLoading,
    isAuthenticated: Boolean(user),
    isAdmin: hasAnyRole(adminRoles),
    isMember: hasRole("MEMBER"),
    hasRole,
    hasAnyRole,
  };
}
