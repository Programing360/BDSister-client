import { Metadata } from "next";
import { AdminOverviewView } from "@/features/admin/components";

export const metadata: Metadata = {
  title: "Dashboard Overview | BDSisters Administration",
  description: "Executive statistics, platform KPIs, community growth, and transaction monitoring.",
};

export const dynamic = "force-dynamic";

export default function AdminDashboardPage() {
  return <AdminOverviewView />;
}
