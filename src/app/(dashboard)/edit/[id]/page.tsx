import { EditShowcaseClient } from "./client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import {
  showcase as ShowcaseSchema,
  product as ProductSchema,
  price as PriceSchema,
} from "@/db/schema";
import { eq, inArray } from "drizzle-orm";

export default async function EditShowcase({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/login");

  const showcase = await db
    .select()
    .from(ShowcaseSchema)
    .where(eq(ShowcaseSchema.id, (await params).id))
    .limit(1);

  if (!showcase || showcase.length === 0) {
    redirect("/");
  }

  if (showcase[0].userId !== session.user.id) {
    redirect("/");
  }

  const products = await db
    .select()
    .from(ProductSchema)
    .where(eq(ProductSchema.showcaseId, (await params).id));

  // Get prices for all products
  const prices =
    products.length > 0
      ? await db
          .select()
          .from(PriceSchema)
          .where(
            inArray(
              PriceSchema.productId,
              products.map((p) => p.id)
            )
          )
      : [];

  return (
    <EditShowcaseClient
      showcase={showcase[0]}
      products={products}
      prices={prices}
    />
  );
}
