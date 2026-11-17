import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionHref,
  actionLabel,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-2xl border border-gray-200/80 bg-gray-50/50 p-8 text-center sm:p-10 ${className}`}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-gray-400 shadow-md shadow-gray-200/50">
        {icon}
      </div>
      <h4 className="mt-4 text-sm font-bold text-gray-900 sm:text-base">
        {title}
      </h4>
      <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-gray-500 sm:text-sm">
        {description}
      </p>
      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="mt-5 inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-[#5B46F6] shadow-sm transition-all hover:border-[#5B46F6]/40 hover:bg-[#5B46F6]/5 active:scale-95"
        >
          <span>{actionLabel}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}
