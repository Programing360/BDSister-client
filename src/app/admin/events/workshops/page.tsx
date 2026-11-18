import { Metadata } from "next";
import { WorkshopsListView } from "@/features/admin/events/components/workshops/workshops-list-view";

export const metadata: Metadata = {
  title: "Workshops Management | BDSisters Admin",
  description: "Curate and oversee skill-building masterclasses and practical studios.",
};

export default function WorkshopsPage() {
  return <WorkshopsListView />;
}
