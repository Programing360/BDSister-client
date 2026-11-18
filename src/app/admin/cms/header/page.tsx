import { HeaderManagementView } from "@/features/admin/cms/components/header/header-management-view";

export const metadata = {
  title: "Header & Navigation Management | BDSisters CMS",
  description: "Configure the public header logo, branding, announcement bar, and primary navigation links.",
};

export default function AdminCmsHeaderPage() {
  return <HeaderManagementView />;
}
