import { BusinessesSuspendedView } from "@/features/admin/businesses/components/businesses-suspended-view";
import { DEMO_ADMIN_BUSINESSES } from "@/features/admin/businesses/data/admin-businesses-data";

export const metadata = {
  title: "Suspended Businesses | BDSisters Administration",
};

export default function AdminBusinessesSuspendedPage() {
  return (
    <div className="space-y-6">
      <BusinessesSuspendedView initialBusinesses={DEMO_ADMIN_BUSINESSES} />
    </div>
  );
}
