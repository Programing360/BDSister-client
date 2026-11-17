import {
  MOCK_BUSINESSES,
  MOCK_PRODUCTS,
  MOCK_EVENTS,
  MOCK_COURSES,
  MOCK_RESOURCES,
  MOCK_TEAM_MEMBERS,
  MOCK_TESTIMONIALS,
  MOCK_FAQS,
} from "../data/mock-data";
import type {
  Business,
  Product,
  Event,
  Course,
  Resource,
  TeamMember,
  Testimonial,
  FaqItem,
} from "@/types/public";

// Normalize helpers so all components get uniform fields
function normalizeBusiness(b: Business): Business {
  return {
    ...b,
    founder: b.founder ?? b.ownerName,
    verified: b.verified ?? b.isVerified ?? true,
    reviewCount: b.reviewCount ?? (b.productsCount ? b.productsCount * 4 + 8 : 24),
    contact: b.contact ?? {
      email: b.contactEmail,
      phone: b.phone,
      website: b.website,
    },
  };
}

function normalizeProduct(p: Product): Product {
  return {
    ...p,
    businessName: p.businessName ?? p.sellerName ?? "BDSisters Artisan",
    featured: p.featured ?? true,
  };
}

function normalizeEvent(e: Event): Event {
  return {
    ...e,
    type: e.type ?? (e.isOnline ? "online" : "in-person"),
    attendeesCount: e.attendeesCount ?? e.registeredCount ?? 45,
    maxCapacity: e.maxCapacity ?? e.capacity ?? 100,
    price: e.price ?? 0,
  };
}

function normalizeCourse(c: Course): Course {
  return {
    ...c,
    enrolledCount: c.enrolledCount ?? c.enrollmentsCount ?? 120,
    rating: c.rating ?? 4.9,
    price: c.price ?? 0,
  };
}

function normalizeResource(r: Resource): Resource {
  return {
    ...r,
    format: r.format ?? (r.type ? r.type.toLowerCase() : "pdf"),
    fileSize: r.fileSize ?? "2.5 MB",
    downloadCount: r.downloadCount ?? 280,
  };
}

function normalizeTeamMember(m: TeamMember): TeamMember {
  return {
    ...m,
    social: m.social ?? m.socialLinks,
  };
}

// Fast timeout helper for build time and disconnected DB states
function withTimeout<T>(promise: Promise<T>, ms = 1500): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout of ${ms}ms exceeded`)), ms)
    ),
  ]);
}

// ----------------------------------------------------------------------
// Public Data Access Service
// ----------------------------------------------------------------------

export async function getBusinesses(): Promise<Business[]> {
  try {
    const { getDatabase } = await import("@/lib/db/mongodb");
    const db = await withTimeout(getDatabase());
    const realDocs = await withTimeout(
      db.collection("businesses").find({ status: "APPROVED", visibility: "PUBLIC" }).toArray()
    );
    if (realDocs && realDocs.length > 0) {
      const realNormalized: Business[] = realDocs.map((doc: any) => ({
        id: doc.id,
        slug: doc.slug,
        name: doc.name,
        tagline: doc.shortDescription,
        description: doc.fullDescription || doc.shortDescription,
        category: doc.category,
        location: `${doc.location?.city || ""}, ${doc.location?.division || ""}`,
        district: doc.location?.district,
        logo: doc.logo,
        coverImage: doc.coverImage,
        isVerified: doc.verificationStatus === "VERIFIED",
        verified: doc.verificationStatus === "VERIFIED",
        ownerName: doc.ownerName || "BDSisters Entrepreneur",
        founder: doc.ownerName,
        rating: 5.0,
        reviewCount: 0,
        contactEmail: doc.contact?.email,
        phone: doc.contact?.phone,
        website: doc.contact?.website,
        tags: [doc.category, doc.businessType].filter(Boolean),
        establishedYear: doc.yearEstablished,
      }));
      return [...realNormalized, ...MOCK_BUSINESSES.map(normalizeBusiness)];
    }
  } catch {
    // fallback
  }
  return MOCK_BUSINESSES.map(normalizeBusiness);
}

export async function getFeaturedBusinesses(): Promise<Business[]> {
  const all = await getBusinesses();
  return all.slice(0, 3);
}

export async function getBusinessBySlug(slug: string): Promise<Business | null> {
  try {
    const { getDatabase } = await import("@/lib/db/mongodb");
    const db = await withTimeout(getDatabase());
    const doc: any = await withTimeout(
      db.collection("businesses").findOne({ slug })
    );
    if (doc) {
      return normalizeBusiness({
        id: doc.id,
        slug: doc.slug,
        name: doc.name,
        tagline: doc.shortDescription,
        description: doc.fullDescription || doc.shortDescription,
        category: doc.category,
        location: `${doc.location?.city || ""}, ${doc.location?.division || ""}`,
        district: doc.location?.district,
        logo: doc.logo,
        coverImage: doc.coverImage,
        isVerified: doc.verificationStatus === "VERIFIED",
        verified: doc.verificationStatus === "VERIFIED",
        ownerName: doc.ownerName || "BDSisters Entrepreneur",
        founder: doc.ownerName,
        rating: 5.0,
        reviewCount: 0,
        contactEmail: doc.contact?.email,
        phone: doc.contact?.phone,
        website: doc.contact?.website,
        tags: [doc.category, doc.businessType].filter(Boolean),
        establishedYear: doc.yearEstablished,
      });
    }
  } catch {
    // fallback
  }

  const item = MOCK_BUSINESSES.find((b) => b.slug === slug);
  return item ? normalizeBusiness(item) : null;
}

export async function getBusinessCategories(): Promise<string[]> {
  const set = new Set(MOCK_BUSINESSES.map((b) => b.category));
  return Array.from(set);
}

export async function getBusinessLocations(): Promise<string[]> {
  const set = new Set(MOCK_BUSINESSES.map((b) => b.district || b.location));
  return Array.from(set);
}

// --- Products ---
export async function getProducts(): Promise<Product[]> {
  try {
    const { getDatabase } = await import("@/lib/db/mongodb");
    const db = await withTimeout(getDatabase());
    const realDocs = await withTimeout(
      db
        .collection("products")
        .find({ status: "ACTIVE", visibility: "PUBLIC" })
        .toArray()
    );

    if (realDocs && realDocs.length > 0) {
      const realNormalized: Product[] = realDocs.map((doc: any) => ({
        id: doc.id,
        slug: doc.slug,
        name: doc.name,
        description: doc.shortDescription || doc.description,
        price: doc.pricing?.salePrice || doc.pricing?.regularPrice || 0,
        originalPrice: doc.pricing?.salePrice ? doc.pricing?.regularPrice : undefined,
        currency: "BDT",
        category: doc.category,
        sellerName: doc.businessName,
        businessName: doc.businessName,
        sellerSlug: doc.businessSlug,
        images: doc.images?.map((i: any) => i.url) || [doc.primaryImage],
        inStock: doc.inventory?.trackInventory === false ? true : (doc.inventory?.quantity || 0) > 0,
        stockCount: doc.inventory?.quantity || 0,
        tags: doc.tags || [],
        rating: doc.rating || 5.0,
        reviewsCount: doc.reviewsCount || 0,
        featured: doc.featured || false,
      }));
      return [...realNormalized, ...MOCK_PRODUCTS.map(normalizeProduct)];
    }
  } catch {
    // Fallback on DB disconnect
  }
  return MOCK_PRODUCTS.map(normalizeProduct);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const all = await getProducts();
  return all.slice(0, 4);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const { getDatabase } = await import("@/lib/db/mongodb");
    const db = await withTimeout(getDatabase());
    const doc: any = await withTimeout(
      db.collection("products").findOne({ slug })
    );

    if (doc) {
      return normalizeProduct({
        id: doc.id,
        slug: doc.slug,
        name: doc.name,
        description: doc.description || doc.shortDescription,
        price: doc.pricing?.salePrice || doc.pricing?.regularPrice || 0,
        originalPrice: doc.pricing?.salePrice ? doc.pricing?.regularPrice : undefined,
        currency: "BDT",
        category: doc.category,
        sellerName: doc.businessName,
        businessName: doc.businessName,
        sellerSlug: doc.businessSlug,
        images: doc.images?.map((i: any) => i.url) || [doc.primaryImage],
        inStock: doc.inventory?.trackInventory === false ? true : (doc.inventory?.quantity || 0) > 0,
        stockCount: doc.inventory?.quantity || 0,
        tags: doc.tags || [],
        rating: doc.rating || 5.0,
        reviewsCount: doc.reviewsCount || 0,
        featured: doc.featured || false,
      });
    }
  } catch {
    // Fallback on DB disconnect
  }

  const item = MOCK_PRODUCTS.find((p) => p.slug === slug);
  return item ? normalizeProduct(item) : null;
}

export async function getProductCategories(): Promise<string[]> {
  try {
    const { getCategories } = await import("@/lib/services/category-service");
    const dbCats = await getCategories();
    if (dbCats && dbCats.length > 0) {
      return dbCats.map((c) => c.name);
    }
  } catch {
    // Fallback
  }
  const set = new Set(MOCK_PRODUCTS.map((p) => p.category));
  return Array.from(set);
}

// --- Events ---
export async function getEvents(): Promise<Event[]> {
  return MOCK_EVENTS.map(normalizeEvent);
}

export async function getUpcomingEvents(): Promise<Event[]> {
  return MOCK_EVENTS.slice(0, 3).map(normalizeEvent);
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  const item = MOCK_EVENTS.find((e) => e.slug === slug);
  return item ? normalizeEvent(item) : null;
}

// --- Courses ---
export async function getCourses(): Promise<Course[]> {
  return MOCK_COURSES.map(normalizeCourse);
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
  const item = MOCK_COURSES.find((c) => c.slug === slug);
  return item ? normalizeCourse(item) : null;
}

export async function getCourseCategories(): Promise<string[]> {
  const set = new Set(MOCK_COURSES.map((c) => c.category));
  return Array.from(set);
}

// --- Resources ---
export async function getResources(): Promise<Resource[]> {
  return MOCK_RESOURCES.map(normalizeResource);
}

export async function getResourceBySlug(slug: string): Promise<Resource | null> {
  const item = MOCK_RESOURCES.find((r) => r.slug === slug);
  return item ? normalizeResource(item) : null;
}

export async function getResourceCategories(): Promise<string[]> {
  const set = new Set(MOCK_RESOURCES.map((r) => r.category));
  return Array.from(set);
}

// --- Team, Testimonials, FAQs ---
export async function getTeamMembers(): Promise<TeamMember[]> {
  return MOCK_TEAM_MEMBERS.map(normalizeTeamMember);
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return MOCK_TESTIMONIALS;
}

export async function getFaqs(category?: string): Promise<FaqItem[]> {
  if (category && category !== "all" && category !== "All") {
    return MOCK_FAQS.filter((f) => f.category === category);
  }
  return MOCK_FAQS;
}

export const publicService = {
  getBusinesses,
  getFeaturedBusinesses,
  getBusinessBySlug,
  getBusinessCategories,
  getBusinessLocations,
  getProducts,
  getFeaturedProducts,
  getProductBySlug,
  getProductCategories,
  getEvents,
  getUpcomingEvents,
  getEventBySlug,
  getCourses,
  getCourseBySlug,
  getCourseCategories,
  getResources,
  getResourceBySlug,
  getResourceCategories,
  getTeamMembers,
  getTestimonials,
  getFaqs,
};
