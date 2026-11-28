import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BrandDetailView, type PublicBrandData } from "@/features/public/brands/components/brand-detail-view";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { decodeHtmlEntities } from "@/lib/utils/format";

interface BrandPageProps {
  params: Promise<{ slug: string }>;
}

async function fetchBrandData(slugOrId: string): Promise<PublicBrandData | null> {
  try {
    const res = await apiClient.get<{ data?: PublicBrandData }>(
      API_ENDPOINTS.business.brandDetail(slugOrId)
    );
    const raw = res as unknown as { data?: PublicBrandData };
    if (raw?.data && raw.data.brandName) {
      return raw.data;
    }
  } catch (err) {
    // If brand not found or API error, return null to trigger notFound()
    console.error(`[BrandPage] Failed to fetch brand for "${slugOrId}":`, err);
  }

  return null;
}

export async function generateMetadata({
  params,
}: BrandPageProps): Promise<Metadata> {
  const { slug } = await params;
  const brand = await fetchBrandData(slug);

  if (!brand) {
    return {
      title: "Brand Not Found | BDSisters.org",
    };
  }

  const brandName = decodeHtmlEntities(brand.brandName);
  return {
    title: `${brandName} | Verified Sister Brand on BDSisters.org`,
    description:
      decodeHtmlEntities(brand.businessSummary) ||
      `Explore ${brandName}, an ethical women-led enterprise on BDSisters.org under Muhsina Organization.`,
  };
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { slug } = await params;
  const brand = await fetchBrandData(slug);

  if (!brand) {
    notFound();
  }

  return <BrandDetailView initialBrand={brand} />;
}
