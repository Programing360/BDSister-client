import { Metadata } from "next";
import { RolesListView } from "@/features/admin/roles/components/roles-list-view";

export const metadata: Metadata = {
  title: "Role & Access Management | BDSisters Admin",
  description: "Configure administrative roles, granular permission matrices, and security governance policies across BDSisters.org.",
};

export default function AdminRolesPage() {
  return <RolesListView />;
}
