import { redirect, notFound } from "next/navigation";
import { getServerSession } from "@/lib/auth/session";
import { getProductById } from "@/lib/services/product-service";
import { getCategories } from "@/lib/services/category-service";
import { ProductEditForm } from "@/features/product/components/product-edit-form";

interface ProductEditPageProps {
  params: Promise<{ productId: string }>;
}

export const metadata = {
  title: "Edit Product | Member Dashboard | BDSisters.org",
  description: "Update product listings, pricing, and inventory.",
};

export default async function ProductEditPage({ params }: ProductEditPageProps) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { productId } = await params;
  const [product, categories] = await Promise.all([
    getProductById(productId, session.user.id),
    getCategories(),
  ]);

  if (!product) {
    notFound();
  }

  return <ProductEditForm product={product} categories={categories} />;
}
