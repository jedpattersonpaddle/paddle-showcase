import type { Metadata } from "next";
import PortalClient from "./PortalClient";
import { paddle } from "@/lib/paddle";
import { SimplifiedSubscription, Transaction } from "./types";
import { db } from "@/db";
import { subscription as SubscriptionSchema } from "@/db/schema";
import { eq } from "drizzle-orm";

export const metadata: Metadata = {
  title: "Customer Portal",
  description: "Portal",
};

interface PortalPageProps {
  params: Promise<{ subscriptionId: string }>;
}

async function getTransactions(subscriptionId: string) {
  const transactionsCollection = await paddle.transactions.list({
    subscriptionId: [subscriptionId],
  });

  const transactions = await transactionsCollection.next();

  const formattedTransactions: Transaction[] = await Promise.all(
    transactions.map(async (transaction) => {
      let invoiceUrl: string | undefined;
      try {
        if (
          transaction.status === "completed" ||
          transaction.status === "billed"
        ) {
          const invoiceResponse = await paddle.transactions.getInvoicePDF(
            transaction.id
          );
          invoiceUrl = invoiceResponse.url;
        }
      } catch (error) {
        console.error(
          `Failed to get invoice URL for transaction ${transaction.id}:`,
          error
        );
      }

      return {
        id: transaction.id,
        status: transaction.status,
        createdAt: transaction.createdAt,
        updatedAt: transaction.updatedAt,
        billedAt: transaction.billedAt,
        totalAmount: transaction.details?.totals?.grandTotal,
        paymentMethod: {
          type: transaction.payments?.[0]?.methodDetails?.type,
          card: {
            brand: transaction.payments?.[0]?.methodDetails?.card?.type,
            last4: transaction.payments?.[0]?.methodDetails?.card?.last4,
            expiryMonth:
              transaction.payments?.[0]?.methodDetails?.card?.expiryMonth?.toString(),
            expiryYear:
              transaction.payments?.[0]?.methodDetails?.card?.expiryYear?.toString(),
          },
        },
        items: transaction.items.map((item) => ({
          price: {
            name: item.price?.name || "",
            unitPrice: {
              amount: item.price?.unitPrice?.amount || "0",
              currencyCode: item.price?.unitPrice?.currencyCode || "USD",
            },
          },
          quantity: item.quantity,
          totalAmount: {
            amount: item.price?.unitPrice?.amount
              ? (
                  parseInt(item.price.unitPrice.amount) * item.quantity
                ).toString()
              : "0",
            currencyCode: item.price?.unitPrice?.currencyCode || "USD",
          },
        })),
        customer: transaction.customer
          ? {
              id: transaction.customer.id,
              name: transaction.customer.name,
              email: transaction.customer.email,
            }
          : null,
        address: transaction.address
          ? {
              countryCode: transaction.address.countryCode,
              postalCode: transaction.address.postalCode,
            }
          : null,
        business: transaction.business
          ? {
              name: transaction.business.name,
              taxIdentifier: transaction.business.taxIdentifier,
            }
          : null,
        invoiceUrl,
      } as Transaction;
    })
  );

  return formattedTransactions;
}

export default async function PortalPage({ params }: PortalPageProps) {
  const { subscriptionId } = await params;

  const subscription = await paddle.subscriptions.get(subscriptionId);

  const customer = await paddle.customers.get(subscription.customerId);

  // Fetch transactions for this subscription
  const transactions = await getTransactions(subscriptionId);

  const dbSubscription = await db
    .select()
    .from(SubscriptionSchema)
    .where(eq(SubscriptionSchema.paddleSubscriptionId, subscription.id));

  // Create a plain object with only the properties we need
  const simplifiedSubscription: SimplifiedSubscription = {
    id: subscription.id,
    status: subscription.status,
    currencyCode: subscription.currencyCode,
    startedAt: subscription.startedAt || "",
    nextBilledAt: subscription.nextBilledAt || "",
    licenseKey: dbSubscription[0]?.licenseKey || "",
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
      transactions={transactions}
    />
  );
}
