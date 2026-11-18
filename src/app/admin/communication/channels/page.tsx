import React from "react";
import { ChannelsOverviewView } from "@/features/admin/communication/components/channels/channels-overview-view";

export const metadata = {
  title: "Communication Channels | BDSisters Admin",
  description: "Monitor and configure omnichannel messaging gateways"
};

export default function ChannelsPage() {
  return <ChannelsOverviewView />;
}
