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
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";

interface UpdateShowcaseType extends ShowcaseType {
  id: string;
}

export async function updateShowcase(showcase: UpdateShowcaseType) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return false;

  const user = await db
    .select()
    .from(UserSchema)
    .where(eq(UserSchema.id, session.user.id));

  if (!user || user.length === 0) return false;

  // Check if the user owns this showcase
  const existingShowcase = await db
    .select()
    .from(ShowcaseSchema)
    .where(eq(ShowcaseSchema.id, showcase.id))
    .limit(1);

  if (!existingShowcase || existingShowcase.length === 0) return false;
  if (existingShowcase[0].userId !== session.user.id) return false;

  // Validate the data
  const validatedData = await showcaseSchema.safeParseAsync({
    companyName: showcase.companyName,
    logoUrl: showcase.logoUrl,
    brandColor: showcase.brandColor,
    subdomain: showcase.subdomain,
    products: showcase.products,
  });

  if (!validatedData.success) return false;

  // Update the showcase
  await db
    .update(ShowcaseSchema)
    .set({
      companyName: validatedData.data.companyName,
      logoUrl: validatedData.data.logoUrl || null,
      brandColor: validatedData.data.brandColor,
      subdomain: validatedData.data.subdomain,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(ShowcaseSchema.id, showcase.id));

  // Get existing products and prices
  const existingProducts = await db
    .select()
    .from(ProductSchema)
    .where(eq(ProductSchema.showcaseId, showcase.id));

  const existingPrices = await db
    .select()
    .from(PriceSchema)
    .where(eq(PriceSchema.productId, existingProducts[0]?.id));

  // Create maps for existing products and prices
  const existingProductsMap = new Map(
    existingProducts.map((product) => [product.id, product])
  );
  const existingPricesMap = new Map(
    existingPrices.map((price) => [price.productId, price])
  );

  // Process each product in the form
  for (const product of validatedData.data.products) {
    if (existingProductsMap.has(product.id)) {
      // Update existing product
      const existingProduct = existingProductsMap.get(product.id)!;
      const existingPrice = existingPricesMap.get(product.id);

      // Update the product in Paddle
      await paddle.products.update(existingPrice?.paddlePriceId || "", {
        name: product.name,
      });

      // Update the price in Paddle
      await paddle.prices.update(existingPrice?.paddlePriceId || "", {
        description: product.name,
        unitPrice: {
          amount: product.basePriceInCents.toString(),
          currencyCode: "USD",
        },
        billingCycle: {
          frequency: product.recurringFrequency,
          interval: product.recurringInterval as Interval,
        },
      });

      // Update the product in the database
      await db
        .update(ProductSchema)
        .set({
          name: product.name,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(ProductSchema.id, product.id));

      // Update the price in the database
      if (existingPrice) {
        await db
          .update(PriceSchema)
          .set({
            name: product.priceName,
            basePriceInCents: product.basePriceInCents,
            priceQuantity: product.priceQuantity,
            recurringInterval: product.recurringInterval,
            recurringFrequency: product.recurringFrequency,
            updatedAt: new Date().toISOString(),
          })
          .where(eq(PriceSchema.id, existingPrice.id));
      }

      // Remove from the maps to track which ones to delete
      existingProductsMap.delete(product.id);
      existingPricesMap.delete(product.id);
    } else {
      // Create new product
      const newProduct = await paddle.products.create({
        name: product.name,
        taxCategory: "standard",
      });

      const price = await paddle.prices.create({
        productId: newProduct.id,
        description: product.name,
        unitPrice: {
          amount: product.basePriceInCents.toString(),
          currencyCode: "USD",
        },
        billingCycle: {
          frequency: product.recurringFrequency,
          interval: product.recurringInterval as Interval,
        },
      });

      const productId = nanoid();
      await db.insert(ProductSchema).values({
        id: productId,
        showcaseId: showcase.id,
        name: product.name,
      });

      await db.insert(PriceSchema).values({
        id: nanoid(),
        productId: productId,
        name: product.priceName,
        basePriceInCents: product.basePriceInCents,
        priceQuantity: product.priceQuantity,
        recurringInterval: product.recurringInterval,
        recurringFrequency: product.recurringFrequency,
        paddlePriceId: price.id,
      });
    }
  }

  // Delete any products and prices that were removed from the form
  for (const [id, product] of existingProductsMap.entries()) {
    const price = existingPricesMap.get(id);

    if (price) {
      try {
        await paddle.products.archive(price.paddlePriceId);
      } catch (error) {
        console.error("Failed to delete product from Paddle:", error);
      }
    }

    // Delete from database (this will cascade due to the foreign key constraint)
    await db.delete(ProductSchema).where(eq(ProductSchema.id, id));
  }

  return true;
}

export async function deleteShowcase(showcaseId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return false;

  const existingShowcase = await db
    .select()
    .from(ShowcaseSchema)
    .where(
      and(
        eq(ShowcaseSchema.id, showcaseId),
        eq(ShowcaseSchema.userId, session.user.id)
      )
    )
    .limit(1);

  if (!existingShowcase || existingShowcase.length === 0) return false;
  if (existingShowcase[0].userId !== session.user.id) return false;

  await db
    .delete(ProductSchema)
    .where(eq(ProductSchema.showcaseId, showcaseId));

  await db.delete(ShowcaseSchema).where(eq(ShowcaseSchema.id, showcaseId));

  return true;
}
