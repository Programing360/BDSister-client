import { Metadata } from "next";
import { RoleCreateForm } from "@/features/admin/roles/components/role-create-form";

export const metadata: Metadata = {
  title: "Create Custom Role | BDSisters Admin",
  description: "Define custom administrative roles with fine-grained granular capability definitions across 15 operational domains.",
};

export default function AdminRoleCreatePage() {
  return <RoleCreateForm />;
}
