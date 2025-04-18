import { z } from "zod";

// Product schema
const productSchema = z.object({
  id: z.string().nonempty("Product ID is required"),
  name: z.string().nonempty("Product name is required"),
  priceName: z.string().nonempty("Price name is required"),
  basePriceInCents: z
    .number()
    .int()
    .nonnegative("Price must be a non-negative integer"),
  priceQuantity: z.number().int().min(1, "Quantity must be at least 1"),
  recurringInterval: z.enum(["day", "week", "month", "year", "one-time"], {
    errorMap: () => ({ message: "Please select a valid recurring interval" }),
  }),
  recurringFrequency: z.number().int().min(1, "Frequency must be at least 1"),
});

// Color validation helper
const isValidHexColor = (color: string) => {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
};

// Subdomain validation helper
const isValidSubdomain = (subdomain: string) => {
  return /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(subdomain);
};

export const showcaseSchema = z.object({
  companyName: z
    .string()
    .nonempty("Company name is required")
    .max(100, "Company name cannot exceed 100 characters"),

  logoUrl: z
    .string()
    .url("Please enter a valid URL")
    .or(z.string().length(0).optional()),

  brandColor: z.string().refine(isValidHexColor, {
    message: "Please enter a valid hex color code (e.g. #FF0000)",
  }),

  subdomain: z
    .string()
    .nonempty("Subdomain is required")
    .max(63, "Subdomain cannot exceed 63 characters")
    .refine(isValidSubdomain, {
      message:
        "Subdomain can only contain lowercase letters, numbers, and hyphens",
    }),

  products: z
    .array(productSchema)
    .nonempty("At least one product is required")
    .refine(
      (products) => {
        // Ensure all products have unique IDs
        const ids = products.map((product) => product.id);
        return new Set(ids).size === ids.length;
      },
      {
        message: "All products must have unique IDs",
      }
    ),
});

// Type inference
export type ShowcaseType = z.infer<typeof showcaseSchema>;
