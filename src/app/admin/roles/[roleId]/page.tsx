import { notFound } from "next/navigation";
import { Metadata } from "next";
import { DEMO_ADMIN_ROLES, getAdminRoleByIdOrSlug } from "@/features/admin/roles/data/admin-roles-data";
import { RoleDetailsView } from "@/features/admin/roles/components/role-details-view";

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
    title: role ? `${role.name} (${role.slug}) | BDSisters Admin` : "Role Details | BDSisters Admin",
    description: role?.description || "Role configuration and security capabilities breakdown.",
  };
}

export default async function AdminRoleDetailsPage({ params }: PageProps) {
  const { roleId } = await params;
  const role = getAdminRoleByIdOrSlug(roleId);

  if (!role) {
    notFound();
  }

  return <RoleDetailsView role={role} />;
}
