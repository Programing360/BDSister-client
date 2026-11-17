import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  htmlFor?: string;
}

export function FormField({
  label,
  required,
  error,
  helperText,
  htmlFor,
  className,
  children,
  ...props
}: FormFieldProps) {
  return (
    <div className={cn("flex flex-col space-y-1.5 w-full", className)} {...props}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="text-sm font-semibold text-text-primary flex items-center gap-1 select-none"
        >
          <span>{label}</span>
          {required && (
            <span className="text-danger" title="Required field" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      {children}

      {error ? (
        <p className="text-xs font-medium text-danger animate-fade-in flex items-center gap-1">
          {error}
        </p>
      ) : helperText ? (
        <p className="text-xs text-text-muted">{helperText}</p>
      ) : null}
    </div>
  );
}
