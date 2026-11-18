import { BusinessesListView } from "@/features/admin/businesses/components/businesses-list-view";
import { DEMO_ADMIN_BUSINESSES, DEMO_BUSINESS_KPIS } from "@/features/admin/businesses/data/admin-businesses-data";

export const metadata = {
  title: "Business Management | BDSisters Administration",
  description: "Manage women-led businesses, review trade licenses, and monitor enterprise activity.",
};

export default function AdminBusinessesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Business Management</h1>
        <p className="text-xs text-gray-500 mt-1">
          Monitor, verify, moderate, and feature Bangladeshi women-founded enterprises across handloom, pottery, food, and craft sectors.
        </p>
      </div>

      <BusinessesListView
        initialBusinesses={DEMO_ADMIN_BUSINESSES}
        initialKpis={DEMO_BUSINESS_KPIS}
      />
    </div>
  );
}
