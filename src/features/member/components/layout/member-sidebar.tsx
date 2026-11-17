"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import type { AuthUser } from "@/types/auth";
import { memberNavGroups } from "@/config/member-navigation";
import { signOut } from "@/lib/auth/auth-client";

interface MemberSidebarProps {
  user: AuthUser;
  onNavigate?: () => void;
  className?: string;
}

export function MemberSidebar({ user, onNavigate, className = "" }: MemberSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.warn("[SignOut Warning]", err);
      router.push("/login");
    }
  };

  return (
    <aside
      className={`flex h-full w-72 flex-col border-r border-gray-200/80 bg-white shadow-xl shadow-[#5B46F6]/5 ${className}`}
    >
      {/* Brand Header */}
      <div className="flex h-20 items-center border-b border-gray-100 px-6">
        <Link
          href="/member"
          onClick={onNavigate}
          className="group flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5B46F6] text-white shadow-md shadow-[#5B46F6]/30 transition-transform duration-200 group-hover:scale-105">
            <span className="text-sm font-black tracking-tight">BD</span>
          </div>
          <div className="flex flex-col">
            <span className="text-base font-black tracking-tight text-gray-900">
              BDSisters<span className="text-[#5B46F6]">.org</span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#7366F7]">
              Member Dashboard
            </span>
          </div>
        </Link>
      </div>

      {/* Nav List */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {memberNavGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-1.5">
            <h3 className="px-3 text-[11px] font-bold uppercase tracking-wider text-gray-400">
              {group.label}
            </h3>
            <ul className="space-y-1">
              {group.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/member" && pathname.startsWith(item.href));

                const Icon = item.icon;

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      className={`group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all duration-200 ${
                        isActive
                          ? "bg-[#5B46F6] text-white shadow-md shadow-[#5B46F6]/25"
                          : "text-gray-600 hover:bg-[#5B46F6]/5 hover:text-[#5B46F6]"
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                          isActive ? "text-white" : "text-gray-400 group-hover:text-[#5B46F6]"
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                      {item.badge !== undefined && (
                        <span
                          className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            isActive
                              ? "bg-white/20 text-white"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer Profile & Logout */}
      <div className="border-t border-gray-100 p-4">
        <div className="flex items-center justify-between rounded-2xl border border-gray-200/80 bg-gray-50/70 p-3 shadow-sm">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#5B46F6] text-xs font-black text-white shadow-sm">
              {user.name ? user.name[0]?.toUpperCase() : "B"}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-gray-900">
                {user.name}
              </p>
              <p className="truncate text-[10px] text-gray-500">
                {user.email}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            aria-label="Log out of BDSisters"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
