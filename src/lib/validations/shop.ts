import { z } from "zod";

export const shopSettingsSchema = z.object({
  businessId: z.string().min(1, "Associated business ID is required"),
  name: z
    .string()
    .trim()
    .min(2, "Shop name must be at least 2 characters")
    .max(80, "Shop name cannot exceed 80 characters"),
  slug: z
    .string()
    .trim()
    .min(2, "Slug must be at least 2 characters")
    .max(80, "Slug cannot exceed 80 characters")
    .regex(/^[a-z0-9-]+$/, "Slug may only contain lowercase letters, numbers, and hyphens"),
  shortDescription: z
    .string()
    .trim()
    .max(250, "Short description cannot exceed 250 characters")
    .optional()
    .or(z.literal("")),
  supportEmail: z.string().trim().email("Please provide a valid support email").optional().or(z.literal("")),
  supportPhone: z.string().trim().max(25, "Phone is too long").optional().or(z.literal("")),
});

export type ShopSettingsInput = z.infer<typeof shopSettingsSchema>;

export const shopBrandingSchema = z.object({
  logo: z.string().optional().nullable(),
  banner: z.string().optional().nullable(),
});

export type ShopBrandingInput = z.infer<typeof shopBrandingSchema>;

export const shopPoliciesSchema = z.object({
  shippingPolicy: z.string().trim().max(2000, "Shipping policy is too long").optional().or(z.literal("")),
  returnPolicy: z.string().trim().max(2000, "Return policy is too long").optional().or(z.literal("")),
  exchangePolicy: z.string().trim().max(2000, "Exchange policy is too long").optional().or(z.literal("")),
  privacyPolicy: z.string().trim().max(2000, "Privacy policy is too long").optional().or(z.literal("")),
  customerSupportHours: z.string().trim().max(200, "Support hours text is too long").optional().or(z.literal("")),
});

export type ShopPoliciesInput = z.infer<typeof shopPoliciesSchema>;

export const fullShopUpdateSchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  slug: z.string().trim().min(2).max(80).regex(/^[a-z0-9-]+$/).optional(),
  shortDescription: z.string().trim().max(250).optional().or(z.literal("")),
  supportEmail: z.string().trim().email().optional().or(z.literal("")),
  supportPhone: z.string().trim().max(25).optional().or(z.literal("")),
  logo: z.string().optional().nullable(),
  banner: z.string().optional().nullable(),
  policies: shopPoliciesSchema.optional(),
  status: z.enum(["DRAFT", "PENDING_REVIEW", "ACTIVE", "PAUSED"]).optional(),
});

export type FullShopUpdateInput = z.infer<typeof fullShopUpdateSchema>;
