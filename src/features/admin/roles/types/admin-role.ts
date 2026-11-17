/**
 * BDSisters.org - Role & Permission Management TypeScript Definitions
 * Step 4: Role, Permission & Access Management System (Frontend Only)
 */

export type RoleType = "BUILT_IN" | "CUSTOM";

export type RoleStatus = "ACTIVE" | "INACTIVE";

export type RoleCategory =
  | "PLATFORM"
  | "COMMUNITY"
  | "COMMERCE"
  | "FINANCE"
  | "SYSTEM"
  | "CUSTOM";

export type PermissionRiskLevel = "STANDARD" | "SENSITIVE" | "CRITICAL";

export interface PermissionGroup {
  id: string; // e.g. "members"
  name: string; // e.g. "Member Management"
  description: string;
  iconName: string;
  category: RoleCategory;
  permissionsCount: number;
}

export interface PermissionItem {
  id: string; // e.g. "perm_101"
  key: string; // e.g. "members.view"
  name: string; // e.g. "View Members Directory"
  description: string;
  groupId: string; // e.g. "members"
  groupName: string; // e.g. "Member Management"
  riskLevel: PermissionRiskLevel;
  isDefault: boolean; // default enabled for standard administrative roles
  assignedRolesCount?: number;
}

export interface AdminRoleItem {
  id: string; // e.g. "role_super_admin"
  name: string; // e.g. "Super Administrator"
  slug: string; // e.g. "super-admin"
  description: string;
  type: RoleType;
  isProtected: boolean; // Built-in roles cannot be edited or deleted
  status: RoleStatus;
  category: RoleCategory;
  assignedMembersCount: number; // Demo count
  permissionsCount: number;
  permissionKeys: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminRoleDetail extends AdminRoleItem {
  notes?: string;
  createdBy?: string;
  lastUpdatedBy?: string;
  systemScopeNote?: string;
}

export interface RoleKpiData {
  totalRoles: number;
  builtInRoles: number;
  customRoles: number;
  availablePermissionGroups: number;
  totalPermissions: number;
  activeRoleAssignments: number;
}

export interface RoleFilterState {
  query: string;
  typeFilter: "ALL" | RoleType;
  statusFilter: "ALL" | RoleStatus;
  categoryFilter: "ALL" | RoleCategory;
  sortBy: "name" | "assignedMembersCount" | "permissionsCount" | "updatedAt";
  sortOrder: "asc" | "desc";
  page: number;
  pageSize: number;
}

export interface PermissionFilterState {
  query: string;
  groupId: "ALL" | string;
  riskLevel: "ALL" | PermissionRiskLevel;
  assignedFilter: "ALL" | "ASSIGNED" | "UNASSIGNED";
  sortBy: "key" | "name" | "groupName" | "riskLevel";
  sortOrder: "asc" | "desc";
  page: number;
  pageSize: number;
}

export interface CreateRoleInput {
  name: string;
  slug: string;
  description: string;
  category: RoleCategory;
  status: RoleStatus;
  permissionKeys: string[];
}

export interface EditRoleInput {
  name: string;
  description: string;
  status: RoleStatus;
  category: RoleCategory;
  permissionKeys: string[];
}

export interface RoleChangeAuditLogItem {
  id: string;
  timestamp: string;
  adminName: string;
  adminRole: string;
  affectedMemberId: string;
  affectedMemberNumber: string; // e.g. BDS-MEM-10492
  affectedMemberName: string;
  previousRole: string;
  newRole: string;
  actionType: "ROLE_ASSIGNED" | "ROLE_REVOKED" | "ROLE_MODIFIED" | "ROLE_CREATED";
  status: "SUCCESS" | "FLAGGED";
  reason: string;
}

export interface MemberRoleAssignmentItem {
  id: string;
  memberId: string; // e.g. BDS-MEM-10492
  name: string;
  email: string;
  avatar: string | null;
  location: string;
  currentRole: string; // Access role slug
  currentRoleName: string;
  membershipType: "FREE" | "PAID"; // SEPARATE ENTITLEMENT
  accountStatus: "ACTIVE" | "SUSPENDED" | "BANNED" | "PENDING";
  lastActive: string;
}
