import { z } from "zod";

// Product schema
const productSchema = z.object({
  id: z.string().nonempty("Product ID is required"),
  name: z.string().nonempty("Product name is required"),
  prices: z
    .array(
      z.object({
        id: z.string().nonempty("Price ID is required"),
        name: z.string().nonempty("Price name is required"),
        basePriceInCents: z
          .number()
          .int()
          .nonnegative("Price must be a non-negative integer"),
        priceQuantity: z.number().int().min(1, "Quantity must be at least 1"),
        recurringInterval: z.enum(
          ["day", "week", "month", "year", "one-time"],
          {
            errorMap: () => ({
              message: "Please select a valid recurring interval",
            }),
          }
        ),
        recurringFrequency: z
          .number()
          .int()
          .min(1, "Frequency must be at least 1"),
      })
    )
    .min(1, "At least one price is required"),
});

// Color validation helper
const isValidHexColor = (color: string) => {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
};

// Subdomain validation helper
const isValidSubdomain = (subdomain: string) => {
  return /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(subdomain);
};

// Showcase schema
export const showcaseSchema = z.object({
  companyName: z.string().nonempty("Company name is required"),
  logoUrl: z.string().optional(),
  brandColor: z
    .string()
    .refine(isValidHexColor, "Brand color must be a valid hex color")
    .default("#3b82f6"),
  subdomain: z
    .string()
    .nonempty("Subdomain is required")
    .regex(
      /^[a-z0-9-]+$/,
      "Subdomain can only contain lowercase letters, numbers, and hyphens"
    ),
  products: z.array(productSchema).min(1, "At least one product is required"),
});

// Type inference
export type ShowcaseType = z.infer<typeof showcaseSchema>;
