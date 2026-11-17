import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth/session";
import { getCategories } from "@/lib/services/category-service";
import { ProductCategoriesView } from "@/features/product/components/product-categories-view";

export const metadata = {
  title: "Product Categories | Member Dashboard | BDSisters.org",
  description: "Explore BDSisters marketplace category taxonomy and subcategories.",
};

export default async function MemberCategoriesPage() {
  const session = await getServerSession();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/member/products/categories");
  }

  const categories = await getCategories();

  return <ProductCategoriesView categories={categories} />;
}
