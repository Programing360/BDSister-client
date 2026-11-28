import {
  LayoutDashboard,
  Users,
  Building2,
  Database,
  ShoppingBag,
  ClipboardList,
  Star,
  FileText,
  Menu,
  HelpCircle,
  MessageSquare,
  ShieldAlert,
  Calendar,
  Archive,
  BookOpen,
  CheckSquare,
  KeyRound,
  Mail,
  type LucideIcon,
} from "lucide-react";

export interface AdminNavSubItem {
  label: string;
  href: string;
  badge?: string | number;
}

export interface AdminNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
  badgeVariant?: "primary" | "warning" | "success" | "neutral";
  isPlanned?: boolean;
  children?: AdminNavSubItem[];
}

export interface AdminNavGroup {
  id: string;
  label: string;
  items: AdminNavItem[];
}

export const adminNavGroups: AdminNavGroup[] = [
  {
    id: "overview",
    label: "Overview",
    items: [
      { label: "Dashboard Overview", href: "/admin", icon: LayoutDashboard },
    ],
  },
  {
    id: "members-enterprises",
    label: "Members & Enterprises",
    items: [
      { label: "Members & Verifications", href: "/admin/members", icon: Users },
      { label: "Businesses & Brands", href: "/admin/businesses", icon: Building2 },
      { label: "Master Databases", href: "/admin/databases", icon: Database },
    ],
  },
  {
    id: "shop-commerce",
    label: "Shop & Commerce",
    items: [
      { label: "Products & Services", href: "/admin/shop/products", icon: ShoppingBag },
      { label: "Orders & Payments", href: "/admin/shop/orders", icon: ClipboardList },
      { label: "Ratings & Reviews", href: "/admin/shop/reviews", icon: Star },
    ],
  },
  {
    id: "content-community",
    label: "Content & Community",
    items: [
      { label: "Pages & Blocks CMS", href: "/admin/content/pages", icon: FileText },
      { label: "Menu & Positioning", href: "/admin/content/menu", icon: Menu },
      { label: "Section Hover Help", href: "/admin/content/hover-help", icon: HelpCircle },
      { label: "Forum Categories", href: "/admin/forums/categories", icon: MessageSquare },
      { label: "Forum Moderation", href: "/admin/forums/moderation", icon: ShieldAlert },
      { label: "Upcoming Events", href: "/admin/events", icon: Calendar },
      { label: "Event Archive", href: "/admin/events/archive", icon: Archive },
      { label: "Resource Library", href: "/admin/resources", icon: BookOpen },
    ],
  },
  {
    id: "operations-wings",
    label: "Operations & Wings",
    items: [
      { label: "Admin Tasks", href: "/admin/tasks", icon: CheckSquare },
      { label: "Wing API Integrations", href: "/admin/integrations", icon: KeyRound },
      { label: "Contact & Newsletter", href: "/admin/contact", icon: Mail },
    ],
  },
];