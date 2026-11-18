import React from "react";
import { CampaignsListView } from "@/features/admin/communication/components/newsletter/campaigns-list-view";

export const metadata = {
  title: "Newsletter Campaigns | BDSisters Admin",
  description: "View and create broadcast newsletter campaigns"
};

export default function CampaignsPage() {
  return <CampaignsListView />;
}
