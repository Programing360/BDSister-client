import { Metadata } from "next";
import { TwoFactorSettingsView } from "@/features/admin/security/components/two-factor-settings-view";

export const metadata: Metadata = {
  title: "Security Settings | BDSisters Admin",
  description: "Configure multi-factor authentication, staff password policies, and session timeouts.",
};

export default function SecuritySettingsPage() {
  return <TwoFactorSettingsView />;
}
