import React from "react";
import { ComplaintsListView } from "@/features/admin/communication/components/support/complaints-list-view";

export const metadata = {
  title: "Formal Member Complaints | BDSisters Admin",
  description: "Investigate and resolve marketplace disputes and user complaints"
};

export default function ComplaintsPage() {
  return <ComplaintsListView />;
}
