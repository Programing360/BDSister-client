import React from "react";

interface DashboardCardProps {
  children: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

export function DashboardCard({
  children,
  className = "",
  headerAction,
  title,
  subtitle,
  icon,
}: DashboardCardProps) {
  return (
    <div
      className={`rounded-2xl border border-gray-200/80 bg-white p-6 shadow-lg shadow-[#5B46F6]/5 transition-all duration-300 hover:shadow-xl hover:shadow-[#5B46F6]/10 sm:p-7 ${className}`}
    >
      {(title || headerAction) && (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#5B46F6]/10 text-[#5B46F6]">
                {icon}
              </div>
            )}
            <div>
              {title && (
                <h3 className="text-base font-extrabold tracking-tight text-gray-900 sm:text-lg">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-xs font-medium text-gray-500 sm:text-sm">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
