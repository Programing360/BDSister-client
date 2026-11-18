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
  MessagesSquare,
  FolderTree,
  ShieldAlert,
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
  Image as ImageIcon,
  HelpCircle,
  History,
  Globe,
  Mail,
  Megaphone,
  Radio,
  Send,
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
        href: "/admin/businesses/verifications",
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
      {
        label: "Membership Plans",
        href: "/admin/membership-plans",
        icon: Sparkles,
        children: [
          { label: "All Plans", href: "/admin/membership-plans" },
          { label: "Create Plan", href: "/admin/membership-plans/create" },
        ],
      },
      {
        label: "Subscriptions",
        href: "/admin/subscriptions",
        icon: Users,
        children: [
          { label: "All Subscriptions", href: "/admin/subscriptions" },
          { label: "Renewal Queue", href: "/admin/subscriptions/renewals", badge: "114" },
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
        badge: "2",
        badgeVariant: "warning",
        children: [
          { label: "All Businesses", href: "/admin/businesses" },
          { label: "Pending Approvals", href: "/admin/businesses/pending", badge: "2" },
          { label: "Approved & Live", href: "/admin/businesses/approved" },
          { label: "Categories", href: "/admin/businesses/categories" },
          { label: "Trade Verifications", href: "/admin/businesses/verifications", badge: "2" },
          { label: "Reviews & Feedback", href: "/admin/businesses/reviews" },
          { label: "Reports & Grievances", href: "/admin/businesses/reports", badge: "1" },
          { label: "Featured Spotlights", href: "/admin/businesses/featured" },
        ],
      },
      {
        label: "Sellers & Artisans",
        href: "/admin/ecommerce/sellers",
        icon: Store,
        children: [
          { label: "All Sellers", href: "/admin/ecommerce/sellers" },
          { label: "Pending Onboarding", href: "/admin/ecommerce/sellers", badge: "2" },
        ],
      },
      {
        label: "Products & Services",
        href: "/admin/ecommerce/inventory",
        icon: Package,
      },
      {
        label: "Customer Orders",
        href: "/admin/orders",
        icon: ShoppingBag,
      },
      {
        label: "Payments & Billing",
        href: "/admin/payments",
        icon: CreditCard,
        badge: "ZiniPay",
        badgeVariant: "primary",
        children: [
          { label: "Payment Overview", href: "/admin/payments" },
          { label: "Transactions", href: "/admin/payments/transactions" },
          { label: "ZiniPay Gateway", href: "/admin/payments/gateway" },
          { label: "Refund Claims", href: "/admin/payments/refunds", badge: "3" },
          { label: "Invoices & Receipts", href: "/admin/payments/invoices" },
          { label: "Revenue Reports", href: "/admin/payments/reports" },
        ],
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
        label: "Community Overview",
        href: "/admin/community",
        icon: MessageSquare,
      },
      {
        label: "Discussion Categories",
        href: "/admin/community/categories",
        icon: FolderTree,
        children: [
          { label: "All Categories", href: "/admin/community/categories" },
          { label: "Create Category", href: "/admin/community/categories/create" },
        ],
      },
      {
        label: "Discussions",
        href: "/admin/community/discussions",
        icon: MessageSquare,
        children: [
          { label: "All Discussions", href: "/admin/community/discussions" },
          { label: "Create Discussion", href: "/admin/community/discussions/create" },
        ],
      },
      {
        label: "Posts",
        href: "/admin/community/posts",
        icon: FileText,
      },
      {
        label: "Comments",
        href: "/admin/community/comments",
        icon: MessagesSquare,
      },
      {
        label: "Moderation Queue",
        href: "/admin/community/moderation",
        icon: ShieldAlert,
        badge: "14",
        badgeVariant: "warning",
      },
      {
        label: "Content Reports",
        href: "/admin/community/reports",
        icon: Flag,
        badge: "9",
        badgeVariant: "warning",
      },
      {
        label: "Moderators",
        href: "/admin/community/moderators",
        icon: UserCheck,
      },
      {
        label: "Community Settings",
        href: "/admin/community/settings",
        icon: Settings,
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
          { label: "Overview", href: "/admin/events" },
          { label: "All Events", href: "/admin/events/all" },
          { label: "Create Event", href: "/admin/events/create" },
          { label: "Categories", href: "/admin/events/categories" },
          { label: "Workshops", href: "/admin/events/workshops" },
          { label: "Registrations", href: "/admin/events/registrations" },
          { label: "Gate Attendees", href: "/admin/events/attendees" },
          { label: "Tickets & Pricing", href: "/admin/events/tickets" },
          { label: "Payments (ZiniPay)", href: "/admin/events/payments" },
          { label: "Reviews & Feedback", href: "/admin/events/feedback" },
          { label: "Media & Archive", href: "/admin/events/archive" },
        ],
      },
      {
        label: "Resource Library",
        href: "/admin/resources",
        icon: BookOpen,
        badge: "3",
        badgeVariant: "warning",
        children: [
          { label: "Overview", href: "/admin/resources" },
          { label: "All Resources", href: "/admin/resources/all" },
          { label: "Create Resource", href: "/admin/resources/create" },
          { label: "Categories", href: "/admin/resources/categories" },
          { label: "Articles & Guides", href: "/admin/resources/articles" },
          { label: "Video Library", href: "/admin/resources/videos" },
          { label: "Featured Spotlights", href: "/admin/resources/featured" },
          { label: "Editorial Approvals", href: "/admin/resources/approvals", badge: "3" },
        ],
      },
      {
        label: "Courses & LMS",
        href: "/admin/resources/courses",
        icon: GraduationCap,
        children: [
          { label: "All Courses", href: "/admin/resources/courses" },
          { label: "Create Course", href: "/admin/resources/courses/create" },
          { label: "Student Enrollments", href: "/admin/resources/enrollments" },
          { label: "Learning Analytics", href: "/admin/resources/analytics" },
        ],
      },
    ],
  },

  // 6. WEBSITE MANAGEMENT
  {
    id: "website-management",
    label: "Website Management",
    items: [
      {
        label: "CMS Overview",
        href: "/admin/cms",
        icon: LayoutDashboard,
      },
      {
        label: "Website Pages",
        href: "/admin/cms/pages",
        icon: FileText,
        children: [
          { label: "All Pages", href: "/admin/cms/pages" },
          { label: "Create Page", href: "/admin/cms/pages/create" },
          { label: "Visual Page Builder", href: "/admin/cms/page-builder" },
        ],
      },
      {
        label: "Homepage Studio",
        href: "/admin/cms/homepage",
        icon: Globe,
      },
      {
        label: "Header & Footer",
        href: "/admin/cms/header",
        icon: MenuIcon,
        children: [
          { label: "Header & Announcements", href: "/admin/cms/header" },
          { label: "Footer & Legal Strip", href: "/admin/cms/footer" },
          { label: "Navigation Trees", href: "/admin/cms/navigation" },
        ],
      },
      {
        label: "Banners & Campaigns",
        href: "/admin/cms/banners",
        icon: Sparkles,
        badge: "4",
        badgeVariant: "primary",
      },
      {
        label: "SEO & Social Cards",
        href: "/admin/cms/seo",
        icon: Layers,
      },
      {
        label: "FAQ Knowledge Base",
        href: "/admin/cms/faq",
        icon: HelpCircle,
        children: [
          { label: "All FAQs", href: "/admin/cms/faq" },
          { label: "Create FAQ", href: "/admin/cms/faq/create" },
        ],
      },
      {
        label: "Static Content & Policies",
        href: "/admin/cms/content",
        icon: FileText,
      },
      {
        label: "Media Library",
        href: "/admin/cms/media",
        icon: ImageIcon,
      },
      {
        label: "Content Reviews",
        href: "/admin/cms/reviews",
        icon: ShieldAlert,
        badge: "3",
        badgeVariant: "warning",
      },
      {
        label: "Revision History",
        href: "/admin/cms/revisions",
        icon: History,
      },
    ],
  },

  // 7. COMMUNICATION & SUPPORT
  {
    id: "communication",
    label: "Communication",
    items: [
      {
        label: "Overview",
        href: "/admin/communication",
        icon: Mail,
      },
      {
        label: "Contact Inquiries",
        href: "/admin/communication/contacts",
        icon: Inbox,
        badge: "14",
        badgeVariant: "warning",
      },
      {
        label: "Support & Help Desk",
        href: "/admin/communication/support",
        icon: LifeBuoy,
        badge: "28",
        badgeVariant: "primary",
        children: [
          { label: "All Tickets", href: "/admin/communication/support/tickets" },
          { label: "Formal Complaints", href: "/admin/communication/support/complaints", badge: "5" },
        ],
      },
      {
        label: "Email Management",
        href: "/admin/communication/email",
        icon: Send,
        children: [
          { label: "Overview", href: "/admin/communication/email" },
          { label: "Templates", href: "/admin/communication/email/templates" },
          { label: "Delivery Logs", href: "/admin/communication/email/logs" },
        ],
      },
      {
        label: "Newsletter & Campaigns",
        href: "/admin/communication/newsletter",
        icon: Users,
        children: [
          { label: "Overview", href: "/admin/communication/newsletter" },
          { label: "Subscribers", href: "/admin/communication/newsletter/subscribers" },
          { label: "Campaigns", href: "/admin/communication/newsletter/campaigns" },
        ],
      },
      {
        label: "Announcements",
        href: "/admin/communication/announcements",
        icon: Megaphone,
        badge: "4",
        badgeVariant: "success",
      },
      {
        label: "Notifications Hub",
        href: "/admin/communication/notifications",
        icon: Bell,
        children: [
          { label: "Overview", href: "/admin/communication/notifications" },
          { label: "Templates", href: "/admin/communication/notifications/templates" },
          { label: "Dispatch History", href: "/admin/communication/notifications/history" },
        ],
      },
      {
        label: "Bulk Email",
        href: "/admin/communication/bulk-email",
        icon: Send,
      },
      {
        label: "Live Chat Inbox",
        href: "/admin/communication/live-chat",
        icon: MessageSquare,
        badge: "4",
        badgeVariant: "primary",
      },
      {
        label: "Channels & Settings",
        href: "/admin/communication/channels",
        icon: Radio,
        children: [
          { label: "Gateways & Channels", href: "/admin/communication/channels" },
          { label: "Communication Settings", href: "/admin/communication/settings" },
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
