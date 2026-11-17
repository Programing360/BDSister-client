import type { UserRole } from "./auth";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon?: LucideIcon;
  badge?: string | number;
  requiredRoles?: UserRole[];
  children?: NavItem[];
  isExternal?: boolean;
  isActive?: boolean;
}

export interface NavGroup {
  label?: string;
  items: NavItem[];
}
