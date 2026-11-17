import { getDatabase } from "@/lib/db/mongodb";
import type { BusinessDocument, PublicBusinessProfile } from "@/types/business";
import {
  type BusinessRegistrationInput,
  type BusinessUpdateInput,
  type BusinessVerificationInput,
  generateSlug,
} from "@/lib/validations/business";
import { filterBusinessForPublic } from "@/features/business/utils/business-utils";

const COLLECTION_NAME = "businesses";

let indexEnsured = false;
async function ensureIndex() {
  if (indexEnsured) return;
  try {
    const db = await getDatabase();
    await db.collection(COLLECTION_NAME).createIndex({ id: 1 }, { unique: true });
    await db.collection(COLLECTION_NAME).createIndex({ slug: 1 }, { unique: true });
    await db.collection(COLLECTION_NAME).createIndex({ ownerId: 1 });
    await db.collection(COLLECTION_NAME).createIndex({ status: 1, visibility: 1 });
    indexEnsured = true;
  } catch (err) {
    console.warn("[BusinessService] Index initialization deferred:", (err as Error).message);
  }
}

/**
 * Ensures unique slug by checking DB and appending counter if needed
 */
export async function generateUniqueBusinessSlug(name: string, excludeId?: string): Promise<string> {
  const baseSlug = generateSlug(name) || "sister-business";
  let slug = baseSlug;
  let counter = 1;

  try {
    const db = await getDatabase();
    while (true) {
      const existing = await db.collection<BusinessDocument>(COLLECTION_NAME).findOne({
        slug,
        ...(excludeId ? { id: { $ne: excludeId } } : {}),
      });

      if (!existing) {
        return slug;
      }

      counter++;
      slug = `${baseSlug}-${counter}`;
    }
  } catch {
    return `${baseSlug}-${Date.now().toString().slice(-4)}`;
  }
}

/**
 * Retrieve all businesses owned by a member
 */
export async function getBusinessesByOwnerId(ownerId: string): Promise<BusinessDocument[]> {
  if (!ownerId) return [];
  await ensureIndex();

  try {
    const db = await getDatabase();
    const cursor = db.collection<BusinessDocument>(COLLECTION_NAME).find({ ownerId }).sort({ createdAt: -1 });
    return await cursor.toArray();
  } catch (err) {
    console.warn("[BusinessService] Failed to query member businesses:", (err as Error).message);
    return [];
  }
}

/**
 * Retrieve a specific business by ID
 */
export async function getBusinessById(id: string): Promise<BusinessDocument | null> {
  if (!id) return null;
  await ensureIndex();

  try {
    const db = await getDatabase();
    return await db.collection<BusinessDocument>(COLLECTION_NAME).findOne({ id });
  } catch (err) {
    console.warn("[BusinessService] Failed to query business by id:", (err as Error).message);
    return null;
  }
}

/**
 * Retrieve business by unique slug
 */
export async function getBusinessBySlug(slug: string): Promise<BusinessDocument | null> {
  if (!slug) return null;
  await ensureIndex();

  try {
    const db = await getDatabase();
    return await db.collection<BusinessDocument>(COLLECTION_NAME).findOne({ slug });
  } catch (err) {
    console.warn("[BusinessService] Failed to query business by slug:", (err as Error).message);
    return null;
  }
}

/**
 * Create a new business with verified session owner
 */
export async function createBusiness(
  ownerId: string,
  data: BusinessRegistrationInput,
  ownerName?: string
): Promise<BusinessDocument> {
  if (!ownerId) {
    throw new Error("Authentication required: ownerId cannot be empty.");
  }

  await ensureIndex();

  const businessId = `biz_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const slug = await generateUniqueBusinessSlug(data.name);

  const newBusiness: BusinessDocument = {
    id: businessId,
    ownerId,
    ownerName: ownerName || "Sister Entrepreneur",
    name: data.name,
    slug,
    shortDescription: data.shortDescription,
    fullDescription: data.fullDescription,
    category: data.category,
    businessType: data.businessType,
    logo: data.logo || null,
    coverImage: data.coverImage || null,
    contact: {
      email: data.email,
      phone: data.phone,
      altPhone: data.altPhone || undefined,
      website: data.website || undefined,
      facebook: data.facebook || undefined,
      instagram: data.instagram || undefined,
      linkedin: data.linkedin || undefined,
    },
    location: {
      country: data.country || "Bangladesh",
      division: data.division,
      district: data.district,
      city: data.city,
      address: data.address || undefined,
      postalCode: data.postalCode || undefined,
    },
    yearEstablished: data.yearEstablished || undefined,
    status: data.submitForReview ? "PENDING_REVIEW" : "DRAFT",
    verificationStatus: "NOT_SUBMITTED",
    visibility: data.visibility || "PUBLIC",
    hasActiveShop: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  try {
    const db = await getDatabase();
    await db.collection(COLLECTION_NAME).insertOne({ ...newBusiness } as any);
    return newBusiness;
  } catch (err) {
    console.warn("[BusinessService] Insert deferred or error:", (err as Error).message);
    return newBusiness;
  }
}

/**
 * Update an existing business with strict ownership check
 */
export async function updateBusiness(
  businessId: string,
  ownerId: string,
  updateData: BusinessUpdateInput
): Promise<BusinessDocument> {
  if (!businessId || !ownerId) {
    throw new Error("Business ID and Owner ID are required.");
  }

  const existing = await getBusinessById(businessId);
  if (!existing) {
    throw new Error("Business not found.");
  }

  if (existing.ownerId !== ownerId) {
    throw new Error("Unauthorized: You do not own this business.");
  }

  let slug = existing.slug;
  if (updateData.name && updateData.name.trim() !== existing.name) {
    slug = await generateUniqueBusinessSlug(updateData.name, businessId);
  }

  const updatedContact = {
    ...existing.contact,
    ...(updateData.email !== undefined ? { email: updateData.email } : {}),
    ...(updateData.phone !== undefined ? { phone: updateData.phone } : {}),
    ...(updateData.altPhone !== undefined ? { altPhone: updateData.altPhone || undefined } : {}),
    ...(updateData.website !== undefined ? { website: updateData.website || undefined } : {}),
    ...(updateData.facebook !== undefined ? { facebook: updateData.facebook || undefined } : {}),
    ...(updateData.instagram !== undefined ? { instagram: updateData.instagram || undefined } : {}),
    ...(updateData.linkedin !== undefined ? { linkedin: updateData.linkedin || undefined } : {}),
  };

  const updatedLocation = {
    ...existing.location,
    ...(updateData.country !== undefined ? { country: updateData.country } : {}),
    ...(updateData.division !== undefined ? { division: updateData.division } : {}),
    ...(updateData.district !== undefined ? { district: updateData.district } : {}),
    ...(updateData.city !== undefined ? { city: updateData.city } : {}),
    ...(updateData.address !== undefined ? { address: updateData.address || undefined } : {}),
    ...(updateData.postalCode !== undefined ? { postalCode: updateData.postalCode || undefined } : {}),
  };

  let newStatus = existing.status;
  if (updateData.submitForReview && existing.status === "DRAFT") {
    newStatus = "PENDING_REVIEW";
  }

  const toSet = {
    name: updateData.name ?? existing.name,
    slug,
    shortDescription: updateData.shortDescription ?? existing.shortDescription,
    fullDescription: updateData.fullDescription ?? existing.fullDescription,
    category: updateData.category ?? existing.category,
    businessType: updateData.businessType ?? existing.businessType,
    logo: updateData.logo !== undefined ? updateData.logo : existing.logo,
    coverImage: updateData.coverImage !== undefined ? updateData.coverImage : existing.coverImage,
    contact: updatedContact,
    location: updatedLocation,
    yearEstablished: updateData.yearEstablished !== undefined ? (updateData.yearEstablished || undefined) : existing.yearEstablished,
    visibility: updateData.visibility ?? existing.visibility,
    status: newStatus,
    updatedAt: new Date(),
  };

  try {
    const db = await getDatabase();
    await db.collection(COLLECTION_NAME).updateOne({ id: businessId }, { $set: toSet });
    return { ...existing, ...toSet };
  } catch (err) {
    console.warn("[BusinessService] Update deferred or error:", (err as Error).message);
    return { ...existing, ...toSet };
  }
}

/**
 * Submit verification documents for a business
 */
export async function submitBusinessVerification(
  businessId: string,
  ownerId: string,
  input: BusinessVerificationInput
): Promise<BusinessDocument> {
  const existing = await getBusinessById(businessId);
  if (!existing) {
    throw new Error("Business not found.");
  }

  if (existing.ownerId !== ownerId) {
    throw new Error("Unauthorized: You do not own this business.");
  }

  const newDoc = {
    id: `doc_${Date.now()}`,
    type: input.documentType,
    title: input.documentTitle,
    fileUrl: input.documentUrl,
    uploadedAt: new Date(),
  };

  const existingDocs = existing.verificationDocuments || [];
  const updatedDocs = [...existingDocs, newDoc];

  const toSet = {
    verificationStatus: "PENDING" as const,
    verificationDocuments: updatedDocs,
    verificationNotes: input.notes || existing.verificationNotes,
    updatedAt: new Date(),
  };

  try {
    const db = await getDatabase();
    await db.collection(COLLECTION_NAME).updateOne({ id: businessId }, { $set: toSet });
    return { ...existing, ...toSet };
  } catch (err) {
    console.warn("[BusinessService] Verification submission deferred:", (err as Error).message);
    return { ...existing, ...toSet };
  }
}

/**
 * Retrieve public businesses (approved & public only)
 */
export async function getPublicApprovedBusinesses(filters?: {
  category?: string;
  division?: string;
  search?: string;
}): Promise<PublicBusinessProfile[]> {
  await ensureIndex();

  const query: Record<string, any> = {
    status: "APPROVED",
    visibility: "PUBLIC",
  };

  if (filters?.category && filters.category !== "all") {
    query.category = filters.category;
  }

  if (filters?.division && filters.division !== "all") {
    query["location.division"] = filters.division;
  }

  if (filters?.search) {
    query.$or = [
      { name: { $regex: filters.search, $options: "i" } },
      { shortDescription: { $regex: filters.search, $options: "i" } },
      { category: { $regex: filters.search, $options: "i" } },
    ];
  }

  try {
    const db = await getDatabase();
    const cursor = db.collection<BusinessDocument>(COLLECTION_NAME).find(query).sort({ createdAt: -1 });
    const docs = await cursor.toArray();
    return docs.map((doc) => filterBusinessForPublic(doc)!).filter(Boolean);
  } catch {
    return [];
  }
}

/**
 * Get public business by slug with privacy filtering
 */
export async function getPublicBusinessBySlug(
  slug: string,
  viewerUserId?: string | null,
  isAdmin = false
): Promise<PublicBusinessProfile | null> {
  const business = await getBusinessBySlug(slug);
  if (!business) return null;
  return filterBusinessForPublic(business, { viewerUserId, isAdmin });
}
