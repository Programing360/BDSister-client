import type {
  ProductDocument,
  PublicProductProfile,
  ProductStatus,
  InventoryStatus,
} from "@/types/product";

/**
 * Calculates percentage savings from regular price to sale price
 */
export function calculateDiscountPercent(
  regularPrice: number,
  salePrice?: number | null
): number {
  if (!salePrice || salePrice >= regularPrice || regularPrice <= 0) {
    return 0;
  }
  const discount = ((regularPrice - salePrice) / regularPrice) * 100;
  return Math.round(discount);
}

/**
 * Computes live inventory status based on tracking setting, quantity and threshold
 */
export function calculateInventoryStatus(
  quantity: number,
  lowStockThreshold: number = 5,
  trackInventory: boolean = true
): InventoryStatus {
  if (!trackInventory) {
    return "NOT_TRACKED";
  }
  if (quantity <= 0) {
    return "OUT_OF_STOCK";
  }
  if (quantity <= lowStockThreshold) {
    return "LOW_STOCK";
  }
  return "IN_STOCK";
}

/**
 * Strips internal and sensitive commercial data for public marketplace visitors
 */
export function filterProductForPublic(
  product: ProductDocument,
  businessStatus?: string,
  shopStatus?: string,
  viewerUserId?: string
): PublicProductProfile | null {
  const isOwner = Boolean(viewerUserId && product.ownerId === viewerUserId);

  if (!isOwner) {
    // Public visitors only see ACTIVE products
    if (product.status !== "ACTIVE") {
      return null;
    }

    // Must be PUBLIC visibility
    if (product.visibility !== "PUBLIC") {
      return null;
    }

    // Business must be APPROVED
    if (businessStatus && businessStatus !== "APPROVED") {
      return null;
    }

    // If shop is specified, it must be ACTIVE
    if (shopStatus && shopStatus !== "ACTIVE") {
      return null;
    }
  }

  const discountPercent = calculateDiscountPercent(
    product.pricing.regularPrice,
    product.pricing.salePrice
  );

  const primaryImg =
    product.primaryImage ||
    product.images.find((img) => img.isPrimary)?.url ||
    product.images[0]?.url ||
    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80";

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    shortDescription: product.shortDescription,
    description: product.description,
    category: product.category,
    subcategory: product.subcategory,
    tags: product.tags || [],
    pricing: {
      regularPrice: product.pricing.regularPrice,
      salePrice: product.pricing.salePrice || undefined,
      discountPercent: discountPercent > 0 ? discountPercent : undefined,
      currency: "BDT",
    },
    primaryImage: primaryImg,
    images: product.images.map((img) => ({
      id: img.id,
      url: img.url,
      alt: img.alt,
      isPrimary: img.isPrimary,
    })),
    inventory: {
      inStock:
        product.inventory.trackInventory === false
          ? true
          : product.inventory.quantity > 0,
      status: product.inventory.status,
      availableQuantity: product.inventory.trackInventory
        ? product.inventory.quantity
        : undefined,
    },
    business: {
      id: product.businessId,
      name: product.businessName,
      slug: product.businessSlug,
    },
    shop: product.shopId
      ? {
          id: product.shopId,
          name: product.shopName || product.businessName,
          slug: product.shopSlug || product.businessSlug,
        }
      : undefined,
    rating: product.rating ?? 5.0,
    reviewsCount: product.reviewsCount ?? 0,
    featured: product.featured,
    createdAt: product.createdAt,
  };
}

/**
 * Visual badge metadata for Product Statuses
 */
export function getProductStatusBadge(status: ProductStatus): {
  label: string;
  color: string;
  bg: string;
  border: string;
} {
  switch (status) {
    case "ACTIVE":
      return {
        label: "Active / Published",
        color: "text-emerald-700",
        bg: "bg-emerald-50",
        border: "border-emerald-200",
      };
    case "PENDING_REVIEW":
      return {
        label: "Pending Review",
        color: "text-amber-700",
        bg: "bg-amber-50",
        border: "border-amber-200",
      };
    case "DRAFT":
      return {
        label: "Draft",
        color: "text-gray-700",
        bg: "bg-gray-50",
        border: "border-gray-200",
      };
    case "REJECTED":
      return {
        label: "Action Required",
        color: "text-rose-700",
        bg: "bg-rose-50",
        border: "border-rose-200",
      };
    case "ARCHIVED":
      return {
        label: "Archived",
        color: "text-zinc-600",
        bg: "bg-zinc-100",
        border: "border-zinc-300",
      };
    default:
      return {
        label: status,
        color: "text-gray-700",
        bg: "bg-gray-50",
        border: "border-gray-200",
      };
  }
}

/**
 * Visual badge metadata for Inventory Statuses
 */
export function getInventoryStatusBadge(status: InventoryStatus): {
  label: string;
  color: string;
  bg: string;
  border: string;
} {
  switch (status) {
    case "IN_STOCK":
      return {
        label: "In Stock",
        color: "text-emerald-700",
        bg: "bg-emerald-50",
        border: "border-emerald-200",
      };
    case "LOW_STOCK":
      return {
        label: "Low Stock",
        color: "text-amber-700",
        bg: "bg-amber-50",
        border: "border-amber-200",
      };
    case "OUT_OF_STOCK":
      return {
        label: "Out of Stock",
        color: "text-rose-700",
        bg: "bg-rose-50",
        border: "border-rose-200",
      };
    case "NOT_TRACKED":
      return {
        label: "Not Tracked",
        color: "text-slate-600",
        bg: "bg-slate-50",
        border: "border-slate-200",
      };
    default:
      return {
        label: status,
        color: "text-gray-700",
        bg: "bg-gray-50",
        border: "border-gray-200",
      };
  }
}
