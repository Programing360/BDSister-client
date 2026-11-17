/**
 * BDSisters.org - Admin Roles Demonstration Registry
 * Step 4: Role, Permission & Access Management System (Frontend Only)
 *
 * NOTE: STRICT FRONTEND DEMO DATASET
 * Role definitions and member assignments here are isolated simulation models
 * for administrative UI testing. Zero changes are made to Better Auth backend or database.
 */

import type {
  AdminRoleDetail,
  RoleKpiData,
  RoleChangeAuditLogItem,
  MemberRoleAssignmentItem,
} from "../types/admin-role.ts";
import { getAllPermissionKeys } from "./admin-permissions-data.ts";

export const DEMO_ROLE_DISCLAIMER =
  "SIMULATED ROLE REPOSITORY: Administrative role profiles, custom permission bundles, and member assignments displayed here are simulated frontend records. Actual authentication enforcement operates under Better Auth backend rules.";

const ALL_KEYS = getAllPermissionKeys();

export const DEMO_ADMIN_ROLES: AdminRoleDetail[] = [
  // 1. Super Admin (Built-in)
  {
    id: "role_super_admin",
    name: "Super Administrator",
    slug: "super-admin",
    description: "Unrestricted platform-wide governance. Full access across all 15 operational, commerce, and security systems.",
    type: "BUILT_IN",
    isProtected: true,
    status: "ACTIVE",
    category: "SYSTEM",
    assignedMembersCount: 2,
    permissionsCount: ALL_KEYS.length,
    permissionKeys: [...ALL_KEYS],
    createdAt: "2026-01-01",
    updatedAt: "2026-11-10",
    notes: "Core root authority. Protected system role. Deletion or permission redaction is permanently disabled.",
    systemScopeNote: "Full Root Authority",
  },

  // 2. Administrator (Built-in)
  {
    id: "role_admin",
    name: "Platform Administrator",
    slug: "admin",
    description: "Broad operational management including member accounts, verification compliance, and business approvals.",
    type: "BUILT_IN",
    isProtected: true,
    status: "ACTIVE",
    category: "PLATFORM",
    assignedMembersCount: 6,
    permissionsCount: 48,
    permissionKeys: [
      "dashboard.overview.view", "dashboard.analytics.deep_dive", "dashboard.reports.export",
      "members.view", "members.create", "members.edit", "members.suspend", "members.export",
      "verifications.view", "verifications.inspect_documents", "verifications.approve", "verifications.reject", "verifications.request_info",
      "profiles.view_all", "profiles.moderate_content", "profiles.feature_member", "profiles.badges.award",
      "roles.view",
      "businesses.view", "businesses.approve", "businesses.reject", "businesses.edit", "businesses.feature",
      "products.view", "products.approve", "products.reject", "products.categories.manage", "products.featured.set",
      "orders.view_all", "orders.status.update", "orders.export",
      "payments.transactions.view", "payments.subscriptions.manage",
      "community.posts.view", "community.posts.moderate", "community.reports.resolve", "community.pin_announcements",
      "events.view", "events.create", "events.registrations.manage",
      "resources.view", "resources.create", "resources.courses.manage",
      "cms.pages.edit", "cms.banners.manage", "cms.seo.manage",
      "communications.tickets.view", "communications.tickets.reply", "communications.notifications.send",
      "security.audit_logs.view"
    ],
    createdAt: "2026-01-01",
    updatedAt: "2026-11-05",
    notes: "High-level day-to-day operations lead. Excludes critical infrastructure and direct financial disbursement authorization.",
  },

  // 3. Moderator (Built-in)
  {
    id: "role_moderator",
    name: "Community Moderator",
    slug: "moderator",
    description: "Oversees community forums, reviews flagged discussions, moderates sister networking spaces, and resolves reports.",
    type: "BUILT_IN",
    isProtected: true,
    status: "ACTIVE",
    category: "COMMUNITY",
    assignedMembersCount: 12,
    permissionsCount: 14,
    permissionKeys: [
      "dashboard.overview.view",
      "members.view",
      "profiles.view_all", "profiles.moderate_content",
      "community.posts.view", "community.posts.moderate", "community.reports.resolve", "community.pin_announcements", "community.mute_member",
      "communications.tickets.view", "communications.tickets.reply",
      "events.view",
      "resources.view"
    ],
    createdAt: "2026-01-01",
    updatedAt: "2026-10-20",
    notes: "Focused entirely on community safety, discourse moderation, and sister-to-sister conflict resolution.",
  },

  // 4. Finance Admin (Built-in)
  {
    id: "role_finance_admin",
    name: "Finance Administrator",
    slug: "finance-admin",
    description: "Manages ZiniPay payment transactions, audits subscriptions, authorizes seller payouts, and issues refunds.",
    type: "BUILT_IN",
    isProtected: true,
    status: "ACTIVE",
    category: "FINANCE",
    assignedMembersCount: 3,
    permissionsCount: 16,
    permissionKeys: [
      "dashboard.overview.view", "dashboard.financial_analytics.view", "dashboard.reports.export",
      "orders.view_all", "orders.export",
      "payments.transactions.view", "payments.refunds.process", "payments.subscriptions.manage", "payments.seller_payouts.authorize", "payments.financial_reports.export",
      "businesses.view",
      "security.audit_logs.view"
    ],
    createdAt: "2026-01-01",
    updatedAt: "2026-11-12",
    notes: "Financial compliance and payment reconciliation officer. Direct access to payout workflows.",
  },

  // 5. Content Manager (Built-in)
  {
    id: "role_content_manager",
    name: "Content & Editorial Manager",
    slug: "content-manager",
    description: "Authors resource guides, manages marketing landing page banners, oversees workshop curriculums and SEO.",
    type: "BUILT_IN",
    isProtected: true,
    status: "ACTIVE",
    category: "COMMUNITY",
    assignedMembersCount: 4,
    permissionsCount: 18,
    permissionKeys: [
      "dashboard.overview.view",
      "events.view", "events.create", "events.registrations.manage", "events.cancel",
      "resources.view", "resources.create", "resources.courses.manage", "resources.delete",
      "cms.pages.edit", "cms.banners.manage", "cms.menus.configure", "cms.seo.manage",
      "communications.newsletters.broadcast", "communications.notifications.send",
      "profiles.feature_member", "businesses.feature", "products.featured.set"
    ],
    createdAt: "2026-01-01",
    updatedAt: "2026-09-18",
    notes: "Editorial, content publishing, and promotional campaign governance.",
  },

  // 6. Support Agent (Built-in)
  {
    id: "role_support_agent",
    name: "Member Support Specialist",
    slug: "support-agent",
    description: "First-line assistance for member inquiries, basic profile troubleshooting, and order delivery status lookups.",
    type: "BUILT_IN",
    isProtected: true,
    status: "ACTIVE",
    category: "COMMUNITY",
    assignedMembersCount: 8,
    permissionsCount: 11,
    permissionKeys: [
      "dashboard.overview.view",
      "members.view",
      "profiles.view_all",
      "orders.view_all",
      "businesses.view",
      "products.view",
      "communications.tickets.view", "communications.tickets.reply", "communications.notifications.send",
      "community.posts.view"
    ],
    createdAt: "2026-01-01",
    updatedAt: "2026-10-02",
    notes: "Member success and support desk representative. Read-only on financial records.",
  },

  // 7. Member (Built-in)
  {
    id: "role_member",
    name: "Platform Member",
    slug: "member",
    description: "Standard self-service community member role. Owns individual profile, personal orders, and permitted shops.",
    type: "BUILT_IN",
    isProtected: true,
    status: "ACTIVE",
    category: "PLATFORM",
    assignedMembersCount: 14892,
    permissionsCount: 6,
    permissionKeys: [
      "members.view",
      "products.view",
      "community.posts.view",
      "events.view",
      "resources.view"
    ],
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01",
    notes: "Default account access role for all registered women members. Elevated permissions require explicit staff assignment.",
  },

  // 8. Guest / Public Access (Built-in Context Profile)
  {
    id: "role_guest",
    name: "Guest / Public Context",
    slug: "guest",
    description: "Unauthenticated visitor context profile. Represents public browsing boundaries. Not a database user account.",
    type: "BUILT_IN",
    isProtected: true,
    status: "ACTIVE",
    category: "PLATFORM",
    assignedMembersCount: 0,
    permissionsCount: 3,
    permissionKeys: [
      "products.view",
      "events.view",
      "resources.view"
    ],
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01",
    notes: "Conceptual access boundary for unauthenticated guests. Never assigned to user accounts in database.",
    systemScopeNote: "Public Context Profile (Unauthenticated)",
  },

  // 9. Custom Role: Regional Coordinator
  {
    id: "role_regional_coordinator",
    name: "Regional Divisional Coordinator",
    slug: "regional-coordinator",
    description: "Tailored divisional role for Dhaka, Sylhet, and Chattogram community leads to inspect regional members and local events.",
    type: "CUSTOM",
    isProtected: false,
    status: "ACTIVE",
    category: "CUSTOM",
    assignedMembersCount: 7,
    permissionsCount: 12,
    permissionKeys: [
      "dashboard.overview.view",
      "members.view", "members.export",
      "verifications.view",
      "businesses.view", "businesses.feature",
      "events.view", "events.create", "events.registrations.manage",
      "community.posts.view", "community.pin_announcements",
      "communications.notifications.send"
    ],
    createdAt: "2026-04-12",
    updatedAt: "2026-10-15",
    notes: "Custom role created for regional women entrepreneur association leaders across Bangladesh divisions.",
    createdBy: "Super Administrator (Admin Salma)",
  },

  // 10. Custom Role: Marketplace Quality Curator
  {
    id: "role_marketplace_curator",
    name: "Marketplace Quality Curator",
    slug: "marketplace-curator",
    description: "Craft quality inspection specialist authorized to approve artisan textiles, ceramics, and gourmet food products.",
    type: "CUSTOM",
    isProtected: false,
    status: "ACTIVE",
    category: "COMMERCE",
    assignedMembersCount: 5,
    permissionsCount: 10,
    permissionKeys: [
      "dashboard.overview.view",
      "businesses.view", "businesses.feature",
      "products.view", "products.approve", "products.reject", "products.featured.set",
      "orders.view_all",
      "profiles.view_all", "profiles.badges.award"
    ],
    createdAt: "2026-06-20",
    updatedAt: "2026-11-01",
    notes: "Custom craft certification specialist role ensuring authenticity of Bangladeshi heritage products.",
    createdBy: "Platform Administrator (Admin Nusrat)",
  },

  // 11. Custom Role: Artisan Onboarding Specialist
  {
    id: "role_artisan_mentor",
    name: "Artisan Onboarding Specialist",
    slug: "artisan-mentor",
    description: "Mentor role assisting village weavers and new entrepreneurs with shop setup and verification paperwork.",
    type: "CUSTOM",
    isProtected: false,
    status: "ACTIVE",
    category: "COMMERCE",
    assignedMembersCount: 9,
    permissionsCount: 9,
    permissionKeys: [
      "dashboard.overview.view",
      "members.view", "members.create",
      "verifications.view", "verifications.request_info",
      "businesses.view", "businesses.edit",
      "products.view",
      "resources.view"
    ],
    createdAt: "2026-08-14",
    updatedAt: "2026-10-28",
    notes: "Custom enablement specialist role bridging technical gaps for grassroots craftswomen.",
    createdBy: "Super Administrator (Admin Salma)",
  },
];

export const DEMO_ROLE_KPIS: RoleKpiData = {
  totalRoles: 11,
  builtInRoles: 8,
  customRoles: 3,
  availablePermissionGroups: 15,
  totalPermissions: 72,
  activeRoleAssignments: 56, // Total staff members with elevated roles
};

export const DEMO_ROLE_CHANGE_LOGS: RoleChangeAuditLogItem[] = [
  {
    id: "log_rc_1",
    timestamp: "2026-11-16 14:32",
    adminName: "Admin Salma",
    adminRole: "Super Administrator",
    affectedMemberId: "mem_102",
    affectedMemberNumber: "BDS-MEM-10491",
    affectedMemberName: "Farzana Yasmin",
    previousRole: "Member",
    newRole: "Marketplace Quality Curator",
    actionType: "ROLE_ASSIGNED",
    status: "SUCCESS",
    reason: "Assigned craft curation privileges following completion of artisan heritage evaluation training.",
  },
  {
    id: "log_rc_2",
    timestamp: "2026-11-12 11:15",
    adminName: "Admin Salma",
    adminRole: "Super Administrator",
    affectedMemberId: "mem_104",
    affectedMemberNumber: "BDS-MEM-10489",
    affectedMemberName: "Dr. Mahmuda Khanam",
    previousRole: "Member",
    newRole: "Regional Divisional Coordinator",
    actionType: "ROLE_ASSIGNED",
    status: "SUCCESS",
    reason: "Elected as Sylhet Division Women Entrepreneur Lead for Q4 2026 platform initiatives.",
  },
  {
    id: "log_rc_3",
    timestamp: "2026-11-08 09:40",
    adminName: "Moderator Tasnim",
    adminRole: "Community Moderator",
    affectedMemberId: "mem_108",
    affectedMemberNumber: "BDS-MEM-10485",
    affectedMemberName: "Naila Kabeer",
    previousRole: "Support Agent",
    newRole: "Member",
    actionType: "ROLE_REVOKED",
    status: "SUCCESS",
    reason: "Routine access rotation following completion of temporary autumn volunteer support rotation.",
  },
  {
    id: "log_rc_4",
    timestamp: "2026-11-01 16:20",
    adminName: "Admin Salma",
    adminRole: "Super Administrator",
    affectedMemberId: "system",
    affectedMemberNumber: "SYS-ROLE-MOD",
    affectedMemberName: "Role: Artisan Onboarding Specialist",
    previousRole: "8 Permissions",
    newRole: "9 Permissions (Added verifications.request_info)",
    actionType: "ROLE_MODIFIED",
    status: "SUCCESS",
    reason: "Granted capability to guide applicants directly on missing document criteria.",
  },
  {
    id: "log_rc_5",
    timestamp: "2026-10-25 10:05",
    adminName: "Admin Salma",
    adminRole: "Super Administrator",
    affectedMemberId: "mem_103",
    affectedMemberNumber: "BDS-MEM-10490",
    affectedMemberName: "Sabrina Akter",
    previousRole: "Member",
    newRole: "Community Moderator",
    actionType: "ROLE_ASSIGNED",
    status: "SUCCESS",
    reason: "Onboarded as Bogura & Rajshahi regional community forum moderator.",
  },
];

export const DEMO_ROLE_ASSIGNMENT_MEMBERS: MemberRoleAssignmentItem[] = [
  {
    id: "mem_101",
    memberId: "BDS-MEM-10492",
    name: "Nusrat Jahan Chowdhury",
    email: "nusrat.jahan@nilambari.bd",
    avatar: null,
    location: "Dhaka",
    currentRole: "admin",
    currentRoleName: "Platform Administrator",
    membershipType: "PAID",
    accountStatus: "ACTIVE",
    lastActive: "10 mins ago",
  },
  {
    id: "mem_102",
    memberId: "BDS-MEM-10491",
    name: "Farzana Yasmin",
    email: "farzana.honey@sundarbans.org",
    avatar: null,
    location: "Khulna",
    currentRole: "marketplace-curator",
    currentRoleName: "Marketplace Quality Curator",
    membershipType: "PAID",
    accountStatus: "ACTIVE",
    lastActive: "1 hour ago",
  },
  {
    id: "mem_103",
    memberId: "BDS-MEM-10490",
    name: "Sabrina Akter",
    email: "sabrina.akter@clayart.com",
    avatar: null,
    location: "Bogura",
    currentRole: "moderator",
    currentRoleName: "Community Moderator",
    membershipType: "FREE",
    accountStatus: "ACTIVE",
    lastActive: "25 mins ago",
  },
  {
    id: "mem_104",
    memberId: "BDS-MEM-10489",
    name: "Dr. Mahmuda Khanam",
    email: "dr.mahmuda@sylhetherbs.com",
    avatar: null,
    location: "Sylhet",
    currentRole: "regional-coordinator",
    currentRoleName: "Regional Divisional Coordinator",
    membershipType: "PAID",
    accountStatus: "ACTIVE",
    lastActive: "3 hours ago",
  },
  {
    id: "mem_105",
    memberId: "BDS-MEM-10488",
    name: "Sadia Rahman",
    email: "sadia.rahman@botanicals.bd",
    avatar: null,
    location: "Dhaka",
    currentRole: "member",
    currentRoleName: "Platform Member",
    membershipType: "FREE",
    accountStatus: "ACTIVE",
    lastActive: "Yesterday",
  },
  {
    id: "mem_106",
    memberId: "BDS-MEM-10487",
    name: "Roksana Begum",
    email: "roksana.nakshi@crafts.bd",
    avatar: null,
    location: "Mymensingh",
    currentRole: "artisan-mentor",
    currentRoleName: "Artisan Onboarding Specialist",
    membershipType: "PAID",
    accountStatus: "ACTIVE",
    lastActive: "4 hours ago",
  },
  {
    id: "mem_107",
    memberId: "BDS-MEM-10486",
    name: "Tahmina Anam",
    email: "tahmina.culinary@dhaka.com",
    avatar: null,
    location: "Dhaka",
    currentRole: "support-agent",
    currentRoleName: "Member Support Specialist",
    membershipType: "FREE",
    accountStatus: "ACTIVE",
    lastActive: "30 mins ago",
  },
  {
    id: "mem_108",
    memberId: "BDS-MEM-10485",
    name: "Naila Kabeer",
    email: "naila.kabeer@designstudio.bd",
    avatar: null,
    location: "Dhaka",
    currentRole: "member",
    currentRoleName: "Platform Member",
    membershipType: "FREE",
    accountStatus: "SUSPENDED",
    lastActive: "5 days ago",
  },
];

// Lookup Helpers
export function getAdminRoleByIdOrSlug(idOrSlug: string): AdminRoleDetail | undefined {
  if (!idOrSlug) return undefined;
  const normalized = idOrSlug.toLowerCase();
  return DEMO_ADMIN_ROLES.find(
    (r) => r.id.toLowerCase() === normalized || r.slug.toLowerCase() === normalized
  );
}

export function getRoleKpis(): RoleKpiData {
  return DEMO_ROLE_KPIS;
}
