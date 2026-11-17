import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, Calendar as CalendarIcon, UserCheck } from "lucide-react";
import type { AuthUser } from "@/types/auth";

interface WelcomeBannerProps {
  user: AuthUser;
}

export function WelcomeBanner({ user }: WelcomeBannerProps) {
  const today = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  const firstName = user.name ? user.name.split(" ")[0] : "Sister";

  return (
    <div className="relative overflow-hidden rounded-3xl border border-gray-200/80 bg-white p-6 shadow-xl shadow-[#5B46F6]/5 sm:p-8 lg:p-10">
      {/* Decorative Brand Gradient Glows */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#5B46F6]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-[#7366F7]/10 blur-3xl" />

      <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
        {/* Left Column: Greeting & Info */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#5B46F6]/20 bg-[#5B46F6]/10 px-3 py-1 text-xs font-extrabold text-[#5B46F6]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>BDSisters Member</span>
            </span>

            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
              <CalendarIcon className="h-3.5 w-3.5 text-gray-400" />
              <span>{today}</span>
            </div>

            {user.emailVerified && (
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                <ShieldCheck className="h-3 w-3" />
                Email Verified
              </span>
            )}
          </div>

          <h1 className="text-2xl font-black tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
            Welcome back, <span className="text-[#5B46F6]">{firstName}!</span>
          </h1>

          <p className="max-w-2xl text-xs font-medium leading-relaxed text-gray-600 sm:text-sm">
            Your centralized member workspace to connect with fellow Bangladeshi women leaders, expand your business, explore sisterhood courses, and participate in community discussions.
          </p>
        </div>

        {/* Right Column: Quick CTA Buttons */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link
            href="/member/profile"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200/80 bg-white px-5 py-3 text-xs font-bold text-gray-800 shadow-sm transition-all hover:border-[#5B46F6]/40 hover:bg-gray-50 hover:text-[#5B46F6] active:scale-98"
          >
            <UserCheck className="h-4 w-4 text-[#5B46F6]" />
            <span>My Profile</span>
          </Link>

          <Link
            href="/member/community"
            className="inline-flex items-center gap-2 rounded-xl bg-[#5B46F6] px-5 py-3 text-xs font-bold text-white shadow-lg shadow-[#5B46F6]/25 transition-all hover:bg-[#4d3ad8] hover:shadow-xl hover:shadow-[#5B46F6]/30 active:scale-98"
          >
            <span>Explore Community</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
