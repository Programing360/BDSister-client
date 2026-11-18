import { BusinessReviewsView } from "@/features/admin/businesses/components/business-reviews-view";

export const metadata = {
  title: "Business Reviews & Ratings | BDSisters Administration",
  description: "Customer reviews moderation and feedback monitoring.",
};

export default function AdminBusinessReviewsPage() {
  return (
    <div className="space-y-6">
      <BusinessReviewsView />
    </div>
  );
}
