"use client";

import { cn } from "@/lib/utils/cn";

interface ErrorDisplayProps {
  title?: string;
  message: string;
  retry?: () => void;
  className?: string;
}

export function ErrorDisplay({
  title = "Something went wrong",
  message,
  retry,
  className,
}: ErrorDisplayProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-6 text-center",
        className,
      )}
    >
      <div className="space-y-1">
        <h3 className="font-semibold text-red-900">{title}</h3>
        <p className="text-sm text-red-700">{message}</p>
      </div>
      {retry && (
        <button
          type="button"
          onClick={retry}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
