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
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

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

// ----------------------------------------------------------------------
// Public Data Access Service (Pure REST API with resilient fallback)
// ----------------------------------------------------------------------

export async function getBusinesses(): Promise<Business[]> {
  try {
    const res = await apiClient.get<any>(API_ENDPOINTS.business.list);
    const apiBusinesses = res.data?.businesses || res.data?.data || (Array.isArray(res.data) ? res.data : null);
    if (apiBusinesses && Array.isArray(apiBusinesses) && apiBusinesses.length > 0) {
      const normalizedApi: Business[] = apiBusinesses.map((doc: any) => ({
        id: doc.id || doc._id,
        slug: doc.slug,
        name: doc.name,
        tagline: doc.shortDescription || doc.tagline,
        description: doc.fullDescription || doc.shortDescription || doc.description,
        category: doc.category,
        location: `${doc.location?.city || ""}, ${doc.location?.division || ""}`,
        district: doc.location?.district,
        logo: doc.logo,
        coverImage: doc.coverImage,
        isVerified: doc.verificationStatus === "VERIFIED" || doc.isVerified,
        verified: doc.verificationStatus === "VERIFIED" || doc.isVerified,
        ownerName: doc.ownerName || "BDSisters Entrepreneur",
        founder: doc.ownerName || doc.founder,
        rating: doc.rating || 5.0,
        reviewCount: doc.reviewCount || doc.reviewsCount || 0,
        contactEmail: doc.contact?.email || doc.contactEmail,
        phone: doc.contact?.phone || doc.phone,
        website: doc.contact?.website || doc.website,
        tags: Array.isArray(doc.tags) ? doc.tags : [doc.category, doc.businessType].filter(Boolean),
        establishedYear: doc.yearEstablished || doc.establishedYear,
      }));
      return normalizedApi;
    }
  } catch {
    // API not active or build time offline
  }

  return MOCK_BUSINESSES.map(normalizeBusiness);
}

export async function getFeaturedBusinesses(): Promise<Business[]> {
  const all = await getBusinesses();
  return all.slice(0, 3);
}

export async function getBusinessBySlug(slug: string): Promise<Business | null> {
  try {
    const res = await apiClient.get<any>(API_ENDPOINTS.business.detail(slug));
    const doc = res.data?.business || res.data?.data || res.data;
    if (doc && doc.name) {
      return normalizeBusiness({
        id: doc.id || doc._id,
        slug: doc.slug,
        name: doc.name,
        tagline: doc.shortDescription || doc.tagline,
        description: doc.fullDescription || doc.shortDescription || doc.description,
        category: doc.category,
        location: `${doc.location?.city || ""}, ${doc.location?.division || ""}`,
        district: doc.location?.district,
        logo: doc.logo,
        coverImage: doc.coverImage,
        isVerified: doc.verificationStatus === "VERIFIED" || doc.isVerified,
        verified: doc.verificationStatus === "VERIFIED" || doc.isVerified,
        ownerName: doc.ownerName || "BDSisters Entrepreneur",
        founder: doc.ownerName || doc.founder,
        rating: doc.rating || 5.0,
        reviewCount: doc.reviewCount || doc.reviewsCount || 0,
        contactEmail: doc.contact?.email || doc.contactEmail,
        phone: doc.contact?.phone || doc.phone,
        website: doc.contact?.website || doc.website,
        tags: Array.isArray(doc.tags) ? doc.tags : [doc.category, doc.businessType].filter(Boolean),
        establishedYear: doc.yearEstablished || doc.establishedYear,
      });
    }
  } catch {
    // API not active, check fallback
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
    const res = await apiClient.get<any>(API_ENDPOINTS.ecommerce.products);
    const apiProducts = res.data?.products || res.data?.data || (Array.isArray(res.data) ? res.data : null);
    if (apiProducts && Array.isArray(apiProducts) && apiProducts.length > 0) {
      const normalizedApi: Product[] = apiProducts.map((doc: any) => {
        const regularPrice = doc.pricing?.regularPrice || doc.originalPrice || doc.price || 0;
        const salePrice = doc.pricing?.salePrice || doc.price || regularPrice;
        const discountPercent = doc.pricing?.discountPercent || (regularPrice > salePrice ? Math.round(((regularPrice - salePrice) / regularPrice) * 100) : 0);
        const isWholesale = doc.wholesaleEligible || (doc.inventory?.quantity >= 10) || doc.tags?.includes("wholesale");

        return {
          id: doc.id || doc._id,
          slug: doc.slug,
          name: doc.name,
          description: doc.shortDescription || doc.description,
          price: salePrice,
          originalPrice: regularPrice > salePrice ? regularPrice : undefined,
          discountPercent,
          wholesaleEligible: Boolean(isWholesale),
          currency: "BDT",
          category: doc.category,
          sellerName: doc.business?.name || doc.businessName || doc.sellerName,
          businessName: doc.business?.name || doc.businessName,
          sellerSlug: doc.business?.slug || doc.businessSlug,
          images: doc.images?.map((i: any) => (typeof i === "string" ? i : i.url)) || [doc.primaryImage],
          inStock: doc.inventory?.inStock ?? (doc.inventory?.quantity ? doc.inventory.quantity > 0 : true),
          stockCount: doc.inventory?.quantity || doc.inventory?.availableQuantity || 0,
          tags: doc.tags || [],
          rating: doc.rating || 5.0,
          reviewsCount: doc.reviewsCount || 0,
          featured: doc.featured || false,
        };
      });
      return normalizedApi;
    }
  } catch {
    // Fallback on API disconnect
  }

  return MOCK_PRODUCTS.map(normalizeProduct);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const res = await apiClient.get<any>(API_ENDPOINTS.ecommerce.products, {
      params: { featured: true, limit: 4 },
    });
    const apiProducts = res.data?.products || res.data?.data;
    if (apiProducts && Array.isArray(apiProducts) && apiProducts.length > 0) {
      return apiProducts.slice(0, 4).map((doc: any) => {
        const regularPrice = doc.pricing?.regularPrice || doc.originalPrice || doc.price || 0;
        const salePrice = doc.pricing?.salePrice || doc.price || regularPrice;
        return {
          id: doc.id || doc._id,
          slug: doc.slug,
          name: doc.name,
          description: doc.shortDescription || doc.description,
          price: salePrice,
          originalPrice: regularPrice > salePrice ? regularPrice : undefined,
          discountPercent: doc.pricing?.discountPercent,
          wholesaleEligible: Boolean(doc.wholesaleEligible),
          currency: "BDT",
          category: doc.category,
          sellerName: doc.business?.name || doc.businessName || doc.sellerName,
          businessName: doc.business?.name || doc.businessName,
          sellerSlug: doc.business?.slug || doc.businessSlug,
          images: doc.images?.map((i: any) => (typeof i === "string" ? i : i.url)) || [doc.primaryImage],
          inStock: true,
          stockCount: 10,
          tags: doc.tags || [],
          rating: doc.rating || 5.0,
          reviewsCount: doc.reviewsCount || 0,
          featured: true,
        };
      });
    }
  } catch {
    // Fallback
  }
  const all = await getProducts();
  return all.slice(0, 4);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const res = await apiClient.get<any>(API_ENDPOINTS.ecommerce.productDetail(slug));
    const doc = res.data?.product || res.data?.data || res.data;
    if (doc && doc.name) {
      const regularPrice = doc.pricing?.regularPrice || doc.originalPrice || doc.price || 0;
      const salePrice = doc.pricing?.salePrice || doc.price || regularPrice;
      const discountPercent = doc.pricing?.discountPercent || (regularPrice > salePrice ? Math.round(((regularPrice - salePrice) / regularPrice) * 100) : 0);
      const isWholesale = doc.wholesaleEligible || (doc.inventory?.quantity >= 10) || doc.tags?.includes("wholesale");

      return normalizeProduct({
        id: doc.id || doc._id,
        slug: doc.slug,
        name: doc.name,
        description: doc.fullDescription || doc.description || doc.shortDescription,
        price: salePrice,
        originalPrice: regularPrice > salePrice ? regularPrice : undefined,
        discountPercent,
        wholesaleEligible: Boolean(isWholesale),
        currency: "BDT",
        category: doc.category,
        sellerName: doc.business?.name || doc.businessName || doc.sellerName,
        businessName: doc.business?.name || doc.businessName,
        sellerSlug: doc.business?.slug || doc.businessSlug,
        images: doc.images?.map((i: any) => (typeof i === "string" ? i : i.url)) || [doc.primaryImage],
        inStock: doc.inventory?.inStock ?? (doc.inventory?.quantity ? doc.inventory.quantity > 0 : true),
        stockCount: doc.inventory?.quantity || doc.inventory?.availableQuantity || 0,
        tags: doc.tags || [],
        rating: doc.rating || 5.0,
        reviewsCount: doc.reviewsCount || 0,
        featured: doc.featured || false,
      });
    }
  } catch {
    // API not active
  }

  const item = MOCK_PRODUCTS.find((p) => p.slug === slug);
  return item ? normalizeProduct(item) : null;
}

export async function getProductCategories(): Promise<string[]> {
  try {
    const res = await apiClient.get<any>("/api/categories");
    if (res.data?.categories && Array.isArray(res.data.categories)) {
      return res.data.categories.map((c: any) => c.name || c);
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
