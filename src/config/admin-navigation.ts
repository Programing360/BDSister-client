import type { NavGroup } from "@/types/navigation";

export const adminNavGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/admin", requiredRoles: ["SUPER_ADMIN", "ADMIN", "MODERATOR", "FINANCE_ADMIN", "CONTENT_MANAGER", "SUPPORT_AGENT"] },
      { label: "Analytics", href: "/admin/analytics", requiredRoles: ["SUPER_ADMIN", "ADMIN"] },
      { label: "Activity Logs", href: "/admin/activity-logs", requiredRoles: ["SUPER_ADMIN", "ADMIN"] },
    ],
  },
  {
    label: "Members",
    items: [
      { label: "All Members", href: "/admin/members", requiredRoles: ["SUPER_ADMIN", "ADMIN", "MODERATOR"] },
      { label: "Verifications", href: "/admin/verifications", requiredRoles: ["SUPER_ADMIN", "ADMIN", "MODERATOR"] },
      { label: "Profiles", href: "/admin/profiles", requiredRoles: ["SUPER_ADMIN", "ADMIN"] },
    ],
  },
  {
    label: "Commerce",
    items: [
      { label: "Businesses", href: "/admin/businesses", requiredRoles: ["SUPER_ADMIN", "ADMIN", "CONTENT_MANAGER"] },
      { label: "Products", href: "/admin/products", requiredRoles: ["SUPER_ADMIN", "ADMIN", "CONTENT_MANAGER"] },
      { label: "Categories", href: "/admin/categories", requiredRoles: ["SUPER_ADMIN", "ADMIN", "CONTENT_MANAGER"] },
      { label: "Orders", href: "/admin/orders", requiredRoles: ["SUPER_ADMIN", "ADMIN", "FINANCE_ADMIN"] },
      { label: "Payments", href: "/admin/payments", requiredRoles: ["SUPER_ADMIN", "ADMIN", "FINANCE_ADMIN"] },
      { label: "Subscriptions", href: "/admin/subscriptions", requiredRoles: ["SUPER_ADMIN", "ADMIN", "FINANCE_ADMIN"] },
    ],
  },
  {
    label: "Content",
    items: [
      { label: "Community", href: "/admin/community", requiredRoles: ["SUPER_ADMIN", "ADMIN", "MODERATOR", "CONTENT_MANAGER"] },
      { label: "Events", href: "/admin/events", requiredRoles: ["SUPER_ADMIN", "ADMIN", "CONTENT_MANAGER"] },
      { label: "Learning", href: "/admin/learning", requiredRoles: ["SUPER_ADMIN", "ADMIN", "CONTENT_MANAGER"] },
      { label: "Resources", href: "/admin/resources", requiredRoles: ["SUPER_ADMIN", "ADMIN", "CONTENT_MANAGER"] },
      { label: "Jobs", href: "/admin/jobs", requiredRoles: ["SUPER_ADMIN", "ADMIN", "CONTENT_MANAGER"] },
    ],
  },
  {
    label: "Communication",
    items: [
      { label: "Messages", href: "/admin/messages", requiredRoles: ["SUPER_ADMIN", "ADMIN"] },
      { label: "Notifications", href: "/admin/notifications", requiredRoles: ["SUPER_ADMIN", "ADMIN"] },
      { label: "Support", href: "/admin/support", requiredRoles: ["SUPER_ADMIN", "ADMIN", "SUPPORT_AGENT"] },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Roles & Permissions", href: "/admin/roles", requiredRoles: ["SUPER_ADMIN"] },
      { label: "Settings", href: "/admin/settings", requiredRoles: ["SUPER_ADMIN", "ADMIN"] },
    ],
  },
];
