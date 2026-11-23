import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { BusinessDocument, PublicBusinessProfile } from "@/types/business";
import {
  type BusinessRegistrationInput,
  type BusinessUpdateInput,
  type BusinessVerificationInput,
  generateSlug,
} from "@/lib/validations/business";
import { filterBusinessForPublic } from "@/features/business/utils/business-utils";

/**
 * Generates a clean URL slug from business title
 */
export async function generateUniqueBusinessSlug(name: string): Promise<string> {
  const baseSlug = generateSlug(name) || "sister-business";
  return `${baseSlug}-${Date.now().toString().slice(-4)}`;
}

/**
 * Retrieve all businesses owned by a member via REST API
 */
export async function getBusinessesByOwnerId(_ownerId?: string): Promise<BusinessDocument[]> {
  try {
    const res = await apiClient.get<{ businesses?: BusinessDocument[] }>("/api/member/business");
    if (res.data?.businesses && Array.isArray(res.data.businesses)) {
      return res.data.businesses;
    }
  } catch (err) {
    console.warn("[BusinessService] Failed to fetch member businesses via API:", (err as Error).message);
  }
  return [];
}

/**
 * Retrieve a specific business by ID via REST API
 */
export async function getBusinessById(id: string): Promise<BusinessDocument | null> {
  if (!id) return null;
  try {
    const res = await apiClient.get<{ business?: BusinessDocument }>(`/api/member/business/${id}`);
    if (res.data?.business) {
      return res.data.business;
    }
  } catch {
    // Attempt public fallback
    try {
      const publicRes = await apiClient.get<{ business?: BusinessDocument }>(API_ENDPOINTS.business.detail(id));
      if (publicRes.data?.business) {
        return publicRes.data.business;
      }
    } catch (publicErr) {
      console.warn("[BusinessService] Business lookup failed:", (publicErr as Error).message);
    }
  }
  return null;
}

/**
 * Retrieve business by unique slug via REST API
 */
export async function getBusinessBySlug(slug: string): Promise<BusinessDocument | null> {
  if (!slug) return null;
  try {
    const res = await apiClient.get<{ business?: BusinessDocument }>(API_ENDPOINTS.business.detail(slug));
    if (res.data?.business) {
      return res.data.business;
    }
  } catch (err) {
    console.warn("[BusinessService] Failed to query business by slug:", (err as Error).message);
  }
  return null;
}

/**
 * Create a new business with verified session owner via REST API
 */
export async function createBusiness(
  _ownerId: string,
  data: BusinessRegistrationInput,
  _ownerName?: string
): Promise<BusinessDocument> {
  const res = await apiClient.post<{ business: BusinessDocument }>(
    API_ENDPOINTS.business.create,
    data
  );

  if (res.error) {
    throw new Error(res.error.message || "Failed to register business.");
  }

  if (!res.data?.business) {
    throw new Error("No business profile returned by server.");
  }

  return res.data.business;
}

/**
 * Update an existing business via REST API
 */
export async function updateBusiness(
  businessId: string,
  _ownerId: string,
  updateData: BusinessUpdateInput
): Promise<BusinessDocument> {
  if (!businessId) {
    throw new Error("Business ID is required.");
  }

  const res = await apiClient.put<{ business: BusinessDocument }>(
    `/api/member/business/${businessId}`,
    updateData
  );

  if (res.error) {
    throw new Error(res.error.message || "Failed to update business.");
  }

  if (!res.data?.business) {
    throw new Error("No updated business returned by server.");
  }

  return res.data.business;
}

/**
 * Submit verification documents for a business via REST API
 */
export async function submitBusinessVerification(
  businessId: string,
  _ownerId: string,
  input: BusinessVerificationInput
): Promise<BusinessDocument> {
  const res = await apiClient.post<{ business: BusinessDocument }>(
    `/api/member/business/${businessId}/verification`,
    input
  );

  if (res.error) {
    throw new Error(res.error.message || "Failed to submit verification.");
  }

  if (!res.data?.business) {
    throw new Error("No business profile returned following verification submission.");
  }

  return res.data.business;
}

/**
 * Retrieve public businesses (approved & public only) via REST API
 */
export async function getPublicApprovedBusinesses(filters?: {
  category?: string;
  division?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<PublicBusinessProfile[]> {
  try {
    const res = await apiClient.get<{ businesses: PublicBusinessProfile[] }>(
      API_ENDPOINTS.business.list,
      { params: filters }
    );
    if (res.data?.businesses && Array.isArray(res.data.businesses)) {
      return res.data.businesses;
    }
  } catch (err) {
    console.warn("[BusinessService] Public businesses fetch failed:", (err as Error).message);
  }
  return [];
}

/**
 * Get public business by slug with privacy filtering via REST API
 */
export async function getPublicBusinessBySlug(
  slug: string,
  viewerUserId?: string | null,
  isAdmin = false
): Promise<PublicBusinessProfile | null> {
  try {
    const res = await apiClient.get<{ business: BusinessDocument | PublicBusinessProfile }>(
      API_ENDPOINTS.business.detail(slug)
    );
    if (res.data?.business) {
      return filterBusinessForPublic(res.data.business as any, { viewerUserId, isAdmin });
    }
  } catch (err) {
    console.warn("[BusinessService] Public slug lookup failed:", (err as Error).message);
  }
  return null;
}
