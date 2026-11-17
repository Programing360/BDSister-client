"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertCircle, RefreshCw, ShoppingCart, HelpCircle } from "lucide-react";

function FailedContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason") || searchParams.get("msg") || "Payment was rejected or could not be completed by the provider.";

  return (
    <div className="mx-auto max-w-xl rounded-3xl border border-red-200/80 bg-white p-8 text-center shadow-xl sm:p-10">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 shadow-md">
        <AlertCircle className="h-10 w-10" />
      </div>

      <span className="mt-4 inline-block rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700 border border-red-200">
        Payment Failed
      </span>

      <h1 className="mt-3 text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">
        We Couldn&apos;t Process Your Payment
      </h1>

      <p className="mt-3 text-sm text-gray-600">
        Your payment attempt was unsuccessful. No funds were debited, or if an amount was withheld, it will automatically reverse back to your original payment channel.
      </p>

      {reason && (
        <div className="mt-4 rounded-xl border border-red-100 bg-red-50/50 p-3 text-xs text-red-800">
          <span className="font-semibold">Reason:</span> {reason}
        </div>
      )}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
        <Link
          href="/checkout"
          className="flex items-center justify-center gap-2 rounded-xl bg-[#5B46F6] px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-[#4a36e2]"
        >
          <RefreshCw className="h-4 w-4" /> Try Again
        </Link>
        <Link
          href="/cart"
          className="flex items-center justify-center gap-2 rounded-xl border border-gray-200/80 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
        >
          <ShoppingCart className="h-4 w-4" /> Return to Cart
        </Link>
      </div>

      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
        <HelpCircle className="h-4 w-4" />
        <span>Need help? Contact support@bdsisters.org or our hotline.</span>
      </div>
    </div>
  );
}

export default function CheckoutFailedPage() {
  return (
    <div className="min-h-screen bg-slate-50/60 pb-20 pt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<div className="text-center py-12 text-sm text-gray-500">Loading...</div>}>
          <FailedContent />
        </Suspense>
      </div>
    </div>
  );
}
