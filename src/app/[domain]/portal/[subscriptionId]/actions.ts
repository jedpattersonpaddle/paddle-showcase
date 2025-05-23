"use server";
import { paddle } from "@/lib/paddle";
import { revalidatePath } from "next/cache";
import { Transaction } from "./types";
import { db } from "@/db";
import { subscription as SubscriptionSchema } from "@/db/schema";
import { eq } from "drizzle-orm";
import { generateLicenseKey } from "@/lib/utils";

export async function cancelSubscription(subscriptionId: string) {
  try {
    await paddle.subscriptions.cancel(subscriptionId, {
      effectiveFrom: "next_billing_period",
    });

    revalidatePath(`/portal/${subscriptionId}`);
    return { success: true };
  } catch (error) {
    console.error("Error cancelling subscription:", error);
    return { success: false, error: "Failed to cancel subscription" };
  }
}

interface CustomerInfo {
  name: string;
  email: string;
}

export async function updateCustomerInfo(
  subscriptionId: string,
  customerInfo: CustomerInfo
) {
  try {
    const subscription = await paddle.subscriptions.get(subscriptionId);

    await paddle.customers.update(subscription.customerId, {
      email: customerInfo.email,
      name: customerInfo.name,
    });

    revalidatePath(`/portal/${subscriptionId}`);

    return { success: true };
  } catch (error) {
    console.error("Error updating customer info:", error);
    return { success: false, error: "Failed to update customer info" };
  }
}

export async function resumeSubscription(subscriptionId: string) {
  try {
    await paddle.subscriptions.update(subscriptionId, {
      scheduledChange: null,
    });
    revalidatePath(`/portal/${subscriptionId}`);
    return { success: true };
  } catch (error) {
    console.error("Error resuming subscription:", error);
    return { success: false, error: "Failed to resume subscription" };
  }
}

export async function getUpdatePaymentMethodTransaction(
  subscriptionId: string
) {
  try {
    const transaction =
      await paddle.subscriptions.getPaymentMethodChangeTransaction(
        subscriptionId
      );

    const serializedTransaction = {
      id: transaction.id,
      status: transaction.status,
    };

    return { success: true, transaction: serializedTransaction };
  } catch (error) {
    console.error("Error getting update payment method transaction:", error);
    return {
      success: false,
      error: "Failed to get update payment method transaction",
    };
  }
}

export async function resetLicenseKey(subscriptionId: string) {
  try {
    const newLicenseKey = generateLicenseKey();

    await db
      .update(SubscriptionSchema)
      .set({ licenseKey: newLicenseKey })
      .where(eq(SubscriptionSchema.paddleSubscriptionId, subscriptionId));

    revalidatePath(`/portal/${subscriptionId}`);
    return { success: true };
  } catch (error) {
    console.error("Error resetting license key:", error);
    return { success: false, error: "Failed to reset license key" };
  }
}
