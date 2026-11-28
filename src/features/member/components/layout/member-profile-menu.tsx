"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { User, Settings, ShieldCheck, LogOut, ChevronDown, Sparkles } from "lucide-react";
import type { AuthUser } from "@/types/auth";
import { useAuth } from "@/hooks/use-auth";
import { authService } from "@/lib/services/auth-service";

interface MemberProfileMenuProps {
  user: AuthUser;
}

export function MemberProfileMenu({ user: initialUser }: MemberProfileMenuProps) {
  const { user: liveAuthUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Bind live authenticated user or fall back to layout session
  const effectiveUser = liveAuthUser || initialUser;

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
      await authService.logout();
    } catch (error) {
      console.warn("[SignOut Warning]", error);
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user");
        document.cookie = "token=; path=/; max-age=0";
        document.cookie = "auth_token=; path=/; max-age=0";
        document.cookie = "user_role=; path=/; max-age=0";
        window.location.href = "/login";
      }
    }
  };

  const rawUser = (effectiveUser || {}) as Record<string, any>;
  const displayName =
    rawUser.fullName ||
    rawUser.name ||
    "Sister Member";

  const avatarUrl =
    rawUser.profilePicture ||
    rawUser.image ||
    null;

  const isVerified = Boolean(rawUser.isEmailVerified || rawUser.emailVerified);
  const rawRole = String(rawUser.role || "MEMBER").toUpperCase();

  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .map((n: string) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "BD";

  const roleLabel =
    rawRole === "SUPER_ADMIN" || rawRole === "SUPERADMIN" || rawRole === "ADMIN"
      ? "Sister Administrator"
      : rawRole === "PAIDMEMBER" || rawRole === "PAID_MEMBER"
      ? "Premium Sister"
      : "Sisterhood Member";

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="flex items-center gap-2.5 rounded-full border border-stone-200 bg-white p-1.5 pr-3 shadow-2xs transition-all hover:border-[#5B9891]/40 hover:shadow-sm active:scale-98"
      >
        <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-[#5B9891] text-xs font-black text-white shadow-2xs">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={displayName}
              fill
              sizes="32px"
              className="object-cover"
            />
          ) : (
            <span>{initials}</span>
          )}
        </div>

        <div className="hidden text-left sm:block">
          <span className="block max-w-[130px] truncate text-xs font-bold text-[#111E28]">
            {displayName}
          </span>
          <span className="block text-[10px] font-semibold text-[#5B9891]">
            {roleLabel}
          </span>
        </div>

        <ChevronDown
          className={`h-3.5 w-3.5 text-stone-400 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-[#5B9891]" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 origin-top-right rounded-2xl border border-stone-200 bg-white p-2 shadow-xl shadow-black/10 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
          <div className="border-b border-stone-100 p-3">
            <p className="truncate text-sm font-extrabold text-[#111E28]">{displayName}</p>
            <p className="truncate text-xs font-medium text-stone-500">{effectiveUser?.email}</p>
            <div className="mt-2 flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#5B9891]/15 px-2 py-0.5 text-[10px] font-bold text-[#5B9891]">
                <Sparkles className="h-3 w-3" />
                {roleLabel}
              </span>
              {isVerified && (
                <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                  Verified
                </span>
              )}
            </div>
          </div>

          <div className="space-y-0.5 py-2">
            <Link
              href="/member/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-stone-700 transition-colors hover:bg-[#F7DFC7]/30 hover:text-[#5B9891]"
            >
              <User className="h-4 w-4 text-stone-400" />
              <span>View My Profile</span>
            </Link>

            <Link
              href="/member/profile/verification"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-stone-700 transition-colors hover:bg-[#F7DFC7]/30 hover:text-[#5B9891]"
            >
              <ShieldCheck className="h-4 w-4 text-stone-400" />
              <span>Identity Verification</span>
            </Link>

            <Link
              href="/member/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-stone-700 transition-colors hover:bg-[#F7DFC7]/30 hover:text-[#5B9891]"
            >
              <Settings className="h-4 w-4 text-stone-400" />
              <span>Account Settings</span>
            </Link>
          </div>

          <div className="border-t border-stone-100 pt-1">
            <button
              type="button"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-rose-600 transition-colors hover:bg-rose-50 disabled:opacity-50"
            >
              <LogOut className="h-4 w-4 text-rose-500" />
              <span>{isSigningOut ? "Signing out..." : "Sign Out"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}