import { Metadata } from "next";
import { TwoFactorSettingsView } from "@/features/admin/security/components/two-factor-settings-view";

export const metadata: Metadata = {
  title: "Two-Factor Authentication Settings | BDSisters Admin",
  description: "Configure multi-factor authentication requirements and session timeouts.",
};

export default function TwoFactorPage() {
  return <TwoFactorSettingsView />;
}
