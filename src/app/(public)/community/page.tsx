import React from "react";
import type { Metadata } from "next";
import { PublicCommunityView } from "@/features/public/community/components/public-community-view";

export const metadata: Metadata = {
  title: "Sisterhood Community Forum | BDSisters",
  description:
    "Join safe, moderated discussions with verified Bangladeshi Muslim women across faith, family, career, and business.",
};

export default function CommunityPage() {
  return <PublicCommunityView />;
}