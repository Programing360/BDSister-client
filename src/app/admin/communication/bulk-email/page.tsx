import React from "react";
import { BulkEmailListView } from "@/features/admin/communication/components/bulk-email/bulk-email-list-view";

export const metadata = {
  title: "Bulk Email Campaigns | BDSisters Admin",
  description: "Execute and manage targeted bulk email campaigns"
};

export default function BulkEmailPage() {
  return <BulkEmailListView />;
}
