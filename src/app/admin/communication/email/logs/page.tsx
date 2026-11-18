import React from "react";
import { EmailLogsView } from "@/features/admin/communication/components/email/email-logs-view";

export const metadata = {
  title: "Email Dispatch Logs | BDSisters Admin",
  description: "Audit trail of outbound emails and delivery statuses"
};

export default function EmailLogsPage() {
  return <EmailLogsView />;
}
