import { Metadata } from "next";
import { SecurityDashboardView } from "@/features/admin/security/components/security-dashboard-view";

export const metadata: Metadata = {
  title: "Security & Access Controls | BDSisters Admin",
  description: "Security posture overview, 2FA compliance, and active admin sessions.",
};

export default function SecurityOverviewPage() {
  return <SecurityDashboardView />;
}
