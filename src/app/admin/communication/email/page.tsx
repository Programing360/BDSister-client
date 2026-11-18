import React from "react";
import { EmailOverviewView } from "@/features/admin/communication/components/email/email-overview-view";

export const metadata = {
  title: "Email System Management | BDSisters Admin",
  description: "Monitor outbound email templates and delivery logs"
};

export default function EmailPage() {
  return <EmailOverviewView />;
}
