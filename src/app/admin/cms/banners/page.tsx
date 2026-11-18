import { BannersListView } from "@/features/admin/cms/components/banners/banners-list-view";

export const metadata = {
  title: "Banners & Announcements | BDSisters CMS",
  description: "Promotional campaigns, hero takeovers, and sitewide alert banners.",
};

export default function AdminCmsBannersPage() {
  return <BannersListView />;
}
