import React from "react";

export default function MemberDashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse pb-10">
      {/* Banner Skeleton */}
      <div className="h-48 w-full rounded-3xl border border-gray-200/80 bg-white/60 p-8 shadow-lg shadow-[#5B46F6]/5" />

      {/* Two Column Grid Skeleton */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
        <div className="h-64 rounded-2xl border border-gray-200/80 bg-white/60 p-6 shadow-lg shadow-[#5B46F6]/5" />
        <div className="h-64 rounded-2xl border border-gray-200/80 bg-white/60 p-6 shadow-lg shadow-[#5B46F6]/5" />
      </div>

      {/* Quick Access Grid Skeleton */}
      <div className="space-y-4">
        <div className="h-6 w-40 rounded-lg bg-gray-200/60" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-40 rounded-2xl border border-gray-200/80 bg-white/60 p-5 shadow-lg shadow-[#5B46F6]/5"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
