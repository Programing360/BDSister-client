import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  generateProductSlug,
  productCreateSchema,
  productPricingSchema,
  productInventorySchema,
  inventoryUpdateSchema,
  inventoryQuickAdjustmentSchema,
} from "../../src/lib/validations/product.ts";
import {
  calculateDiscountPercent,
  calculateInventoryStatus,
  filterProductForPublic,
  getProductStatusBadge,
  getInventoryStatusBadge,
} from "../../src/features/product/utils/product-utils.ts";
import type { ProductDocument } from "../../src/types/product.ts";

describe("Product Management & Inventory System Verification", () => {
  describe("Product Slug Generation", () => {
    it("should generate URL-friendly lowercase slugs without special symbols", () => {
      assert.strictEqual(
        generateProductSlug("Royal Nilambari Handwoven Muslin Jamdani"),
        "royal-nilambari-handwoven-muslin-jamdani"
      );
      assert.strictEqual(
        generateProductSlug("100% Pure Organic Sundarban Honey (500g)!"),
        "100-pure-organic-sundarban-honey-500g"
      );
      assert.strictEqual(
        generateProductSlug("   Terracotta Jewelry Set -- Eid Special   "),
        "terracotta-jewelry-set-eid-special"
      );
    });
  });

  describe("Product Validation Schemas", () => {
    it("should accept valid product creation payload", () => {
      const validPayload = {
        name: "Handwoven Muslin Jamdani Saree",
        businessId: "biz_100",
        shortDescription: "Finest 100-count traditional muslin Jamdani woven in Rupganj.",
        description: "Intricately handwoven Jamdani saree featuring heritage floral motifs, spun with pure cotton thread over three months.",
        category: "Fashion & Saree",
        tags: ["Jamdani", "Muslin", "Handloom"],
        pricing: {
          regularPrice: 18500,
          salePrice: 16500,
          costPrice: 12000,
          currency: "BDT",
        },
        images: [
          {
            id: "img_1",
            url: "https://example.com/jamdani.jpg",
            order: 0,
            isPrimary: true,
          },
        ],
        inventory: {
          sku: "SHU-JAM-001",
          quantity: 15,
          lowStockThreshold: 5,
          trackInventory: true,
        },
      };

      const result = productCreateSchema.safeParse(validPayload);
      assert.strictEqual(result.success, true);
    });

    it("should reject product with short name or short descriptions", () => {
      const invalid = productCreateSchema.safeParse({
        name: "AB", // Too short (< 3)
        businessId: "biz_100",
        shortDescription: "Short", // Too short (< 10)
        description: "Not long enough", // Too short (< 20)
        category: "Fashion & Saree",
        pricing: { regularPrice: 1000 },
        inventory: { sku: "SKU-1" },
      });

      assert.strictEqual(invalid.success, false);
      if (!invalid.success) {
        const fields = invalid.error.issues.map((i) => i.path[0]);
        assert.ok(fields.includes("name"));
        assert.ok(fields.includes("shortDescription"));
        assert.ok(fields.includes("description"));
      }
    });

    it("should reject pricing when sale price is greater than regular price", () => {
      const invalidPricing = productPricingSchema.safeParse({
        regularPrice: 1000,
        salePrice: 1500, // Invalid: salePrice > regularPrice
        currency: "BDT",
      });

      assert.strictEqual(invalidPricing.success, false);
      if (!invalidPricing.success) {
        assert.strictEqual(invalidPricing.error.issues[0].path[0], "salePrice");
      }
    });

    it("should reject negative prices and negative quantities", () => {
      const negativePrice = productPricingSchema.safeParse({
        regularPrice: -500,
        currency: "BDT",
      });
      assert.strictEqual(negativePrice.success, false);

      const negativeInventory = productInventorySchema.safeParse({
        sku: "TEST-SKU",
        quantity: -5,
      });
      assert.strictEqual(negativeInventory.success, false);
    });
  });

  describe("Discount & Metric Calculations", () => {
    it("should accurately compute percentage discount savings", () => {
      // 10,000 -> 8,000 = 20% discount
      assert.strictEqual(calculateDiscountPercent(10000, 8000), 20);

      // 18,500 -> 16,500 = 11% discount
      assert.strictEqual(calculateDiscountPercent(18500, 16500), 11);

      // No sale price = 0%
      assert.strictEqual(calculateDiscountPercent(18500, undefined), 0);
      assert.strictEqual(calculateDiscountPercent(18500, null), 0);

      // Sale price equals regular price = 0%
      assert.strictEqual(calculateDiscountPercent(18500, 18500), 0);
    });

    it("should accurately compute inventory status based on tracking and thresholds", () => {
      // Untracked
      assert.strictEqual(calculateInventoryStatus(0, 5, false), "NOT_TRACKED");

      // Tracked: Zero or negative
      assert.strictEqual(calculateInventoryStatus(0, 5, true), "OUT_OF_STOCK");
      assert.strictEqual(calculateInventoryStatus(-2, 5, true), "OUT_OF_STOCK");

      // Tracked: Low stock (<= threshold)
      assert.strictEqual(calculateInventoryStatus(3, 5, true), "LOW_STOCK");
      assert.strictEqual(calculateInventoryStatus(5, 5, true), "LOW_STOCK");

      // Tracked: Ample in-stock (> threshold)
      assert.strictEqual(calculateInventoryStatus(6, 5, true), "IN_STOCK");
      assert.strictEqual(calculateInventoryStatus(50, 5, true), "IN_STOCK");
    });
  });

  describe("Public Privacy & Commercial Redaction", () => {
    const mockProductDoc: ProductDocument = {
      id: "prod_001",
      ownerId: "usr_owner_1",
      businessId: "biz_100",
      businessName: "Shurjo Crafts",
      businessSlug: "shurjo-crafts",
      name: "Heritage Jamdani",
      slug: "heritage-jamdani",
      shortDescription: "Exquisite handwoven Jamdani",
      description: "Authentic fine muslin Jamdani created by master artisans.",
      category: "Fashion & Saree",
      tags: ["Jamdani", "Muslin"],
      pricing: {
        regularPrice: 20000,
        salePrice: 17000,
        discountPercent: 15,
        costPrice: 11000, // Sensitive confidential internal margin
        currency: "BDT",
      },
      images: [
        {
          id: "img_1",
          url: "https://example.com/jamdani.jpg",
          order: 0,
          isPrimary: true,
        },
      ],
      primaryImage: "https://example.com/jamdani.jpg",
      inventory: {
        sku: "SHU-JAM-001",
        quantity: 12,
        lowStockThreshold: 4,
        trackInventory: true,
        status: "IN_STOCK",
      },
      status: "ACTIVE",
      visibility: "PUBLIC",
      featured: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it("should return sanitized product profile and strip private cost price for public visitors", () => {
      const publicView = filterProductForPublic(
        mockProductDoc,
        "APPROVED", // business status
        "ACTIVE"    // shop status
      );

      assert.ok(publicView !== null);
      assert.strictEqual(publicView.name, "Heritage Jamdani");
      assert.strictEqual(publicView.pricing.regularPrice, 20000);
      assert.strictEqual(publicView.pricing.salePrice, 17000);
      assert.strictEqual(publicView.pricing.discountPercent, 15);
      // Cost price must be strictly omitted from public view
      assert.strictEqual((publicView.pricing as any).costPrice, undefined);
    });

    it("should hide DRAFT and PENDING products from public visitors", () => {
      const draftDoc = { ...mockProductDoc, status: "DRAFT" as const };
      const publicView = filterProductForPublic(draftDoc, "APPROVED", "ACTIVE");
      assert.strictEqual(publicView, null);

      const pendingDoc = { ...mockProductDoc, status: "PENDING_REVIEW" as const };
      assert.strictEqual(filterProductForPublic(pendingDoc, "APPROVED", "ACTIVE"), null);
    });

    it("should allow product owner to preview their own draft or pending product", () => {
      const draftDoc = { ...mockProductDoc, status: "DRAFT" as const };
      const ownerPreview = filterProductForPublic(
        draftDoc,
        "APPROVED",
        "ACTIVE",
        "usr_owner_1" // Viewer is owner
      );

      assert.ok(ownerPreview !== null);
      assert.strictEqual(ownerPreview.id, "prod_001");
    });

    it("should hide products belonging to unapproved or suspended businesses from external visitors", () => {
      const unapprovedBizView = filterProductForPublic(
        mockProductDoc,
        "PENDING_REVIEW", // Business is not yet approved
        "ACTIVE"
      );
      assert.strictEqual(unapprovedBizView, null);
    });
  });

  describe("Status Badge Helpers", () => {
    it("should return valid UI presentation badges for product and inventory statuses", () => {
      assert.strictEqual(getProductStatusBadge("ACTIVE").label, "Active / Published");
      assert.strictEqual(getProductStatusBadge("DRAFT").label, "Draft");
      assert.strictEqual(getProductStatusBadge("PENDING_REVIEW").label, "Pending Review");

      assert.strictEqual(getInventoryStatusBadge("IN_STOCK").label, "In Stock");
      assert.strictEqual(getInventoryStatusBadge("LOW_STOCK").label, "Low Stock");
      assert.strictEqual(getInventoryStatusBadge("OUT_OF_STOCK").label, "Out of Stock");
    });
  });
});
