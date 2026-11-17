import type { ShopDocument, PublicShopProfile, ShopStatus } from "../../../types/shop.ts";

/**
 * Filter shop document for public consumption
 */
export function filterShopForPublic(
  shop: ShopDocument,
  businessVerified = false,
  viewerContext: { viewerUserId?: string | null; isAdmin?: boolean } = {}
): PublicShopProfile | null {
  const isOwner = Boolean(viewerContext.viewerUserId && viewerContext.viewerUserId === shop.ownerId);
  const isAdmin = Boolean(viewerContext.isAdmin);

  if (shop.status !== "ACTIVE") {
    if (!isOwner && !isAdmin) {
      return null;
    }
  }

  return {
    id: shop.id,
    businessId: shop.businessId,
    businessName: shop.businessName || "BDSisters Artisan Brand",
    businessSlug: shop.businessSlug || "",
    name: shop.name,
    slug: shop.slug,
    shortDescription: shop.shortDescription,
    logo: shop.logo || null,
    banner: shop.banner || null,
    supportEmail: shop.supportEmail,
    supportPhone: shop.supportPhone,
    policies: shop.policies || {},
    status: shop.status,
    isBusinessVerified: businessVerified,
    createdAt: shop.createdAt,
  };
}

/**
 * Shop status badge details
 */
export function getShopStatusBadge(status: ShopStatus): {
  label: string;
  variant: "not_configured" | "draft" | "pending" | "active" | "paused" | "suspended";
} {
  switch (status) {
    case "ACTIVE":
      return { label: "Active & Open", variant: "active" };
    case "PENDING_REVIEW":
      return { label: "Pending Approval", variant: "pending" };
    case "PAUSED":
      return { label: "Temporarily Paused", variant: "paused" };
    case "SUSPENDED":
      return { label: "Suspended", variant: "suspended" };
    case "DRAFT":
      return { label: "Draft Setup", variant: "draft" };
    case "NOT_CONFIGURED":
    default:
      return { label: "Not Configured", variant: "not_configured" };
  }
}
