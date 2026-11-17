import { getDatabase } from "@/lib/db/mongodb";
import type { ShopDocument, PublicShopProfile, ShopPolicies } from "@/types/shop";
import { generateSlug } from "@/lib/validations/business";
import { getBusinessById } from "./business-service";
import { filterShopForPublic } from "@/features/shop/utils/shop-utils";

const COLLECTION_NAME = "shops";

let indexEnsured = false;
async function ensureIndex() {
  if (indexEnsured) return;
  try {
    const db = await getDatabase();
    await db.collection(COLLECTION_NAME).createIndex({ id: 1 }, { unique: true });
    await db.collection(COLLECTION_NAME).createIndex({ businessId: 1 }, { unique: true });
    await db.collection(COLLECTION_NAME).createIndex({ slug: 1 }, { unique: true });
    await db.collection(COLLECTION_NAME).createIndex({ ownerId: 1 });
    indexEnsured = true;
  } catch (err) {
    console.warn("[ShopService] Index initialization deferred:", (err as Error).message);
  }
}

/**
 * Generate unique shop slug
 */
export async function generateUniqueShopSlug(name: string, excludeId?: string): Promise<string> {
  const baseSlug = generateSlug(name) || "sister-shop";
  let slug = baseSlug;
  let counter = 1;

  try {
    const db = await getDatabase();
    while (true) {
      const existing = await db.collection<ShopDocument>(COLLECTION_NAME).findOne({
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
 * Retrieve shop by associated business ID
 */
export async function getShopByBusinessId(businessId: string): Promise<ShopDocument | null> {
  if (!businessId) return null;
  await ensureIndex();

  try {
    const db = await getDatabase();
    return await db.collection<ShopDocument>(COLLECTION_NAME).findOne({ businessId });
  } catch (err) {
    console.warn("[ShopService] Lookup by businessId failed:", (err as Error).message);
    return null;
  }
}

/**
 * Retrieve shop by unique slug
 */
export async function getShopBySlug(slug: string): Promise<ShopDocument | null> {
  if (!slug) return null;
  await ensureIndex();

  try {
    const db = await getDatabase();
    return await db.collection<ShopDocument>(COLLECTION_NAME).findOne({ slug });
  } catch (err) {
    console.warn("[ShopService] Lookup by slug failed:", (err as Error).message);
    return null;
  }
}

/**
 * Retrieve all shops owned by member
 */
export async function getShopsByOwnerId(ownerId: string): Promise<ShopDocument[]> {
  if (!ownerId) return [];
  await ensureIndex();

  try {
    const db = await getDatabase();
    return await db.collection<ShopDocument>(COLLECTION_NAME).find({ ownerId }).toArray();
  } catch (err) {
    console.warn("[ShopService] Lookup by ownerId failed:", (err as Error).message);
    return [];
  }
}

/**
 * Create or configure a shop for an approved or pending business
 */
export async function createOrUpdateShop(
  ownerId: string,
  businessId: string,
  data: Partial<ShopDocument>
): Promise<ShopDocument> {
  if (!ownerId || !businessId) {
    throw new Error("Owner ID and Business ID are required.");
  }

  const business = await getBusinessById(businessId);
  if (!business) {
    throw new Error("Associated business not found.");
  }

  if (business.ownerId !== ownerId) {
    throw new Error("Unauthorized: You do not own this business.");
  }

  await ensureIndex();

  const existingShop = await getShopByBusinessId(businessId);
  const shopId = existingShop ? existingShop.id : `shop_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  let slug = existingShop?.slug || "";
  if (!slug || (data.name && data.name !== existingShop?.name)) {
    slug = await generateUniqueShopSlug(data.name || business.name, existingShop?.id);
  } else if (data.slug && data.slug !== existingShop?.slug) {
    slug = await generateUniqueShopSlug(data.slug, existingShop?.id);
  }

  // If business is not yet approved, shop cannot be ACTIVE
  let status = data.status || existingShop?.status || "DRAFT";
  if (status === "ACTIVE" && business.status !== "APPROVED") {
    status = "PENDING_REVIEW";
  }

  const shopDoc: ShopDocument = {
    id: shopId,
    businessId,
    ownerId,
    businessName: business.name,
    businessSlug: business.slug,
    name: data.name || existingShop?.name || `${business.name} Shop`,
    slug,
    shortDescription: data.shortDescription ?? existingShop?.shortDescription ?? business.shortDescription,
    logo: data.logo !== undefined ? data.logo : (existingShop?.logo ?? business.logo),
    banner: data.banner !== undefined ? data.banner : (existingShop?.banner ?? business.coverImage),
    supportEmail: data.supportEmail ?? existingShop?.supportEmail ?? business.contact.email,
    supportPhone: data.supportPhone ?? existingShop?.supportPhone ?? business.contact.phone,
    policies: {
      ...(existingShop?.policies || {}),
      ...(data.policies || {}),
    },
    status,
    productCount: existingShop?.productCount || 0,
    totalOrdersCount: existingShop?.totalOrdersCount || 0,
    createdAt: existingShop?.createdAt || new Date(),
    updatedAt: new Date(),
  };

  try {
    const db = await getDatabase();
    await db.collection(COLLECTION_NAME).updateOne(
      { businessId },
      { $set: shopDoc },
      { upsert: true }
    );

    // Update business reference
    await db.collection("businesses").updateOne(
      { id: businessId },
      {
        $set: {
          shopId,
          hasActiveShop: status === "ACTIVE",
          updatedAt: new Date(),
        },
      }
    );

    return shopDoc;
  } catch (err) {
    console.warn("[ShopService] Save shop deferred or error:", (err as Error).message);
    return shopDoc;
  }
}

/**
 * Update shop policies
 */
export async function updateShopPolicies(
  businessId: string,
  ownerId: string,
  policies: ShopPolicies
): Promise<ShopDocument> {
  const shop = await getShopByBusinessId(businessId);
  if (!shop) {
    throw new Error("Shop not found for this business.");
  }
  if (shop.ownerId !== ownerId) {
    throw new Error("Unauthorized to edit shop policies.");
  }

  const updatedPolicies = {
    ...shop.policies,
    ...policies,
  };

  try {
    const db = await getDatabase();
    await db.collection(COLLECTION_NAME).updateOne(
      { businessId },
      { $set: { policies: updatedPolicies, updatedAt: new Date() } }
    );
    return { ...shop, policies: updatedPolicies, updatedAt: new Date() };
  } catch {
    return { ...shop, policies: updatedPolicies };
  }
}

/**
 * Retrieve public shop profile by slug
 */
export async function getPublicShopBySlug(
  slug: string,
  viewerUserId?: string | null,
  isAdmin = false
): Promise<PublicShopProfile | null> {
  const shop = await getShopBySlug(slug);
  if (!shop) return null;

  const business = await getBusinessById(shop.businessId);
  const isVerified = business?.verificationStatus === "VERIFIED";

  return filterShopForPublic(shop, isVerified, { viewerUserId, isAdmin });
}
