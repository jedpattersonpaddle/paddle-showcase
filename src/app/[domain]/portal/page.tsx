import { paddle } from "@/lib/paddle";
import { db } from "@/db";
import { showcase, product } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import type { Subscription } from "@paddle/paddle-node-sdk";
import { format } from "date-fns";

type Product = typeof product.$inferSelect;

interface SubscriptionWithProduct extends Subscription {
  product: Product;
}

export default async function PortalPage({
  params,
}: {
  params: Promise<{ domain: string }>;
}) {
  const { domain } = await params;

  const showcaseData = await db
    .select()
    .from(showcase)
    .where(eq(showcase.subdomain, domain))
    .limit(1);

  if (!showcaseData || showcaseData.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Showcase not found
          </h1>
          <p className="text-gray-500 mt-2">
            The showcase you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>
      </div>
    );
  }

  const products = await db
    .select()
    .from(product)
    .where(eq(product.showcaseId, showcaseData[0].id));

  const subscriptions = await Promise.all(
    products.map(async (product) => {
      try {
        const subsCollection = await paddle.subscriptions.list({
          priceId: [product.paddlePriceId],
        });

        const subs = await subsCollection.next();

        return subs.map((sub) => ({
          ...sub,
          product,
        }));
      } catch (error) {
        console.error(
          `Error fetching subscriptions for product ${product.id}:`,
          error
        );
        return [];
      }
    })
  );

  const allSubscriptions = subscriptions.flat() as SubscriptionWithProduct[];

  return (
    <div className="min-h-screen w-full bg-gray-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50" />

      <div className="relative w-full min-h-screen">
        <div className="max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8 h-full">
          <div className="bg-white rounded-2xl shadow-xl ring-1 ring-gray-200 p-6 lg:p-8">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h5 className="text-blue-600 font-semibold text-sm uppercase tracking-wide">
                    {showcaseData[0].companyName}
                  </h5>
                </div>

                <div>
                  <h3 className="text-4xl font-bold text-gray-900">
                    Your Subscriptions
                  </h3>
                  <h4 className="text-sm text-gray-500 mt-1">
                    Manage your active subscriptions
                  </h4>
                </div>
              </div>

              {allSubscriptions.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium text-gray-900">
                    No subscriptions found
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    You don&apos;t have any active subscriptions yet.
                  </p>
                  <div className="mt-6">
                    <Link href={`/`}>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        Browse Products
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {allSubscriptions.map((subscription) => (
                    <div
                      key={subscription.id}
                      className="border rounded-lg p-6 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">
                              {subscription.product.name}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                              Status:{" "}
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  subscription.status === "active"
                                    ? "bg-green-100 text-green-800"
                                    : subscription.status === "past_due"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {subscription.status.replace("_", " ")}
                              </span>
                            </p>
                          </div>

                          <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Customer ID:</span>{" "}
                              {subscription.customerId || "N/A"}
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Purchased:</span>{" "}
                              {format(
                                new Date(subscription.createdAt),
                                "MMMM d, yyyy"
                              )}
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">
                                Next billing date:
                              </span>{" "}
                              {subscription.nextBilledAt
                                ? format(
                                    new Date(subscription.nextBilledAt),
                                    "MMMM d, yyyy"
                                  )
                                : "N/A"}
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Quantity:</span>{" "}
                              {subscription.items[0].quantity}
                            </p>
                          </div>
                        </div>

                        <div className="text-right space-y-4">
                          <div>
                            <p className="text-lg font-medium text-gray-900">
                              {formatPrice(
                                parseFloat(
                                  subscription.items[0].price.unitPrice.amount
                                )
                              )}
                            </p>
                            <p className="text-sm text-gray-500">
                              per {subscription.billingCycle.interval}
                            </p>
                          </div>

                          <div className="flex flex-col gap-2">
                            <Link href={`/portal/${subscription.id}`}>
                              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                                View Portal
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
