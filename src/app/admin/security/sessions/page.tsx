import { Metadata } from "next";
import { SessionManagementView } from "@/features/admin/security/components/session-management-view";

export const metadata: Metadata = {
  title: "Active Sessions | BDSisters Admin",
  description: "Manage privileged administrative sessions and active devices.",
};

export default function SessionsPage() {
  return <SessionManagementView />;
}
