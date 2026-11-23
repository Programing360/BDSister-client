"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Settings,
  ShieldAlert,
  LogOut,
  ChevronDown,
  Sparkles,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export function AdminProfileMenu() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click or Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await logout();
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.warn("[Admin SignOut]", err);
      router.push("/login");
    } finally {
      setIsSigningOut(false);
      setIsOpen(false);
    }
  };

  const adminName = user?.name || "Sister Administrator";
  const adminEmail = user?.email || "admin@bdsisters.org";
  const adminRole = user?.role || "SUPER_ADMIN";

  // Derive initials
  const initials = adminName
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "AD";

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="flex items-center gap-2.5 rounded-xl border border-gray-200/80 bg-white/90 p-1.5 pr-2.5 shadow-sm transition hover:border-[#5B46F6]/40 hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#5B46F6]/20"
      >
        {/* Avatar */}
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#5B46F6] text-xs font-black text-white shadow-xs">
          {initials}
        </div>

        {/* Text Info (Desktop) */}
        <div className="hidden text-left sm:block">
          <p className="truncate text-xs font-bold text-gray-900 max-w-[120px]">{adminName}</p>
          <div className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <p className="text-[10px] font-semibold uppercase tracking-wider text-purple-700">
              {adminRole.replace(/_/g, " ")}
            </p>
          </div>
        </div>

        <ChevronDown
          className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180 text-gray-700" : ""
            }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl border border-gray-200/80 bg-white p-2 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
          {/* Header Card */}
          <div className="rounded-xl bg-purple-50/60 p-3 border border-purple-100/80 mb-2">
            <p className="font-bold text-xs text-gray-900 truncate">{adminName}</p>
            <p className="text-[11px] text-gray-500 truncate">{adminEmail}</p>
            <div className="mt-2 flex items-center justify-between">
              <span className="inline-flex items-center rounded-md bg-purple-100 px-2 py-0.5 text-[10px] font-black text-[#5B46F6]">
                {adminRole}
              </span>
              {!user && (
                <span className="text-[9px] font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                  Dev Mode
                </span>
              )}
            </div>
          </div>

          {/* Links */}
          <div className="space-y-0.5 text-xs text-gray-700">
            <Link
              href="/admin/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 font-medium hover:bg-gray-100 hover:text-gray-900 transition"
            >
              <User className="h-4 w-4 text-[#5B46F6]" />
              <span>Admin Profile</span>
            </Link>

            <Link
              href="/admin/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 font-medium hover:bg-gray-100 hover:text-gray-900 transition"
            >
              <Settings className="h-4 w-4 text-gray-500" />
              <span>System Settings</span>
            </Link>

            <Link
              href="/admin/system/security"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 font-medium hover:bg-gray-100 hover:text-gray-900 transition"
            >
              <ShieldAlert className="h-4 w-4 text-emerald-600" />
              <span>Security & Audit</span>
            </Link>

            <Link
              href="/member"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between rounded-xl px-3 py-2 font-medium text-purple-700 hover:bg-purple-50 transition"
            >
              <span className="flex items-center gap-2.5">
                <Sparkles className="h-4 w-4" />
                <span>Switch to Member View</span>
              </span>
              <ExternalLink className="h-3.5 w-3.5 text-gray-400" />
            </Link>
          </div>

          <div className="my-1.5 border-t border-gray-100" />

          {/* Sign Out Action */}
          <button
            type="button"
            disabled={isSigningOut}
            onClick={handleSignOut}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition disabled:opacity-50"
          >
            {isSigningOut ? (
              <Loader2 className="h-4 w-4 animate-spin text-rose-600" />
            ) : (
              <LogOut className="h-4 w-4 text-rose-600" />
            )}
            <span>{isSigningOut ? "Signing out..." : "Sign Out"}</span>
          </button>
        </div>
      )}
    </div>
  );
}
