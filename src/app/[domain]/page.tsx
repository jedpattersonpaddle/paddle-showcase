import { db } from "@/db";
import {
  showcase as ShowcaseSchema,
  product as ProductSchema,
  price as PriceSchema,
} from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import PricingClient from "./PricingClient";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ domain: string }>;
}): Promise<Metadata> {
  const domain = decodeURIComponent((await params).domain);
  const showcase = await db
    .select()
    .from(ShowcaseSchema)
    .where(eq(ShowcaseSchema.subdomain, domain))
    .limit(1);

  return {
    title: `${showcase[0].companyName} - Pricing`,
    description: `Pricing plans for ${showcase[0].companyName}`,
  };
}

async function getShowcase(domain: string) {
  const showcase = await db
    .select()
    .from(ShowcaseSchema)
    .where(eq(ShowcaseSchema.subdomain, domain))
    .limit(1);

  if (!showcase || showcase.length === 0) {
    return null;
  }

  const products = await db
    .select()
    .from(ProductSchema)
    .where(eq(ProductSchema.showcaseId, showcase[0].id));

  const prices = await db
    .select()
    .from(PriceSchema)
    .where(
      inArray(
        PriceSchema.productId,
        products.map((p) => p.id)
      )
    );

  return {
    showcase: showcase[0],
    products: products.map((product) => ({
      ...product,
      prices: prices
        .filter((price) => price.productId === product.id)
        .map((price) => ({
          id: price.id,
          name: price.name,
          basePriceInCents: price.basePriceInCents,
          priceQuantity: price.priceQuantity,
          recurringInterval: price.recurringInterval as
            | "day"
            | "week"
            | "month"
            | "year"
            | "one-time",
          recurringFrequency: price.recurringFrequency,
        })),
    })),
  };
}

export default async function SiteHomePage({
  params,
}: {
  params: Promise<{ domain: string }>;
}) {
  const domain = decodeURIComponent((await params).domain);
  const data = await getShowcase(domain);

  if (!data) {
    return <div>Showcase not found</div>;
  }

  return <PricingClient showcase={data.showcase} products={data.products} />;
}
