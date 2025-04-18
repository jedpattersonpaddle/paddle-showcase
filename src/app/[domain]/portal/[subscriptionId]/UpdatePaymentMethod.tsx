"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import usePaddle from "@/hooks/usePaddle";
import { getUpdatePaymentMethodTransaction } from "./actions";

interface UpdatePaymentMethodProps {
  subscriptionId: string;
}

interface SerializedTransaction {
  id: string;
  status: string;
}

export default function UpdatePaymentMethod({
  subscriptionId,
}: UpdatePaymentMethodProps) {
  const [isLoading, setIsLoading] = useState(false);
  const paddle = usePaddle();

  const handleUpdatePaymentMethod = async () => {
    if (!paddle) {
      toast.error("Paddle is not initialized");
      return;
    }

    setIsLoading(true);
    try {
      const result = await getUpdatePaymentMethodTransaction(subscriptionId);

      if (!result.success || !result.transaction) {
        toast.error("Failed to update payment method", {
          description: result.error,
        });
        return;
      }

      const transaction = result.transaction as SerializedTransaction;

      paddle.Checkout.open({
        transactionId: transaction.id,
        settings: {
          frameInitialHeight: 400,
          allowedPaymentMethods: ["card"],
        },
      });
    } catch (error) {
      console.error("Error updating payment method:", error);
      toast.error("An error occurred", {
        description: "Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleUpdatePaymentMethod}
        disabled={isLoading || !paddle}
        className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-blue-600 shadow-sm ring-1 ring-inset ring-blue-200 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Updating...
          </>
        ) : (
          <>
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 10h18M7 15h.01M11 15h.01M15 15h.01M19 15h.01M7 19h.01M11 19h.01M15 19h.01M19 19h.01M21 6H3v14h18V6z"
              />
            </svg>
            Update payment method
          </>
        )}
      </button>
    </div>
  );
}
