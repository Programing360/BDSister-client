import { Metadata } from "next";
import { ResourcesOverviewView } from "@/features/admin/resources/components/overview/resources-overview-view";

export const metadata: Metadata = {
  title: "Resource Library & Learning Management | BDSisters Admin",
  description:
    "Executive learning management suite, educational resources, guides, videos, LMS courses, and member knowledge base.",
};

export default function AdminResourcesPage() {
  return <ResourcesOverviewView />;
}
