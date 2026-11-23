import { Metadata } from "next";
import { LoginHistoryView } from "@/features/admin/security/components/login-history-view";

export const metadata: Metadata = {
  title: "Login History | BDSisters Admin",
  description: "Administrative login history and intrusion attempt audits.",
};

export default function LoginHistoryPage() {
  return <LoginHistoryView />;
}
