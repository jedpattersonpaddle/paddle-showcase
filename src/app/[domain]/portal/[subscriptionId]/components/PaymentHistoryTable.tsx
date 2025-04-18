import { PaymentHistory } from "../types";

interface PaymentHistoryTableProps {
  payments: PaymentHistory[];
  onPaymentClick: (payment: PaymentHistory) => void;
  formatDateTime: (date: string) => string;
  formatCurrency: (amount: string, currencyCode: string) => string;
  currencyCode: string;
}

export default function PaymentHistoryTable({
  payments,
  onPaymentClick,
  formatDateTime,
  formatCurrency,
  currencyCode,
}: PaymentHistoryTableProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-200 p-6 lg:p-8 transition duration-200 hover:shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Payment History
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
              >
                Date
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Amount
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Payment Method
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Invoice
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {payments.map((payment) => (
              <tr
                key={payment.id}
                onClick={() => onPaymentClick(payment)}
                className="cursor-pointer hover:bg-gray-50"
              >
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-0">
                  {formatDateTime(payment.date)}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                  {formatCurrency(payment.amount, currencyCode)}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                  {payment.paymentMethod}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm">
                  <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                    {payment.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                  {payment.invoiceUrl && (
                    <a
                      href={payment.invoiceUrl}
                      className="text-blue-600 hover:text-blue-800"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
