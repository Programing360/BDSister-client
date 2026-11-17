import { Metadata } from "next";
import { ProfilesListView } from "@/features/admin/profiles/components/profiles-list-view";

export const metadata: Metadata = {
  title: "Member Profile Management | BDSisters Admin",
  description: "Audit, review, approve, and spotlight registered artisan and professional sister profiles.",
};

export default function AdminProfilesPage() {
  return <ProfilesListView />;
}
