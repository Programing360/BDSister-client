import { Metadata } from "next";
import { ProfileCategoriesView } from "@/features/admin/profiles/components/profile-categories-view";

export const metadata: Metadata = {
  title: "Profile Categories | BDSisters Admin",
  description: "Manage professional and artisan taxonomy categories for member portfolios.",
};

export default function AdminProfileCategoriesPage() {
  return <ProfileCategoriesView />;
}
