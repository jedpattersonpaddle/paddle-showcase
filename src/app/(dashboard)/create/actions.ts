"use server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { paddle } from "@/lib/paddle";
import { showcaseSchema, type ShowcaseType } from "@/lib/schemas";
import { type Interval } from "@paddle/paddle-node-sdk";
import {
  user as UserSchema,
  showcase as ShowcaseSchema,
  product as ProductSchema,
  price as PriceSchema,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { addDomainToProject } from "@/lib/vercel";

export async function createShowcase(showcase: ShowcaseType) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return false;

  const user = await db
    .select()
    .from(UserSchema)
    .where(eq(UserSchema.id, session.user.id));

  if (!user || user.length === 0) return false;

  const validatedData = await showcaseSchema.safeParseAsync(showcase);

  if (!validatedData.success) return false;

  const showcaseId = nanoid();
  const subdomain = validatedData.data.subdomain;

  if (process.env.NODE_ENV === "production") {
    try {
      await addDomainToProject(
        `${subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
      );
    } catch (error) {
      console.error("Failed to add domain to Vercel:", error);
      return false;
    }
  }

  await db.insert(ShowcaseSchema).values({
    id: showcaseId,
    userId: session.user.id,
    companyName: validatedData.data.companyName,
    logoUrl: validatedData.data.logoUrl || null,
    brandColor: validatedData.data.brandColor,
    subdomain: subdomain,
  });

  for (const product of validatedData.data.products) {
    const newProduct = await paddle.products.create({
      name: product.name,
      taxCategory: "standard",
    });

    const productId = nanoid();
    await db.insert(ProductSchema).values({
      id: productId,
      showcaseId: showcaseId,
      name: product.name,
    });

    for (const price of product.prices) {
      const paddlePrice = await paddle.prices.create({
        productId: newProduct.id,
        description: `${product.name} - ${price.name}`,
        unitPrice: {
          amount: price.basePriceInCents.toString(),
          currencyCode: "USD",
        },
        billingCycle: {
          frequency: price.recurringFrequency,
          interval: price.recurringInterval as Interval,
        },
      });

      await db.insert(PriceSchema).values({
        id: nanoid(),
        productId: productId,
        name: price.name,
        basePriceInCents: price.basePriceInCents,
        priceQuantity: price.priceQuantity,
        recurringInterval: price.recurringInterval,
        recurringFrequency: price.recurringFrequency,
        paddlePriceId: paddlePrice.id,
      });
    }
  }

  return showcaseId;
}
