import { Metadata } from "next";
import { SellerOrdersView } from "@/features/ecommerce/components/seller-orders-view";

export const metadata: Metadata = {
  title: "Merchant Orders | BDSisters.org",
  description: "Manage product sales and dispatch fulfillment for your shops on BDSisters.org.",
};

export const dynamic = "force-dynamic";

export default function SellerOrdersPage() {
  return (
    <div className="py-6">
      <SellerOrdersView />
    </div>
  );
}
