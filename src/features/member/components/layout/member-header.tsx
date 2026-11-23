"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, Bell, Search } from "lucide-react";
import type { AuthUser } from "@/types/auth";
import { MemberBreadcrumbs } from "./member-breadcrumbs";
import { MemberProfileMenu } from "./member-profile-menu";
import { notificationService } from "@/lib/services/notification-service";

interface MemberHeaderProps {
  user: AuthUser;
  onOpenMobileDrawer: () => void;
}

export function MemberHeader({ user, onOpenMobileDrawer }: MemberHeaderProps) {
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;
    notificationService
      .getUnreadCount()
      .then((count) => {
        if (isMounted) setUnreadCount(count);
      })
      .catch(() => { });

    return () => {
      isMounted = false;
    };
  }, []);
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-gray-200/80 bg-[#EAE6F7]/80 px-4 backdrop-blur-md sm:px-8">
      {/* Left side: Hamburger toggle for mobile & Breadcrumbs */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={onOpenMobileDrawer}
          aria-label="Open navigation menu"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200/80 bg-white text-gray-700 shadow-md shadow-[#5B46F6]/5 transition-colors hover:border-[#5B46F6]/40 hover:text-[#5B46F6] lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden sm:block">
          <MemberBreadcrumbs />
        </div>
      </div>

      {/* Right side: Search shortcut, Notification button, and Profile dropdown */}
      <div className="flex items-center gap-3">
        {/* Search input entry point */}
        <div className="relative hidden md:block">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            readOnly
            placeholder="Search resources, events..."
            onClick={() => {
              // Graceful notification
              const input = document.getElementById("search-hint");
              if (input) input.classList.remove("hidden");
              setTimeout(() => input?.classList.add("hidden"), 2500);
            }}
            className="w-48 cursor-pointer rounded-full border border-gray-200/80 bg-white/90 py-2 pl-9 pr-3 text-xs font-medium text-gray-600 shadow-md shadow-[#5B46F6]/5 backdrop-blur transition-all placeholder:text-gray-400 hover:border-[#5B46F6]/40 focus:outline-none lg:w-64"
          />
          <div
            id="search-hint"
            className="absolute right-0 top-full mt-1.5 hidden rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-gray-600 shadow-lg"
          >
            Universal search coming in upcoming release
          </div>
        </div>

        {/* Notifications Button */}
        <Link
          href="/member/notifications"
          aria-label="View notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-full border border-gray-200/80 bg-white text-gray-700 shadow-md shadow-[#5B46F6]/5 transition-all hover:border-[#5B46F6]/40 hover:text-[#5B46F6] active:scale-95"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#5B46F6] text-[10px] font-bold text-white shadow-xs ring-2 ring-white animate-pulse">
              {unreadCount}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Link>

        {/* Profile Menu Dropdown */}
        <MemberProfileMenu user={user} />
      </div>
    </header>
  );
}
