import React from "react";
import type { Metadata } from "next";
import {
  PublicBusinessesView,
  type PublicBusinessProfile,
} from "@/features/public/businesses/components/public-businesses-view";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Business & Brands Directory | BDSisters",
  description:
    "Explore verified businesses, brands, and services led by Bangladeshi Muslim women.",
};

async function getInitialBusinesses(): Promise<PublicBusinessProfile[]> {
  try {
    const res = await apiClient.get<any>(API_ENDPOINTS.businesses.list, {
      cache: "no-store",
    });
    const raw = res as any;
    const list: PublicBusinessProfile[] = Array.isArray(raw)
      ? raw
      : Array.isArray(raw?.data)
        ? raw.data
        : Array.isArray(raw?.data?.businesses)
          ? raw.data.businesses
          : Array.isArray(raw?.businesses)
            ? raw.businesses
            : [];
    return list;
  } catch (err) {
    console.error("[BusinessesPage] Server fetch error:", err);
    return [];
  }
}

export default async function BusinessesPage() {
  const initialBusinesses = await getInitialBusinesses();
  return <PublicBusinessesView initialBusinesses={initialBusinesses} />;
}
