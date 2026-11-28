"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import type { AuthUser } from "@/types/auth";
import { memberNavGroups } from "@/config/member-navigation";
import { useAuth } from "@/hooks/use-auth";

interface MemberSidebarProps {
  user: AuthUser;
  onNavigate?: () => void;
  className?: string;
}

export function MemberSidebar({ user: initialUser, onNavigate, className = "" }: MemberSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user: liveUser, logout } = useAuth();

  const user = liveUser || initialUser;
  const rawUser = (user || {}) as Record<string, any>;
  const displayName = rawUser.fullName || rawUser.name || "Sister Member";
  const displayEmail = rawUser.email || "";
  const initialChar = displayName ? displayName.trim().charAt(0).toUpperCase() : "B";

  const handleSignOut = async () => {
    try {
      if (logout) {
        await logout();
      } else {
        router.push("/login");
      }
    } catch (err) {
      console.warn("[SignOut Warning]", err);
      router.push("/login");
    }
  };

  return (
    <aside
      className={`flex h-full w-72 flex-col border-r border-stone-200/80 bg-[#0e1f21] shadow-xl shadow-[#5B9891]/5 ${className}`}
    >
      {/* Brand Header */}
      <div className="flex h-20 items-center border-b border-stone-100 px-6">
        <Link
          href="/member"
          onClick={onNavigate}
          className="group flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5B9891] text-white shadow-md shadow-[#5B9891]/30 transition-transform duration-200 group-hover:scale-105">
            <span className="text-sm font-black tracking-tight">BD</span>
          </div>
          <div className="flex flex-col">
            <span className="text-base font-black tracking-tight text-white">
              BDSisters<span className="text-[#D98408]">.org</span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#5B9891]">
              Member Dashboard
            </span>
          </div>
        </Link>
      </div>

      {/* Nav List */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {memberNavGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-1.5">
            <h3 className="px-3 text-[11px] font-bold uppercase tracking-wider text-stone-400">
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
                      className={`group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all duration-200 ${isActive
                        ? "bg-[#5B9891] text-white shadow-md shadow-[#5B9891]/25"
                        : "text-white hover:bg-[#F7DFC7]/30 hover:text-[#f5fffef6]"
                        }`}
                    >
                      <Icon
                        className={`h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${isActive ? "text-white" : "text-stone-400 group-hover:text-[#5B9891]"
                          }`}
                      />
                      <span className="truncate">{item.label}</span>
                      {item.badge !== undefined && (
                        <span
                          className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold ${isActive
                            ? "bg-white/20 text-white"
                            : "bg-[#7c6d5f] text-[#f39302]"
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
      <div className="border-t border-stone-100 p-4">
        <div className="flex items-center justify-between rounded-2xl border border-stone-200/80 bg-[#FAF8F5] p-3 shadow-2xs">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#5B9891] text-xs font-black text-white shadow-2xs">
              {initialChar}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-[#111E28]">
                {displayName}
              </p>
              <p className="truncate text-[10px] text-stone-500">
                {displayEmail}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            aria-label="Log out of BDSisters"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-500 transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
