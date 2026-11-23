import { Metadata } from "next";
import { AuditLogsView } from "@/features/admin/security/components/audit-logs-view";

export const metadata: Metadata = {
  title: "Audit & Activity Logs | BDSisters Admin",
  description: "Tamper-evident log of administrative actions, verifications, and system modifications.",
};

export default function AuditLogsPage() {
  return <AuditLogsView />;
}
