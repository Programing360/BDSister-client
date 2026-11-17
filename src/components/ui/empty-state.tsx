import * as React from "react";
import { cn } from "@/lib/utils/cn";
import { Button } from "./button";

interface EmptyStateAction {
  label: string;
  onClick: () => void;
}

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode | EmptyStateAction;
  className?: string;
  icon?: React.ReactNode | React.ComponentType<{ className?: string }>;
}

export function EmptyState({
  title,
  description,
  action,
  className,
  icon: IconProp,
}: EmptyStateProps) {
  let renderedIcon: React.ReactNode = null;
  if (IconProp) {
    if (typeof IconProp === "function") {
      const Component = IconProp as React.ComponentType<{ className?: string }>;
      renderedIcon = <Component className="h-10 w-10 text-neutral" />;
    } else {
      renderedIcon = IconProp;
    }
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-16 text-center rounded-2xl border border-border bg-surface/50 p-8",
        className,
      )}
    >
      {renderedIcon && (
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface border border-border text-neutral mb-1">
          {renderedIcon}
        </div>
      )}
      <div className="space-y-1 max-w-sm">
        <h3 className="text-base font-bold text-text-primary">{title}</h3>
        {description && (
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {action && (
        <div className="pt-2">
          {React.isValidElement(action) ? (
            action
          ) : typeof action === "object" && "label" in action ? (
            <Button
              variant="outline"
              size="sm"
              onClick={(action as EmptyStateAction).onClick}
            >
              {(action as EmptyStateAction).label}
            </Button>
          ) : null}
        </div>
      )}
    </div>
  );
}
