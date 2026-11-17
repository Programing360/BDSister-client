import * as React from "react";
import { cn } from "@/lib/utils/cn";
import { Breadcrumb, type BreadcrumbItem } from "./breadcrumb";

export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  accentTitle?: boolean;
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
  accentTitle = false,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 pb-6 border-b border-border sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
      {...props}
    >
      <div className="space-y-1.5">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumb items={breadcrumbs} className="mb-2" />
        )}
        <h1
          className={cn(
            "text-h2 font-bold tracking-tight text-foreground",
            accentTitle && "text-heading-accent",
          )}
        >
          {title}
        </h1>
        {description && (
          <p className="text-sm text-text-secondary max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-3 shrink-0 pt-2 sm:pt-0">
          {actions}
        </div>
      )}
    </div>
  );
}
