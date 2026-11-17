import { notFound } from "next/navigation";
import { Metadata } from "next";
import { DEMO_ADMIN_ROLES, getAdminRoleByIdOrSlug } from "@/features/admin/roles/data/admin-roles-data";
import { RoleEditForm } from "@/features/admin/roles/components/role-edit-form";

interface PageProps {
  params: Promise<{
    roleId: string;
  }>;
}

export function generateStaticParams() {
  return DEMO_ADMIN_ROLES.flatMap((r) => [
    { roleId: r.slug },
    { roleId: r.id },
  ]);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { roleId } = await params;
  const role = getAdminRoleByIdOrSlug(roleId);
  return {
    title: role ? `Edit ${role.name} | BDSisters Admin` : "Edit Role | BDSisters Admin",
    description: "Modify role metadata and assigned functional capability permissions.",
  };
}

export default async function AdminRoleEditPage({ params }: PageProps) {
  const { roleId } = await params;
  const role = getAdminRoleByIdOrSlug(roleId);

  if (!role) {
    notFound();
  }

  return <RoleEditForm role={role} />;
}
