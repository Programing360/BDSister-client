"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import type { NavGroup } from "@/types/navigation";

interface DashboardSidebarProps {
  navGroups: NavGroup[];
  headerSlot?: React.ReactNode;
  footerSlot?: React.ReactNode;
  className?: string;
}

export function DashboardSidebar({
  navGroups,
  headerSlot,
  footerSlot,
  className,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex h-full w-64 flex-col border-r border-border bg-white/95 backdrop-blur-md shadow-subtle",
        className,
      )}
    >
      {headerSlot && (
        <div className="border-b border-border p-4.5">{headerSlot}</div>
      )}
      <nav className="flex-1 overflow-y-auto p-4 space-y-6">
        {navGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-1.5">
            {group.label && (
              <p className="px-2.5 text-xs font-bold uppercase tracking-wider text-text-muted">
                {group.label}
              </p>
            )}
            <ul className="space-y-1">
              {group.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/admin" &&
                    item.href !== "/member" &&
                    pathname.startsWith(item.href));

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-smooth",
                        isActive
                          ? "bg-primary-soft text-primary font-semibold shadow-subtle"
                          : "text-text-secondary hover:bg-surface hover:text-foreground",
                      )}
                    >
                      {item.icon && (
                        <item.icon
                          size={18}
                          className={cn(
                            isActive ? "text-primary" : "text-text-muted",
                          )}
                        />
                      )}
                      <span>{item.label}</span>
                      {item.badge !== undefined && (
                        <span className="ml-auto rounded-full bg-border px-2 py-0.5 text-xs font-semibold text-text-secondary">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      {footerSlot && (
        <div className="border-t border-border p-4 bg-muted/50">{footerSlot}</div>
      )}
    </aside>
  );
}
