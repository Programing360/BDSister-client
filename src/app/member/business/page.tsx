import React from "react";
import type { Metadata } from "next";
import { MemberBusinessView } from "@/features/member/components/member-business-view";

export const metadata: Metadata = {
  title: "My Business & Brands | BDSisters",
  description: "Manage your sisterhood business profile, brand roles, and publishing subscription.",
  robots: { index: false, follow: false },
};

export default function MemberBusinessPage() {
  return <MemberBusinessView />;
}