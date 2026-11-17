import { Metadata } from "next";
import { ProfilesPublishedView } from "@/features/admin/profiles/components/profiles-published-view";

export const metadata: Metadata = {
  title: "Published Member Profiles | BDSisters Admin",
  description: "Explore all approved, publicly active sister profiles across the directory.",
};

export default function AdminProfilesPublishedPage() {
  return <ProfilesPublishedView />;
}
