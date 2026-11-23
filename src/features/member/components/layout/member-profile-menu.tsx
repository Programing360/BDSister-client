"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { User, Settings, ShieldCheck, LogOut, ChevronDown, Sparkles } from "lucide-react";
import type { AuthUser } from "@/types/auth";
import { authService } from "@/lib/services/auth-service";

interface MemberProfileMenuProps {
  user: AuthUser;
}

export function MemberProfileMenu({ user }: MemberProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  const displayName =
    (user as unknown as { fullName?: string }).fullName || user.name || "Sister Member";
  const avatarUrl =
    (user as unknown as { profilePicture?: string }).profilePicture || user.image;
  const isVerified = Boolean(
    (user as unknown as { isEmailVerified?: boolean }).isEmailVerified || user.emailVerified
  );

  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "BD";

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="flex items-center gap-2.5 rounded-full border border-gray-200/80 bg-white p-1.5 pr-3 shadow-md shadow-[#5B46F6]/5 transition-all hover:border-[#5B46F6]/40 hover:shadow-lg active:scale-98"
      >
        <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-[#5B46F6] text-xs font-black text-white shadow-sm">
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
          <span className="block max-w-[130px] truncate text-xs font-bold text-gray-900">
            {displayName}
          </span>
          <span className="block text-[10px] font-semibold text-[#5B46F6]">
            Sisterhood Member
          </span>
        </div>

        <ChevronDown
          className={`h-3.5 w-3.5 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180 text-[#5B46F6]" : ""
            }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 origin-top-right rounded-2xl border border-gray-200/80 bg-white p-2 shadow-xl shadow-black/10 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
          <div className="border-b border-gray-100 p-3">
            <p className="truncate text-sm font-extrabold text-gray-900">{displayName}</p>
            <p className="truncate text-xs font-medium text-gray-500">{user.email}</p>
            <div className="mt-2 flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#5B46F6]/10 px-2 py-0.5 text-[10px] font-bold text-[#5B46F6]">
                <Sparkles className="h-3 w-3" />
                Active Member
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
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-gray-700 transition-colors hover:bg-[#5B46F6]/5 hover:text-[#5B46F6]"
            >
              <User className="h-4 w-4 text-gray-400" />
              <span>View My Profile</span>
            </Link>

            <Link
              href="/member/profile/verification"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-gray-700 transition-colors hover:bg-[#5B46F6]/5 hover:text-[#5B46F6]"
            >
              <ShieldCheck className="h-4 w-4 text-gray-400" />
              <span>Identity Verification</span>
            </Link>

            <Link
              href="/member/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-gray-700 transition-colors hover:bg-[#5B46F6]/5 hover:text-[#5B46F6]"
            >
              <Settings className="h-4 w-4 text-gray-400" />
              <span>Account Settings</span>
            </Link>
          </div>

          <div className="border-t border-gray-100 pt-1">
            <button
              type="button"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
            >
              <LogOut className="h-4 w-4 text-red-500" />
              <span>{isSigningOut ? "Signing out..." : "Sign Out"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}