"use client";

import { useEffect, useState, useCallback } from "react";
import { showcase, product } from "@/db/schema";
import Script from "next/script";
import {
  initializePaddle,
  InitializePaddleOptions,
  Paddle,
  Environments,
} from "@paddle/paddle-js";
import type { CheckoutEventsData } from "@paddle/paddle-js/types/checkout/events";
import throttle from "lodash.throttle";

type Showcase = typeof showcase.$inferSelect;
type Product = typeof product.$inferSelect;

interface CheckoutClientProps {
  showcase: Showcase;
  products: Product[];
}

export default function CheckoutClient({
  showcase,
  products,
}: CheckoutClientProps) {
  const [paddle, setPaddle] = useState<Paddle | null>(null);
  const [checkoutData, setCheckoutData] = useState<CheckoutEventsData | null>(
    null
  );
  const [quantities, setQuantities] = useState<number[]>([1]);

  const handleCheckoutEvents = (event: CheckoutEventsData) => {
    setCheckoutData(event);
  };

  const updateItems = useCallback(
    throttle(
      (paddle: Paddle, items: { priceId: string; quantity: number }[]) => {
        paddle.Checkout.updateItems(items);
      },
      1000
    ),
    []
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
        if (paddle && products.length > 0) {
          setPaddle(paddle);
          const initialItems = products.map((product, index) => ({
            priceId: product.paddlePriceId,
            quantity: quantities[index] || 1,
          }));

          paddle.Checkout.open({
            items: initialItems,
          });
        }
      });
    }
  }, [paddle?.Initialized, products, quantities]);

  useEffect(() => {
    if (paddle && paddle.Initialized) {
      const items = products.map((product, index) => ({
        priceId: product.paddlePriceId,
        quantity: quantities[index] || 1,
      }));
      updateItems(paddle, items);
    }
  }, [paddle, products, quantities, updateItems]);

  const decreaseQuantity = (index: number) => {
    if (quantities[index] > 1) {
      const newQuantities = [...quantities];
      newQuantities[index] = quantities[index] - 1;
      setQuantities(newQuantities);
    }
  };

  const increaseQuantity = (index: number) => {
    const newQuantities = [...quantities];
    newQuantities[index] = quantities[index] + 1;
    setQuantities(newQuantities);
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
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50" />

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
                    {/* <h6 className="text-gray-500 text-sm">
                      {checkoutData?.recurring_totals
                        ? "Subscription"
                        : "One-time purchase"}
                    </h6> */}
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
                      {products.map((product, index) => (
                        <tr key={product.id} className="group">
                          <td className="py-4">
                            <div className="flex items-center">
                              <div className="flex items-center border rounded-lg mr-4 bg-white shadow-sm">
                                <button
                                  onClick={() => decreaseQuantity(index)}
                                  className="px-3 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-l-lg transition-colors"
                                >
                                  -
                                </button>
                                <span className="px-4 py-2 font-medium min-w-[40px] text-center">
                                  {quantities[index] || 1}
                                </span>
                                <button
                                  onClick={() => increaseQuantity(index)}
                                  className="px-3 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-r-lg transition-colors"
                                >
                                  +
                                </button>
                              </div>
                              <span className="text-gray-700 font-medium">
                                {product.priceName}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 text-right text-gray-700 font-medium">
                            {formatPrice(
                              ((checkoutData?.items?.[index]?.totals
                                ?.subtotal || 0) /
                                (quantities[index] || 1)) *
                                (quantities[index] || 1),
                              checkoutData?.currency_code
                            )}
                          </td>
                        </tr>
                      ))}

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
              </div>
            </div>

            {/* Right Container - Payment Section - Card Design */}
            <div className="flex-1 lg:py-12">
              <div className="bg-white rounded-2xl shadow-xl ring-1 ring-gray-200 p-6 lg:p-8">
                <Script
                  src="https://cdn.paddle.com/paddle/v2/paddle.js"
                  strategy="afterInteractive"
                  onError={(e) => {
                    console.error("Error loading Paddle script:", e);
                  }}
                />
                <div className="text-lg font-semibold text-gray-900 mb-8">
                  Payment details
                </div>
                <div className="paddle-checkout-frame bg-transparent" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
