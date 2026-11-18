import { Metadata } from "next";
import { ApprovalsListView } from "@/features/admin/resources/components/approvals/approvals-list-view";

export const metadata: Metadata = {
  title: "Editorial Reviews & Approvals | BDSisters Admin",
  description:
    "Moderate and review mentor and partner submitted guides, articles, and educational materials.",
};

export default function AdminApprovalsPage() {
  return <ApprovalsListView />;
}
