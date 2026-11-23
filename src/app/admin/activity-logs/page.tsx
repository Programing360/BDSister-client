import { Metadata } from "next";
import { AuditLogsView } from "@/features/admin/security/components/audit-logs-view";

export const metadata: Metadata = {
  title: "Administrative Activity Logs | BDSisters Admin",
  description: "Tamper-evident trail of administrative actions, verifications, and system modifications.",
};

export default function AdminActivityLogsPage() {
  return <AuditLogsView />;
}
