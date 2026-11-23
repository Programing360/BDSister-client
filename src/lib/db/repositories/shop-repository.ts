import { getDatabase } from "@/lib/db/mongodb";
import { toPlainObject } from "@/lib/utils/serialize";
import type { ShopDocument, PublicShopProfile, ShopPolicies } from "@/types/shop";
import { generateSlug } from "@/lib/validations/business";
import { findBusinessById } from "./business-repository";
import { filterShopForPublic } from "@/features/shop/utils/shop-utils";

const COLLECTION_NAME = "shops";

let indexEnsured = false;
export async function ensureShopIndices() {
  if (indexEnsured) return;
  try {
    const db = await getDatabase();
    await db.collection(COLLECTION_NAME).createIndex({ id: 1 }, { unique: true });
    await db.collection(COLLECTION_NAME).createIndex({ businessId: 1 }, { unique: true });
    await db.collection(COLLECTION_NAME).createIndex({ slug: 1 }, { unique: true });
    await db.collection(COLLECTION_NAME).createIndex({ ownerId: 1 });
    indexEnsured = true;
  } catch (err) {
    console.warn("[ShopRepo] Index initialization deferred:", (err as Error).message);
  }
}

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

export async function findShopByBusinessId(businessId: string): Promise<ShopDocument | null> {
  if (!businessId) return null;
  await ensureShopIndices();

  try {
    const db = await getDatabase();
    const doc = await db.collection<ShopDocument>(COLLECTION_NAME).findOne({ businessId });
    return doc ? toPlainObject(doc) : null;
  } catch (err) {
    console.warn("[ShopRepo] Lookup by businessId failed:", (err as Error).message);
    return null;
  }
}

export async function findShopBySlug(slug: string): Promise<ShopDocument | null> {
  if (!slug) return null;
  await ensureShopIndices();

  try {
    const db = await getDatabase();
    const doc = await db.collection<ShopDocument>(COLLECTION_NAME).findOne({ slug });
    return doc ? toPlainObject(doc) : null;
  } catch (err) {
    console.warn("[ShopRepo] Lookup by slug failed:", (err as Error).message);
    return null;
  }
}

export async function findShopsByOwnerId(ownerId: string): Promise<ShopDocument[]> {
  if (!ownerId) return [];
  await ensureShopIndices();

  try {
    const db = await getDatabase();
    const docs = await db.collection<ShopDocument>(COLLECTION_NAME).find({ ownerId }).toArray();
    return toPlainObject(docs);
  } catch (err) {
    console.warn("[ShopRepo] Lookup by ownerId failed:", (err as Error).message);
    return [];
  }
}

export async function saveShop(
  ownerId: string,
  businessId: string,
  data: Partial<ShopDocument>
): Promise<ShopDocument> {
  if (!ownerId || !businessId) {
    throw new Error("Owner ID and Business ID are required.");
  }

  const business = await findBusinessById(businessId);
  if (!business) {
    throw new Error("Associated business not found.");
  }

  if (business.ownerId !== ownerId) {
    throw new Error("Unauthorized: You do not own this business.");
  }

  await ensureShopIndices();

  const existingShop = await findShopByBusinessId(businessId);
  const shopId = existingShop ? existingShop.id : `shop_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  let slug = existingShop?.slug || "";
  if (!slug || (data.name && data.name !== existingShop?.name)) {
    slug = await generateUniqueShopSlug(data.name || business.name, existingShop?.id);
  } else if (data.slug && data.slug !== existingShop?.slug) {
    slug = await generateUniqueShopSlug(data.slug, existingShop?.id);
  }

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
    console.warn("[ShopRepo] Save shop deferred or error:", (err as Error).message);
    return shopDoc;
  }
}

export async function modifyShopPolicies(
  businessId: string,
  ownerId: string,
  policies: ShopPolicies
): Promise<ShopDocument> {
  const shop = await findShopByBusinessId(businessId);
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

export async function queryPublicShopBySlug(
  slug: string,
  viewerUserId?: string | null,
  isAdmin = false
): Promise<PublicShopProfile | null> {
  const shop = await findShopBySlug(slug);
  if (!shop) return null;

  const business = await findBusinessById(shop.businessId);
  const isVerified = business?.verificationStatus === "VERIFIED";

  return filterShopForPublic(shop, isVerified, { viewerUserId, isAdmin });
}
