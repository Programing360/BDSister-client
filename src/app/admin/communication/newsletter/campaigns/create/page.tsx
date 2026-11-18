import React from "react";
import { CreateCampaignView } from "@/features/admin/communication/components/newsletter/create-campaign-view";

export const metadata = {
  title: "Create Newsletter Campaign | BDSisters Admin",
  description: "Compose and dispatch a newsletter broadcast"
};

export default function CreateCampaignPage() {
  return <CreateCampaignView />;
}
