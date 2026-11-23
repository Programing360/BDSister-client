import React from "react";
import type { Metadata } from "next";
import { MemberSellerView } from "@/features/member/components/member-seller-view";

export const metadata: Metadata = {
  title: "Seller Center — Products & Services | BDSisters",
  description: "List products and services with MRP discounts and wholesale pricing on BDSisters.",
  robots: { index: false, follow: false },
};

export default function MemberSellerPage() {
  return <MemberSellerView />;
}