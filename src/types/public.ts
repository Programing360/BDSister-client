// ============================================================
// BDSisters.org — Public Domain Types
// ============================================================

export interface BusinessContact {
  email?: string;
  phone?: string;
  website?: string;
}

export interface Business {
  id: string;
  slug: string;
  name: string;
  tagline?: string;
  description: string;
  category: string;
  location: string;
  district?: string;
  logo?: string;
  coverImage?: string;
  isVerified?: boolean;
  verified?: boolean;
  ownerName: string;
  founder?: string;
  ownerRole?: string;
  productsCount?: number;
  rating: number;
  reviewCount?: number;
  contactEmail?: string;
  phone?: string;
  website?: string;
  contact?: BusinessContact;
  tags: string[];
  establishedYear?: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  currency?: string;
  category: string;
  sellerName?: string;
  businessName?: string;
  sellerSlug?: string;
  images?: string[];
  inStock: boolean;
  stockCount?: number;
  tags: string[];
  rating: number;
  reviewsCount?: number;
  featured?: boolean;
}

export interface Event {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  isOnline?: boolean;
  type?: "online" | "in-person";
  category: string;
  organizer?: string;
  coverImage?: string;
  image?: string;
  capacity?: number;
  maxCapacity?: number;
  registeredCount?: number;
  attendeesCount?: number;
  status?: "upcoming" | "ongoing" | "completed";
  price?: number;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  instructor: string;
  instructorTitle?: string;
  duration: string;
  lessonsCount: number;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "all levels" | string;
  coverImage?: string;
  thumbnail?: string;
  enrollmentsCount?: number;
  enrolledCount?: number;
  enrolled?: number;
  learningObjectives?: string[];
  rating?: number;
  price?: number;
}

export type ResourceType =
  | "Guide"
  | "Template"
  | "Article"
  | "Document"
  | "Tutorial"
  | string;

export interface Resource {
  id: string;
  slug: string;
  title: string;
  description: string;
  type?: ResourceType;
  category: string;
  author: string;
  readTime?: string;
  publishedAt?: string;
  downloadUrl?: string;
  tags: string[];
  format?: string;
  fileSize?: string;
  downloadCount?: number;
  coverImage?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department?: string;
  bio: string;
  image?: string;
  avatar?: string;
  social?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    email?: string;
  };
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    email?: string;
  };
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  district?: string;
  location?: string;
  avatar?: string;
  rating?: number;
  category?: "Business" | "Community" | "Career" | "Learning" | string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}
