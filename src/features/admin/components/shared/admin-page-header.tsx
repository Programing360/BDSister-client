import React from "react";

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  badge?: string;
  actionSlot?: React.ReactNode;
}

export function AdminPageHeader({
  title,
  description,
  badge,
  actionSlot,
}: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6">
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl font-black tracking-tight text-[#111827] sm:text-3xl">
            {title}
          </h1>
          {badge && (
            <span className="rounded-full bg-purple-100 border border-purple-200/80 px-2.5 py-0.5 text-xs font-bold text-[#5B46F6]">
              {badge}
            </span>
          )}
        </div>
        {description && (
          <p className="mt-1 text-xs sm:text-sm text-[#4B5563]">
            {description}
          </p>
        )}
      </div>

      {actionSlot && <div className="flex items-center gap-2.5 shrink-0">{actionSlot}</div>}
    </div>
  );
}
