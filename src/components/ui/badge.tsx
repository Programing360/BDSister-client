import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | "default"
    | "primary"
    | "soft"
    | "subtle"
    | "neutral"
    | "success"
    | "warning"
    | "danger"
    | "outline";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
}

const badgeVariants: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "bg-muted text-text-secondary border border-border",
  neutral: "bg-surface text-text-secondary border border-border",
  primary: "bg-primary text-white border-transparent",
  soft: "bg-primary-soft text-primary border border-borderSubtle",
  subtle: "bg-primary/10 text-primary border border-primary/20",
  success: "bg-success-soft text-emerald-800 border border-emerald-200",
  warning: "bg-warning-soft text-amber-800 border border-amber-200",
  danger: "bg-danger-soft text-rose-800 border border-rose-200",
  outline: "bg-transparent text-text-primary border border-border",
};

const badgeSizes: Record<NonNullable<BadgeProps["size"]>, string> = {
  sm: "px-2 py-0.5 text-xs font-medium rounded-md gap-1",
  md: "px-2.5 py-1 text-xs font-semibold rounded-lg gap-1.5",
  lg: "px-3 py-1.5 text-sm font-semibold rounded-xl gap-2",
};

export function Badge({
  className,
  variant = "default",
  size = "md",
  icon,
  children,
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center font-medium leading-none select-none transition-smooth",
        badgeVariants[variant],
        badgeSizes[size],
        className,
      )}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </div>
  );
}
