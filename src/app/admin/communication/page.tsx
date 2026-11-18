import React from "react";
import { CommunicationOverviewView } from "@/features/admin/communication/components/overview/communication-overview-view";

export const metadata = {
  title: "Communication Management | BDSisters Admin",
  description: "BDSisters communication, support tickets, and notification dispatch console"
};

export default function CommunicationPage() {
  return <CommunicationOverviewView />;
}
