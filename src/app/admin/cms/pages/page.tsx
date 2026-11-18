import { PagesListView } from "@/features/admin/cms/components/pages/pages-list-view";

export const metadata = {
  title: "Website Pages | BDSisters CMS Administration",
  description: "Browse, filter, edit, and publish static and campaign pages across BDSisters.org.",
};

export default function AdminCmsPagesPage() {
  return <PagesListView />;
}
