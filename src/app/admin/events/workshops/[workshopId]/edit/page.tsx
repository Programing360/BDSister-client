import { Metadata } from "next";
import { notFound } from "next/navigation";
import { DEMO_WORKSHOPS } from "@/features/admin/events/data/mock-events";
import { WorkshopForm } from "@/features/admin/events/components/workshops/workshop-form";

interface PageProps {
  params: Promise<{ workshopId: string }>;
}

export async function generateStaticParams() {
  return DEMO_WORKSHOPS.map((ws) => ({
    workshopId: ws.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { workshopId } = await params;
  const workshop = DEMO_WORKSHOPS.find((ws) => ws.id === workshopId);
  return {
    title: workshop ? `Edit ${workshop.title} | BDSisters Admin` : "Edit Workshop | BDSisters Admin",
  };
}

export default async function EditWorkshopPage({ params }: PageProps) {
  const { workshopId } = await params;
  const workshop = DEMO_WORKSHOPS.find((ws) => ws.id === workshopId);

  if (!workshop) {
    notFound();
  }

  return <WorkshopForm initialData={workshop} isEdit={true} />;
}
