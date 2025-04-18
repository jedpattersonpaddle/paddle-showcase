import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { PaymentHistory } from "../types";

interface PaymentDetailsDialogProps {
  payment: PaymentHistory | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formatCurrency: (amount: string, currencyCode: string) => string;
  currencyCode: string;
}

export default function PaymentDetailsDialog({
  payment,
  open,
  onOpenChange,
  formatCurrency,
  currencyCode,
}: PaymentDetailsDialogProps) {
  if (!payment) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            <div className="flex flex-col">
              <span className="text-xl font-semibold text-gray-900">
                Payment details
              </span>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-3xl font-bold">
                  {formatCurrency(payment.amount, currencyCode)}
                </span>
                <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                  Paid
                </span>
              </div>
              <p className="text-gray-600 text-sm mt-1">
                {payment.description}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-4">Details</h4>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm text-gray-500">Billing date</dt>
                <dd className="text-sm text-gray-900">{payment.billingDate}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Payment method</dt>
                <dd className="text-sm text-gray-900">
                  {payment.cardBrand?.toUpperCase()} ending in{" "}
                  {payment.cardLast4}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Transaction ID</dt>
                <dd className="text-sm font-mono text-gray-900">
                  {payment.transactionId}
                </dd>
              </div>
            </dl>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-4">Products</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-900">{payment.description}</p>
                  <p className="text-sm text-gray-500">{payment.billingDate}</p>
                  <div className="inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                    Recurring payment
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Qty: 1</p>
                  <p className="text-sm text-gray-500">Tax: 20%</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatCurrency(
                      (parseInt(payment.amount) * 0.833).toString(),
                      currencyCode
                    )}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-gray-900">
                    {formatCurrency(
                      (parseInt(payment.amount) * 0.833).toString(),
                      currencyCode
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-500">Tax</span>
                  <span className="text-gray-900">
                    {formatCurrency(
                      (parseInt(payment.amount) * 0.167).toString(),
                      currencyCode
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-medium mt-2 pt-2 border-t border-gray-200">
                  <span>Total (Inc. tax)</span>
                  <span>{formatCurrency(payment.amount, currencyCode)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <div className="flex justify-end gap-2">
            <button
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              onClick={() => window.open(payment.invoiceUrl, "_blank")}
            >
              View invoice
            </button>
            <button className="px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-600 rounded-md hover:bg-blue-50">
              Update invoice
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
