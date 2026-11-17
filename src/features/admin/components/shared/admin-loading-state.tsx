import React from "react";
import { Loader2 } from "lucide-react";

export function AdminLoadingState({ label = "Loading administrative data..." }: { label?: string }) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center gap-3">
      <Loader2 className="h-8 w-8 animate-spin text-[#5B46F6]" />
      <p className="text-xs font-semibold text-gray-500">{label}</p>
    </div>
  );
}

export function AdminKpiSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div
          key={i}
          className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm animate-pulse space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="h-4 w-28 bg-gray-200 rounded" />
            <div className="h-9 w-9 bg-gray-200 rounded-xl" />
          </div>
          <div className="h-8 w-32 bg-gray-200 rounded" />
          <div className="h-3 w-40 bg-gray-100 rounded" />
        </div>
      ))}
    </div>
  );
}
