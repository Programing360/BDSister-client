import { getDatabase } from "@/lib/db/mongodb";
import type {
  ProductDocument,
  PublicProductProfile,
  ProductStatsSummary,
  InventoryStatus,
} from "@/types/product";
import {
  type ProductCreateInput,
  type ProductUpdateInput,
  type InventoryUpdateInput,
  generateProductSlug,
} from "@/lib/validations/product";
import {
  calculateDiscountPercent,
  calculateInventoryStatus,
  filterProductForPublic,
} from "@/features/product/utils/product-utils";
import { findBusinessById as getBusinessById } from "@/lib/db/repositories/business-repository";
import { findShopByBusinessId as getShopByBusinessId } from "@/lib/db/repositories/shop-repository";

const COLLECTION_NAME = "products";

let indexEnsured = false;
async function ensureIndex() {
  if (indexEnsured) return;
  try {
    const db = await getDatabase();
    // MongoDB documents already use _id as unique identifier. Do not enforce unique index on optional 'id' field
    await db.collection(COLLECTION_NAME).createIndex({ slug: 1 });
    await db.collection(COLLECTION_NAME).createIndex({ ownerId: 1 });
    await db.collection(COLLECTION_NAME).createIndex({ businessId: 1 });
    await db.collection(COLLECTION_NAME).createIndex({ status: 1, visibility: 1 });
    await db.collection(COLLECTION_NAME).createIndex({ category: 1 });
    await db.collection(COLLECTION_NAME).createIndex({ "inventory.sku": 1 });
    await db.collection(COLLECTION_NAME).createIndex({ createdAt: -1 });
    indexEnsured = true;
  } catch (err) {
    console.warn("[ProductService] Index initialization deferred:", (err as Error).message);
  }
}

/**
 * Generates an isolated, collision-free product URL slug
 */
export async function generateUniqueProductSlug(name: string, excludeId?: string): Promise<string> {
  const baseSlug = generateProductSlug(name) || "artisan-product";
  let slug = baseSlug;
  let counter = 1;

  try {
    const db = await getDatabase();
    while (true) {
      const existing = await db.collection<ProductDocument>(COLLECTION_NAME).findOne({
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
 * Creates a new product for an authenticated business owner
 */
export async function createProduct(
  ownerId: string,
  input: ProductCreateInput
): Promise<ProductDocument> {
  await ensureIndex();

  if (!ownerId) {
    throw new Error("Unauthorized: Authenticated session required");
  }

  // 1. Verify business ownership
  const business = await getBusinessById(input.businessId);
  if (!business || business.ownerId !== ownerId) {
    throw new Error("Unauthorized: You can only create products for businesses you own");
  }

  // 2. Fetch associated shop if available or verify provided shop
  let shop = null;
  if (input.shopId) {
    shop = await getShopByBusinessId(input.businessId);
    if (!shop || shop.id !== input.shopId) {
      throw new Error("Invalid shop association for this business");
    }
  } else {
    shop = await getShopByBusinessId(input.businessId);
  }

  const slug = await generateUniqueProductSlug(input.name);
  const now = new Date();
  const productId = `prod_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

  // 3. Compute derived financial & inventory metrics
  const discountPercent = calculateDiscountPercent(
    input.pricing.regularPrice,
    input.pricing.salePrice
  );

  const inventoryStatus: InventoryStatus = calculateInventoryStatus(
    input.inventory.quantity,
    input.inventory.lowStockThreshold,
    input.inventory.trackInventory
  );

  const images = input.images.map((img, idx) => ({
    ...img,
    order: img.order ?? idx,
    isPrimary: idx === 0 || img.isPrimary,
  }));

  const primaryImage =
    input.primaryImage ||
    images.find((i) => i.isPrimary)?.url ||
    images[0]?.url ||
    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80";

  const newProduct: ProductDocument = {
    id: productId,
    ownerId,
    businessId: business.id,
    businessName: business.name,
    businessSlug: business.slug,
    shopId: shop?.id,
    shopName: shop?.name,
    shopSlug: shop?.slug,
    name: input.name,
    slug,
    shortDescription: input.shortDescription,
    description: input.description,
    category: input.category,
    subcategory: input.subcategory || undefined,
    tags: input.tags || [],
    pricing: {
      regularPrice: input.pricing.regularPrice,
      salePrice: input.pricing.salePrice || undefined,
      discountPercent: discountPercent > 0 ? discountPercent : undefined,
      costPrice: input.pricing.costPrice || undefined,
      currency: "BDT",
    },
    images,
    primaryImage,
    inventory: {
      sku: input.inventory.sku,
      quantity: input.inventory.quantity,
      lowStockThreshold: input.inventory.lowStockThreshold,
      trackInventory: input.inventory.trackInventory,
      status: inventoryStatus,
      backorderPolicy: input.inventory.backorderPolicy || "DENY",
    },
    status: input.status || "DRAFT",
    visibility: input.visibility || "PUBLIC",
    featured: input.featured ?? false,
    rating: 5.0,
    reviewsCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  const db = await getDatabase();
  await db.collection<ProductDocument>(COLLECTION_NAME).insertOne(newProduct);

  // Increment shop product count if shop exists
  if (shop?.id) {
    try {
      await db.collection("shops").updateOne({ id: shop.id }, { $inc: { productCount: 1 } });
    } catch {
      // non-fatal
    }
  }

  return newProduct;
}

/**
 * Retrieves all products owned by a member with aggregated statistics
 */
export async function getProductsByOwnerId(
  ownerId: string,
  options: {
    businessId?: string;
    category?: string;
    status?: string;
    search?: string;
    stockStatus?: string;
    sort?: string;
    page?: number;
    limit?: number;
  } = {}
): Promise<{
  products: ProductDocument[];
  total: number;
  page: number;
  totalPages: number;
  stats: ProductStatsSummary;
}> {
  await ensureIndex();

  if (!ownerId) {
    return {
      products: [],
      total: 0,
      page: 1,
      totalPages: 0,
      stats: { total: 0, published: 0, draft: 0, pendingReview: 0, lowStock: 0, outOfStock: 0 },
    };
  }

  const db = await getDatabase();
  const allOwnerProducts = await db
    .collection<ProductDocument>(COLLECTION_NAME)
    .find({ ownerId })
    .toArray();

  // Aggregate stats across all owner's products
  const stats: ProductStatsSummary = {
    total: allOwnerProducts.length,
    published: allOwnerProducts.filter((p) => p.status === "ACTIVE").length,
    draft: allOwnerProducts.filter((p) => p.status === "DRAFT").length,
    pendingReview: allOwnerProducts.filter((p) => p.status === "PENDING_REVIEW").length,
    lowStock: allOwnerProducts.filter((p) => p.inventory.status === "LOW_STOCK").length,
    outOfStock: allOwnerProducts.filter((p) => p.inventory.status === "OUT_OF_STOCK").length,
  };

  // Build filter query
  const query: any = { ownerId };

  if (options.businessId) {
    query.businessId = options.businessId;
  }

  if (options.category && options.category !== "all") {
    query.category = options.category;
  }

  if (options.status && options.status !== "all") {
    query.status = options.status;
  }

  if (options.stockStatus && options.stockStatus !== "all") {
    query["inventory.status"] = options.stockStatus;
  }

  if (options.search?.trim()) {
    const searchRegex = new RegExp(options.search.trim(), "i");
    query.$or = [
      { name: searchRegex },
      { "inventory.sku": searchRegex },
      { shortDescription: searchRegex },
      { tags: searchRegex },
    ];
  }

  const sortOption: any = {};
  switch (options.sort) {
    case "price_asc":
      sortOption["pricing.regularPrice"] = 1;
      break;
    case "price_desc":
      sortOption["pricing.regularPrice"] = -1;
      break;
    case "name_asc":
      sortOption.name = 1;
      break;
    case "oldest":
      sortOption.createdAt = 1;
      break;
    case "newest":
    default:
      sortOption.createdAt = -1;
      break;
  }

  const page = Math.max(1, options.page || 1);
  const limit = Math.max(1, Math.min(100, options.limit || 12));
  const skip = (page - 1) * limit;

  const total = await db.collection<ProductDocument>(COLLECTION_NAME).countDocuments(query);
  const products = await db
    .collection<ProductDocument>(COLLECTION_NAME)
    .find(query)
    .sort(sortOption)
    .skip(skip)
    .limit(limit)
    .toArray();

  return {
    products,
    total,
    page,
    totalPages: Math.ceil(total / limit) || 1,
    stats,
  };
}

/**
 * Retrieves a product by ID, verifying ownership when required
 */
export async function getProductById(
  id: string,
  ownerId?: string
): Promise<ProductDocument | null> {
  await ensureIndex();

  try {
    const db = await getDatabase();
    const query: any = { id };
    if (ownerId) {
      query.ownerId = ownerId;
    }
    return await db.collection<ProductDocument>(COLLECTION_NAME).findOne(query);
  } catch {
    return null;
  }
}

/**
 * Updates a product with server-side ownership verification
 */
export async function updateProduct(
  id: string,
  ownerId: string,
  input: Partial<ProductCreateInput>
): Promise<ProductDocument | null> {
  await ensureIndex();

  const existing = await getProductById(id, ownerId);
  if (!existing) {
    throw new Error("Product not found or access unauthorized");
  }

  const now = new Date();
  const updateDoc: any = { updatedAt: now };

  if (input.name && input.name !== existing.name) {
    updateDoc.name = input.name;
    updateDoc.slug = await generateUniqueProductSlug(input.name, id);
  }

  if (input.shortDescription !== undefined) updateDoc.shortDescription = input.shortDescription;
  if (input.description !== undefined) updateDoc.description = input.description;
  if (input.category !== undefined) updateDoc.category = input.category;
  if (input.subcategory !== undefined) updateDoc.subcategory = input.subcategory || undefined;
  if (input.tags !== undefined) updateDoc.tags = input.tags;

  // Pricing updates
  if (input.pricing) {
    const regPrice = input.pricing.regularPrice ?? existing.pricing.regularPrice;
    const salePrice = input.pricing.salePrice !== undefined ? input.pricing.salePrice : existing.pricing.salePrice;
    const discount = calculateDiscountPercent(regPrice, salePrice);

    updateDoc.pricing = {
      ...existing.pricing,
      regularPrice: regPrice,
      salePrice: salePrice || undefined,
      discountPercent: discount > 0 ? discount : undefined,
      costPrice: input.pricing.costPrice !== undefined ? input.pricing.costPrice : existing.pricing.costPrice,
    };
  }

  // Inventory updates
  if (input.inventory) {
    const qty = input.inventory.quantity ?? existing.inventory.quantity;
    const threshold = input.inventory.lowStockThreshold ?? existing.inventory.lowStockThreshold;
    const track = input.inventory.trackInventory ?? existing.inventory.trackInventory;
    const invStatus = calculateInventoryStatus(qty, threshold, track);

    updateDoc.inventory = {
      ...existing.inventory,
      sku: input.inventory.sku ?? existing.inventory.sku,
      quantity: Math.max(0, qty),
      lowStockThreshold: Math.max(0, threshold),
      trackInventory: track,
      status: invStatus,
      backorderPolicy: input.inventory.backorderPolicy ?? existing.inventory.backorderPolicy,
    };
  }

  // Media updates
  if (input.images) {
    updateDoc.images = input.images;
    updateDoc.primaryImage =
      input.primaryImage ||
      input.images.find((i) => i.isPrimary)?.url ||
      input.images[0]?.url ||
      existing.primaryImage;
  }

  if (input.status) updateDoc.status = input.status;
  if (input.visibility) updateDoc.visibility = input.visibility;
  if (input.featured !== undefined) updateDoc.featured = input.featured;

  const db = await getDatabase();
  await db.collection<ProductDocument>(COLLECTION_NAME).updateOne({ id }, { $set: updateDoc });

  return await getProductById(id, ownerId);
}

/**
 * Updates inventory quantity atomically and recalculates status
 */
export async function updateProductInventory(
  id: string,
  ownerId: string,
  input: InventoryUpdateInput
): Promise<ProductDocument | null> {
  await ensureIndex();

  const existing = await getProductById(id, ownerId);
  if (!existing) {
    throw new Error("Product not found or access unauthorized");
  }

  const qty = Math.max(0, input.quantity);
  const threshold = input.lowStockThreshold ?? existing.inventory.lowStockThreshold;
  const track = input.trackInventory ?? existing.inventory.trackInventory;
  const status = calculateInventoryStatus(qty, threshold, track);

  const db = await getDatabase();
  await db.collection<ProductDocument>(COLLECTION_NAME).updateOne(
    { id },
    {
      $set: {
        "inventory.quantity": qty,
        "inventory.lowStockThreshold": threshold,
        "inventory.trackInventory": track,
        "inventory.status": status,
        updatedAt: new Date(),
      },
    }
  );

  return await getProductById(id, ownerId);
}

/**
 * Performs a quick stock delta or direct set adjustment
 */
export async function adjustProductStock(
  productId: string,
  ownerId: string,
  adjustment: number,
  mode: "SET" | "INCREMENT" = "SET"
): Promise<ProductDocument | null> {
  const existing = await getProductById(productId, ownerId);
  if (!existing) {
    throw new Error("Product not found or access unauthorized");
  }

  let newQty = 0;
  if (mode === "INCREMENT") {
    newQty = Math.max(0, existing.inventory.quantity + adjustment);
  } else {
    newQty = Math.max(0, adjustment);
  }

  return await updateProductInventory(productId, ownerId, {
    quantity: newQty,
    lowStockThreshold: existing.inventory.lowStockThreshold,
    trackInventory: existing.inventory.trackInventory,
  });
}

/**
 * Archives a product (soft delete)
 */
export async function archiveProduct(id: string, ownerId: string): Promise<boolean> {
  await ensureIndex();
  const existing = await getProductById(id, ownerId);
  if (!existing) {
    throw new Error("Product not found or access unauthorized");
  }

  const db = await getDatabase();
  const res = await db.collection(COLLECTION_NAME).updateOne(
    { id, ownerId },
    { $set: { status: "ARCHIVED", updatedAt: new Date() } }
  );

  return res.modifiedCount > 0;
}

/**
 * Submits a draft product for moderation review
 */
export async function submitProductForReview(id: string, ownerId: string): Promise<ProductDocument | null> {
  await ensureIndex();
  const existing = await getProductById(id, ownerId);
  if (!existing) {
    throw new Error("Product not found or access unauthorized");
  }

  const db = await getDatabase();
  await db.collection(COLLECTION_NAME).updateOne(
    { id, ownerId },
    { $set: { status: "PENDING_REVIEW", updatedAt: new Date() } }
  );

  return await getProductById(id, ownerId);
}

/**
 * Public Marketplace Query: retrieves verified active products with server-side filters
 */
export async function getPublicProducts(
  options: {
    search?: string;
    category?: string;
    inStockOnly?: boolean;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
    page?: number;
    limit?: number;
  } = {}
): Promise<{
  products: PublicProductProfile[];
  total: number;
  page: number;
  totalPages: number;
}> {
  await ensureIndex();

  const db = await getDatabase();
  const query: any = {
    status: "ACTIVE",
    visibility: "PUBLIC",
  };

  if (options.category && options.category !== "all" && options.category !== "All") {
    query.category = options.category;
  }

  if (options.inStockOnly) {
    query.$or = [
      { "inventory.trackInventory": false },
      { "inventory.quantity": { $gt: 0 } },
    ];
  }

  if (options.minPrice !== undefined || options.maxPrice !== undefined) {
    query["pricing.regularPrice"] = {};
    if (options.minPrice !== undefined) query["pricing.regularPrice"].$gte = options.minPrice;
    if (options.maxPrice !== undefined) query["pricing.regularPrice"].$lte = options.maxPrice;
  }

  if (options.search?.trim()) {
    const regex = new RegExp(options.search.trim(), "i");
    query.$or = [
      { name: regex },
      { shortDescription: regex },
      { description: regex },
      { tags: regex },
      { businessName: regex },
    ];
  }

  const sortOption: any = {};
  switch (options.sort) {
    case "price_asc":
      sortOption["pricing.regularPrice"] = 1;
      break;
    case "price_desc":
      sortOption["pricing.regularPrice"] = -1;
      break;
    case "rating":
      sortOption.rating = -1;
      break;
    case "featured":
      sortOption.featured = -1;
      sortOption.createdAt = -1;
      break;
    case "newest":
    default:
      sortOption.createdAt = -1;
      break;
  }

  const page = Math.max(1, options.page || 1);
  const limit = Math.max(1, Math.min(100, options.limit || 12));
  const skip = (page - 1) * limit;

  const total = await db.collection<ProductDocument>(COLLECTION_NAME).countDocuments(query);
  const docs = await db
    .collection<ProductDocument>(COLLECTION_NAME)
    .find(query)
    .sort(sortOption)
    .skip(skip)
    .limit(limit)
    .toArray();

  const sanitized = docs
    .map((doc) => filterProductForPublic(doc))
    .filter((p): p is PublicProductProfile => p !== null);

  return {
    products: sanitized,
    total,
    page,
    totalPages: Math.ceil(total / limit) || 1,
  };
}

/**
 * Retrieves a single public product by slug with preview support for the product owner
 */
export async function getPublicProductBySlug(
  slug: string,
  viewerUserId?: string
): Promise<PublicProductProfile | null> {
  await ensureIndex();

  try {
    const db = await getDatabase();
    const doc = await db.collection<ProductDocument>(COLLECTION_NAME).findOne({ slug });
    if (!doc) return null;

    // Check associated business verification/status if present
    const business = await getBusinessById(doc.businessId);
    const shop = doc.shopId ? await getShopByBusinessId(doc.businessId) : null;

    return filterProductForPublic(
      doc,
      business?.status,
      shop?.status,
      viewerUserId
    );
  } catch {
    return null;
  }
}

/**
 * Retrieves related products in the same category
 */
export async function getRelatedProducts(
  currentSlug: string,
  category: string,
  limit: number = 4
): Promise<PublicProductProfile[]> {
  await ensureIndex();

  try {
    const db = await getDatabase();
    const docs = await db
      .collection<ProductDocument>(COLLECTION_NAME)
      .find({
        slug: { $ne: currentSlug },
        category,
        status: "ACTIVE",
        visibility: "PUBLIC",
      })
      .limit(limit)
      .toArray();

    return docs
      .map((doc) => filterProductForPublic(doc))
      .filter((p): p is PublicProductProfile => p !== null);
  } catch {
    return [];
  }
}
