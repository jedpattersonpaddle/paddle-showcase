import { db } from "@/db";
import {
  showcase as ShowcaseSchema,
  product as ProductSchema,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
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
    .leftJoin(ProductSchema, eq(ShowcaseSchema.id, ProductSchema.showcaseId));
  return showcase;
}

export default async function SiteHomePage({
  params,
}: {
  params: Promise<{ domain: string }>;
}) {
  const domain = decodeURIComponent((await params).domain);

  const showcase = await getShowcase(domain);

  if (!showcase || showcase.length === 0) {
    return <div>Showcase not found</div>;
  }

  // Extract products from the showcase data and filter out null values
  const products = showcase
    .filter((item) => item.product !== null)
    .map((item) => item.product as NonNullable<typeof item.product>);

  return <PricingClient showcase={showcase[0].showcase} products={products} />;
}
