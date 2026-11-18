import React from "react";
import { Metadata } from "next";
import { CommunitySettingsView } from "@/features/admin/community/components/settings/community-settings-view";

export const metadata: Metadata = {
  title: "Community Settings | BDSisters Admin",
  description: "Configure forum permissions, moderation rules, and community guidelines.",
};

export default function CommunitySettingsPage() {
  return <CommunitySettingsView />;
}
