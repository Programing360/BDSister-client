import React from "react";
import type { Metadata } from "next";
import { MemberBillingView } from "@/features/member/components/member-billing-view";

export const metadata: Metadata = {
    title: "Billing & Invoices | BDSisters",
    description: "View your ZiniPay membership and business publishing payment receipts.",
    robots: { index: false, follow: false },
};

export default function MemberBillingPage() {
    return <MemberBillingView />;
}