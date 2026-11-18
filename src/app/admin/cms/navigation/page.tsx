import { NavigationManagementView } from "@/features/admin/cms/components/navigation/navigation-management-view";

export const metadata = {
  title: "Navigation & Menus Management | BDSisters CMS",
  description: "Centralized routing trees for primary header, footer links, mobile drawer, and utility navigation.",
};

export default function AdminCmsNavigationPage() {
  return <NavigationManagementView />;
}
