import { Metadata } from "next";
import { SystemSettingsView } from "@/features/admin/system/components/system-settings-view";

export const metadata: Metadata = {
  title: "Platform Settings | BDSisters Admin",
  description: "Global platform configuration, operational defaults, and maintenance controls.",
};

export default function AdminSettingsOverviewPage() {
  return <SystemSettingsView />;
}
