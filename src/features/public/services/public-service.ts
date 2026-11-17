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

// ----------------------------------------------------------------------
// Public Data Access Service
// ----------------------------------------------------------------------

export async function getBusinesses(): Promise<Business[]> {
  return MOCK_BUSINESSES.map(normalizeBusiness);
}

export async function getFeaturedBusinesses(): Promise<Business[]> {
  return MOCK_BUSINESSES.slice(0, 3).map(normalizeBusiness);
}

export async function getBusinessBySlug(slug: string): Promise<Business | null> {
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
  return MOCK_PRODUCTS.map(normalizeProduct);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return MOCK_PRODUCTS.slice(0, 4).map(normalizeProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const item = MOCK_PRODUCTS.find((p) => p.slug === slug);
  return item ? normalizeProduct(item) : null;
}

export async function getProductCategories(): Promise<string[]> {
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
