"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

const SEGMENT_LABELS: Record<string, string> = {
  admin: "Admin",
  members: "Members",
  create: "Create",
  verifications: "Verifications",
  roles: "Roles & Permissions",
  permissions: "Permissions",
  profiles: "Profiles",
  pending: "Pending",
  featured: "Featured",
  businesses: "Businesses",
  categories: "Categories",
  ecommerce: "Commerce",
  sellers: "Sellers",
  products: "Products",
  orders: "Orders",
  payments: "Payments",
  inventory: "Inventory",
  refunds: "Refunds",
  community: "Community",
  discussions: "Discussions",
  reports: "Reports",
  events: "Events",
  resources: "Resources",
  articles: "Articles",
  videos: "Videos",
  courses: "Courses",
  cms: "CMS",
  pages: "Pages",
  homepage: "Homepage",
  menus: "Menus",
  banners: "Banners",
  seo: "SEO",
  communications: "Communications",
  support: "Support Tickets",
  "contact-submissions": "Contact Submissions",
  newsletters: "Newsletters",
  notifications: "Notifications",
  integrations: "Integrations",
  muhsina: "Muhsina Organization",
  system: "System",
  "activity-logs": "Activity Logs",
  security: "Security",
  settings: "Settings",
  profile: "Profile",
};

export function AdminBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  // If directly at /admin, show simple Welcome breadcrumb
  if (segments.length <= 1) {
    return (
      <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
        <Home className="h-3.5 w-3.5 text-[#5B46F6]" />
        <span>Admin Console</span>
        <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
        <span className="font-bold text-gray-900">Dashboard Overview</span>
      </div>
    );
  }

  const breadcrumbItems = segments.slice(1).map((segment, index, arr) => {
    const currentHref = `/admin/${arr.slice(0, index + 1).join("/")}`;
    const isLast = index === arr.length - 1;
    const label =
      SEGMENT_LABELS[segment] ||
      segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    return { currentHref, isLast, label };
  });

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-gray-500 overflow-x-auto py-0.5">
      <Link
        href="/admin"
        className="flex items-center gap-1 text-gray-500 hover:text-[#5B46F6] transition font-medium"
      >
        <Home className="h-3.5 w-3.5 text-gray-400" />
        <span className="hidden sm:inline">Admin</span>
      </Link>

      {breadcrumbItems.map((item) => (
        <React.Fragment key={item.currentHref}>
          <ChevronRight className="h-3.5 w-3.5 text-gray-400 shrink-0" />
          {item.isLast ? (
            <span className="font-bold text-gray-900 capitalize truncate" aria-current="page">
              {item.label}
            </span>
          ) : (
            <Link
              href={item.currentHref}
              className="font-medium text-gray-500 hover:text-[#5B46F6] transition truncate capitalize"
            >
              {item.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
