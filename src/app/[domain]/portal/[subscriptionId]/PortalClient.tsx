"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { cancelSubscription, resumeSubscription } from "./actions";
import UpdatePaymentMethod from "./UpdatePaymentMethod";

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

interface PortalClientProps {
  subscriptionId: string;
  subscription: SimplifiedSubscription;
}

export default function PortalClient({
  subscriptionId,
  subscription,
}: PortalClientProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [dialogType, setDialogType] = useState<"cancel" | "resume">("cancel");

  const formatCurrency = (amount: string, currencyCode: string) => {
    const numericAmount = parseInt(amount) / 100;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
    }).format(numericAmount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculateTotalPrice = () => {
    return subscription.items.reduce((total, item) => {
      const itemPrice = parseInt(item.price.unitPrice.amount) * item.quantity;
      return total + itemPrice;
    }, 0);
  };

  const handleCancelSubscription = async () => {
    setIsLoading(true);
    try {
      const result = await cancelSubscription(subscriptionId);
      if (result.success) {
        toast.success("Subscription cancelled successfully", {
          description: `You will have access until ${formatDate(
            subscription.nextBilledAt
          )}`,
        });
      } else {
        toast.error("Failed to cancel subscription", {
          description: result.error,
        });
      }
    } catch (error) {
      toast.error("An error occurred", {
        description: "Please try again later",
      });
    } finally {
      setIsLoading(false);
      setShowConfirmDialog(false);
    }
  };

  const handleResumeSubscription = async () => {
    setIsLoading(true);
    try {
      const result = await resumeSubscription(subscriptionId);
      if (result.success) {
        toast.success("Subscription resumed successfully");
        // Refresh the page to show updated status
        window.location.reload();
      } else {
        toast.error("Failed to resume subscription", {
          description: result.error,
        });
      }
    } catch (error) {
      toast.error("An error occurred", {
        description: "Please try again later",
      });
    } finally {
      setIsLoading(false);
      setShowConfirmDialog(false);
    }
  };

  const totalPrice = calculateTotalPrice();
  const formattedTotalPrice = formatCurrency(
    totalPrice.toString(),
    subscription.currencyCode
  );

  const isCancelled = subscription.status === "canceled";
  const isScheduledToCancel = subscription.scheduledChange?.action === "cancel";
  const showResumeButton = isScheduledToCancel;
  const showCancelButton = !isCancelled && !isScheduledToCancel;

  return (
    <div className="min-h-screen w-full bg-gray-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50" />

      <div className="relative w-full min-h-screen">
        <div className="max-w-[1200px] mx-auto p-4 sm:p-6 lg:p-8 h-full">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl">
              Subscription Details
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage your subscription, billing, and payment details.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            {/* Subscription Overview Card */}
            <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-200 p-6 lg:p-8 transition duration-200 hover:shadow-md">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl w-12 h-12 flex items-center justify-center shadow-sm ring-1 ring-blue-100">
                      <span className="text-blue-700 font-semibold text-lg">
                        {subscription.items[0]?.product.name.charAt(0) || "S"}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {subscription.items[0]?.product.name || "Standard Plan"}
                      </h2>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
                            subscription.status === "active"
                              ? "bg-green-50 text-green-700 ring-green-600/20"
                              : subscription.status === "canceled"
                              ? "bg-red-50 text-red-700 ring-red-600/20"
                              : "bg-yellow-50 text-yellow-700 ring-yellow-600/20"
                          }`}
                        >
                          {subscription.status.charAt(0).toUpperCase() +
                            subscription.status.slice(1)}
                        </span>
                        <span className="text-sm text-gray-500">
                          Started on {formatDate(subscription.startedAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <h3 className="text-3xl font-bold text-gray-900">
                      {formatCurrency(
                        totalPrice.toString(),
                        subscription.items[0].price.unitPrice.currencyCode
                      )}
                    </h3>
                    <span className="text-sm text-gray-500 font-medium">
                      /{subscription.billingCycle.interval}
                    </span>
                  </div>
                </div>
                {showResumeButton && (
                  <button
                    onClick={() => {
                      setDialogType("resume");
                      setShowConfirmDialog(true);
                    }}
                    disabled={isLoading}
                    className="group relative inline-flex items-center justify-center rounded-lg py-2 px-4 text-sm font-semibold text-green-600 ring-1 ring-inset ring-green-200 hover:bg-green-50 hover:text-green-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Resuming...
                      </>
                    ) : (
                      "Resume subscription"
                    )}
                  </button>
                )}
                {showCancelButton && (
                  <button
                    onClick={() => {
                      setDialogType("cancel");
                      setShowConfirmDialog(true);
                    }}
                    disabled={isLoading}
                    className="group relative inline-flex items-center justify-center rounded-lg py-2 px-4 text-sm font-semibold text-red-600 ring-1 ring-inset ring-red-200 hover:bg-red-50 hover:text-red-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Cancelling...
                      </>
                    ) : (
                      "Cancel subscription"
                    )}
                  </button>
                )}
                {isCancelled && (
                  <span className="text-sm text-gray-500">
                    Subscription cancelled
                  </span>
                )}
              </div>
            </div>

            {/* Payment Information Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Next Payment Card */}
              <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-200 p-6 lg:p-8 transition duration-200 hover:shadow-md">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Next payment summary
                  </h3>
                  <span className="text-sm text-gray-500">
                    Due in{" "}
                    {Math.ceil(
                      (new Date(subscription.nextBilledAt).getTime() -
                        new Date().getTime()) /
                        (1000 * 60 * 60 * 24)
                    )}{" "}
                    days
                  </span>
                </div>
                <div className="space-y-6">
                  {/* Payment Details */}
                  <div className="space-y-4">
                    {/* Subscription Line Item */}
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="bg-gray-100 rounded-lg w-10 h-10 flex items-center justify-center">
                          <span className="text-gray-600 font-medium">
                            {subscription.items[0]?.product.name.charAt(0) ||
                              "S"}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {subscription.items[0]?.product.name}
                          </h4>
                          <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
                            Recurring payment
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-500">
                            Qty: {subscription.items[0]?.quantity}
                          </span>
                          <span className="text-sm text-gray-500">
                            Tax: 20%
                          </span>
                          <span className="font-medium">
                            {formatCurrency(
                              (
                                parseInt(
                                  subscription.items[0]?.price.unitPrice.amount
                                ) * 0.833
                              ).toString(),
                              subscription.items[0]?.price.unitPrice
                                .currencyCode
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="space-y-2 pt-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Subtotal</span>
                        <span className="font-medium">
                          {formatCurrency(
                            (
                              parseInt(
                                subscription.items[0]?.price.unitPrice.amount
                              ) * 0.833
                            ).toString(),
                            subscription.items[0]?.price.unitPrice.currencyCode
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Tax</span>
                        <span className="font-medium">
                          {formatCurrency(
                            (
                              parseInt(
                                subscription.items[0]?.price.unitPrice.amount
                              ) * 0.167
                            ).toString(),
                            subscription.items[0]?.price.unitPrice.currencyCode
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm font-medium pt-2 border-t border-gray-100">
                        <span>Total (Inc. tax)</span>
                        <span>
                          {formatCurrency(
                            subscription.items[0]?.price.unitPrice.amount,
                            subscription.items[0]?.price.unitPrice.currencyCode
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <UpdatePaymentMethod subscriptionId={subscriptionId} />
                </div>
              </div>

              {/* Subscription Items Card */}
              <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-200 p-6 lg:p-8 transition duration-200 hover:shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Subscription Items
                </h3>
                <div className="space-y-4">
                  {subscription.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start justify-between py-3 border-b border-gray-100 last:border-0"
                    >
                      <div className="flex items-start gap-3">
                        {item.product.imageUrl && (
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        )}
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {item.product.name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {item.price.name}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          {formatCurrency(
                            (
                              parseInt(item.price.unitPrice.amount) *
                              item.quantity
                            ).toString(),
                            item.price.unitPrice.currencyCode
                          )}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatCurrency(
                            item.price.unitPrice.amount,
                            item.price.unitPrice.currencyCode
                          )}{" "}
                          each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {dialogType === "cancel"
                ? "Cancel Subscription"
                : "Resume Subscription"}
            </h3>
            <p className="text-gray-600 mb-6">
              {dialogType === "cancel" ? (
                <>
                  Are you sure you want to cancel your subscription? You will
                  still have access until{" "}
                  {formatDate(subscription.nextBilledAt)}.
                </>
              ) : (
                <>
                  Are you sure you want to resume your subscription? Your next
                  billing date will be {formatDate(subscription.nextBilledAt)}.
                </>
              )}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
              >
                {dialogType === "cancel"
                  ? "Keep Subscription"
                  : "Keep Cancelled"}
              </button>
              <button
                onClick={
                  dialogType === "cancel"
                    ? handleCancelSubscription
                    : handleResumeSubscription
                }
                disabled={isLoading}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2 ${
                  dialogType === "cancel"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {dialogType === "cancel" ? "Cancelling..." : "Resuming..."}
                  </>
                ) : dialogType === "cancel" ? (
                  "Yes, Cancel Subscription"
                ) : (
                  "Yes, Resume Subscription"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
