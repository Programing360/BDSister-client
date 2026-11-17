import { Metadata } from "next";
import { CustomerOrdersView } from "@/features/ecommerce/components/customer-orders-view";

export const metadata: Metadata = {
  title: "My Orders | BDSisters.org",
  description: "View and track your purchases on BDSisters.org.",
};

export const dynamic = "force-dynamic";

export default function MemberOrdersPage() {
  return (
    <div className="py-6">
      <CustomerOrdersView />
    </div>
  );
}
