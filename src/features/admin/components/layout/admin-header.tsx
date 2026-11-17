"use client";

import React, { useState } from "react";
import {
  Menu,
  Search,
  Command,
  CreditCard,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { AdminBreadcrumbs } from "./admin-breadcrumbs";
import { AdminProfileMenu } from "./admin-profile-menu";
import { AdminNotificationsMenu } from "./admin-notifications-menu";
import { AdminSearchModal } from "./admin-search-modal";

interface AdminHeaderProps {
  onOpenMobileDrawer: () => void;
  isSidebarCollapsed: boolean;
  onToggleSidebarCollapse: () => void;
}

export function AdminHeader({
  onOpenMobileDrawer,
  isSidebarCollapsed,
  onToggleSidebarCollapse,
}: AdminHeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-gray-200/80 bg-white/95 px-4 backdrop-blur-md sm:px-6 shadow-xs">
        {/* Left Section: Mobile Toggle, Desktop Toggle & Breadcrumbs */}
        <div className="flex items-center gap-3">
          {/* Mobile Drawer Button */}
          <button
            type="button"
            onClick={onOpenMobileDrawer}
            aria-label="Open navigation menu"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:bg-gray-100 hover:text-gray-900 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Desktop Sidebar Quick Toggle */}
          <button
            type="button"
            onClick={onToggleSidebarCollapse}
            aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="hidden lg:flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200/80 bg-white text-gray-500 shadow-2xs hover:border-[#5B46F6]/30 hover:bg-purple-50/50 hover:text-[#5B46F6] transition"
            title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isSidebarCollapsed ? (
              <PanelLeft className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </button>

          {/* Breadcrumbs */}
          <div className="hidden sm:block">
            <AdminBreadcrumbs />
          </div>
        </div>

        {/* Center / Right Section: Search, Environment Tag, Notifications & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Trigger Bar */}
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-gray-200/80 bg-slate-50/70 px-3 py-1.5 text-xs text-gray-400 shadow-2xs hover:border-[#5B46F6]/40 hover:bg-white hover:text-gray-600 transition w-36 sm:w-56 justify-between"
          >
            <div className="flex items-center gap-2 truncate">
              <Search className="h-3.5 w-3.5 text-gray-400 shrink-0" />
              <span className="truncate">Search admin...</span>
            </div>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-gray-200 bg-white px-1.5 py-0.5 text-[10px] font-mono text-gray-500 shadow-2xs">
              <Command className="h-2.5 w-2.5" /> K
            </kbd>
          </button>

          {/* Gateway Status Pill (Desktop only) */}
          <div className="hidden xl:flex items-center gap-1.5 rounded-full border border-purple-200/70 bg-purple-50/60 px-3 py-1 text-[11px] font-bold text-purple-800">
            <CreditCard className="h-3.5 w-3.5 text-[#5B46F6]" />
            <span>ZiniPay Active</span>
          </div>

          {/* Notifications Popover */}
          <AdminNotificationsMenu />

          {/* Divider */}
          <div className="h-6 w-px bg-gray-200 mx-0.5" aria-hidden="true" />

          {/* Admin Profile Dropdown */}
          <AdminProfileMenu />
        </div>
      </header>

      {/* Global Search Modal */}
      <AdminSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
