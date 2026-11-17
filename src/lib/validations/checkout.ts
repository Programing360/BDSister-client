import { z } from "zod";

export const shippingAddressSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Recipient name must be at least 2 characters")
    .max(100, "Recipient name cannot exceed 100 characters"),
  phone: z
    .string()
    .trim()
    .min(11, "Phone number must be at least 11 digits")
    .max(18, "Phone number cannot exceed 18 characters")
    .regex(/^[0-9+-\s()]+$/, "Phone number contains invalid characters"),
  email: z
    .string()
    .trim()
    .email("Please provide a valid email address for order notifications"),
  division: z.string().trim().min(2, "Please select your administrative division"),
  district: z.string().trim().min(2, "Please select your district"),
  city: z.string().trim().min(2, "Please specify your City, Thana, or Upazila"),
  streetAddress: z
    .string()
    .trim()
    .min(5, "Street address must be at least 5 characters")
    .max(300, "Street address cannot exceed 300 characters"),
  postalCode: z.string().trim().max(10).optional().nullable(),
  deliveryInstructions: z.string().trim().max(500).optional().nullable(),
});

export const checkoutOrderCreateSchema = z.object({
  shippingAddress: shippingAddressSchema,
  paymentProvider: z.literal("ZINIPAY").default("ZINIPAY"),
  customerNotes: z.string().trim().max(500).optional().nullable(),
});

export const updateFulfillmentStatusSchema = z.object({
  itemId: z.string().min(1, "Order item ID is required"),
  fulfillmentStatus: z.enum(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]),
  carrier: z.string().trim().max(100).optional().nullable(),
  trackingNumber: z.string().trim().max(100).optional().nullable(),
});

export const orderCancelRequestSchema = z.object({
  reason: z.string().trim().min(5, "Reason must be at least 5 characters").max(500),
});

export type ShippingAddressInput = z.infer<typeof shippingAddressSchema>;
export type CheckoutOrderCreateInput = z.infer<typeof checkoutOrderCreateSchema>;
export type UpdateFulfillmentStatusInput = z.infer<typeof updateFulfillmentStatusSchema>;
