import { SellersListView } from "@/features/admin/sellers/components/sellers-list-view";
import { DEMO_ADMIN_SELLERS, DEMO_SELLER_KPIS } from "@/features/admin/sellers/data/admin-sellers-data";

export const metadata = {
  title: "Seller Administration | BDSisters Administration",
  description: "Manage marketplace sellers, artisan merchant accounts, and payout settings.",
};

export default function AdminEcommerceSellersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Seller Administration</h1>
        <p className="text-xs text-gray-500 mt-1">
          Monitor active marketplace sellers, manage merchant onboardings, set commission rates, and audit payout channels.
        </p>
      </div>

      <SellersListView
        initialSellers={DEMO_ADMIN_SELLERS}
        initialKpis={DEMO_SELLER_KPIS}
      />
    </div>
  );
}
