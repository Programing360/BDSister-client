import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  spacing?: "none" | "sm" | "md" | "lg" | "xl";
}

const spacingClasses = {
  none: "py-0",
  sm: "py-6 sm:py-8",
  md: "py-10 sm:py-14",
  lg: "py-16 sm:py-24",
  xl: "py-20 sm:py-32",
} as const;

export function Section({
  spacing = "md",
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn("w-full relative", spacingClasses[spacing], className)}
      {...props}
    >
      {children}
    </section>
  );
}
