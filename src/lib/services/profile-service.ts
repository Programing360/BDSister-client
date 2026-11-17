import { getDatabase } from "@/lib/db/mongodb";
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

const COLLECTION_NAME = "member_profiles";

let indexEnsured = false;
async function ensureIndex() {
  if (indexEnsured) return;
  try {
    const db = await getDatabase();
    await db.collection(COLLECTION_NAME).createIndex({ userId: 1 }, { unique: true });
    indexEnsured = true;
  } catch (err) {
    // If connection deferred or mock, do not fail
    console.warn("[ProfileService] Index creation deferred:", (err as Error).message);
  }
}

/**
 * Fetch member profile by userId. Creates an initial baseline profile in DB if not found.
 */
export async function getProfileByUserId(
  userId: string,
  initialData?: { displayName?: string; avatar?: string | null }
): Promise<MemberProfileDocument> {
  if (!userId) {
    throw new Error("userId is required to fetch profile");
  }

  await ensureIndex();

  try {
    const db = await getDatabase();
    const doc = await db.collection<MemberProfileDocument>(COLLECTION_NAME).findOne({ userId });

    if (doc) {
      return {
        ...doc,
        privacySettings: {
          ...defaultPrivacySettings,
          ...(doc.privacySettings || {}),
        },
      };
    }

    // Initialize baseline profile
    const newProfile = createDefaultProfile(
      userId,
      initialData?.displayName,
      initialData?.avatar
    );

    await db.collection(COLLECTION_NAME).insertOne({ ...newProfile } as any);
    return newProfile;
  } catch (err) {
    console.warn("[ProfileService] Database lookup deferred or failed:", (err as Error).message);
    // Return memory baseline for resilience during build or offline tests
    return createDefaultProfile(userId, initialData?.displayName, initialData?.avatar);
  }
}

/**
 * Update member profile by userId. Strips administrative fields to prevent tampering.
 */
export async function updateProfileByUserId(
  userId: string,
  updateData: Partial<MemberProfileDocument>
): Promise<MemberProfileDocument> {
  if (!userId) {
    throw new Error("userId is required to update profile");
  }

  await ensureIndex();

  // Strip protected fields
  const safeData = { ...updateData };
  delete (safeData as Record<string, unknown>)._id;
  delete (safeData as Record<string, unknown>).userId;
  delete (safeData as Record<string, unknown>).role;
  delete (safeData as Record<string, unknown>).isVerified;
  delete (safeData as Record<string, unknown>).membershipTier;
  delete (safeData as Record<string, unknown>).createdAt;

  const toSet = {
    ...safeData,
    updatedAt: new Date(),
  };

  try {
    const db = await getDatabase();
    const result = await db.collection(COLLECTION_NAME).findOneAndUpdate(
      { userId },
      { $set: toSet },
      { returnDocument: "after", upsert: true }
    );

    if (result) {
      return result as unknown as MemberProfileDocument;
    }

    return (await getProfileByUserId(userId)) as MemberProfileDocument;
  } catch (err) {
    console.warn("[ProfileService] Database update deferred or failed:", (err as Error).message);
    return {
      ...createDefaultProfile(userId),
      ...toSet,
    } as MemberProfileDocument;
  }
}
