import { db } from "@/db";
import type {
  SubscriptionCreatedEvent,
  SubscriptionCanceledEvent,
} from "@paddle/paddle-node-sdk";
import { generateLicenseKey } from "../utils";
import { subscription as SubscriptionSchema } from "@/db/schema";
import { eq } from "drizzle-orm";
import { generateId } from "@/lib/utils";

export async function createSubscription(
  subscription: SubscriptionCreatedEvent
) {
  const licenseKey = generateLicenseKey();

  await db.insert(SubscriptionSchema).values({
    paddleSubscriptionId: subscription.data.id,
    licenseKey,
    status: subscription.data.status,
    id: generateId(),
  });
}
export async function cancelSubscription(
  subscription: SubscriptionCanceledEvent
) {
  await db
    .update(SubscriptionSchema)
    .set({ status: subscription.data.status })
    .where(eq(SubscriptionSchema.paddleSubscriptionId, subscription.data.id));
}
