import { Metadata } from "next";
import { SystemSettingsView } from "@/features/admin/system/components/system-settings-view";

export const metadata: Metadata = {
  title: "System Settings | BDSisters Admin",
  description: "Global platform parameters, maintenance mode, and registration controls.",
};

export default function AdminSystemSettingsPage() {
  return <SystemSettingsView />;
}
