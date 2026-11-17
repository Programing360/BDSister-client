import React from "react";

export type AdminBadgeVariant =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "primary"
  | "neutral";

interface AdminStatusBadgeProps {
  label: string;
  variant?: AdminBadgeVariant;
  size?: "sm" | "md";
  dot?: boolean;
}

const VARIANT_STYLES: Record<AdminBadgeVariant, { bg: string; text: string; border: string; dotColor: string }> = {
  success: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dotColor: "bg-emerald-500",
  },
  warning: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dotColor: "bg-amber-500",
  },
  danger: {
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-200",
    dotColor: "bg-rose-500",
  },
  info: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    dotColor: "bg-blue-500",
  },
  primary: {
    bg: "bg-purple-50",
    text: "text-[#5B46F6]",
    border: "border-purple-200",
    dotColor: "bg-[#5B46F6]",
  },
  neutral: {
    bg: "bg-gray-50",
    text: "text-gray-700",
    border: "border-gray-200",
    dotColor: "bg-gray-400",
  },
};

export function AdminStatusBadge({
  label,
  variant = "neutral",
  size = "sm",
  dot = false,
}: AdminStatusBadgeProps) {
  const styles = VARIANT_STYLES[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg border font-bold uppercase tracking-wider ${
        styles.bg
      } ${styles.text} ${styles.border} ${
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs"
      }`}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${styles.dotColor}`} />}
      <span>{label}</span>
    </span>
  );
}
