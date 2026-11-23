"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { adminNavGroups } from "@/config/admin-navigation";

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onNavigate?: () => void;
  isMobileDrawer?: boolean;
}

export function AdminSidebar({
  isCollapsed,
  onToggleCollapse,
  onNavigate,
  isMobileDrawer = false,
}: AdminSidebarProps) {
  const pathname = usePathname();
  // Set of user-toggled expanded parent item labels
  const [userToggled, setUserToggled] = useState<Record<string, boolean>>({});

  const toggleExpand = (label: string, currentExpanded: boolean) => {
    setUserToggled((prev) => ({
      ...prev,
      [label]: !currentExpanded,
    }));
  };

  const collapsedMode = isCollapsed && !isMobileDrawer;

  return (
    <aside
      className={`flex h-full flex-col border-r border-[#5B9891]/20 bg-[#0E1F21] text-slate-100 transition-all duration-300 select-none ${
        collapsedMode ? "w-[76px]" : "w-[272px]"
      }`}
    >
      {/* 1. Brand Header */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-[#5B9891]/15 px-4">
        <Link
          href="/admin"
          onClick={onNavigate}
          className="flex items-center gap-2.5 overflow-hidden group"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#5B9891] to-[#3E726C] text-white shadow-md shadow-[#5B9891]/20 ring-1 ring-[#F7DFC7]/25 group-hover:scale-105 transition-transform">
            <span className="font-black text-sm tracking-wider text-[#F7DFC7]">BD</span>
          </div>

          {!collapsedMode && (
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-black tracking-tight text-white">BDSisters</span>
                <span className="rounded-md border border-[#F2B55D]/30 bg-[#D98408]/20 px-1.5 py-0.2 text-[9px] font-black uppercase text-[#F2B55D]">
                  Admin
                </span>
              </div>
              <p className="text-[10px] font-medium text-[#9BB8B5] truncate">
                Centralized Management Portal
              </p>
            </div>
          )}
        </Link>

        {/* Desktop Collapse Toggle */}
        {!isMobileDrawer && (
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={collapsedMode ? "Expand sidebar" : "Collapse sidebar"}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#5B9891]/25 bg-[#5B9891]/10 text-[#B8D1CE] shadow-2xs hover:border-[#F2B55D]/50 hover:bg-[#5B9891] hover:text-white transition-all duration-200"
          >
            {collapsedMode ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        )}
      </div>

      {/* 2. Navigation Area */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-[#5B9891]/20">
        {adminNavGroups.map((group) => (
          <div key={group.id} className="space-y-1">
            {/* Group Label */}
            {!collapsedMode && group.label && (
              <p className="px-3 pb-1 text-[10px] font-extrabold uppercase tracking-widest text-[#7A9E9A]">
                {group.label}
              </p>
            )}

            {collapsedMode && <div className="h-px bg-[#5B9891]/15 my-2 mx-2" aria-hidden="true" />}

            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const hasChildren = Boolean(item.children && item.children.length > 0);
                const hasActiveChild = hasChildren
                  ? item.children!.some(
                      (c) =>
                        pathname === c.href || (c.href !== "/admin" && pathname.startsWith(c.href)),
                    )
                  : false;
                const isExpanded = userToggled[item.label] ?? hasActiveChild;

                const isDirectActive =
                  pathname === item.href ||
                  (item.href !== "/admin" && pathname.startsWith(item.href) && !hasChildren);

                const isParentActive = isDirectActive || hasActiveChild;

                if (hasChildren && !collapsedMode) {
                  return (
                    <div key={item.label} className="space-y-1">
                      <button
                        type="button"
                        onClick={() => toggleExpand(item.label, isExpanded)}
                        className={`group flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-200 ease-in-out ${
                          isParentActive
                            ? "bg-[#5B9891]/20 text-[#F7DFC7] ring-1 ring-[#5B9891]/35"
                            : "text-slate-300 hover:bg-[#5B9891]/12 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon
                            className={`h-4 w-4 shrink-0 transition-colors duration-200 ${
                              isParentActive
                                ? "text-[#F2B55D]"
                                : "text-[#8FB0AC] group-hover:text-[#F7DFC7]"
                            }`}
                          />
                          <span className="truncate">{item.label}</span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {item.badge && (
                            <span
                              className={`rounded-md px-1.5 py-0.2 text-[10px] font-bold ${
                                item.badgeVariant === "warning"
                                  ? "bg-[#D98408]/25 text-[#F2B55D]"
                                  : item.badgeVariant === "success"
                                    ? "bg-[#5B9891]/25 text-[#8CD3CB]"
                                    : "bg-[#F7DFC7]/15 text-[#F7DFC7]"
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                          <ChevronDown
                            className={`h-3.5 w-3.5 text-[#7A9E9A] transition-transform duration-200 ${
                              isExpanded ? "rotate-180 text-[#F2B55D]" : ""
                            }`}
                          />
                        </div>
                      </button>

                      {/* Nested Sub-items */}
                      {isExpanded && (
                        <div className="pl-5 pr-1 space-y-0.5 border-l border-[#F7DFC7]/20 ml-4.5 mt-1">
                          {item.children!.map((child) => {
                            const isChildActive =
                              pathname === child.href ||
                              (child.href !== "/admin" && pathname.startsWith(child.href));

                            return (
                              <Link
                                key={child.href}
                                href={child.href}
                                onClick={onNavigate}
                                className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition-all duration-200 ease-in-out ${
                                  isChildActive
                                    ? "bg-[#5B9891] text-white font-bold shadow-xs"
                                    : "text-[#A3C2BE] hover:bg-[#5B9891]/15 hover:text-white"
                                }`}
                              >
                                <span className="truncate">{child.label}</span>
                                {child.badge && (
                                  <span
                                    className={`rounded px-1.5 py-0.2 text-[9px] font-bold ${
                                      isChildActive
                                        ? "bg-[#0E1F21]/30 text-[#F7DFC7]"
                                        : "bg-[#D98408]/20 text-[#F2B55D]"
                                    }`}
                                  >
                                    {child.badge}
                                  </span>
                                )}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                // Normal or Collapsed Item
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    title={collapsedMode ? item.label : undefined}
                    className={`group relative flex items-center rounded-xl transition-all duration-200 ease-in-out ${
                      collapsedMode
                        ? "justify-center h-10 w-10 mx-auto"
                        : "justify-between px-3 py-2 text-xs font-semibold"
                    } ${
                      isParentActive
                        ? "bg-gradient-to-r from-[#5B9891] to-[#477C76] text-white shadow-sm shadow-black/20 font-bold ring-1 ring-[#F7DFC7]/20"
                        : "text-slate-300 hover:bg-[#5B9891]/12 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={`h-4 w-4 shrink-0 transition-colors duration-200 ${
                          isParentActive
                            ? "text-[#F7DFC7]"
                            : "text-[#8FB0AC] group-hover:text-[#F7DFC7]"
                        }`}
                      />
                      {!collapsedMode && <span className="truncate">{item.label}</span>}
                    </div>

                    {!collapsedMode && item.badge && (
                      <span
                        className={`rounded-md px-1.5 py-0.2 text-[10px] font-bold ${
                          isParentActive
                            ? "bg-[#0E1F21]/30 text-[#F7DFC7]"
                            : item.badgeVariant === "warning"
                              ? "bg-[#D98408]/25 text-[#F2B55D]"
                              : item.badgeVariant === "success"
                                ? "bg-[#5B9891]/25 text-[#8CD3CB]"
                                : "bg-[#F7DFC7]/15 text-[#F7DFC7]"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}

                    {/* Collapsed active dot indicator */}
                    {collapsedMode && isParentActive && (
                      <span className="absolute -right-1 top-1/2 -translate-y-1/2 h-3 w-1 rounded-l-full bg-[#F2B55D]" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* 3. Bottom Footer */}
      <div className="border-t border-[#5B9891]/15 p-3 bg-[#091517]">
        {!collapsedMode ? (
          <div className="flex items-center justify-between text-[11px] text-[#9BB8B5] px-1">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#F2B55D] animate-pulse" />
              <span className="font-semibold text-[#F7DFC7]">Admin Engine v2.0</span>
            </div>
            <Link
              href="/"
              target="_blank"
              className="text-[#9BB8B5] hover:text-[#F2B55D] transition-colors duration-200 flex items-center gap-1 font-medium"
              title="Open Public Website in new tab"
            >
              <span>Site</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        ) : (
          <div className="flex justify-center" title="Admin Engine Online">
            <span className="h-2.5 w-2.5 rounded-full bg-[#F2B55D] animate-pulse" />
          </div>
        )}
      </div>
    </aside>
  );
}
