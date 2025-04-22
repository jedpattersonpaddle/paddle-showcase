import { db } from "@/db";
import {
  product as ProductSchema,
  showcase as ShowcaseSchema,
  price as PriceSchema,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ domain: string }>;
}) {
  const domain = decodeURIComponent((await params).domain);

  const showcase = await db
    .select()
    .from(ShowcaseSchema)
    .where(eq(ShowcaseSchema.subdomain, domain));

  const products = await db
    .select()
    .from(ProductSchema)
    .where(eq(ProductSchema.showcaseId, showcase[0].id));

  const price = await db
    .select()
    .from(PriceSchema)
    .where(eq(PriceSchema.productId, products[0].id));

  const priceId = price[0].paddlePriceId;

  if (!priceId) {
    return <div>No price found</div>;
  }

  redirect(`/checkout/${priceId}`);
}
