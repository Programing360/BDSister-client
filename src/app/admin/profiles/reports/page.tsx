import { Metadata } from "next";
import { ProfileReportsView } from "@/features/admin/profiles/components/profile-reports-view";

export const metadata: Metadata = {
  title: "Profile Reports & Moderation | BDSisters Admin",
  description: "Investigate member profile safety reports, misleading details, copyright flags, and spam.",
};

export default function AdminProfileReportsPage() {
  return <ProfileReportsView />;
}
