import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth/session";
import { getBusinessesByOwnerId } from "@/lib/services/business-service";
import { getShopsByOwnerId } from "@/lib/services/shop-service";
import { getCategories } from "@/lib/services/category-service";
import { ProductCreateWizard } from "@/features/product/components/product-create-wizard";

export const metadata = {
  title: "Create Product | Member Dashboard | BDSisters.org",
  description: "List a new handcrafted creation or service on the BDSisters marketplace.",
};

export default async function ProductCreatePage() {
  const session = await getServerSession();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/member/products/create");
  }

  const [businesses, shops, categories] = await Promise.all([
    getBusinessesByOwnerId(session.user.id),
    getShopsByOwnerId(session.user.id),
    getCategories(),
  ]);

  return (
    <ProductCreateWizard
      businesses={businesses}
      shops={shops}
      categories={categories}
    />
  );
}
