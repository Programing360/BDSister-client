import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  addToCartSchema,
  updateCartItemSchema,
  removeCartItemSchema,
} from "../../src/lib/validations/cart.ts";
import {
  shippingAddressSchema,
  checkoutOrderCreateSchema,
  updateFulfillmentStatusSchema,
  orderCancelRequestSchema,
} from "../../src/lib/validations/checkout.ts";
import {
  extractInvoiceIdFromUrl,
  normalizeZiniPayStatus,
} from "../../src/lib/services/zinipay-service.ts";
import {
  getOrderStatusBadge,
  getPaymentStatusBadge,
  getItemFulfillmentBadge,
} from "../../src/features/ecommerce/utils/ecommerce-utils.ts";

describe("E-commerce, Checkout & ZiniPay Payment System Tests", () => {
  describe("Cart Validation Schemas", () => {
    it("should validate adding item to cart with valid quantity", () => {
      const valid = addToCartSchema.safeParse({
        productId: "prod_jamdani_01",
        quantity: 2,
      });
      assert.strictEqual(valid.success, true);
      if (valid.success) {
        assert.strictEqual(valid.data.quantity, 2);
      }
    });

    it("should reject negative or zero quantity when adding to cart", () => {
      const invalidZero = addToCartSchema.safeParse({
        productId: "prod_01",
        quantity: 0,
      });
      assert.strictEqual(invalidZero.success, false);

      const invalidNegative = addToCartSchema.safeParse({
        productId: "prod_01",
        quantity: -3,
      });
      assert.strictEqual(invalidNegative.success, false);
    });

    it("should reject adding more than max allowed single-line limit (50)", () => {
      const invalidOver = addToCartSchema.safeParse({
        productId: "prod_01",
        quantity: 100,
      });
      assert.strictEqual(invalidOver.success, false);
    });

    it("should validate cart item update payload", () => {
      const valid = updateCartItemSchema.safeParse({
        productId: "prod_xyz_99",
        quantity: 5,
      });
      assert.strictEqual(valid.success, true);
    });

    it("should validate removing item from cart", () => {
      const valid = removeCartItemSchema.safeParse({
        productId: "prod_xyz_99",
      });
      assert.strictEqual(valid.success, true);
    });
  });

  describe("Shipping Address & Checkout Order Schemas", () => {
    const validShippingAddress = {
      fullName: "Nusrat Jahan Chowdhury",
      phone: "01712345678",
      email: "nusrat.jahan@example.com",
      division: "Dhaka",
      district: "Dhaka",
      city: "Dhanmondi",
      streetAddress: "House 24, Road 7A, Apartment 5B",
      postalCode: "1209",
      deliveryInstructions: "Please call upon arrival at the security gate",
    };

    it("should validate a complete and correct Bangladesh shipping address", () => {
      const parsed = shippingAddressSchema.safeParse(validShippingAddress);
      assert.strictEqual(parsed.success, true);
    });

    it("should reject phone number shorter than 11 digits", () => {
      const invalid = shippingAddressSchema.safeParse({
        ...validShippingAddress,
        phone: "0171234",
      });
      assert.strictEqual(invalid.success, false);
    });

    it("should reject invalid email format", () => {
      const invalid = shippingAddressSchema.safeParse({
        ...validShippingAddress,
        email: "not-an-email",
      });
      assert.strictEqual(invalid.success, false);
    });

    it("should accept valid checkout order payload with ZiniPay provider", () => {
      const checkoutPayload = {
        shippingAddress: validShippingAddress,
        paymentProvider: "ZINIPAY",
        customerNotes: "Please pack carefully with gift wrap",
      };

      const parsed = checkoutOrderCreateSchema.safeParse(checkoutPayload);
      assert.strictEqual(parsed.success, true);
      if (parsed.success) {
        assert.strictEqual(parsed.data.paymentProvider, "ZINIPAY");
      }
    });

    it("should validate fulfillment update status schema", () => {
      const validFulfillment = updateFulfillmentStatusSchema.safeParse({
        itemId: "item_123",
        fulfillmentStatus: "SHIPPED",
        carrier: "Steadfast Courier",
        trackingNumber: "SF-88912301",
      });
      assert.strictEqual(validFulfillment.success, true);
    });

    it("should reject fulfillment update with invalid enum value", () => {
      const invalid = updateFulfillmentStatusSchema.safeParse({
        itemId: "item_123",
        fulfillmentStatus: "UNKNOWN_STATUS",
      });
      assert.strictEqual(invalid.success, false);
    });

    it("should validate order cancellation request schema", () => {
      const valid = orderCancelRequestSchema.safeParse({
        reason: "Ordered wrong size, need to reorder medium size",
      });
      assert.strictEqual(valid.success, true);

      const invalidTooShort = orderCancelRequestSchema.safeParse({
        reason: "No",
      });
      assert.strictEqual(invalidTooShort.success, false);
    });
  });

  describe("ZiniPay Payment Utility & URL Extraction", () => {
    it("should extract invoice ID from query string parameter", () => {
      const url1 = "https://checkout.zinipay.com/pay?invoice_id=INV_BDSISTERS_98234";
      assert.strictEqual(extractInvoiceIdFromUrl(url1), "INV_BDSISTERS_98234");

      const url2 = "https://sandbox.zinipay.com/gateway?invoiceId=INV_SANDBOX_771";
      assert.strictEqual(extractInvoiceIdFromUrl(url2), "INV_SANDBOX_771");

      const url3 = "https://checkout.zinipay.com/pay?id=INV_SHORT_ID";
      assert.strictEqual(extractInvoiceIdFromUrl(url3), "INV_SHORT_ID");
    });

    it("should extract invoice ID from path segment", () => {
      const pathUrl1 = "https://api.zinipay.com/v1/invoice/INV_PATH_9999";
      assert.strictEqual(extractInvoiceIdFromUrl(pathUrl1), "INV_PATH_9999");

      const pathUrl2 = "https://checkout.zinipay.com/payment/INV_SEGMENT_123";
      assert.strictEqual(extractInvoiceIdFromUrl(pathUrl2), "INV_SEGMENT_123");
    });

    it("should normalize diverse ZiniPay payment statuses correctly", () => {
      assert.strictEqual(normalizeZiniPayStatus("COMPLETED"), "PAID");
      assert.strictEqual(normalizeZiniPayStatus("PAID"), "PAID");
      assert.strictEqual(normalizeZiniPayStatus("CANCELLED"), "CANCELLED");
      assert.strictEqual(normalizeZiniPayStatus("canceled"), "CANCELLED");
      assert.strictEqual(normalizeZiniPayStatus("FAILED"), "FAILED");
      assert.strictEqual(normalizeZiniPayStatus("PENDING"), "PROCESSING");
      assert.strictEqual(normalizeZiniPayStatus("PROCESSING"), "PROCESSING");
    });
  });

  describe("E-commerce UI Badges & Presentation Helpers", () => {
    it("should provide consistent badges for OrderStatus", () => {
      const confirmed = getOrderStatusBadge("CONFIRMED");
      assert.strictEqual(confirmed.label, "Confirmed");
      assert.strictEqual(typeof confirmed.color, "string");
      assert.strictEqual(typeof confirmed.bg, "string");

      const shipped = getOrderStatusBadge("SHIPPED");
      assert.strictEqual(shipped.label, "Shipped");

      const delivered = getOrderStatusBadge("DELIVERED");
      assert.strictEqual(delivered.label, "Delivered");

      const pending = getOrderStatusBadge("PENDING_PAYMENT");
      assert.strictEqual(pending.label, "Pending Payment");
    });

    it("should provide consistent badges for PaymentStatus", () => {
      const paid = getPaymentStatusBadge("PAID");
      assert.strictEqual(paid.label, "Paid");

      const pending = getPaymentStatusBadge("PENDING");
      assert.strictEqual(pending.label, "Pending");

      const failed = getPaymentStatusBadge("FAILED");
      assert.strictEqual(failed.label, "Failed");
    });

    it("should provide consistent badges for ItemFulfillmentStatus", () => {
      const processing = getItemFulfillmentBadge("PROCESSING");
      assert.strictEqual(processing.label, "Processing");

      const shipped = getItemFulfillmentBadge("SHIPPED");
      assert.strictEqual(shipped.label, "Shipped");

      const delivered = getItemFulfillmentBadge("DELIVERED");
      assert.strictEqual(delivered.label, "Delivered");
    });
  });
});
