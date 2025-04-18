import { Loader2 } from "lucide-react";
import { SimplifiedSubscription } from "../types";

interface SubscriptionOverviewCardProps {
  subscription: SimplifiedSubscription;
  formattedTotalPrice: string;
  formatDate: (dateString: string) => string;
  isLoading: boolean;
  isCancelled: boolean;
  isScheduledToCancel: boolean;
  showResumeButton: boolean;
  showCancelButton: boolean;
  onCancelClick: () => void;
  onResumeClick: () => void;
}

export default function SubscriptionOverviewCard({
  subscription,
  formattedTotalPrice,
  formatDate,
  isLoading,
  isCancelled,
  isScheduledToCancel,
  showResumeButton,
  showCancelButton,
  onCancelClick,
  onResumeClick,
}: SubscriptionOverviewCardProps) {
  return (
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
              {formattedTotalPrice}
            </h3>
            <span className="text-sm text-gray-500 font-medium">
              /{subscription.billingCycle.interval}
            </span>
          </div>
        </div>
        {showResumeButton && (
          <button
            onClick={onResumeClick}
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
            onClick={onCancelClick}
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
          <span className="text-sm text-gray-500">Subscription cancelled</span>
        )}
      </div>
    </div>
  );
}
