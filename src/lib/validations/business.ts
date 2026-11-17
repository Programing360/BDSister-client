import { z } from "zod";

export const BUSINESS_CATEGORIES = [
  "Fashion & Apparel",
  "Handicrafts & Heritage Crafts",
  "Health, Beauty & Skincare",
  "Food, Bakery & Catering",
  "Technology & Software",
  "Education, Tutoring & Training",
  "Home Decor & Furniture",
  "Jewelry & Accessories",
  "Creative Arts & Photography",
  "Professional & Legal Consulting",
  "Event Planning & Floral",
  "Agriculture & Organic Produce",
  "Other Women-Led Venture",
] as const;

export const BUSINESS_TYPES = [
  "Sole Proprietorship",
  "Partnership",
  "Private Limited Company",
  "Social Enterprise",
  "Cottage / Artisan Studio",
  "Online Startup",
  "Other",
] as const;

export const BANGLADESH_DIVISIONS = [
  "Dhaka",
  "Chattogram",
  "Sylhet",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Rangpur",
  "Mymensingh",
  "Diaspora / International",
] as const;

/**
 * Generate a clean URL-friendly slug
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .refine(
    (val) => !val || val === "" || /^https?:\/\/.+/i.test(val) || /^[\w.-]+(\.[\w.-]+)+/i.test(val),
    { message: "Please enter a valid website address or URL (e.g. https://example.com)" }
  );

export const businessRegistrationSchema = z.object({
  // Step 1: Basic info
  name: z
    .string()
    .trim()
    .min(2, "Business name must be at least 2 characters")
    .max(100, "Business name cannot exceed 100 characters"),
  category: z.string().min(1, "Please select a business category"),
  businessType: z.enum(BUSINESS_TYPES, {
    message: "Please select a valid business entity type",
  }),
  shortDescription: z
    .string()
    .trim()
    .min(10, "Tagline / short description must be at least 10 characters")
    .max(200, "Short description cannot exceed 200 characters"),
  fullDescription: z
    .string()
    .trim()
    .min(20, "Detailed story must be at least 20 characters")
    .max(3000, "Detailed story cannot exceed 3,000 characters"),
  yearEstablished: z
    .number()
    .int()
    .min(1971, "Year must be 1971 or later")
    .max(new Date().getFullYear(), "Year cannot be in the future")
    .optional()
    .nullable(),

  // Step 2: Contact
  email: z.string().trim().email("Please provide a valid business email"),
  phone: z
    .string()
    .trim()
    .min(6, "Phone number is required")
    .max(25, "Phone number is too long"),
  altPhone: z.string().trim().max(25).optional().or(z.literal("")),
  website: optionalUrl,
  facebook: optionalUrl,
  instagram: optionalUrl,
  linkedin: optionalUrl,

  // Step 3: Location
  country: z.string().trim().default("Bangladesh"),
  division: z.string().min(1, "Please select your division"),
  district: z.string().trim().min(2, "District is required"),
  city: z.string().trim().min(2, "City or area is required"),
  address: z.string().trim().max(200).optional().or(z.literal("")),
  postalCode: z.string().trim().max(20).optional().or(z.literal("")),

  // Step 4: Branding
  logo: z.string().optional().nullable(),
  coverImage: z.string().optional().nullable(),

  // Step 5: Submission options
  visibility: z.enum(["PUBLIC", "PRIVATE"]).default("PUBLIC"),
  submitForReview: z.boolean().default(true),
});

export type BusinessRegistrationInput = z.infer<typeof businessRegistrationSchema>;

export const businessUpdateSchema = businessRegistrationSchema.partial();
export type BusinessUpdateInput = z.infer<typeof businessUpdateSchema>;

export const businessVerificationSchema = z.object({
  businessId: z.string().min(1, "Business ID is required"),
  documentType: z.enum(["TRADE_LICENSE", "TIN_CERTIFICATE", "NATIONAL_ID", "UTILITY_BILL", "OTHER"]),
  documentTitle: z.string().trim().min(2, "Document title required").max(100),
  documentUrl: z.string().min(1, "Document file is required"),
  notes: z.string().trim().max(500).optional(),
});

export type BusinessVerificationInput = z.infer<typeof businessVerificationSchema>;
