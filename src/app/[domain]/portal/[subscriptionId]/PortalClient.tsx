"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  cancelSubscription,
  resumeSubscription,
  resetLicenseKey,
} from "./actions";
import CustomerProfileCard from "./components/CustomerProfileCard";
import PaymentMethodCard from "./components/PaymentMethodCard";
import PaymentHistoryTable from "./components/PaymentHistoryTable";
import PaymentDetailsDialog from "./components/PaymentDetailsDialog";
import UpcomingPaymentCard from "./components/UpcomingPaymentCard";
import SubscriptionOverviewCard from "./components/SubscriptionOverviewCard";
import LicenseKeyCard from "./components/LicenseKeyCard";
import {
  CustomerInfo,
  PaymentHistory,
  SimplifiedSubscription,
  Transaction,
} from "./types";

interface PortalClientProps {
  subscriptionId: string;
  subscription: SimplifiedSubscription;
  transactions: Transaction[];
}

export default function PortalClient({
  subscriptionId,
  subscription,
  transactions,
}: PortalClientProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [dialogType, setDialogType] = useState<"cancel" | "resume">("cancel");
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentHistory | null>(
    null
  );

  // Mock payment method
  const paymentMethod = {
    brand: "Visa",
    last4: "4242",
    expiryMonth: "12",
    expiryYear: "2025",
  };

  // Convert transactions to payment history format
  const paymentHistory: PaymentHistory[] = transactions.map((transaction) => ({
    id: transaction.id,
    date: transaction.createdAt,
    amount: transaction.totalAmount || "0",
    status: transaction.status,
    paymentMethod: transaction.paymentMethod?.card
      ? `${transaction.paymentMethod.card.brand} ending in ${transaction.paymentMethod.card.last4}`
      : "Unknown payment method",
    invoiceUrl: transaction.invoiceUrl,
    cardBrand: transaction.paymentMethod?.card?.brand,
    cardLast4: transaction.paymentMethod?.card?.last4,
    description: transaction.items[0]?.price?.name || "Subscription payment",
    transactionId: transaction.id,
    billingDate: new Date(
      transaction.billedAt || transaction.createdAt
    ).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
  }));

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

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handlePaymentClick = (payment: PaymentHistory) => {
    setSelectedPayment(payment);
    setShowPaymentDialog(true);
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

  const handleResetLicense = async () => {
    const result = await resetLicenseKey(subscriptionId);
    if (!result.success) {
      throw new Error(result.error);
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
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl">
              Customer Portal
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage your subscription, billing, and payment details.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            {/* Subscription Overview Card */}
            <SubscriptionOverviewCard
              subscription={subscription}
              formattedTotalPrice={formattedTotalPrice}
              formatDate={formatDate}
              isLoading={isLoading}
              isCancelled={isCancelled}
              isScheduledToCancel={isScheduledToCancel}
              showResumeButton={showResumeButton}
              showCancelButton={showCancelButton}
              onCancelClick={() => {
                setDialogType("cancel");
                setShowConfirmDialog(true);
              }}
              onResumeClick={() => {
                setDialogType("resume");
                setShowConfirmDialog(true);
              }}
            />

            {subscription.licenseKey && (
              <LicenseKeyCard
                licenseKey={subscription.licenseKey}
                onResetLicense={handleResetLicense}
              />
            )}

            {/* Upcoming Payment Card */}
            <UpcomingPaymentCard
              subscription={subscription}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
            />

            {/* Payment Method and Customer Profile Cards - Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Payment Method Card */}
              <PaymentMethodCard
                subscriptionId={subscriptionId}
                paymentMethod={paymentMethod}
              />

              {/* Customer Profile Card */}
              <CustomerProfileCard
                customerInfo={{
                  name: subscription.customer.name,
                  email: subscription.customer.email,
                }}
                subscriptionId={subscriptionId}
              />
            </div>

            {/* Payment History Table */}
            <PaymentHistoryTable
              payments={paymentHistory}
              onPaymentClick={handlePaymentClick}
              formatDateTime={formatDateTime}
              formatCurrency={formatCurrency}
              currencyCode={subscription.currencyCode}
            />
          </div>
        </div>
      </div>

      {/* Payment Details Dialog */}
      <PaymentDetailsDialog
        payment={selectedPayment}
        open={showPaymentDialog}
        onOpenChange={(open) => {
          if (!open) {
            setShowPaymentDialog(false);
            setSelectedPayment(null);
          }
        }}
        formatCurrency={formatCurrency}
        currencyCode={subscription.currencyCode}
      />

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
