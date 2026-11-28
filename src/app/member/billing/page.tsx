import React, { Suspense } from "react";
import type { Metadata } from "next";
import { MemberBillingView } from "@/features/member/components/member-billing-view";

export const metadata: Metadata = {
    title: "Billing & Invoices | BDSisters",
    description: "View your ZiniPay membership and business publishing payment receipts.",
    robots: { index: false, follow: false },
};

export default function MemberBillingPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-xs text-gray-500">Loading billing details...</div>}>
            <MemberBillingView />
        </Suspense>
    );
}