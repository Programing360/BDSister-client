import { Metadata } from "next";
import { AllResourcesView } from "@/features/admin/resources/components/list/all-resources-view";

export const metadata: Metadata = {
  title: "All Resources Catalogue | BDSisters Admin",
  description:
    "Explore, filter, and manage all published guides, articles, videos, templates, and courses.",
};

export default function AllResourcesPage() {
  return <AllResourcesView />;
}
