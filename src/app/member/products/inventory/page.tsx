import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth/session";
import { getProductsByOwnerId } from "@/lib/services/product-service";
import { InventoryManagementView } from "@/features/product/components/inventory-management-view";

export const metadata = {
  title: "Inventory & Stock Management | Member Dashboard | BDSisters.org",
  description: "Monitor and manage live inventory levels across all product SKUs.",
};

export default async function MemberInventoryPage() {
  const session = await getServerSession();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/member/products/inventory");
  }

  const { products } = await getProductsByOwnerId(session.user.id, { limit: 100 });

  return <InventoryManagementView initialProducts={products} />;
}
