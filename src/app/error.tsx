"use client";

import { useEffect } from "react";
import { ErrorDisplay } from "@/components/ui/error-display";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("[App Error]", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <ErrorDisplay
          title="Application Error"
          message={error.message || "An unexpected error occurred. Please try again."}
          retry={reset}
        />
        {error.digest && (
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
