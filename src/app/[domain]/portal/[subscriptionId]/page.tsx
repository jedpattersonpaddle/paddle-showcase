import type { Metadata } from "next";
import PortalClient from "./PortalClient";
import { paddle } from "@/lib/paddle";

export const metadata: Metadata = {
  title: "Customer Portal",
  description: "Portal",
};

interface PortalPageProps {
  params: Promise<{ subscriptionId: string }>;
}

interface SimplifiedSubscription {
  id: string;
  status: string;
  currencyCode: string;
  startedAt: string;
  nextBilledAt: string;
  billingCycle: {
    frequency: number;
    interval: string;
  };
  items: Array<{
    quantity: number;
    price: {
      name: string;
      unitPrice: {
        amount: string;
        currencyCode: string;
      };
    };
    product: {
      name: string;
      description: string;
      imageUrl: string;
    };
  }>;
  managementUrls: {
    updatePaymentMethod: string;
    cancel: string;
  };
  scheduledChange?: {
    action: string;
    effectiveAt: string;
  } | null;
}

export default async function PortalPage({ params }: PortalPageProps) {
  const { subscriptionId } = await params;

  const subscription = await paddle.subscriptions.get(subscriptionId);

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
