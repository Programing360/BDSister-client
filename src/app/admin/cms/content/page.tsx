import { ContentManagementView } from "@/features/admin/cms/components/content/content-management-view";

export const metadata = {
  title: "Website Static Content & Policies | BDSisters CMS",
  description: "About Us, Mission, Privacy, Terms, and legal notices editor.",
};

export default function AdminCmsContentPage() {
  return <ContentManagementView />;
}
