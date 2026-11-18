import React from "react";
import { Metadata } from "next";
import { ReportsListView } from "@/features/admin/community/components/reports/reports-list-view";

export const metadata: Metadata = {
  title: "Content Reports & Grievances | BDSisters Admin",
  description: "Investigate and resolve user-submitted content reports and community grievances.",
};

export default function ReportsPage() {
  return <ReportsListView />;
}
