import { Suspense } from "react";
import { Metadata } from "next";
import { CheckoutView } from "@/features/ecommerce/components/checkout-view";

export const metadata: Metadata = {
  title: "Checkout | BDSisters.org",
  description: "Secure online checkout via ZiniPay for BDSisters.org.",
};

export const dynamic = "force-dynamic";

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-slate-50/60 pb-20 pt-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Suspense
          fallback={
            <div className="p-12 text-center text-sm text-stone-500">
              Loading checkout...
            </div>
          }
        >
          <CheckoutView />
        </Suspense>
      </div>
    </div>
  );
}
