import React from "react";
import { CheckSquare, Download, UserX, Crown, X } from "lucide-react";

interface MemberBulkToolbarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBulkExport: () => void;
  onBulkSuspend: () => void;
  onBulkMembership: () => void;
}

export function MemberBulkToolbar({
  selectedCount,
  onClearSelection,
  onBulkExport,
  onBulkSuspend,
  onBulkMembership,
}: MemberBulkToolbarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-purple-200 bg-purple-50/90 p-3 shadow-xs animate-in fade-in slide-in-from-top-2">
      <div className="flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#5B46F6] text-white">
          <CheckSquare className="h-3.5 w-3.5" />
        </div>
        <span className="text-xs font-bold text-gray-900">
          {selectedCount} {selectedCount === 1 ? "member" : "members"} selected
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onBulkExport}
          className="inline-flex items-center gap-1.5 rounded-lg border border-purple-200 bg-white px-2.5 py-1 text-xs font-semibold text-gray-700 hover:border-[#5B46F6] transition shadow-2xs"
        >
          <Download className="h-3.5 w-3.5 text-gray-500" />
          <span>Export Selected</span>
        </button>

        <button
          type="button"
          onClick={onBulkMembership}
          className="inline-flex items-center gap-1.5 rounded-lg border border-purple-200 bg-white px-2.5 py-1 text-xs font-semibold text-gray-700 hover:border-[#5B46F6] transition shadow-2xs"
        >
          <Crown className="h-3.5 w-3.5 text-amber-500" />
          <span>Change Tier</span>
        </button>

        <button
          type="button"
          onClick={onBulkSuspend}
          className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition shadow-2xs"
        >
          <UserX className="h-3.5 w-3.5" />
          <span>Suspend Selected</span>
        </button>

        <button
          type="button"
          onClick={onClearSelection}
          className="rounded-lg p-1 text-gray-400 hover:bg-purple-100 hover:text-gray-700 transition"
          title="Clear selection"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
