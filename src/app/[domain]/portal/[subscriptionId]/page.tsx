import type { Metadata } from "next";
import PortalClient from "./PortalClient";
import { paddle } from "@/lib/paddle";
import { SimplifiedSubscription } from "./types";

export const metadata: Metadata = {
  title: "Customer Portal",
  description: "Portal",
};

interface PortalPageProps {
  params: Promise<{ subscriptionId: string }>;
}

export default async function PortalPage({ params }: PortalPageProps) {
  const { subscriptionId } = await params;

  const subscription = await paddle.subscriptions.get(subscriptionId);

  const customer = await paddle.customers.get(subscription.customerId);

  // Create a plain object with only the properties we need
  const simplifiedSubscription: SimplifiedSubscription = {
    id: subscription.id,
    status: subscription.status,
    currencyCode: subscription.currencyCode,
    startedAt: subscription.startedAt || "",
    nextBilledAt: subscription.nextBilledAt || "",
    billingCycle: {
      frequency: subscription.billingCycle.frequency,
      interval: subscription.billingCycle.interval,
    },
    items: subscription.items.map((item) => ({
      quantity: item.quantity,
      price: {
        name: item.price.name || "",
        unitPrice: {
          amount: item.price.unitPrice.amount,
          currencyCode: item.price.unitPrice.currencyCode,
        },
      },
      product: {
        name: item.product.name,
        description: item.product.description || "",
        imageUrl: item.product.imageUrl || "",
      },
    })),
    customer: {
      name: customer.name,
      email: customer.email,
    },
    managementUrls: {
      updatePaymentMethod:
        subscription.managementUrls?.updatePaymentMethod || "",
      cancel: subscription.managementUrls?.cancel || "",
    },
    scheduledChange: subscription.scheduledChange
      ? {
          action: subscription.scheduledChange.action,
          effectiveAt: subscription.scheduledChange.effectiveAt,
        }
      : null,
  };

  console.log(simplifiedSubscription.status);

  return (
    <PortalClient
      subscriptionId={subscriptionId}
      subscription={simplifiedSubscription}
    />
  );
}
