import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  User,
  ShieldCheck,
  Sparkles,
  Settings,
  Briefcase,
  Store,
  ShoppingBag,
  Package,
  Boxes,
  Heart,
  Users,
  MessageSquare,
  Calendar,
  Compass,
  GraduationCap,
  BookOpen,
  FolderArchive,
  CreditCard,
  Receipt,
  Bell,
  HelpCircle,
} from "lucide-react";

export interface MemberNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
  isPlanned?: boolean;
}

export interface MemberNavGroup {
  label: string;
  items: MemberNavItem[];
}

export const memberNavGroups: MemberNavGroup[] = [
  {
    label: "Overview",
    items: [
      {
        label: "Dashboard",
        href: "/member",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "My Account",
    items: [
      {
        label: "My Profile",
        href: "/member/profile",
        icon: User,
      },
      {
        label: "Profile Verification",
        href: "/member/profile/verification",
        icon: ShieldCheck,
      },
      {
        label: "Skills & Interests",
        href: "/member/skills",
        icon: Sparkles,
      },
      {
        label: "Account Settings",
        href: "/member/settings",
        icon: Settings,
      },
    ],
  },
  {
    label: "Business & Commerce",
    items: [
      {
        label: "My Business",
        href: "/member/business",
        icon: Briefcase,
      },
      {
        label: "My Shop",
        href: "/member/shop",
        icon: Store,
      },
      {
        label: "My Products",
        href: "/member/products",
        icon: Package,
      },
      {
        label: "Inventory",
        href: "/member/products/inventory",
        icon: Boxes,
      },
      {
        label: "Marketplace",
        href: "/member/marketplace",
        icon: ShoppingBag,
      },
      {
        label: "My Orders",
        href: "/member/orders",
        icon: Package,
      },
      {
        label: "Merchant Orders",
        href: "/member/seller/orders",
        icon: Receipt,
      },
      {
        label: "Saved Wishlist",
        href: "/member/wishlist",
        icon: Heart,
      },
    ],
  },
  {
    label: "Community",
    items: [
      {
        label: "Community Feed",
        href: "/member/community",
        icon: Users,
      },
      {
        label: "Direct Messages",
        href: "/member/messages",
        icon: MessageSquare,
      },
      {
        label: "Sisterhood Events",
        href: "/member/events",
        icon: Calendar,
      },
      {
        label: "Job Opportunities",
        href: "/member/jobs",
        icon: Compass,
      },
    ],
  },
  {
    label: "Learning & Growth",
    items: [
      {
        label: "Learning Hub",
        href: "/member/learning",
        icon: GraduationCap,
      },
      {
        label: "My Courses",
        href: "/member/courses",
        icon: BookOpen,
      },
      {
        label: "Knowledge Resources",
        href: "/resources",
        icon: FolderArchive,
      },
    ],
  },
  {
    label: "Account & Support",
    items: [
      {
        label: "Membership Tier",
        href: "/member/membership",
        icon: CreditCard,
      },
      {
        label: "Billing & Invoices",
        href: "/member/billing",
        icon: Receipt,
      },
      {
        label: "Notifications",
        href: "/member/notifications",
        icon: Bell,
      },
      {
        label: "Help & Support",
        href: "/member/support",
        icon: HelpCircle,
      },
    ],
  },
];
