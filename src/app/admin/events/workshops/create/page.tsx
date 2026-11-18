import { Metadata } from "next";
import { WorkshopForm } from "@/features/admin/events/components/workshops/workshop-form";

export const metadata: Metadata = {
  title: "Create Workshop | BDSisters Admin",
  description: "Schedule a new hands-on artisan or tech workshop.",
};

export default function CreateWorkshopPage() {
  return <WorkshopForm isEdit={false} />;
}
