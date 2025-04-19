import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { PaymentHistory } from "../types";
import { CreditCard, Receipt, Calendar, Hash } from "lucide-react";

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
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Payment Details
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {payment.description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6 py-4">
          {/* Payment Amount and Status */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-gray-900">
                {formatCurrency(payment.amount, currencyCode)}
              </span>
              <span className="text-sm text-gray-500 mt-1">
                {payment.billingDate}
              </span>
            </div>
            <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
              {payment.status}
            </span>
          </div>

          {/* Payment Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-500">
                Payment Information
              </h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <CreditCard className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Payment Method</p>
                    <p className="text-sm font-medium text-gray-900">
                      {payment.cardBrand?.toUpperCase()} ending in{" "}
                      {payment.cardLast4}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Billing Date</p>
                    <p className="text-sm font-medium text-gray-900">
                      {payment.billingDate}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <Hash className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Transaction ID</p>
                    <p className="text-sm font-mono font-medium text-gray-900">
                      {payment.transactionId}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-500">Invoice</h4>
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <Receipt className="h-5 w-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Invoice</p>
                  {payment.invoiceUrl ? (
                    <a
                      href={payment.invoiceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      View Invoice
                    </a>
                  ) : (
                    <p className="text-sm font-medium text-gray-900">
                      No invoice available
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <button
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            onClick={() => onOpenChange(false)}
          >
            Close
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
