import type { UserRole } from "@/types/auth";

export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  MODERATOR: "MODERATOR",
  FINANCE_ADMIN: "FINANCE_ADMIN",
  CONTENT_MANAGER: "CONTENT_MANAGER",
  SUPPORT_AGENT: "SUPPORT_AGENT",
  MEMBER: "MEMBER",
} as const satisfies Record<UserRole, UserRole>;

// Roles that can access the admin dashboard
export const ADMIN_ROLES: UserRole[] = [
  ROLES.SUPER_ADMIN,
  ROLES.ADMIN,
  ROLES.MODERATOR,
  ROLES.FINANCE_ADMIN,
  ROLES.CONTENT_MANAGER,
  ROLES.SUPPORT_AGENT,
];

// Role hierarchy — higher index = more permissions
export const ROLE_HIERARCHY: UserRole[] = [
  ROLES.MEMBER,
  ROLES.SUPPORT_AGENT,
  ROLES.CONTENT_MANAGER,
  ROLES.FINANCE_ADMIN,
  ROLES.MODERATOR,
  ROLES.ADMIN,
  ROLES.SUPER_ADMIN,
];

export function normalizeRole(role?: string | null): string {
  if (!role) return "";
  return role.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
}

const ADMIN_NORMALIZED_SET = new Set([
  "superadmin",
  "admin",
  "moderator",
  "financeadmin",
  "contentmanager",
  "supportagent",
]);

export function getRoleLevel(role: UserRole | string): number {
  const norm = normalizeRole(role);
  const index = ROLE_HIERARCHY.findIndex((r) => normalizeRole(r) === norm);
  return index === -1 ? 0 : index;
}

export function isAdminRole(role: UserRole | string | null | undefined): boolean {
  if (!role) return false;
  return ADMIN_NORMALIZED_SET.has(normalizeRole(role));
}
