import { redirect, notFound } from "next/navigation";
import { getServerSession } from "@/lib/auth/session";
import { getProductById } from "@/lib/services/product-service";
import { ProductDetailView } from "@/features/product/components/product-detail-view";

interface ProductPageProps {
  params: Promise<{ productId: string }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { productId } = await params;
  const product = await getProductById(productId);
  return {
    title: product ? `${product.name} | Product Details` : "Product Not Found",
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { productId } = await params;
  const product = await getProductById(productId, session.user.id);

  if (!product) {
    notFound();
  }

  return <ProductDetailView product={product} />;
}
