import { CreditCard } from "lucide-react";
import { SimplifiedSubscription } from "../types";

interface UpcomingPaymentCardProps {
  subscription: SimplifiedSubscription;
  formatCurrency: (amount: string, currencyCode: string) => string;
  formatDate: (dateString: string) => string;
}

export default function UpcomingPaymentCard({
  subscription,
  formatCurrency,
  formatDate,
}: UpcomingPaymentCardProps) {
  const calculateDaysUntilNextPayment = () => {
    const nextPaymentDate = new Date(subscription.nextBilledAt);
    const today = new Date();
    const diffTime = nextPaymentDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilNextPayment = calculateDaysUntilNextPayment();

  return (
    <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-200 p-6 lg:p-8 transition duration-200 hover:shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Next payment summary
        </h3>
        <span className="text-sm text-gray-500">
          Due in {daysUntilNextPayment} days
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
                  {subscription.items[0]?.product.name.charAt(0) || "S"}
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
                <span className="text-sm text-gray-500">Tax: 20%</span>
                <span className="font-medium">
                  {formatCurrency(
                    (
                      parseInt(subscription.items[0]?.price.unitPrice.amount) *
                      0.833
                    ).toString(),
                    subscription.items[0]?.price.unitPrice.currencyCode
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
                    parseInt(subscription.items[0]?.price.unitPrice.amount) *
                    0.833
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
                    parseInt(subscription.items[0]?.price.unitPrice.amount) *
                    0.167
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

        {/* Payment Method */}
        <div className="flex items-start gap-4 pt-4 border-t border-gray-100">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="flex-grow">
            <h4 className="text-sm font-medium text-gray-900">
              Payment method
            </h4>
            <p className="text-sm text-gray-500 mt-1">
              Your next payment will be charged to your default payment method
              on {formatDate(subscription.nextBilledAt)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
