import { CreditCard } from "lucide-react";
import UpdatePaymentMethod from "../UpdatePaymentMethod";

interface PaymentMethodCardProps {
  subscriptionId: string;
  paymentMethod: {
    brand: string;
    last4: string;
    expiryMonth: string;
    expiryYear: string;
  };
}

export default function PaymentMethodCard({
  subscriptionId,
  paymentMethod,
}: PaymentMethodCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-200 p-6 lg:p-8 transition duration-200 hover:shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Payment Method
      </h3>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        <div className="flex-grow space-y-1">
          <p className="text-base font-medium text-gray-900">
            {paymentMethod.brand} •••• {paymentMethod.last4}
          </p>
          <p className="text-sm text-gray-500">
            Expires {paymentMethod.expiryMonth}/{paymentMethod.expiryYear}
          </p>
          <div className="mt-4">
            <UpdatePaymentMethod subscriptionId={subscriptionId} />
          </div>
        </div>
      </div>
    </div>
  );
}
