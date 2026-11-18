import { BusinessesRejectedView } from "@/features/admin/businesses/components/businesses-rejected-view";
import { DEMO_ADMIN_BUSINESSES } from "@/features/admin/businesses/data/admin-businesses-data";

export const metadata = {
  title: "Rejected Businesses | BDSisters Administration",
};

export default function AdminBusinessesRejectedPage() {
  return (
    <div className="space-y-6">
      <BusinessesRejectedView initialBusinesses={DEMO_ADMIN_BUSINESSES} />
    </div>
  );
}
