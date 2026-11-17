import { Metadata } from "next";
import { PermissionGroupsView } from "@/features/admin/permissions/components/permission-groups-view";

export const metadata: Metadata = {
  title: "Permission Domains & Groups | BDSisters Admin",
  description: "Explore the 15 functional security domains governing the BDSisters.org administrative and commerce platform.",
};

export default function AdminPermissionGroupsPage() {
  return <PermissionGroupsView />;
}
