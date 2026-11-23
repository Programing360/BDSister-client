import React from "react";
import type { Metadata } from "next";
import { MemberCommunityView } from "@/features/member/components/member-community-view";

export const metadata: Metadata = {
  title: "Community Forums | BDSisters",
  description: "Connect and converse with verified sisters in a safe, moderated environment.",
  robots: { index: false, follow: false },
};

export default function MemberCommunityPage() {
  return <MemberCommunityView />;
}