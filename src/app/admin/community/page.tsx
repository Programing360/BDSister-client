import React from "react";
import { Metadata } from "next";
import { CommunityOverviewView } from "@/features/admin/community/components/overview/community-overview-view";

export const metadata: Metadata = {
  title: "Community Management Overview | BDSisters Admin",
  description: "Monitor forum health, sisterhood discussions, moderation queues, and member contributions.",
};

export default function CommunityOverviewPage() {
  return <CommunityOverviewView />;
}
