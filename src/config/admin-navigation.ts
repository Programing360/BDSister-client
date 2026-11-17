/**
 * BDSisters.org - Centralized Admin Dashboard Navigation Configuration
 * Step 1: Admin Dashboard Foundation, Layout & Navigation
 */

import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  KeyRound,
  UserCheck,
  Building2,
  Store,
  Package,
  ShoppingBag,
  CreditCard,
  Boxes,
  RotateCcw,
  MessageSquare,
  Flag,
  Calendar,
  BookOpen,
  GraduationCap,
  FileText,
  Menu as MenuIcon,
  Sparkles,
  LifeBuoy,
  Inbox,
  Bell,
  Layers,
  Activity,
  Lock,
  Settings,
} from "lucide-react";

export interface AdminNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
  badgeVariant?: "primary" | "warning" | "success" | "neutral";
  isPlanned?: boolean;
  children?: {
    label: string;
    href: string;
    badge?: string | number;
  }[];
}

export interface AdminNavGroup {
  id: string;
  label: string;
  items: AdminNavItem[];
}

export const adminNavGroups: AdminNavGroup[] = [
  // 1. OVERVIEW
  {
    id: "overview",
    label: "Overview",
    items: [
      {
        label: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
      },
    ],
  },

  // 2. PLATFORM MANAGEMENT
  {
    id: "platform-management",
    label: "Platform Management",
    items: [
      {
        label: "Members",
        href: "/admin/members",
        icon: Users,
        children: [
          { label: "All Members", href: "/admin/members" },
          { label: "Add New Member", href: "/admin/members/create" },
        ],
      },
      {
        label: "Verifications",
        href: "/admin/verifications",
        icon: ShieldCheck,
        badge: "48",
        badgeVariant: "warning",
      },
      {
        label: "Roles & Permissions",
        href: "/admin/roles",
        icon: KeyRound,
        children: [
          { label: "Roles Management", href: "/admin/roles" },
          { label: "Create Role", href: "/admin/roles/create" },
          { label: "Permissions Matrix", href: "/admin/permissions" },
          { label: "Permission Groups", href: "/admin/permissions/groups" },
        ],
      },
      {
        label: "Profiles",
        href: "/admin/profiles",
        icon: UserCheck,
        children: [
          { label: "All Profiles", href: "/admin/profiles" },
          { label: "Pending Approval", href: "/admin/profiles/pending", badge: "142" },
          { label: "Published", href: "/admin/profiles/published" },
          { label: "Categories", href: "/admin/profiles/categories" },
          { label: "Reports & Moderation", href: "/admin/profiles/reports", badge: "18" },
          { label: "Featured Profiles", href: "/admin/profiles/featured" },
        ],
      },
    ],
  },

  // 3. BUSINESS & COMMERCE
  {
    id: "business-commerce",
    label: "Business & Commerce",
    items: [
      {
        label: "Businesses",
        href: "/admin/businesses",
        icon: Building2,
        children: [
          { label: "All Businesses", href: "/admin/businesses" },
          { label: "Pending Approvals", href: "/admin/businesses/pending", badge: "14" },
          { label: "Categories", href: "/admin/businesses/categories" },
        ],
      },
      {
        label: "Sellers & Artisans",
        href: "/admin/ecommerce/sellers",
        icon: Store,
      },
      {
        label: "Products & Services",
        href: "/admin/products",
        icon: Package,
      },
      {
        label: "Customer Orders",
        href: "/admin/orders",
        icon: ShoppingBag,
      },
      {
        label: "Payments & Invoices",
        href: "/admin/payments",
        icon: CreditCard,
        badge: "ZiniPay",
        badgeVariant: "primary",
      },
      {
        label: "Inventory Hub",
        href: "/admin/ecommerce/inventory",
        icon: Boxes,
      },
      {
        label: "Refunds & Disputes",
        href: "/admin/ecommerce/refunds",
        icon: RotateCcw,
      },
    ],
  },

  // 4. COMMUNITY
  {
    id: "community",
    label: "Community",
    items: [
      {
        label: "Forum & Discussions",
        href: "/admin/community",
        icon: MessageSquare,
        children: [
          { label: "All Discussions", href: "/admin/community/discussions" },
          { label: "Categories", href: "/admin/community/categories" },
        ],
      },
      {
        label: "Content Reports",
        href: "/admin/community/reports",
        icon: Flag,
        badge: "4",
        badgeVariant: "warning",
      },
    ],
  },

  // 5. EVENTS & LEARNING
  {
    id: "events-learning",
    label: "Events & Learning",
    items: [
      {
        label: "Events & Workshops",
        href: "/admin/events",
        icon: Calendar,
        children: [
          { label: "All Events", href: "/admin/events" },
          { label: "Create Event", href: "/admin/events/create" },
        ],
      },
      {
        label: "Resource Library",
        href: "/admin/resources",
        icon: BookOpen,
        children: [
          { label: "All Resources", href: "/admin/resources" },
          { label: "Articles", href: "/admin/resources/articles" },
          { label: "Video Masterclasses", href: "/admin/resources/videos" },
        ],
      },
      {
        label: "Courses & Training",
        href: "/admin/resources/courses",
        icon: GraduationCap,
      },
    ],
  },

  // 6. WEBSITE MANAGEMENT
  {
    id: "website-management",
    label: "Website Management",
    items: [
      {
        label: "CMS & Pages",
        href: "/admin/cms/pages",
        icon: FileText,
        children: [
          { label: "Static Pages", href: "/admin/cms/pages" },
          { label: "Homepage Editor", href: "/admin/cms/homepage" },
        ],
      },
      {
        label: "Navigation & Menus",
        href: "/admin/cms/menus",
        icon: MenuIcon,
      },
      {
        label: "SEO & Banners",
        href: "/admin/cms/banners",
        icon: Sparkles,
        children: [
          { label: "Hero & Promotional Banners", href: "/admin/cms/banners" },
          { label: "SEO Meta Configuration", href: "/admin/cms/seo" },
        ],
      },
    ],
  },

  // 7. COMMUNICATION
  {
    id: "communication",
    label: "Communication",
    items: [
      {
        label: "Support Tickets",
        href: "/admin/support",
        icon: LifeBuoy,
      },
      {
        label: "Contact Submissions",
        href: "/admin/communications/contact-submissions",
        icon: Inbox,
      },
      {
        label: "Notifications & Newsletter",
        href: "/admin/notifications",
        icon: Bell,
        children: [
          { label: "System Notifications", href: "/admin/notifications" },
          { label: "Newsletter Campaigns", href: "/admin/communications/newsletters" },
        ],
      },
    ],
  },

  // 8. INTEGRATIONS
  {
    id: "integrations",
    label: "Integrations",
    items: [
      {
        label: "Muhsina Organization",
        href: "/admin/integrations/muhsina",
        icon: Layers,
        badge: "Official",
        badgeVariant: "success",
      },
    ],
  },

  // 9. SYSTEM
  {
    id: "system",
    label: "System",
    items: [
      {
        label: "Activity Logs",
        href: "/admin/activity-logs",
        icon: Activity,
      },
      {
        label: "Security & Access",
        href: "/admin/system/security",
        icon: Lock,
      },
      {
        label: "System Settings",
        href: "/admin/settings",
        icon: Settings,
      },
    ],
  },
];
