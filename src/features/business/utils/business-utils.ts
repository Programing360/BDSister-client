import type {
  BusinessDocument,
  PublicBusinessProfile,
  BusinessStatus,
} from "../../../types/business.ts";
import { generateSlug } from "../../../lib/validations/business.ts";

export { generateSlug };

/**
 * Filter business document for public consumption
 */
export function filterBusinessForPublic(
  business: BusinessDocument,
  viewerContext: { viewerUserId?: string | null; isAdmin?: boolean } = {}
): PublicBusinessProfile | null {
  const isOwner = Boolean(viewerContext.viewerUserId && viewerContext.viewerUserId === business.ownerId);
  const isAdmin = Boolean(viewerContext.isAdmin);

  // If not approved or private, only owner and admin can view (as preview)
  if (business.status !== "APPROVED" || business.visibility === "PRIVATE") {
    if (!isOwner && !isAdmin) {
      return null;
    }
  }

  return {
    id: business.id,
    slug: business.slug,
    name: business.name,
    shortDescription: business.shortDescription,
    fullDescription: business.fullDescription,
    category: business.category,
    businessType: business.businessType,
    logo: business.logo || null,
    coverImage: business.coverImage || null,
    contact: {
      email: business.contact.email,
      phone: business.contact.phone,
      website: business.contact.website,
      facebook: business.contact.facebook,
      instagram: business.contact.instagram,
      linkedin: business.contact.linkedin,
    },
    location: {
      division: business.location.division,
      district: business.location.district,
      city: business.location.city,
      country: business.location.country,
    },
    yearEstablished: business.yearEstablished,
    isVerified: business.verificationStatus === "VERIFIED",
    status: business.status,
    ownerName: business.ownerName,
    hasActiveShop: business.hasActiveShop,
    createdAt: business.createdAt,
  };
}

/**
 * Formats status for visual badges
 */
export function getBusinessStatusBadge(status: BusinessStatus): {
  label: string;
  variant: "draft" | "pending" | "approved" | "rejected" | "suspended";
} {
  switch (status) {
    case "APPROVED":
      return { label: "Approved & Live", variant: "approved" };
    case "PENDING_REVIEW":
      return { label: "Under Review", variant: "pending" };
    case "REJECTED":
      return { label: "Changes Requested", variant: "rejected" };
    case "SUSPENDED":
      return { label: "Suspended", variant: "suspended" };
    case "DRAFT":
    default:
      return { label: "Draft Setup", variant: "draft" };
  }
}
