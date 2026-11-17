import React from "react";
import Link from "next/link";
import { Store, ArrowRight, Sparkles } from "lucide-react";
import { DashboardCard } from "../shared/dashboard-card";

export function BusinessOverviewCard() {
  return (
    <DashboardCard
      title="Women Entrepreneurs Hub"
      subtitle="Showcase your brand and products across Bangladesh"
      icon={<Store className="h-5 w-5" />}
    >
      <div className="relative overflow-hidden rounded-2xl border border-[#5B46F6]/20 bg-gradient-to-br from-[#5B46F6]/5 via-white to-purple-50/40 p-6 text-center sm:p-7">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#5B46F6] text-white shadow-md shadow-[#5B46F6]/25">
          <Store className="h-6 w-6" />
        </div>

        <div className="mt-3.5 inline-flex items-center gap-1 rounded-full bg-[#5B46F6]/10 px-3 py-1 text-[11px] font-bold text-[#5B46F6]">
          <Sparkles className="h-3 w-3" />
          <span>Empower Your Brand</span>
        </div>

        <h4 className="mt-2 text-base font-extrabold text-gray-900">
          Have a Business or Boutique?
        </h4>

        <p className="mx-auto mt-1.5 max-w-md text-xs leading-relaxed text-gray-600 sm:text-sm">
          Register your women-led business profile to receive verified vendor status, create digital shop listings, and access bulk B2B sister buyers.
        </p>

        <div className="mt-5">
          <Link
            href="/member/business/create"
            className="inline-flex items-center gap-2 rounded-xl bg-[#5B46F6] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-[#5B46F6]/25 transition-all hover:bg-[#4d3ad8] hover:shadow-lg active:scale-98"
          >
            <span>Register Your Business</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </DashboardCard>
  );
}
