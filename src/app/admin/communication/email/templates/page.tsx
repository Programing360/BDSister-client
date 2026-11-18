import React from "react";
import { EmailTemplatesListView } from "@/features/admin/communication/components/email/email-templates-list-view";

export const metadata = {
  title: "Email Templates | BDSisters Admin",
  description: "Browse and manage system transactional email templates"
};

export default function EmailTemplatesPage() {
  return <EmailTemplatesListView />;
}
