import { BusinessesApprovedView } from "@/features/admin/businesses/components/businesses-approved-view";
import { DEMO_ADMIN_BUSINESSES } from "@/features/admin/businesses/data/admin-businesses-data";

export const metadata = {
  title: "Approved Businesses | BDSisters Administration",
};

export default function AdminBusinessesApprovedPage() {
  return (
    <div className="space-y-6">
      <BusinessesApprovedView initialBusinesses={DEMO_ADMIN_BUSINESSES} />
    </div>
  );
}
