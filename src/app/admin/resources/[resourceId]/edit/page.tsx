import { Metadata } from "next";
import { notFound } from "next/navigation";
import { DEMO_RESOURCES } from "@/features/admin/resources/data/mock-resources";
import { ResourceForm } from "@/features/admin/resources/components/form/resource-form";

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
      ? `Edit: ${resource.title} | BDSisters Admin`
      : "Edit Resource | BDSisters Admin",
    description: "Modify resource content, tags, visibility, and metadata.",
  };
}

export default async function EditResourcePage({ params }: PageProps) {
  const { resourceId } = await params;
  const resource = DEMO_RESOURCES.find((r) => r.id === resourceId);

  if (!resource) {
    notFound();
  }

  return <ResourceForm initialData={resource} isEdit={true} />;
}
