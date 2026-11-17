import { getDatabase } from "@/lib/db/mongodb";
import type { CategoryDocument, PublicCategory } from "@/types/category";

const COLLECTION_NAME = "categories";

export const DEFAULT_CATEGORIES: Omit<CategoryDocument, "_id" | "createdAt" | "updatedAt">[] = [
  {
    id: "cat_fashion_saree",
    name: "Fashion & Saree",
    slug: "fashion-saree",
    description: "Authentic Jamdani, fine Muslin, handloom silk, modest abayas, and festive ethnic wear.",
    icon: "Sparkles",
    subcategories: ["Muslin Jamdani", "Rajshahi Silk", "Handloom Cotton", "Kurtis & Tunics", "Modest Wear"],
    isActive: true,
    displayOrder: 1,
    productCount: 14,
  },
  {
    id: "cat_beauty_wellness",
    name: "Beauty & Wellness",
    slug: "beauty-wellness",
    description: "Ayurvedic skincare, cold-pressed facial oils, organic hair elixirs, and clean herbal care.",
    icon: "Heart",
    subcategories: ["Facial Oils & Serums", "Herbal Haircare", "Organic Soaps", "Aromatherapy"],
    isActive: true,
    displayOrder: 2,
    productCount: 8,
  },
  {
    id: "cat_home_living",
    name: "Home & Living",
    slug: "home-living",
    description: "Heritage Nokshi Kantha, handcrafted clay pottery, jute floor mats, and brass decor.",
    icon: "Store",
    subcategories: ["Nokshi Kantha", "Jute Craft", "Pottery & Terracotta", "Table Linen & Cushions"],
    isActive: true,
    displayOrder: 3,
    productCount: 12,
  },
  {
    id: "cat_jewelry_accessories",
    name: "Jewelry & Accessories",
    slug: "jewelry-accessories",
    description: "Filigree silver jewelry, terracotta bead earrings, hand-embroidered batua bags, and scarves.",
    icon: "ShoppingBag",
    subcategories: ["Silver Filigree", "Clay Jewelry", "Handmade Bags", "Dupattas & Scarves"],
    isActive: true,
    displayOrder: 4,
    productCount: 9,
  },
  {
    id: "cat_food_culinary",
    name: "Food & Culinary",
    slug: "food-culinary",
    description: "Artisan homemade sweets, organic Sundarban honey, pure cow ghee, and heritage delta pickles.",
    icon: "Package",
    subcategories: ["Heritage Sweets", "Sundarban Honey", "Organic Ghee", "Artisan Pickles"],
    isActive: true,
    displayOrder: 5,
    productCount: 7,
  },
  {
    id: "cat_art_crafts",
    name: "Art & Handicrafts",
    slug: "art-handicrafts",
    description: "Traditional Rickshaw art, Nakshi needlework, bamboo woodwork, and festive handmade decor.",
    icon: "Palette",
    subcategories: ["Rickshaw Painting", "Bamboo Crafts", "Embroidery Art", "Handmade Stationery"],
    isActive: true,
    displayOrder: 6,
    productCount: 6,
  },
  {
    id: "cat_digital_services",
    name: "Technology & Digital",
    slug: "technology-digital",
    description: "Creative digital illustrations, branding kits, website templates, and software solutions.",
    icon: "Laptop",
    subcategories: ["Brand Identity", "Digital Art", "Web Templates", "Social Media Kits"],
    isActive: true,
    displayOrder: 7,
    productCount: 4,
  },
];

let indexEnsured = false;
async function ensureIndex() {
  if (indexEnsured) return;
  try {
    const db = await getDatabase();
    await db.collection(COLLECTION_NAME).createIndex({ id: 1 }, { unique: true });
    await db.collection(COLLECTION_NAME).createIndex({ slug: 1 }, { unique: true });
    await db.collection(COLLECTION_NAME).createIndex({ isActive: 1, displayOrder: 1 });
    indexEnsured = true;
  } catch (err) {
    console.warn("[CategoryService] Index initialization deferred:", (err as Error).message);
  }
}

/**
 * Retrieves all active categories, seeding default artisan categories if the collection is empty
 */
export async function getCategories(): Promise<PublicCategory[]> {
  await ensureIndex();

  try {
    const db = await getDatabase();
    const count = await db.collection(COLLECTION_NAME).countDocuments();

    if (count === 0) {
      // Seed default categories
      const now = new Date();
      const docsToInsert = DEFAULT_CATEGORIES.map((cat) => ({
        ...cat,
        createdAt: now,
        updatedAt: now,
      }));
      await db.collection(COLLECTION_NAME).insertMany(docsToInsert);
    }

    const docs = await db
      .collection<CategoryDocument>(COLLECTION_NAME)
      .find({ isActive: true })
      .sort({ displayOrder: 1 })
      .toArray();

    return docs.map((doc) => ({
      id: doc.id,
      name: doc.name,
      slug: doc.slug,
      description: doc.description,
      icon: doc.icon,
      image: doc.image,
      subcategories: doc.subcategories || [],
      productCount: doc.productCount,
    }));
  } catch (err) {
    console.warn("[CategoryService] Fallback to in-memory categories:", (err as Error).message);
    return DEFAULT_CATEGORIES.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      icon: cat.icon,
      image: cat.image,
      subcategories: cat.subcategories || [],
      productCount: cat.productCount,
    }));
  }
}

export async function getCategoryBySlug(slug: string): Promise<PublicCategory | null> {
  const categories = await getCategories();
  return categories.find((c) => c.slug === slug) || null;
}
