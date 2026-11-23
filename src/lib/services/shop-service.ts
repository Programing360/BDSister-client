import { apiClient } from "@/lib/api/client";
import type { ShopDocument, PublicShopProfile, ShopPolicies } from "@/types/shop";
import { generateSlug } from "@/lib/validations/business";
import { filterShopForPublic } from "@/features/shop/utils/shop-utils";

/**
 * Generate unique shop slug client-side
 */
export async function generateUniqueShopSlug(name: string): Promise<string> {
  const baseSlug = generateSlug(name) || "sister-shop";
  return `${baseSlug}-${Date.now().toString().slice(-4)}`;
}

/**
 * Retrieve shop by associated business ID via REST API
 */
export async function getShopByBusinessId(businessId: string): Promise<ShopDocument | null> {
  if (!businessId) return null;
  try {
    const res = await apiClient.get<{ shop?: ShopDocument }>("/api/member/shop", {
      params: { businessId },
    });
    if (res.data?.shop) {
      return res.data.shop;
    }
  } catch (err) {
    console.warn("[ShopService] Lookup by businessId failed:", (err as Error).message);
  }
  return null;
}

/**
 * Retrieve shop by unique slug via REST API
 */
export async function getShopBySlug(slug: string): Promise<ShopDocument | null> {
  if (!slug) return null;
  try {
    const res = await apiClient.get<{ shop?: ShopDocument }>(`/api/member/shop?slug=${encodeURIComponent(slug)}`);
    if (res.data?.shop) {
      return res.data.shop;
    }
  } catch (err) {
    console.warn("[ShopService] Lookup by slug failed:", (err as Error).message);
  }
  return null;
}

/**
 * Retrieve all shops owned by member via REST API
 */
export async function getShopsByOwnerId(_ownerId?: string): Promise<ShopDocument[]> {
  try {
    const res = await apiClient.get<{ shops?: ShopDocument[] }>("/api/member/shop");
    if (res.data?.shops && Array.isArray(res.data.shops)) {
      return res.data.shops;
    }
  } catch (err) {
    console.warn("[ShopService] Lookup by ownerId failed:", (err as Error).message);
  }
  return [];
}

/**
 * Create or configure a shop for an approved or pending business via REST API
 */
export async function createOrUpdateShop(
  _ownerId: string,
  businessId: string,
  data: Partial<ShopDocument>
): Promise<ShopDocument> {
  if (!businessId) {
    throw new Error("Business ID is required.");
  }

  const res = await apiClient.post<{ shop: ShopDocument }>("/api/member/shop", {
    businessId,
    ...data,
  });

  if (res.error) {
    throw new Error(res.error.message || "Failed to configure shop.");
  }

  if (!res.data?.shop) {
    throw new Error("No shop document returned by server.");
  }

  return res.data.shop;
}

/**
 * Update shop policies via REST API
 */
export async function updateShopPolicies(
  businessId: string,
  _ownerId: string,
  policies: ShopPolicies
): Promise<ShopDocument> {
  if (!businessId) {
    throw new Error("Business ID is required.");
  }

  const res = await apiClient.put<{ shop: ShopDocument }>("/api/member/shop/policies", {
    businessId,
    ...policies,
  });

  if (res.error) {
    throw new Error(res.error.message || "Failed to update shop policies.");
  }

  if (!res.data?.shop) {
    throw new Error("No updated shop returned by server.");
  }

  return res.data.shop;
}

/**
 * Retrieve public shop profile by slug via REST API
 */
export async function getPublicShopBySlug(
  slug: string,
  viewerUserId?: string | null,
  isAdmin = false
): Promise<PublicShopProfile | null> {
  const shop = await getShopBySlug(slug);
  if (!shop) return null;

  return filterShopForPublic(shop, shop.status === "ACTIVE", { viewerUserId, isAdmin });
}
