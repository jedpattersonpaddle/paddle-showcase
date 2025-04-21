"use client";

import { useEffect, useState, useCallback } from "react";
import { showcase } from "@/db/schema";
import Script from "next/script";
import { initializePaddle, Paddle, Environments } from "@paddle/paddle-js";
import type { CheckoutEventsData } from "@paddle/paddle-js/types/checkout/events";
import throttle from "lodash.throttle";
import { Switch } from "@/components/ui/switch";
import { Settings } from "lucide-react";

type Showcase = typeof showcase.$inferSelect;

interface CheckoutClientProps {
  priceId: string;
  showcase: Showcase;
}

export default function CheckoutClient({
  priceId,
  showcase,
}: CheckoutClientProps) {
  const [paddle, setPaddle] = useState<Paddle | null>(null);
  const [checkoutData, setCheckoutData] = useState<CheckoutEventsData | null>(
    null
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [showAnnualUpsell, setShowAnnualUpsell] = useState<boolean>(true);
  const [showSettingsCard, setShowSettingsCard] = useState<boolean>(true);

  const handleCheckoutEvents = (event: CheckoutEventsData) => {
    setCheckoutData(event);
  };

  const updateItems = useCallback(
    throttle(async (paddle: Paddle, quantity: number) => {
      paddle.Checkout.updateItems([
        {
          priceId,
          quantity,
        },
      ]);
    }, 1000),
    [priceId]
  );

  useEffect(() => {
    if (
      !paddle?.Initialized &&
      process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN &&
      process.env.NEXT_PUBLIC_PADDLE_ENV
    ) {
      initializePaddle({
        token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
        environment: process.env.NEXT_PUBLIC_PADDLE_ENV as Environments,
        eventCallback: (event) => {
          if (event.data && event.name) {
            handleCheckoutEvents(event.data);
          }
        },
        checkout: {
          settings: {
            variant: "one-page",
            displayMode: "inline",
            frameTarget: "paddle-checkout-frame",
            frameInitialHeight: 450,
            frameStyle:
              "width: 100%; background-color: transparent; border: none",
            successUrl: "/checkout/success",
            allowedPaymentMethods: ["card"],
          },
        },
      }).then(async (paddle) => {
        if (paddle) {
          setPaddle(paddle);
          paddle.Checkout.open({
            items: [
              {
                priceId,
                quantity,
              },
            ],
          });
        }
      });
    }
  }, [paddle?.Initialized, priceId, quantity]);

  useEffect(() => {
    if (paddle && paddle.Initialized) {
      updateItems(paddle, quantity);
    }
  }, [paddle, quantity, updateItems]);

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const getCurrencySymbol = (currencyCode: string) => {
    switch (currencyCode) {
      case "GBP":
        return "£";
      case "USD":
        return "$";
      case "EUR":
        return "€";
      default:
        return `${currencyCode} `;
    }
  };

  const formatPrice = (amount: number, currencyCode: string = "GBP") => {
    return `${getCurrencySymbol(currencyCode)}${amount.toFixed(2)}`;
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 relative overflow-hidden">
      {/* Background Pattern */}

      <div className="relative w-full min-h-screen">
        <div className="max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8 h-full">
          <div className="flex flex-col lg:flex-row lg:items-start gap-8 xl:gap-16">
            {/* Left Container - Price Section - Integrated with page */}
            <div className="w-full lg:w-[500px] lg:py-12">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h5 className="text-blue-600 font-semibold text-sm uppercase tracking-wide">
                      {showcase.companyName}
                    </h5>
                  </div>

                  <div>
                    <h3 className="text-4xl font-bold text-gray-900">
                      {formatPrice(
                        checkoutData?.totals?.total || 0,
                        checkoutData?.currency_code
                      )}
                    </h3>
                    <h4 className="text-sm text-gray-500 mt-1">due today</h4>
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed">
                    Includes full access to the product, plus all future
                    updates. Add more seats, upgrade, pause or cancel your
                    subscription at any time.
                  </p>

                  <p className="text-gray-500 text-sm">
                    All prices in{" "}
                    <span className="font-medium">
                      {checkoutData?.currency_code || "GBP"}
                    </span>
                  </p>
                </div>

                <div className="space-y-6">
                  <table className="w-full">
                    <tbody className="divide-y divide-gray-100">
                      <tr className="group">
                        <td className="py-4">
                          <div className="flex items-center">
                            <div className="flex items-center border rounded-lg mr-4 bg-white shadow-sm">
                              <button
                                onClick={decreaseQuantity}
                                className="px-3 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-l-lg transition-colors"
                              >
                                -
                              </button>
                              <span className="px-4 py-2 font-medium min-w-[40px] text-center">
                                {quantity}
                              </span>
                              <button
                                onClick={increaseQuantity}
                                className="px-3 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-r-lg transition-colors"
                              >
                                +
                              </button>
                            </div>
                            <span className="text-gray-700 font-medium">
                              License
                            </span>
                          </div>
                        </td>
                        <td className="py-4 text-right text-gray-700 font-medium">
                          {formatPrice(
                            ((checkoutData?.items?.[0]?.totals?.subtotal || 0) /
                              quantity) *
                              quantity,
                            checkoutData?.currency_code
                          )}
                        </td>
                      </tr>

                      <tr>
                        <td className="py-4 text-gray-500">Subtotal</td>
                        <td className="py-4 text-right font-medium text-gray-700">
                          {formatPrice(
                            checkoutData?.totals?.subtotal || 0,
                            checkoutData?.currency_code
                          )}
                        </td>
                      </tr>

                      <tr>
                        <td className="py-4 text-gray-500">Taxes</td>
                        <td className="py-4 text-right text-gray-500">
                          {formatPrice(
                            checkoutData?.totals?.tax || 0,
                            checkoutData?.currency_code
                          )}
                        </td>
                      </tr>

                      <tr className="border-t-2 border-gray-200">
                        <td className="py-4 font-semibold text-gray-900">
                          Total price (due today)
                        </td>
                        <td className="py-4 text-right font-semibold text-gray-900">
                          {formatPrice(
                            checkoutData?.totals?.total || 0,
                            checkoutData?.currency_code
                          )}
                        </td>
                      </tr>

                      {checkoutData?.recurring_totals && (
                        <tr>
                          <td className="py-4 text-gray-500">then</td>
                          <td className="py-4 text-right text-gray-500">
                            {formatPrice(
                              checkoutData?.recurring_totals?.total || 0,
                              checkoutData?.currency_code
                            )}{" "}
                            every{" "}
                            {checkoutData?.items?.[0]?.billing_cycle
                              ?.interval || "month"}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Annual Plan Upsell Banner */}
                {showAnnualUpsell && (
                  <div className="mt-6">
                    <div className="bg-blue-50 rounded-lg p-4 flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <svg
                          className="w-5 h-5 text-blue-600"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900">
                          Save 20% with annual billing
                        </h3>
                        <p className="mt-1 text-sm text-gray-600">
                          Switch to annual billing and save 20% on your
                          subscription. You'll still have full access to all
                          features and can cancel anytime.
                        </p>
                        <button
                          onClick={() => {
                            // TODO: Implement annual plan switch
                            console.log("Switch to annual plan");
                          }}
                          className="mt-3 text-sm font-medium text-blue-600 bg-blue-100 hover:bg-blue-200 px-3 py-1.5 rounded-md transition-colors"
                        >
                          Switch to annual billing
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Container - Payment Section - Card Design */}
            <div className="flex-1 lg:py-12">
              <div className="bg-white rounded-2xl shadow-xl ring-1 ring-gray-200 p-6 lg:p-8">
                <div className="text-lg font-semibold text-gray-900 mb-8">
                  Payment details
                </div>
                <div className="paddle-checkout-frame bg-transparent" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Card */}
      {showSettingsCard && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-white rounded-xl shadow-lg p-4 border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full">
                CHECKOUT SETTINGS
              </div>
              <button
                onClick={() => setShowSettingsCard(false)}
                className="text-xs text-gray-400 hover:text-gray-600 ml-auto"
              >
                ×
              </button>
            </div>
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Annual Upsell:</span>
              <Switch
                checked={showAnnualUpsell}
                onCheckedChange={setShowAnnualUpsell}
                className="ml-2"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
