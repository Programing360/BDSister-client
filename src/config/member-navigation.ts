import {
  LayoutDashboard,
  UserCircle,
  Compass,
  Building2,
  Store,
  MessageSquare,
  Calendar,
  BookOpen,
  ShoppingBag,
  Receipt,
  UserPlus,
  type LucideIcon,
} from "lucide-react";

export interface MemberNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

export interface MemberNavGroup {
  id: string;
  label: string;
  items: MemberNavItem[];
}

export const memberNavGroups: MemberNavGroup[] = [
  {
    id: "personal-growth",
    label: "Personal & Growth",
    items: [
      { label: "Member Overview", href: "/member", icon: LayoutDashboard },
      { label: "My Profile & ID", href: "/member/profile", icon: UserCircle },
      { label: "Discover Yourself", href: "/member/discover", icon: Compass },
    ],
  },
  {
    id: "enterprise-commerce",
    label: "Enterprise & Shop",
    items: [
      { label: "My Business & Brands", href: "/member/business", icon: Building2 },
      { label: "Seller Center", href: "/member/seller", icon: Store, badge: "Pro" },
      { label: "My Orders & Reviews", href: "/member/orders", icon: ShoppingBag },
    ],
  },
  {
    id: "sisterhood-network",
    label: "Sisterhood Network",
    items: [
      { label: "Community Forums", href: "/member/community", icon: MessageSquare },
      { label: "Events & Tickets", href: "/member/events", icon: Calendar },
      { label: "Resource Library", href: "/member/resources", icon: BookOpen },
    ],
  },
  {
    id: "account-referrals",
    label: "Account & Referrals",
    items: [
      { label: "Refer a Sister", href: "/member/referrals", icon: UserPlus },
      { label: "Billing & Invoices", href: "/member/billing", icon: Receipt },
    ],
  },
];