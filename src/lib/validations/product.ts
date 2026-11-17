import { z } from "zod";

/**
 * Normalizes string to a clean URL-friendly slug
 */
export function generateProductSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const productImageSchema = z.object({
  id: z.string().default(() => `img_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`),
  url: z.string().min(1, "Image URL is required"),
  alt: z.string().max(120).optional(),
  order: z.number().int().min(0).default(0),
  isPrimary: z.boolean().default(false),
});

export const productPricingSchema = z
  .object({
    regularPrice: z
      .number({ message: "Regular price must be a valid number" })
      .positive("Regular price must be greater than 0")
      .max(2000000, "Price exceeds maximum supported platform limit"),
    salePrice: z
      .number({ message: "Sale price must be a valid number" })
      .positive("Sale price must be greater than 0")
      .max(2000000, "Price exceeds maximum supported platform limit")
      .optional()
      .nullable(),
    costPrice: z
      .number({ message: "Cost price must be a valid number" })
      .min(0, "Cost price cannot be negative")
      .optional()
      .nullable(),
    currency: z.literal("BDT").default("BDT"),
  })
  .refine(
    (data) => {
      if (data.salePrice !== undefined && data.salePrice !== null) {
        return data.salePrice <= data.regularPrice;
      }
      return true;
    },
    {
      message: "Sale price cannot be greater than regular price",
      path: ["salePrice"],
    }
  );

export const productInventorySchema = z.object({
  sku: z
    .string()
    .trim()
    .min(2, "SKU must have at least 2 characters")
    .max(50, "SKU cannot exceed 50 characters")
    .regex(/^[A-Za-z0-9_-]+$/, "SKU may only contain letters, numbers, hyphens, and underscores"),
  quantity: z
    .number({ message: "Quantity must be a number" })
    .int("Quantity must be a whole number")
    .min(0, "Stock quantity cannot be negative")
    .default(0),
  lowStockThreshold: z
    .number({ message: "Low stock threshold must be a number" })
    .int("Threshold must be a whole number")
    .min(0, "Threshold cannot be negative")
    .default(5),
  trackInventory: z.boolean().default(true),
  backorderPolicy: z.enum(["DENY", "ALLOW"]).default("DENY"),
});

export const productCreateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Product name must be at least 3 characters")
    .max(120, "Product name cannot exceed 120 characters"),
  businessId: z.string().min(1, "Please select an associated business"),
  shopId: z.string().optional().nullable(),
  shortDescription: z
    .string()
    .trim()
    .min(10, "Short description must be at least 10 characters")
    .max(300, "Short description cannot exceed 300 characters"),
  description: z
    .string()
    .trim()
    .min(20, "Full description must be at least 20 characters")
    .max(10000, "Full description cannot exceed 10,000 characters"),
  category: z.string().min(1, "Please select a product category"),
  subcategory: z.string().trim().max(100).optional().nullable(),
  tags: z
    .array(z.string().trim().max(40))
    .max(15, "Cannot specify more than 15 tags")
    .default([]),
  pricing: productPricingSchema,
  images: z.array(productImageSchema).default([]),
  primaryImage: z.string().optional().nullable(),
  inventory: productInventorySchema,
  status: z.enum(["DRAFT", "PENDING_REVIEW", "ACTIVE", "REJECTED", "ARCHIVED"]).default("DRAFT"),
  visibility: z.enum(["PUBLIC", "PRIVATE", "UNLISTED"]).default("PUBLIC"),
  featured: z.boolean().default(false),
});

export const productUpdateSchema = productCreateSchema.partial().extend({
  id: z.string().min(1, "Product ID is required"),
});

export const inventoryUpdateSchema = z.object({
  quantity: z
    .number({ message: "Quantity must be a number" })
    .int("Quantity must be an integer")
    .min(0, "Quantity cannot be negative"),
  lowStockThreshold: z
    .number({ message: "Low stock threshold must be a number" })
    .int("Threshold must be an integer")
    .min(0, "Threshold cannot be negative")
    .optional(),
  trackInventory: z.boolean().optional(),
  backorderPolicy: z.enum(["DENY", "ALLOW"]).optional(),
});

export const inventoryQuickAdjustmentSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  adjustment: z.number().int("Adjustment must be an integer"),
  mode: z.enum(["SET", "INCREMENT"]).default("SET"),
});

export type ProductCreateInput = z.infer<typeof productCreateSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;
export type InventoryUpdateInput = z.infer<typeof inventoryUpdateSchema>;
export type InventoryQuickAdjustmentInput = z.infer<typeof inventoryQuickAdjustmentSchema>;
