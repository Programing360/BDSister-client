"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-white p-4">
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">Critical Error</h1>
          <p className="mb-4 text-gray-600">
            A critical application error occurred. Please refresh the page.
          </p>
          <button
            type="button"
            onClick={reset}
            className="rounded-md bg-gray-900 px-6 py-2 text-white hover:bg-gray-700"
          >
            Refresh
          </button>
        </div>
      </body>
    </html>
  );
}
