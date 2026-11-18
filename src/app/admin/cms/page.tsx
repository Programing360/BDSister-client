import { CMSOverviewView } from "@/features/admin/cms/components/overview/cms-overview-view";

export const metadata = {
  title: "CMS & Website Management | BDSisters Administration",
  description: "Manage BDSisters.org public pages, visual page builder, header, footer, SEO metadata, and media library.",
};

export default function AdminCmsPage() {
  return <CMSOverviewView />;
}
