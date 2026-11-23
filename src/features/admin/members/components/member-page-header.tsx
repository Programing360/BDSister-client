import React from "react";
import { RefreshCw, ShieldCheck } from "lucide-react";

interface MemberPageHeaderProps {
  onRefresh: () => void;
  isRefreshing: boolean;
}

export function MemberPageHeader({
  onRefresh,
  isRefreshing,
}: MemberPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl shadow-sm shadow-gray-400 border-[#5B9891]/20 bg-gradient-to-r from-[#F7DFC7]/45 via-white to-[#5B9891]/10 p-6 ">
      <div>
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Members & Verifications
          </h1>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#F7DFC7]/80 border border-[#D98408]/30 px-3 py-0.5 text-xs font-bold text-[#D98408]">
            <ShieldCheck className="h-3.5 w-3.5" />
            Identity & Roles
          </span>
        </div>
        <p className="mt-1 text-xs text-gray-600">
          Approve pending sister profiles, inspect private NID/Passport documents, and assign member roles.
        </p>
      </div>

      <button
        type="button"
        onClick={onRefresh}
        title="Refresh member records"
        disabled={isRefreshing}
        className="inline-flex items-center gap-2 self-start sm:self-auto rounded-xl border border-[#5B9891]/30 bg-white px-4 py-2 text-xs font-bold text-[#5B9891] shadow-2xs hover:bg-[#5B9891] hover:text-white transition disabled:opacity-50"
      >
        <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
        <span>Refresh List</span>
      </button>
    </div>
  );
}