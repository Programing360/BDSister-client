import { Metadata } from "next";
import { FeaturedResourcesView } from "@/features/admin/resources/components/featured/featured-resources-view";

export const metadata: Metadata = {
  title: "Featured Resources & Spotlights | BDSisters Admin",
  description:
    "Curate homepage learning highlights, trending articles, and top featured LMS programs.",
};

export default function AdminFeaturedResourcesPage() {
  return <FeaturedResourcesView />;
}
