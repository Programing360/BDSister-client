import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { MemberProfileDocument } from "@/types/profile";
import { defaultPrivacySettings } from "@/lib/validations/profile";
import {
  createDefaultProfile,
  filterProfileByPrivacy,
  calculateDetailedProfileCompletion,
} from "@/features/profile/utils/profile-utils";

export {
  createDefaultProfile,
  filterProfileByPrivacy,
  calculateDetailedProfileCompletion,
};
export type { PrivacyViewerContext } from "@/features/profile/utils/profile-utils";

/**
 * Fetch member profile via REST API.
 * Calls /api/users/:id or /api/auth/me instead of direct MongoDB connection.
 * Falls back safely to baseline default profile during offline or mock runs.
 */
export async function getProfileByUserId(
  userId: string,
  initialData?: { displayName?: string; avatar?: string | null }
): Promise<MemberProfileDocument> {
  if (!userId) {
    throw new Error("userId is required to fetch profile");
  }

  try {
    const res = await apiClient.get<MemberProfileDocument>(API_ENDPOINTS.users.detail(userId));
    if (res.data) {
      return {
        ...res.data,
        privacySettings: {
          ...defaultPrivacySettings,
          ...(res.data.privacySettings || {}),
        },
      };
    }
  } catch (err) {
    console.warn("[ProfileService] API fetch deferred or offline:", (err as Error).message);
  }

  // Fallback to initial structured profile
  return createDefaultProfile(userId, initialData?.displayName, initialData?.avatar);
}

/**
 * Update member profile via REST API.
 * Calls PATCH /api/auth/me/contact or PUT /api/users/profile instead of direct MongoDB connection.
 */
export async function updateProfileByUserId(
  userId: string,
  updateData: Partial<MemberProfileDocument>
): Promise<MemberProfileDocument> {
  if (!userId) {
    throw new Error("userId is required to update profile");
  }

  // Strip administrative / system properties
  const safeData = { ...updateData };
  delete (safeData as Record<string, unknown>)._id;
  delete (safeData as Record<string, unknown>).userId;
  delete (safeData as Record<string, unknown>).role;
  delete (safeData as Record<string, unknown>).isVerified;
  delete (safeData as Record<string, unknown>).membershipTier;
  delete (safeData as Record<string, unknown>).createdAt;

  try {
    const res = await apiClient.patch<MemberProfileDocument>(
      API_ENDPOINTS.auth.updateContact,
      safeData
    );
    if (res.data) {
      return res.data;
    }
  } catch (err) {
    console.warn("[ProfileService] API update deferred:", (err as Error).message);
  }

  return {
    ...createDefaultProfile(userId),
    ...safeData,
    updatedAt: new Date(),
  };
}

/**
 * Submit member profile for official sisterhood verification review.
 * Calls POST /api/auth/me/submit-review
 */
export async function submitProfileForReview(): Promise<{ success: boolean; message: string }> {
  try {
    const res = await apiClient.post<{ message?: string }>(API_ENDPOINTS.auth.submitReview);
    return {
      success: !res.error,
      message: res.data?.message || "Profile successfully submitted for official Sisterhood Review.",
    };
  } catch (err) {
    return {
      success: false,
      message: (err as Error).message || "Failed to submit profile for review.",
    };
  }
}

/**
 * Initiate authenticated download of member profile in official PDF format.
 * Triggers GET /api/auth/export-pdf
 */
export function downloadProfilePdf(): void {
  if (typeof window === "undefined") return;
  const downloadUrl = API_ENDPOINTS.auth.exportPdf;
  window.open(downloadUrl, "_blank");
}
