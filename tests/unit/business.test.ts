import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  businessRegistrationSchema,
  businessVerificationSchema,
  generateSlug,
} from "../../src/lib/validations/business.ts";
import {
  shopSettingsSchema,
  shopPoliciesSchema,
} from "../../src/lib/validations/shop.ts";
import {
  filterBusinessForPublic,
  getBusinessStatusBadge,
} from "../../src/features/business/utils/business-utils.ts";
import {
  filterShopForPublic,
  getShopStatusBadge,
} from "../../src/features/shop/utils/shop-utils.ts";
import type { BusinessDocument } from "../../src/types/business.ts";
import type { ShopDocument } from "../../src/types/shop.ts";

describe("Business & Shop Management System Verification", () => {
  describe("Slug Generation & Validation", () => {
    it("should generate clean, lowercase, hyphenated URL slugs", () => {
      assert.strictEqual(generateSlug("SilkHeritage Studio & Boutique"), "silkheritage-studio-boutique");
      assert.strictEqual(generateSlug("Dr. Ayesha's Skincare Lab!"), "dr-ayeshas-skincare-lab");
      assert.strictEqual(generateSlug("  Tech Sisters Ltd. -- 2024 "), "tech-sisters-ltd-2024");
    });

    it("should enforce valid shop slug format via Zod", () => {
      const valid = shopSettingsSchema.safeParse({
        businessId: "biz_100",
        name: "My Sister Boutique",
        slug: "my-sister-boutique",
      });
      assert.strictEqual(valid.success, true);

      const invalidSlug = shopSettingsSchema.safeParse({
        businessId: "biz_100",
        name: "My Sister Boutique",
        slug: "My Sister Boutique!@#", // spaces & capitals not allowed in slug
      });
      assert.strictEqual(invalidSlug.success, false);
    });
  });

  describe("Business Registration Validation", () => {
    it("should accept valid business registration payload", () => {
      const valid = businessRegistrationSchema.safeParse({
        name: "Jamdani Crafts Studio",
        category: "Handicrafts & Heritage Crafts",
        businessType: "Sole Proprietorship",
        shortDescription: "Authentic Jamdani weaving studio preserving heritage looms in Narayanganj.",
        fullDescription: "Founded in 2021, Jamdani Crafts Studio employs 25 master female weavers to produce museum-grade handloom textiles.",
        yearEstablished: 2021,
        email: "info@jamdanicrafts.org",
        phone: "+880 1711 000000",
        division: "Dhaka",
        district: "Narayanganj",
        city: "Rupganj",
        country: "Bangladesh",
        visibility: "PUBLIC",
        submitForReview: true,
      });

      assert.strictEqual(valid.success, true);
    });

    it("should reject business registration with short name or short description", () => {
      const invalid = businessRegistrationSchema.safeParse({
        name: "A", // too short
        category: "Fashion & Apparel",
        businessType: "Sole Proprietorship",
        shortDescription: "Short", // <10 chars
        fullDescription: "Also short", // <20 chars
        email: "not-an-email",
        phone: "12",
        division: "Dhaka",
        district: "Dhaka",
        city: "Dhaka",
      });

      assert.strictEqual(invalid.success, false);
    });

    it("should validate verification document submissions", () => {
      const valid = businessVerificationSchema.safeParse({
        businessId: "biz_100",
        documentType: "TRADE_LICENSE",
        documentTitle: "Dhaka North City Corporation Trade License 2024",
        documentUrl: "https://example.com/license.pdf",
        notes: "Valid through June 2025",
      });

      assert.strictEqual(valid.success, true);
    });
  });

  describe("Shop Policies Validation", () => {
    it("should accept valid shop policies within character limits", () => {
      const valid = shopPoliciesSchema.safeParse({
        shippingPolicy: "Standard delivery 24-48 hours inside Dhaka.",
        returnPolicy: "Returns accepted within 7 days.",
        exchangePolicy: "Exchanges within 5 days.",
        customerSupportHours: "Saturday to Thursday 9am-6pm",
      });

      assert.strictEqual(valid.success, true);
    });
  });

  describe("Public Business Privacy & Visibility Filtering", () => {
    const mockBusiness: BusinessDocument = {
      id: "biz_999",
      ownerId: "user_owner_1",
      name: "Bengal Herbal Labs",
      slug: "bengal-herbal-labs",
      shortDescription: "Organic herbal wellness formulas formulated by Bangladeshi women biochemists.",
      fullDescription: "Dedicated to reviving indigenous Ayurvedic and herbal remedies with rigorous laboratory testing and clinical trials.",
      category: "Health, Beauty & Skincare",
      businessType: "Private Limited Company",
      contact: {
        email: "contact@bengalherbal.com",
        phone: "+880 1812 345678",
      },
      location: {
        country: "Bangladesh",
        division: "Chattogram",
        district: "Chattogram",
        city: "Nasirabad",
      },
      status: "APPROVED",
      verificationStatus: "VERIFIED",
      visibility: "PUBLIC",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it("should display approved public businesses to external visitors", () => {
      const publicView = filterBusinessForPublic(mockBusiness, {
        viewerUserId: "anonymous_visitor",
        isAdmin: false,
      });

      assert.notStrictEqual(publicView, null);
      assert.strictEqual(publicView?.name, "Bengal Herbal Labs");
      assert.strictEqual(publicView?.isVerified, true);
      assert.strictEqual(publicView?.location.district, "Chattogram");
    });

    it("should hide DRAFT and PENDING businesses from public visitors", () => {
      const draftBiz: BusinessDocument = {
        ...mockBusiness,
        status: "DRAFT",
      };

      const publicView = filterBusinessForPublic(draftBiz, {
        viewerUserId: "anonymous_visitor",
        isAdmin: false,
      });

      assert.strictEqual(publicView, null);
    });

    it("should allow the business owner to preview their own unapproved business", () => {
      const pendingBiz: BusinessDocument = {
        ...mockBusiness,
        status: "PENDING_REVIEW",
      };

      const ownerPreview = filterBusinessForPublic(pendingBiz, {
        viewerUserId: "user_owner_1",
        isAdmin: false,
      });

      assert.notStrictEqual(ownerPreview, null);
      assert.strictEqual(ownerPreview?.name, "Bengal Herbal Labs");
      assert.strictEqual(ownerPreview?.status, "PENDING_REVIEW");
    });

    it("should hide PRIVATE visibility businesses from external visitors", () => {
      const privateBiz: BusinessDocument = {
        ...mockBusiness,
        visibility: "PRIVATE",
      };

      const publicView = filterBusinessForPublic(privateBiz, {
        viewerUserId: "other_user",
        isAdmin: false,
      });

      assert.strictEqual(publicView, null);
    });
  });

  describe("Public Shop Privacy & Filtering", () => {
    const mockShop: ShopDocument = {
      id: "shop_888",
      businessId: "biz_999",
      ownerId: "user_owner_1",
      name: "Bengal Herbal Store",
      slug: "bengal-herbal-store",
      shortDescription: "Official digital store for pure herbal formulas.",
      policies: {
        shippingPolicy: "Delivery within 48h.",
      },
      status: "ACTIVE",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it("should display active shop to public visitors", () => {
      const publicShop = filterShopForPublic(mockShop, true, {
        viewerUserId: "visitor_1",
        isAdmin: false,
      });

      assert.notStrictEqual(publicShop, null);
      assert.strictEqual(publicShop?.name, "Bengal Herbal Store");
      assert.strictEqual(publicShop?.isBusinessVerified, true);
    });

    it("should hide PAUSED and DRAFT shops from public visitors", () => {
      const pausedShop: ShopDocument = {
        ...mockShop,
        status: "PAUSED",
      };

      const publicShop = filterShopForPublic(pausedShop, true, {
        viewerUserId: "visitor_1",
        isAdmin: false,
      });

      assert.strictEqual(publicShop, null);
    });

    it("should allow the shop owner to view paused or draft shop in preview mode", () => {
      const draftShop: ShopDocument = {
        ...mockShop,
        status: "DRAFT",
      };

      const ownerView = filterShopForPublic(draftShop, true, {
        viewerUserId: "user_owner_1",
        isAdmin: false,
      });

      assert.notStrictEqual(ownerView, null);
      assert.strictEqual(ownerView?.status, "DRAFT");
    });
  });

  describe("Status Badge Helpers", () => {
    it("should map business statuses to correct presentation badges", () => {
      assert.strictEqual(getBusinessStatusBadge("APPROVED").variant, "approved");
      assert.strictEqual(getBusinessStatusBadge("PENDING_REVIEW").variant, "pending");
      assert.strictEqual(getBusinessStatusBadge("REJECTED").variant, "rejected");
      assert.strictEqual(getBusinessStatusBadge("SUSPENDED").variant, "suspended");
      assert.strictEqual(getBusinessStatusBadge("DRAFT").variant, "draft");
    });

    it("should map shop statuses to correct presentation badges", () => {
      assert.strictEqual(getShopStatusBadge("ACTIVE").variant, "active");
      assert.strictEqual(getShopStatusBadge("PENDING_REVIEW").variant, "pending");
      assert.strictEqual(getShopStatusBadge("PAUSED").variant, "paused");
      assert.strictEqual(getShopStatusBadge("DRAFT").variant, "draft");
      assert.strictEqual(getShopStatusBadge("NOT_CONFIGURED").variant, "not_configured");
    });
  });
});
