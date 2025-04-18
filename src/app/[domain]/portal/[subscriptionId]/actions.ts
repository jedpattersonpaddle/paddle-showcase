"use server";
import { paddle } from "@/lib/paddle";
import { revalidatePath } from "next/cache";
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
