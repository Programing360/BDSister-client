import { Metadata } from "next";
import { ProfilesRejectedView } from "@/features/admin/profiles/components/profiles-rejected-view";

export const metadata: Metadata = {
  title: "Rejected & Suspended Profiles | BDSisters Admin",
  description: "Review declined and suspended member profiles with logged moderation justifications.",
};

export default function AdminProfilesRejectedPage() {
  return <ProfilesRejectedView />;
}
