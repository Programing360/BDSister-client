import type { UserRole } from "@/types/auth";
import type { Permission } from "./permissions";
import { hasPermission } from "./permissions";
import { isAdminRole, ADMIN_ROLES } from "./roles";

export interface AccessControlOptions {
  requiredRoles?: UserRole[];
  requiredPermissions?: Permission[];
  requireAll?: boolean; // true = must have ALL, false = must have ANY
}

/**
 * Check if a user role satisfies the given access control options.
 * This is used server-side — NEVER trust client-side role claims alone.
 */
export function checkAccess(
  userRole: UserRole | null | undefined,
  options: AccessControlOptions,
): boolean {
  if (!userRole) return false;

  const { requiredRoles, requiredPermissions, requireAll = false } = options;

  // Role check
  if (requiredRoles && requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.includes(userRole);
    if (!hasRequiredRole) return false;
  }

  // Permission check
  if (requiredPermissions && requiredPermissions.length > 0) {
    if (requireAll) {
      return requiredPermissions.every((p) => hasPermission(userRole, p));
    } else {
      return requiredPermissions.some((p) => hasPermission(userRole, p));
    }
  }

  return true;
}

/**
 * Check if a role can access admin routes.
 */
export function canAccessAdmin(role: UserRole | null | undefined): boolean {
  if (!role) return false;
  return isAdminRole(role);
}

/**
 * Check if a role can access member routes.
 */
export function canAccessMember(role: UserRole | null | undefined): boolean {
  if (!role) return false;
  return role === "MEMBER" || ADMIN_ROLES.includes(role);
}
