"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { XCircle, ArrowLeft, ShoppingBag } from "lucide-react";

function CancelledContent() {
  const searchParams = useSearchParams();
  const invoiceId = searchParams.get("invoice_id") || searchParams.get("invoiceId");

  return (
    <div className="mx-auto max-w-xl rounded-3xl border border-gray-200/80 bg-white p-8 text-center shadow-xl sm:p-10">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-500 shadow-md">
        <XCircle className="h-10 w-10" />
      </div>

      <span className="mt-4 inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700 border border-gray-200">
        Checkout Cancelled
      </span>

      <h1 className="mt-3 text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">
        Payment Process Cancelled
      </h1>

      <p className="mt-3 text-sm text-gray-600">
        You cancelled the payment on ZiniPay. Your cart items are saved and ready whenever you want to complete your order.
      </p>

      {invoiceId && (
        <p className="mt-2 text-xs font-mono text-gray-400">Invoice ID: {invoiceId}</p>
      )}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
        <Link
          href="/checkout"
          className="flex items-center justify-center gap-2 rounded-xl bg-[#5B46F6] px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-[#4a36e2]"
        >
          <ArrowLeft className="h-4 w-4" /> Return to Checkout
        </Link>
        <Link
          href="/marketplace"
          className="flex items-center justify-center gap-2 rounded-xl border border-gray-200/80 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
        >
          <ShoppingBag className="h-4 w-4" /> Keep Browsing
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutCancelledPage() {
  return (
    <div className="min-h-screen bg-slate-50/60 pb-20 pt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<div className="text-center py-12 text-sm text-gray-500">Loading...</div>}>
          <CancelledContent />
        </Suspense>
      </div>
    </div>
  );
}
