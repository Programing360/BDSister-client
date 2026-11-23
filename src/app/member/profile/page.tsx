import React from "react";
import type { Metadata } from "next";
import { MemberProfileBuilderView } from "@/features/member/components/member-profile-builder-view";

export const metadata: Metadata = {
  title: "My Profile | BDSisters",
  description: "View and manage your BDSisters professional profile, portfolio, and sisterhood presence.",
};

export default async function MemberProfilePage() {
  return <MemberProfileBuilderView />;
}
