import { db } from "@/db";
import { showcase as ShowcaseSchema, price as PriceSchema } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import CheckoutClient from "./CheckoutClient";
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
    title: `${showcase[0].companyName} - Checkout`,
    description: `Checkout page for ${showcase[0].companyName}`,
  };
}

async function getShowcaseAndPrices(domain: string, currentPriceId: string) {
  const showcase = await db
    .select()
    .from(ShowcaseSchema)
    .where(eq(ShowcaseSchema.subdomain, domain))
    .limit(1);

  if (!showcase[0]) {
    return null;
  }

  // Get the current price
  const currentPrice = await db
    .select()
    .from(PriceSchema)
    .where(eq(PriceSchema.paddlePriceId, currentPriceId))
    .limit(1);

  if (!currentPrice[0]) {
    return null;
  }

  // Get the alternative price (monthly/annual)
  const alternativePrice = await db
    .select()
    .from(PriceSchema)
    .where(
      and(
        eq(PriceSchema.productId, currentPrice[0].productId),
        eq(
          PriceSchema.recurringInterval,
          currentPrice[0].recurringInterval === "month" ? "year" : "month"
        )
      )
    )
    .limit(1);

  return {
    showcase: showcase[0],
    currentPrice: currentPrice[0],
    alternativePrice: alternativePrice[0] || null,
  };
}

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ domain: string; priceId: string }>;
}) {
  const domain = decodeURIComponent((await params).domain);
  const priceId = (await params).priceId;
  const data = await getShowcaseAndPrices(domain, priceId);

  if (!data) {
    return <div>Showcase or price not found</div>;
  }

  return (
    <CheckoutClient
      priceId={priceId}
      showcase={data.showcase}
      currentPrice={data.currentPrice}
      alternativePrice={data.alternativePrice}
    />
  );
}
