import { FeaturedBusinessesView } from "@/features/admin/businesses/components/featured-businesses-view";
import { DEMO_ADMIN_BUSINESSES } from "@/features/admin/businesses/data/admin-businesses-data";

export const metadata = {
  title: "Featured Businesses | BDSisters Administration",
  description: "Curated spotlight businesses showcased on homepage and marketplace.",
};

export default function AdminFeaturedBusinessesPage() {
  return (
    <div className="space-y-6">
      <FeaturedBusinessesView initialBusinesses={DEMO_ADMIN_BUSINESSES} />
    </div>
  );
}
