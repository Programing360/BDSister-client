"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
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
      className={`flex h-full flex-col border-r border-gray-200/80 bg-white transition-all duration-300 select-none ${collapsedMode ? "w-[76px]" : "w-[272px]"
        }`}
    >
      {/* 1. Brand Header */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-gray-100 px-4">
        <Link
          href="/admin"
          onClick={onNavigate}
          className="flex items-center gap-2.5 overflow-hidden group"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#5B46F6] to-[#7366F7] text-white shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
            <span className="font-black text-sm tracking-wider">BD</span>
          </div>

          {!collapsedMode && (
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-black tracking-tight text-gray-900">
                  BDSisters
                </span>
                <span className="rounded-md bg-purple-100 px-1.5 py-0.2 text-[9px] font-black uppercase text-[#5B46F6]">
                  Admin
                </span>
              </div>
              <p className="text-[10px] font-semibold text-gray-400 truncate">
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
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200/80 bg-gray-50 text-gray-500 shadow-2xs hover:border-[#5B46F6]/40 hover:bg-white hover:text-gray-900 transition"
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
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-gray-200">
        {adminNavGroups.map((group) => (
          <div key={group.id} className="space-y-1">
            {/* Group Label */}
            {!collapsedMode && group.label && (
              <p className="px-3 pb-1 text-[10px] font-extrabold uppercase tracking-widest text-gray-400">
                {group.label}
              </p>
            )}

            {collapsedMode && (
              <div className="h-px bg-gray-100 my-2 mx-2" aria-hidden="true" />
            )}

            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const hasChildren = Boolean(item.children && item.children.length > 0);
                const hasActiveChild = hasChildren
                  ? item.children!.some(
                    (c) => pathname === c.href || (c.href !== "/admin" && pathname.startsWith(c.href))
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
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition ${isParentActive
                            ? "bg-purple-50/70 text-[#5B46F6]"
                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                          }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon
                            className={`h-4 w-4 shrink-0 transition ${isParentActive ? "text-[#5B46F6]" : "text-gray-500"
                              }`}
                          />
                          <span className="truncate">{item.label}</span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {item.badge && (
                            <span
                              className={`rounded-md px-1.5 py-0.2 text-[10px] font-bold ${item.badgeVariant === "warning"
                                  ? "bg-amber-100 text-amber-800"
                                  : item.badgeVariant === "success"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : "bg-purple-100 text-[#5B46F6]"
                                }`}
                            >
                              {item.badge}
                            </span>
                          )}
                          <ChevronDown
                            className={`h-3.5 w-3.5 text-gray-400 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""
                              }`}
                          />
                        </div>
                      </button>

                      {/* Nested Sub-items */}
                      {isExpanded && (
                        <div className="pl-6 pr-1 space-y-0.5 border-l-2 border-purple-100 ml-4.5 mt-1">
                          {item.children!.map((child) => {
                            const isChildActive =
                              pathname === child.href ||
                              (child.href !== "/admin" && pathname.startsWith(child.href));

                            return (
                              <Link
                                key={child.href}
                                href={child.href}
                                onClick={onNavigate}
                                className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition ${isChildActive
                                    ? "bg-[#5B46F6] text-white font-bold shadow-xs"
                                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                                  }`}
                              >
                                <span className="truncate">{child.label}</span>
                                {child.badge && (
                                  <span
                                    className={`rounded px-1.5 py-0.2 text-[9px] font-bold ${isChildActive
                                        ? "bg-white/20 text-white"
                                        : "bg-purple-100 text-[#5B46F6]"
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
                    className={`relative flex items-center rounded-xl transition ${collapsedMode
                        ? "justify-center h-10 w-10 mx-auto"
                        : "justify-between px-3 py-2 text-xs font-semibold"
                      } ${isParentActive
                        ? "bg-[#5B46F6] text-white shadow-sm shadow-purple-500/25 font-bold"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={`h-4 w-4 shrink-0 ${isParentActive
                            ? "text-white"
                            : "text-gray-500 group-hover:text-gray-900"
                          }`}
                      />
                      {!collapsedMode && <span className="truncate">{item.label}</span>}
                    </div>

                    {!collapsedMode && item.badge && (
                      <span
                        className={`rounded-md px-1.5 py-0.2 text-[10px] font-bold ${isParentActive
                            ? "bg-white/20 text-white"
                            : item.badgeVariant === "warning"
                              ? "bg-amber-100 text-amber-800"
                              : item.badgeVariant === "success"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-purple-100 text-[#5B46F6]"
                          }`}
                      >
                        {item.badge}
                      </span>
                    )}

                    {/* Collapsed active dot indicator */}
                    {collapsedMode && isParentActive && (
                      <span className="absolute -right-1 top-1/2 -translate-y-1/2 h-2 w-1 rounded-l-full bg-[#5B46F6]" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* 3. Bottom Footer */}
      <div className="border-t border-gray-100 p-3 bg-slate-50/50">
        {!collapsedMode ? (
          <div className="flex items-center justify-between text-[11px] text-gray-500 px-1">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-gray-700">Admin Engine v2.0</span>
            </div>
            <Link
              href="/"
              target="_blank"
              className="text-gray-400 hover:text-[#5B46F6] transition flex items-center gap-0.5"
              title="Open Public Website in new tab"
            >
              <span>Site</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        ) : (
          <div className="flex justify-center" title="Admin Engine Online">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        )}
      </div>
    </aside>
  );
}
