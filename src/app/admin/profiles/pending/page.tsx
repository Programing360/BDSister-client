import { Metadata } from "next";
import { ProfilesPendingView } from "@/features/admin/profiles/components/profiles-pending-view";

export const metadata: Metadata = {
  title: "Pending Profile Approvals | BDSisters Admin",
  description: "Inspect member biographies, skills, certifications, and portfolio links awaiting public approval.",
};

export default function AdminProfilesPendingPage() {
  return <ProfilesPendingView />;
}
