import { Metadata } from "next";
import { notFound } from "next/navigation";
import { DEMO_RESOURCES } from "@/features/admin/resources/data/mock-resources";
import { ResourceDetailView } from "@/features/admin/resources/components/list/resource-detail-view";

interface PageProps {
  params: Promise<{ resourceId: string }>;
}

export async function generateStaticParams() {
  return DEMO_RESOURCES.map((r) => ({
    resourceId: r.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { resourceId } = await params;
  const resource = DEMO_RESOURCES.find((r) => r.id === resourceId);
  return {
    title: resource
      ? `${resource.title} | BDSisters Admin`
      : "Resource Not Found | BDSisters Admin",
    description: resource?.shortDescription || "Resource details and management view.",
  };
}

export default async function ResourceDetailPage({ params }: PageProps) {
  const { resourceId } = await params;
  const resource = DEMO_RESOURCES.find((r) => r.id === resourceId);

  if (!resource) {
    notFound();
  }

  return <ResourceDetailView resource={resource} />;
}
