/**
 * BDSisters.org - Admin Business Reviews Demo Data
 * Step 6: Business Management & Seller Administration
 */

import type { BusinessReviewItem } from "../types/admin-business.ts";

export const DEMO_BUSINESS_REVIEWS: BusinessReviewItem[] = [
  {
    id: "rev_01",
    businessId: "biz_101",
    businessName: "Nilambari Jamdani & Heritage Silk",
    businessSlug: "nilambari-crafts",
    reviewerId: "BDS-MEM-10490",
    reviewerName: "Sabrina Akter",
    reviewerEmail: "sabrina.akter@example.com",
    reviewerAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
    rating: 5,
    title: "Mesmerizing Jamdani Weave & Outstanding Quality",
    comment: "I purchased an 84-count lilac Neelambari Jamdani for my sister's wedding. The weave was remarkably light, supple, and breathtakingly elegant. Knowing it supports rural Narayanganj women makes it even more special!",
    status: "PUBLISHED",
    createdAt: "2026-10-18T14:30:00Z",
    responseText: "Thank you so much, Sister Sabrina! Our Rupganj artisans send their warmest gratitude for your kind support.",
    responseDate: "2026-10-19T09:00:00Z",
  },
  {
    id: "rev_02",
    businessId: "biz_104",
    businessName: "Sundarbans Pure Honey & Forest Produce",
    businessSlug: "sundarbans-pure-honey",
    reviewerId: "BDS-MEM-10492",
    reviewerName: "Nusrat Jahan",
    reviewerEmail: "nusrat.jahan@example.com",
    reviewerAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150",
    rating: 5,
    title: "Purest Khalisha Flower Honey We've Ever Tasted",
    comment: "No artificial sugar crystallization at all. The floral aroma is distinct, raw, and pure. We buy two jars every month for our entire family in Dhaka.",
    status: "PUBLISHED",
    createdAt: "2026-10-25T11:15:00Z",
    responseText: "Heartfelt gratitude, Nusrat apu! Pure forest goodness directly from our Satkhira Mouwals.",
    responseDate: "2026-10-25T16:20:00Z",
  },
  {
    id: "rev_03",
    businessId: "biz_102",
    businessName: "Matir Maya Pottery & Terracotta",
    businessSlug: "matir-maya-pottery",
    reviewerId: "BDS-MEM-10486",
    reviewerName: "Tahmina Anam",
    reviewerEmail: "tahmina.anam@example.com",
    rating: 5,
    title: "Terracotta Biryani Handi Made Our Feast Unforgettable",
    comment: "Cooked kacchi biryani on low flame in their seasoned terracotta handi. The natural clay flavor and heat retention were spectacular. Packaging was completely safe.",
    status: "PUBLISHED",
    createdAt: "2026-11-02T16:40:00Z",
  },
  {
    id: "rev_04",
    businessId: "biz_105",
    businessName: "Tahmina Pitha Palli & Confectionery",
    businessSlug: "tahmina-pitha",
    reviewerId: "BDS-MEM-10488",
    reviewerName: "Sadia Rahman",
    reviewerEmail: "sadia.rahman@example.com",
    rating: 4,
    title: "Nostalgic Patishapta and Aromatic Date Palm Gur",
    comment: "Warm, soft, and naturally sweetened with pure Jessore date palm molasses. Delivery in Mirpur took slightly longer during peak evening hours, but worth the wait.",
    status: "PUBLISHED",
    createdAt: "2026-11-08T18:20:00Z",
  },
  {
    id: "rev_05",
    businessId: "biz_108",
    businessName: "Dhaka Quick Capital & Direct Schemes",
    businessSlug: "dhaka-quick-capital",
    reviewerId: "BDS-MEM-10484",
    reviewerName: "Rasheda Khatun",
    reviewerEmail: "rasheda.khatun@example.com",
    rating: 1,
    title: "Predatory Multi-Level Marketing Solicitation",
    comment: "Charged initial registration fee under the guise of women handicraft marketing training, then forced me to recruit 5 friends before releasing any work. Total scam!",
    status: "REPORTED",
    createdAt: "2026-07-18T10:10:00Z",
  },
  {
    id: "rev_06",
    businessId: "biz_101",
    businessName: "Nilambari Jamdani & Heritage Silk",
    businessSlug: "nilambari-crafts",
    reviewerId: "BDS-MEM-10487",
    reviewerName: "Afsana Mimi",
    reviewerEmail: "afsana.mimi@example.com",
    rating: 5,
    title: "Pure Elegance and Ethical Craftsmanship",
    comment: "Exquisite craftsmanship and beautiful packaging. Proud to see our traditional weavers flourishing.",
    status: "PENDING",
    createdAt: "2026-11-16T12:00:00Z",
  },
  {
    id: "rev_07",
    businessId: "biz_104",
    businessName: "Sundarbans Pure Honey & Forest Produce",
    businessSlug: "sundarbans-pure-honey",
    reviewerId: "BDS-MEM-99999",
    reviewerName: "Anonymous Competitor",
    reviewerEmail: "unknown.bot@spamsite.xyz",
    rating: 1,
    title: "Suspicious Commercial Attack",
    comment: "This honey is fake and contaminated with tap water. Don't buy anything from this sister.",
    status: "HIDDEN",
    createdAt: "2026-11-05T03:12:00Z",
  },
];

export function getAllBusinessReviews(): BusinessReviewItem[] {
  return [...DEMO_BUSINESS_REVIEWS];
}

export function getBusinessReviewsByBusinessId(businessId: string): BusinessReviewItem[] {
  return DEMO_BUSINESS_REVIEWS.filter((r) => r.businessId === businessId);
}

export function getBusinessReviewsByStatus(status: string): BusinessReviewItem[] {
  if (!status || status === "ALL") return [...DEMO_BUSINESS_REVIEWS];
  return DEMO_BUSINESS_REVIEWS.filter((r) => r.status === status);
}
