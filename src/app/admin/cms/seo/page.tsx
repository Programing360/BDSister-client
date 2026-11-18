import { SEOManagementView } from "@/features/admin/cms/components/seo/seo-management-view";

export const metadata = {
  title: "SEO & Social Metadata Studio | BDSisters CMS",
  description: "Search engine snippet optimization, OpenGraph social sharing tags, and canonical URLs.",
};

export default function AdminCmsSeoPage() {
  return <SEOManagementView />;
}
