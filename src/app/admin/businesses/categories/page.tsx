import { BusinessCategoriesView } from "@/features/admin/businesses/components/business-categories-view";

export const metadata = {
  title: "Business Categories | BDSisters Administration",
  description: "Manage business classifications and artisan craft taxonomy.",
};

export default function AdminBusinessesCategoriesPage() {
  return (
    <div className="space-y-6">
      <BusinessCategoriesView />
    </div>
  );
}
