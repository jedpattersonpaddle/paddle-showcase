"use client";

import { useEffect, useState } from "react";
import { showcase, product } from "@/db/schema";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import usePaddle from "@/hooks/usePaddle";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Showcase = typeof showcase.$inferSelect;
type Product = typeof product.$inferSelect;

interface PricingClientProps {
  showcase: Showcase;
  products: Product[];
}

const countries = [
  { code: "US", name: "United States", currency: "USD", taxRate: 0 },
  { code: "GB", name: "United Kingdom", currency: "GBP", taxRate: 20 },
  { code: "CA", name: "Canada", currency: "CAD", taxRate: 5 },
  { code: "AU", name: "Australia", currency: "AUD", taxRate: 10 },
  { code: "DE", name: "Germany", currency: "EUR", taxRate: 19 },
  { code: "FR", name: "France", currency: "EUR", taxRate: 20 },
  { code: "JP", name: "Japan", currency: "JPY", taxRate: 10 },
  { code: "IN", name: "India", currency: "INR", taxRate: 18 },
  { code: "BR", name: "Brazil", currency: "BRL", taxRate: 17 },
  { code: "MX", name: "Mexico", currency: "MXN", taxRate: 16 },
];

export default function PricingClient({
  showcase,
  products,
}: PricingClientProps) {
  const paddle = usePaddle();
  const [paddlePricing, setPaddlePricing] = useState<any>(null);
  const [paddleTaxRate, setPaddleTaxRate] = useState<number>(0);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [showCountrySelector, setShowCountrySelector] = useState(true);

  const [billingInterval, setBillingInterval] = useState<"monthly" | "annual">(
    "monthly"
  );

  const productGroups = products.reduce<Record<string, Product[]>>(
    (acc, product) => {
      if (!acc[product.name]) {
        acc[product.name] = [];
      }
      acc[product.name].push(product);
      return acc;
    },
    {}
  );

  const formatPrice = (
    amount: number,
    currencyCode: string = selectedCountry.currency
  ) => {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    return formatter.format(amount / 100);
  };

  const getPrice = (product: Product) => {
    if (paddlePricing) {
      const lineItem = paddlePricing.data.details.lineItems.find(
        (item: any) => item.price.productId === product.paddleProductId
      );

      if (lineItem) {
        return lineItem.formattedTotals.total;
      }
    }

    if (paddle && !paddlePricing) {
      return "Loading...";
    }

    return formatPrice(product.basePriceInCents);
  };

  const getPricePerMonth = (product: Product) => {
    return null;
  };

  const getFeatures = (productName: string) => {
    const featuresMap: Record<string, string[]> = {
      Basic: [
        "Up to 5 users",
        "Basic analytics",
        "Email support",
        "1GB storage",
        "Basic integrations",
      ],
      Pro: [
        "Up to 20 users",
        "Advanced analytics",
        "Priority email support",
        "10GB storage",
        "Advanced integrations",
        "Custom branding",
      ],
      Enterprise: [
        "Unlimited users",
        "Enterprise analytics",
        "24/7 phone support",
        "Unlimited storage",
        "All integrations",
        "Custom branding",
        "Dedicated account manager",
        "SLA guarantee",
      ],
    };

    return (
      featuresMap[productName] || [
        "Feature 1",
        "Feature 2",
        "Feature 3",
        "Feature 4",
        "Feature 5",
      ]
    );
  };

  useEffect(() => {
    const getPricing = async () => {
      if (!paddle) return;

      const priceItems = products.map((product) => ({
        priceId: product.paddlePriceId,
        quantity: 1,
      }));

      try {
        const pricing = await paddle.PricePreview({
          items: priceItems,
          address: {
            countryCode: selectedCountry.code,
          },
        });

        setPaddlePricing(pricing);

        if (pricing?.data?.details?.lineItems?.length > 0) {
          const taxRate =
            parseFloat(pricing.data.details.lineItems[0].taxRate) * 100;
          setPaddleTaxRate(taxRate);
        }
      } catch (error) {
        console.error("Error fetching Paddle pricing:", error);
      }
    };

    getPricing();
  }, [paddle, products, selectedCountry.code, billingInterval]);

  const CountrySelector = () => {
    if (!showCountrySelector) return null;

    return (
      <div className="fixed bottom-8 right-8 z-50">
        <div className="bg-white rounded-xl shadow-lg p-4 border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full">
              PREVIEW LOCALIZED PRICING
            </div>
            <button
              onClick={() => setShowCountrySelector(false)}
              className="text-xs text-gray-400 hover:text-gray-600 ml-auto"
            >
              ×
            </button>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">View prices in:</span>
            <Select
              value={selectedCountry.code}
              onValueChange={(value) => {
                const country = countries.find((c) => c.code === value);
                if (country) setSelectedCountry(country);
              }}
            >
              <SelectTrigger className="w-[140px] h-8 text-sm">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.name} ({country.currency})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50" />

      <div className="relative w-full min-h-screen">
        <div className="max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8 h-full">
          <div className="flex flex-col gap-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Welcome to {showcase.companyName}
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                Choose the plan that&apos;s right for you and start growing your
                business today.
              </p>
            </div>

            {/* Billing Interval Toggle */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center p-1 bg-gray-100 rounded-lg">
                <button
                  onClick={() => setBillingInterval("monthly")}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                    billingInterval === "monthly"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-900"
                  )}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingInterval("annual")}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                    billingInterval === "annual"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-900"
                  )}
                >
                  Annual
                  <span className="ml-1 text-xs text-green-600 font-medium">
                    Save 20%
                  </span>
                </button>
              </div>
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Object.entries(productGroups).map(([name, products], index) => {
                const product = products[0]; // Use the first product in the group
                const isPopular = name === "Pro";
                const features = getFeatures(name);

                return (
                  <div
                    key={name}
                    className={cn(
                      "bg-white rounded-2xl shadow-xl ring-1 ring-gray-200 overflow-hidden",
                      isPopular && "ring-2 ring-blue-500 relative"
                    )}
                  >
                    {isPopular && (
                      <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-tl-lg">
                        MOST POPULAR
                      </div>
                    )}
                    <div
                      className="h-2"
                      style={{ backgroundColor: showcase.brandColor }}
                    />
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {name}
                      </h3>
                      <div className="mb-4">
                        <span className="text-4xl font-bold">
                          {getPrice(product)}
                        </span>
                        {billingInterval === "annual" && (
                          <span className="text-gray-500 ml-2">/year</span>
                        )}
                        {billingInterval === "monthly" && (
                          <span className="text-gray-500 ml-2">/month</span>
                        )}
                      </div>
                      {billingInterval === "annual" &&
                        getPricePerMonth(product) && (
                          <p className="text-sm text-gray-500 mb-4">
                            {getPricePerMonth(product)} per month, billed
                            annually
                          </p>
                        )}
                      {paddleTaxRate > 0 && (
                        <p className="text-sm text-gray-500 mb-4">
                          Includes {paddleTaxRate}% tax
                        </p>
                      )}
                      <ul className="space-y-3 mb-6">
                        {features.map((feature, i) => (
                          <li key={i} className="flex items-start">
                            <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-600">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Link href={`/checkout`}>
                        <Button
                          className={cn(
                            "w-full",
                            isPopular
                              ? "bg-blue-600 hover:bg-blue-700 text-white"
                              : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                          )}
                        >
                          Get Started
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* FAQ Section */}
            <div className="mt-16">
              <h2 className="text-3xl font-bold text-center mb-8">
                Frequently Asked Questions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="text-lg font-semibold mb-2">
                    Can I change my plan later?
                  </h3>
                  <p className="text-gray-600">
                    Yes, you can upgrade or downgrade your plan at any time.
                    Changes will be reflected in your next billing cycle.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="text-lg font-semibold mb-2">
                    Do you offer refunds?
                  </h3>
                  <p className="text-gray-600">
                    We offer a 30-day money-back guarantee for all plans. If
                    you&apos;re not satisfied, contact our support team.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="text-lg font-semibold mb-2">
                    What payment methods do you accept?
                  </h3>
                  <p className="text-gray-600">
                    We accept all major credit cards, PayPal, and bank transfers
                    for annual plans.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="text-lg font-semibold mb-2">
                    Do you offer custom plans?
                  </h3>
                  <p className="text-gray-600">
                    Yes, we offer custom plans for businesses with specific
                    needs. Contact our sales team for more information.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Country Selector */}
      <CountrySelector />
    </div>
  );
}
