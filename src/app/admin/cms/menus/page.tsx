import { NavigationManagementView } from "@/features/admin/cms/components/navigation/navigation-management-view";

export const metadata = {
  title: "Menus & Navigation | BDSisters CMS",
  description: "Centralized site menus management.",
};

export default function AdminCmsMenusPage() {
  return <NavigationManagementView />;
}
