import React from "react";
import type { Metadata } from "next";
import { MemberOrdersView } from "@/features/member/components/member-orders-view";

export const metadata: Metadata = {
  title: "My Orders & Reviews | BDSisters",
  description: "Track your marketplace orders and review sister-owned products.",
  robots: { index: false, follow: false },
};

export default function MemberOrdersPage() {
  return <MemberOrdersView />;
}