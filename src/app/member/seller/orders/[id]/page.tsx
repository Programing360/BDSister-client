import { Metadata } from "next";
import { SellerOrderDetailView } from "@/features/ecommerce/components/seller-order-detail-view";

export const metadata: Metadata = {
  title: "Manage Merchant Order | BDSisters.org",
  description: "Update fulfillment status and courier tracking for this order.",
};

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function SellerOrderDetailPage({ params }: Props) {
  const { id } = await params;
  return (
    <div className="py-6">
      <SellerOrderDetailView orderId={id} />
    </div>
  );
}
