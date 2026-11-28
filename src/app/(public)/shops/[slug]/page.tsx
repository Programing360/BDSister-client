import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetailView, type ProductDetailData } from "@/features/shop/components/product-detail-view";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

async function fetchProduct(slugOrId: string): Promise<ProductDetailData | null> {
  try {
    const res = await apiClient.get<{ data?: ProductDetailData }>(
      API_ENDPOINTS.ecommerce.productDetail(slugOrId)
    );
    const raw = res as unknown as { data?: ProductDetailData };
    if (raw?.data && (raw.data.title || (raw.data as any).name)) {
      return raw.data;
    }
  } catch (err) {
    console.warn(`[ShopProductPage] Could not fetch product for "${slugOrId}":`, err);
  }
  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProduct(slug);

  if (!product) {
    return {
      title: "Product Not Found | BDSisters Halal Shops",
    };
  }

  return {
    title: `${product.title} by ${product.brandName} | BDSisters Halal Shops`,
    description:
      product.description ||
      `Buy ${product.title} from verified sister brand ${product.brandName} with MRP guarantee.`,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await fetchProduct(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailView product={product} />;
}
