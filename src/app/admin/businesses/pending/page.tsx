import { BusinessesPendingView } from "@/features/admin/businesses/components/businesses-pending-view";
import { DEMO_ADMIN_BUSINESSES } from "@/features/admin/businesses/data/admin-businesses-data";

export const metadata = {
  title: "Pending Businesses | BDSisters Administration",
};

export default function AdminBusinessesPendingPage() {
  return (
    <div className="space-y-6">
      <BusinessesPendingView initialBusinesses={DEMO_ADMIN_BUSINESSES} />
    </div>
  );
}
