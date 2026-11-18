import React from "react";
import { BulkEmailCreateView } from "@/features/admin/communication/components/bulk-email/bulk-email-create-view";

export const metadata = {
  title: "Create Bulk Email Campaign | BDSisters Admin",
  description: "Compose and simulate bulk email campaign blast"
};

export default function CreateBulkEmailPage() {
  return <BulkEmailCreateView />;
}
