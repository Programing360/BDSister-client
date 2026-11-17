import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-4 text-center">
      <div className="space-y-2">
        <h1 className="text-6xl font-bold text-gray-900">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700">Page Not Found</h2>
        <p className="text-gray-500">
          The page you are looking for does not exist or has been moved.
        </p>
      </div>
      <div className="flex gap-3">
        <Link
          href="/"
          className="rounded-md bg-gray-900 px-6 py-2 text-white transition hover:bg-gray-700"
        >
          Go Home
        </Link>
        <Link
          href="/contact"
          className="rounded-md border border-gray-300 px-6 py-2 text-gray-700 transition hover:bg-gray-50"
        >
          Contact Support
        </Link>
      </div>
    </div>
  );
}
