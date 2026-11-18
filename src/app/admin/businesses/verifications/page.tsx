import { BusinessVerificationsView } from "@/features/admin/businesses/components/business-verifications-view";

export const metadata = {
  title: "Business Verifications | BDSisters Administration",
  description: "Inspect trade licenses, TIN certificates, and compliance records.",
};

export default function AdminBusinessVerificationsPage() {
  return (
    <div className="space-y-6">
      <BusinessVerificationsView />
    </div>
  );
}
