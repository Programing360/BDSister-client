"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

const segmentNameMap: Record<string, string> = {
  member: "Dashboard",
  profile: "Profile",
  edit: "Edit Profile",
  verification: "Identity Verification",
  business: "My Business",
  create: "Create",
  shop: "My Shop",
  products: "Products",
  marketplace: "Marketplace",
  orders: "Orders",
  wishlist: "Wishlist",
  skills: "Skills & Interests",
  community: "Community",
  messages: "Messages",
  events: "Events",
  jobs: "Jobs",
  learning: "Learning Hub",
  courses: "My Courses",
  resources: "Resources",
  membership: "Membership",
  billing: "Billing & Invoices",
  notifications: "Notifications",
  settings: "Settings",
  support: "Support",
};

export function MemberBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length <= 1) {
    return (
      <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
        <Home className="h-3.5 w-3.5 text-[#5B46F6]" />
        <span>Dashboard Overview</span>
      </div>
    );
  }

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
      <Link
        href="/member"
        className="flex items-center gap-1 text-gray-600 transition-colors hover:text-[#5B46F6]"
      >
        <Home className="h-3.5 w-3.5" />
        <span>Dashboard</span>
      </Link>

      {segments.slice(1).map((segment, index) => {
        const path = `/${segments.slice(0, index + 2).join("/")}`;
        const isLast = index === segments.slice(1).length - 1;
        const name = segmentNameMap[segment] || segment.replace(/-/g, " ");

        return (
          <React.Fragment key={path}>
            <ChevronRight className="h-3 w-3 text-gray-400" />
            {isLast ? (
              <span className="font-bold capitalize text-gray-900">{name}</span>
            ) : (
              <Link
                href={path}
                className="capitalize text-gray-600 transition-colors hover:text-[#5B46F6]"
              >
                {name}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
