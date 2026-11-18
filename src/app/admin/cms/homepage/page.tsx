import { HomepageManagementView } from "@/features/admin/cms/components/homepage/homepage-management-view";

export const metadata = {
  title: "Homepage Management | BDSisters CMS",
  description: "Configure the BDSisters.org landing page sections, hero messaging, and layout flow.",
};

export default function AdminCmsHomepagePage() {
  return <HomepageManagementView />;
}
