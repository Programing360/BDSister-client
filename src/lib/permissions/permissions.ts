import type { UserRole } from "@/types/auth";

// Permission action types
export type PermissionAction =
  | "read"
  | "create"
  | "update"
  | "delete"
  | "manage";

// Resource types
export type PermissionResource =
  | "members"
  | "profiles"
  | "businesses"
  | "products"
  | "orders"
  | "payments"
  | "community"
  | "events"
  | "learning"
  | "resources"
  | "jobs"
  | "analytics"
  | "roles"
  | "settings"
  | "notifications";

export type Permission = `${PermissionResource}:${PermissionAction}`;

// Role-based permission map
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  SUPER_ADMIN: [
    "members:manage", "profiles:manage", "businesses:manage",
    "products:manage", "orders:manage", "payments:manage",
    "community:manage", "events:manage", "learning:manage",
    "resources:manage", "jobs:manage", "analytics:read",
    "roles:manage", "settings:manage", "notifications:manage",
  ],
  ADMIN: [
    "members:manage", "profiles:manage", "businesses:manage",
    "products:manage", "orders:manage", "payments:manage",
    "community:manage", "events:manage", "learning:manage",
    "resources:manage", "jobs:manage", "analytics:read",
    "settings:read", "notifications:manage",
  ],
  MODERATOR: [
    "members:read", "members:update", "profiles:read", "profiles:update",
    "community:manage", "businesses:read", "products:read",
    "notifications:read",
  ],
  FINANCE_ADMIN: [
    "orders:manage", "payments:manage", "members:read",
    "analytics:read", "notifications:read",
  ],
  CONTENT_MANAGER: [
    "businesses:manage", "products:manage", "events:manage",
    "learning:manage", "resources:manage", "jobs:manage",
    "community:read", "notifications:read",
  ],
  SUPPORT_AGENT: [
    "members:read", "orders:read", "notifications:read",
    "community:read",
  ],
  MEMBER: [],
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[role] ?? [];
  // Check exact permission or wildcard manage
  const [resource] = permission.split(":") as [PermissionResource, PermissionAction];
  return (
    permissions.includes(permission) ||
    permissions.includes(`${resource}:manage` as Permission)
  );
}

export function getRolePermissions(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}
