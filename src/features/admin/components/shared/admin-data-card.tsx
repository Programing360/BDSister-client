import React from "react";

interface AdminDataCardProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function AdminDataCard({
  title,
  subtitle,
  icon,
  headerAction,
  children,
  className = "",
}: AdminDataCardProps) {
  return (
    <div
      className={`rounded-2xl border border-gray-200/80 bg-white shadow-sm transition hover:shadow-md ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 p-5 sm:px-6">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-[#5B46F6]">
              {icon}
            </div>
          )}
          <div>
            <h3 className="text-base font-bold text-gray-900">{title}</h3>
            {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
          </div>
        </div>

        {headerAction && <div className="flex items-center gap-2">{headerAction}</div>}
      </div>

      <div className="p-5 sm:p-6">{children}</div>
    </div>
  );
}
