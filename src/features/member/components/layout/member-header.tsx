"use client";

import React from "react";
import { Menu, Search } from "lucide-react";
import type { AuthUser } from "@/types/auth";
import { MemberBreadcrumbs } from "./member-breadcrumbs";
import { MemberProfileMenu } from "./member-profile-menu";
import { MemberNotificationMenu } from "./member-notification-menu";

interface MemberHeaderProps {
  user: AuthUser;
  onOpenMobileDrawer: () => void;
}

export function MemberHeader({ user, onOpenMobileDrawer }: MemberHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-[#F7DFC7] bg-[#FAF8F5]/90 px-4 backdrop-blur-md sm:px-8">
      {/* Left side: Hamburger toggle for mobile & Breadcrumbs */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={onOpenMobileDrawer}
          aria-label="Open navigation menu"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-700 shadow-2xs transition-colors hover:border-[#5B9891]/40 hover:text-[#5B9891] lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden sm:block">
          <MemberBreadcrumbs />
        </div>
      </div>

      {/* Right side: Search shortcut, Notification dropdown popover, and Profile dropdown */}
      <div className="flex items-center gap-3">
        {/* Search input entry point */}
        <div className="relative hidden md:block">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-stone-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            readOnly
            placeholder="Search resources, events..."
            onClick={() => {
              window.location.href = "/member/resources";
            }}
            className="w-48 cursor-pointer rounded-full border border-stone-200 bg-white/90 py-2 pl-9 pr-3 text-xs font-medium text-stone-700 shadow-2xs backdrop-blur transition-all placeholder:text-stone-400 hover:border-[#5B9891]/40 focus:outline-none lg:w-64"
          />
        </div>

        {/* In-Place Notifications Popover Dropdown */}
        <MemberNotificationMenu />

        {/* Profile Menu Dropdown */}
        <MemberProfileMenu user={user} />
      </div>
    </header>
  );
}
