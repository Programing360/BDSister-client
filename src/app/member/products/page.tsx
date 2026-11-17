import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth/session";
import { getProductsByOwnerId } from "@/lib/services/product-service";
import { getBusinessesByOwnerId } from "@/lib/services/business-service";
import { ProductListView } from "@/features/product/components/product-list-view";

export const metadata = {
  title: "Product Management | Member Dashboard | BDSisters.org",
  description: "Manage products, catalog listings, and inventory for your BDSisters businesses.",
};

export default async function MemberProductsPage() {
  const session = await getServerSession();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/member/products");
  }

  const [productsData, businesses] = await Promise.all([
    getProductsByOwnerId(session.user.id, { limit: 100 }),
    getBusinessesByOwnerId(session.user.id),
  ]);

  return (
    <ProductListView
      initialProducts={productsData.products}
      businesses={businesses}
      stats={productsData.stats}
    />
  );
}
