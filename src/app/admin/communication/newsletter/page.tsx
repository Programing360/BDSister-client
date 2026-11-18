import React from "react";
import { NewsletterOverviewView } from "@/features/admin/communication/components/newsletter/newsletter-overview-view";

export const metadata = {
  title: "Newsletter & Campaigns | BDSisters Admin",
  description: "Manage newsletter subscriber lists and broadcast campaigns"
};

export default function NewsletterPage() {
  return <NewsletterOverviewView />;
}
