import { Metadata } from "next";
import { CustomerOrderDetailView } from "@/features/ecommerce/components/customer-order-detail-view";

export const metadata: Metadata = {
  title: "Order Details | BDSisters.org",
  description: "View order tracking, delivery address, and payment information.",
};

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function MemberOrderDetailPage({ params }: Props) {
  const { id } = await params;
  return (
    <div className="py-6">
      <CustomerOrderDetailView orderId={id} />
    </div>
  );
}
