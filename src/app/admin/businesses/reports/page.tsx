import { BusinessReportsView } from "@/features/admin/businesses/components/business-reports-view";

export const metadata = {
  title: "Business Reports & Moderation | BDSisters Administration",
  description: "Review safety reports, fraud flags, and commercial policy disputes.",
};

export default function AdminBusinessReportsPage() {
  return (
    <div className="space-y-6">
      <BusinessReportsView />
    </div>
  );
}
