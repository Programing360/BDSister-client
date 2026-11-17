import React from "react";
import Link from "next/link";
import { FolderOpen } from "lucide-react";

interface AdminEmptyStateProps {
  title: string;
  message: string;
  icon?: React.ReactNode;
  actionText?: string;
  actionHref?: string;
  onActionClick?: () => void;
}

export function AdminEmptyState({
  title,
  message,
  icon,
  actionText,
  actionHref,
  onActionClick,
}: AdminEmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-[#5B46F6]">
        {icon || <FolderOpen className="h-7 w-7" />}
      </div>
      <h3 className="mt-4 text-base font-bold text-gray-900">{title}</h3>
      <p className="mt-1 text-xs text-gray-500 max-w-sm mx-auto">{message}</p>
      {actionText && (
        <div className="mt-6">
          {actionHref ? (
            <Link
              href={actionHref}
              className="inline-flex items-center gap-2 rounded-xl bg-[#5B46F6] px-4 py-2 text-xs font-bold text-white shadow transition hover:bg-[#4a36e2]"
            >
              {actionText}
            </Link>
          ) : (
            <button
              type="button"
              onClick={onActionClick}
              className="inline-flex items-center gap-2 rounded-xl bg-[#5B46F6] px-4 py-2 text-xs font-bold text-white shadow transition hover:bg-[#4a36e2]"
            >
              {actionText}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
