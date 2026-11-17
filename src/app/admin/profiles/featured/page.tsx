import { Metadata } from "next";
import { FeaturedProfilesView } from "@/features/admin/profiles/components/featured-profiles-view";

export const metadata: Metadata = {
  title: "Featured Profiles | BDSisters Admin",
  description: "Manage inspirational featured sister profiles spotlighted on homepage banners.",
};

export default function AdminFeaturedProfilesPage() {
  return <FeaturedProfilesView />;
}
