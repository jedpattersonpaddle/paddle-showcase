import { db } from "@/db";
import { showcase as ShowcaseSchema } from "@/db/schema";
import { eq } from "drizzle-orm";
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

async function getShowcase(domain: string) {
  const showcase = await db
    .select()
    .from(ShowcaseSchema)
    .where(eq(ShowcaseSchema.subdomain, domain))
    .limit(1);
  return showcase[0];
}

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ domain: string; priceId: string }>;
}) {
  const domain = decodeURIComponent((await params).domain);
  const showcase = await getShowcase(domain);

  if (!showcase) {
    return <div>Showcase not found</div>;
  }

  return (
    <CheckoutClient priceId={(await params).priceId} showcase={showcase} />
  );
}
