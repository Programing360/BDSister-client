import { PageForm } from "@/features/admin/cms/components/pages/page-form";

export const metadata = {
  title: "Create Website Page | BDSisters CMS Administration",
  description: "Compose and publish a new public page with sections and SEO metadata.",
};

export default function AdminCmsPagesCreatePage() {
  return <PageForm />;
}
