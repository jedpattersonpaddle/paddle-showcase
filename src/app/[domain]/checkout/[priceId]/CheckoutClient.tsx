"use client";

import { useEffect, useState, useCallback } from "react";
import { showcase, price } from "@/db/schema";
import { initializePaddle, Paddle, Environments } from "@paddle/paddle-js";
import type { CheckoutEventsData } from "@paddle/paddle-js/types/checkout/events";
import throttle from "lodash.throttle";
import { Switch } from "@/components/ui/switch";
import { Settings, Globe, X, Tag, Receipt } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchParams, useRouter } from "next/navigation";
import { checkoutTranslations, Locale } from "@/lib/translations/checkout";

type Showcase = typeof showcase.$inferSelect;
type Price = typeof price.$inferSelect;

interface CheckoutClientProps {
  priceId: string;
  showcase: Showcase;
  currentPrice: Price;
  alternativePrice: Price | null;
}

export default function CheckoutClient({
  priceId,
  showcase,
  currentPrice,
  alternativePrice,
}: CheckoutClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [paddle, setPaddle] = useState<Paddle | null>(null);
  const [checkoutData, setCheckoutData] = useState<CheckoutEventsData | null>(
    null
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [showAnnualUpsell, setShowAnnualUpsell] = useState<boolean>(true);
  const [showSettingsCard, setShowSettingsCard] = useState<boolean>(true);
  const [showDiscountInput, setShowDiscountInput] = useState<boolean>(true);
  const [showTaxIdInput, setShowTaxIdInput] = useState<boolean>(false);
  const [isAnnual, setIsAnnual] = useState<boolean>(
    currentPrice.recurringInterval === "year"
  );

  const urlLocale = searchParams.get("locale") as Locale | null;
  const discountCode = searchParams.get("code") as string | null;
  const [checkoutLocale, setCheckoutLocale] = useState<Locale>(
    urlLocale && Object.keys(checkoutTranslations).includes(urlLocale)
      ? urlLocale
      : "en"
  );

  const updateLocale = (newLocale: Locale) => {
    setCheckoutLocale(newLocale);

    const params = new URLSearchParams(searchParams.toString());
    params.set("locale", newLocale);
    router.push(`?${params.toString()}`, { scroll: false });
  };

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

  const reinitializePaddle = useCallback(() => {
    if (paddle) {
      paddle.Checkout.close();

      initializePaddle({
        token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!,
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
            allowedPaymentMethods: [
              "card",
              "apple_pay",
              "google_pay",
              "paypal",
            ],
            showAddDiscounts: showDiscountInput,
            showAddTaxId: showTaxIdInput,
            locale: checkoutLocale,
          },
        },
      }).then(async (newPaddle) => {
        if (newPaddle) {
          setPaddle(newPaddle);
          newPaddle.Checkout.open({
            items: [
              {
                priceId,
                quantity,
              },
            ],
            discountCode,
          });
        }
      });
    }
  }, [
    paddle,
    priceId,
    quantity,
    showDiscountInput,
    showTaxIdInput,
    checkoutLocale,
  ]);

  useEffect(() => {
    if (paddle && paddle.Initialized) {
      reinitializePaddle();
    }
  }, [showDiscountInput, showTaxIdInput, checkoutLocale, reinitializePaddle]);

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
            allowedPaymentMethods: [
              "card",
              "apple_pay",
              "google_pay",
              "paypal",
            ],
            showAddDiscounts: showDiscountInput,
            showAddTaxId: showTaxIdInput,
            locale: checkoutLocale,
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
            discountCode,
          });
        }
      });
    }
  }, [
    paddle?.Initialized,
    priceId,
    quantity,
    showDiscountInput,
    showTaxIdInput,
    checkoutLocale,
  ]);

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

  const locales = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "it", name: "Italian" },
    { code: "pt", name: "Portuguese" },
    { code: "nl", name: "Dutch" },
    { code: "pl", name: "Polish" },
    { code: "ru", name: "Russian" },
    { code: "ja", name: "Japanese" },
    { code: "zh", name: "Chinese" },
  ];

  const t = checkoutTranslations[checkoutLocale];

  const handleSwitchToAnnual = () => {
    if (alternativePrice) {
      const domain = window.location.pathname.split("/")[1];
      router.push(
        `/checkout/${alternativePrice.paddlePriceId}${window.location.search}`
      );
    }
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
                    <h4 className="text-sm text-gray-500 mt-1">{t.dueToday}</h4>
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed">
                    {t.includesAccess}
                  </p>

                  <p className="text-gray-500 text-sm">
                    {t.allPricesIn}{" "}
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
                              {t.license}
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
                        <td className="py-4 text-gray-500">{t.subtotal}</td>
                        <td className="py-4 text-right font-medium text-gray-700">
                          {formatPrice(
                            checkoutData?.totals?.subtotal || 0,
                            checkoutData?.currency_code
                          )}
                        </td>
                      </tr>

                      {checkoutData?.totals?.discount
                        ? checkoutData.totals.discount > 0 && (
                            <tr>
                              <td className="py-4 text-gray-500">
                                {t.discount}
                              </td>
                              <td className="py-4 text-right text-green-600">
                                -
                                {formatPrice(
                                  checkoutData.totals.discount,
                                  checkoutData?.currency_code
                                )}
                              </td>
                            </tr>
                          )
                        : null}

                      <tr>
                        <td className="py-4 text-gray-500">{t.taxes}</td>
                        <td className="py-4 text-right text-gray-500">
                          {formatPrice(
                            checkoutData?.totals?.tax || 0,
                            checkoutData?.currency_code
                          )}
                        </td>
                      </tr>

                      <tr className="border-t-2 border-gray-200">
                        <td className="py-4 font-semibold text-gray-900">
                          {t.totalPrice}
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
                          <td className="py-4 text-gray-500">{t.then}</td>
                          <td className="py-4 text-right text-gray-500">
                            {formatPrice(
                              checkoutData?.recurring_totals?.total || 0,
                              checkoutData?.currency_code
                            )}{" "}
                            {t.every}{" "}
                            {checkoutData?.items?.[0]?.billing_cycle
                              ?.interval === "year"
                              ? t.year
                              : t.month}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Annual/Monthly Plan Upsell Banner */}
                {showAnnualUpsell && alternativePrice && (
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
                          {isAnnual ? t.switchToMonthly : t.saveWithAnnual}
                        </h3>
                        <p className="mt-1 text-sm text-gray-600">
                          {isAnnual
                            ? t.monthlyDescription
                            : t.annualDescription}
                        </p>
                        <button
                          onClick={handleSwitchToAnnual}
                          className="mt-3 text-sm font-medium text-blue-600 bg-blue-100 hover:bg-blue-200 px-3 py-1.5 rounded-md transition-colors"
                        >
                          {isAnnual ? t.switchToMonthly : t.switchToAnnual}
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
                  {t.paymentDetails}
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
          <div className="bg-white rounded-xl shadow-lg p-5 border border-blue-200 w-80">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-full">
                {t.checkoutSettings}
              </div>
              <button
                onClick={() => setShowSettingsCard(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    {t.annualUpsell}
                  </span>
                </div>
                <Switch
                  checked={showAnnualUpsell}
                  onCheckedChange={setShowAnnualUpsell}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    {t.discountInput}
                  </span>
                </div>
                <Switch
                  checked={showDiscountInput}
                  onCheckedChange={setShowDiscountInput}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    {t.taxIdInput}
                  </span>
                </div>
                <Switch
                  checked={showTaxIdInput}
                  onCheckedChange={setShowTaxIdInput}
                />
              </div>

              <div className="pt-2">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    {t.checkoutLanguage}
                  </span>
                </div>
                <Select value={checkoutLocale} onValueChange={updateLocale}>
                  <SelectTrigger className="w-full h-9 text-sm">
                    <SelectValue placeholder="Select locale" />
                  </SelectTrigger>
                  <SelectContent>
                    {locales.map((locale) => (
                      <SelectItem key={locale.code} value={locale.code}>
                        {locale.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
