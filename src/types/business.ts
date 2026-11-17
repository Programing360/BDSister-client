/**
 * BDSisters.org - Business Ecosystem Types
 * Step 7: Business Management, Business Profile & Shop Management
 */

export type BusinessStatus =
  | "DRAFT"
  | "PENDING_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "SUSPENDED";

export type BusinessVerificationStatus =
  | "NOT_SUBMITTED"
  | "PENDING"
  | "UNDER_REVIEW"
  | "VERIFIED"
  | "REJECTED"
  | "ACTION_REQUIRED";

export type BusinessType =
  | "Sole Proprietorship"
  | "Partnership"
  | "Private Limited Company"
  | "Social Enterprise"
  | "Cottage / Artisan Studio"
  | "Online Startup"
  | "Other";

export interface BusinessLocation {
  country: string;
  division: string;
  district: string;
  city: string;
  address?: string;
  postalCode?: string;
}

export interface BusinessContactInfo {
  email: string;
  phone: string;
  altPhone?: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
}

export interface BusinessVerificationDocument {
  id: string;
  type: "TRADE_LICENSE" | "TIN_CERTIFICATE" | "NATIONAL_ID" | "UTILITY_BILL" | "OTHER";
  title: string;
  fileUrl: string;
  uploadedAt: string | Date;
}

export interface BusinessDocument {
  _id?: any;
  id: string;
  ownerId: string; // references Better Auth user id
  ownerName?: string;
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  businessType: BusinessType;
  logo?: string | null;
  coverImage?: string | null;
  contact: BusinessContactInfo;
  location: BusinessLocation;
  yearEstablished?: number;
  status: BusinessStatus;
  verificationStatus: BusinessVerificationStatus;
  verificationNotes?: string;
  verificationDocuments?: BusinessVerificationDocument[];
  visibility: "PUBLIC" | "PRIVATE";
  shopId?: string | null;
  hasActiveShop?: boolean;
  moderationFeedback?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PublicBusinessProfile {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  businessType: BusinessType;
  logo?: string | null;
  coverImage?: string | null;
  contact: {
    email?: string;
    phone?: string;
    website?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
  location: {
    division: string;
    district: string;
    city: string;
    country: string;
  };
  yearEstablished?: number;
  isVerified: boolean;
  status: BusinessStatus;
  ownerName?: string;
  shopSlug?: string;
  hasActiveShop?: boolean;
  createdAt: string | Date;
}
