import React from "react";
import { CampaignDetailView } from "@/features/admin/communication/components/newsletter/campaign-detail-view";
import { DEMO_NEWSLETTER_CAMPAIGNS } from "@/features/admin/communication/data/mock-communication";

export const metadata = {
  title: "Campaign Report & Details | BDSisters Admin",
  description: "View newsletter broadcast metrics and delivery analytics"
};

export async function generateStaticParams() {
  return DEMO_NEWSLETTER_CAMPAIGNS.map((campaign) => ({
    campaignId: campaign.id
  }));
}

interface PageProps {
  params: Promise<{ campaignId: string }>;
}

export default async function CampaignDetailPage({ params }: PageProps) {
  const { campaignId } = await params;
  return <CampaignDetailView campaignId={campaignId} />;
}
