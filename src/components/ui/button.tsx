import * as React from "react";
import { cn } from "@/lib/utils/cn";
import { LoadingSpinner } from "./loading-spinner";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "soft"
    | "danger"
    | "link";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active shadow-subtle hover:shadow-card focus-visible:ring-primary",
  secondary:
    "bg-surface text-foreground border border-border hover:bg-muted active:bg-border focus-visible:ring-primary",
  outline:
    "bg-transparent border border-primary text-primary hover:bg-primary-soft active:bg-border focus-visible:ring-primary",
  ghost:
    "bg-transparent text-text-secondary hover:bg-surface hover:text-foreground focus-visible:ring-primary",
  soft:
    "bg-primary-soft text-primary hover:bg-border active:bg-primary-soft focus-visible:ring-primary",
  danger:
    "bg-danger text-danger-foreground hover:bg-red-600 active:bg-red-700 focus-visible:ring-danger",
  link:
    "bg-transparent text-primary hover:underline underline-offset-4 p-0 h-auto focus-visible:ring-primary",
};

const sizeStyles: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "h-8 px-3 text-xs gap-1.5 rounded-md",
  md: "h-10 px-4 text-sm gap-2 rounded-lg",
  lg: "h-12 px-6 text-base gap-2.5 rounded-xl",
  icon: "h-10 w-10 p-0 rounded-lg justify-center",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      type = "button",
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-smooth select-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:pointer-events-none disabled:shadow-none",
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <LoadingSpinner size="sm" className="shrink-0" />
            <span className="sr-only">Loading</span>
            {size !== "icon" && children}
          </>
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";
