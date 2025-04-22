"use client";

import { useEffect, useState } from "react";
import { showcase, product } from "@/db/schema";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, Globe } from "lucide-react";
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
type Product = typeof product.$inferSelect & {
  prices: {
    id: string;
    name: string;
    basePriceInCents: number;
    priceQuantity: number;
    recurringInterval: "day" | "week" | "month" | "year" | "one-time";
    recurringFrequency: number;
  }[];
};

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

  const formatPrice = (cents: number) => {
    return (cents / 100).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  const getPrice = (product: Product, interval: "monthly" | "annual") => {
    const price = product.prices.find((p) =>
      interval === "monthly"
        ? p.recurringInterval === "month"
        : p.recurringInterval === "year"
    );

    if (!price) return null;

    return formatPrice(price.basePriceInCents);
  };

  const getPricePerMonth = (product: Product) => {
    const annualPrice = product.prices.find(
      (p) => p.recurringInterval === "year"
    );
    if (!annualPrice) return null;

    return formatPrice(Math.round(annualPrice.basePriceInCents / 12));
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
                Choose the plan that&apos;s right for you
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
                const product = products[0];
                const isPopular = name === "Pro";
                const features = getFeatures(name);
                const monthlyPrice = getPrice(product, "monthly");
                const annualPrice = getPrice(product, "annual");

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
                          {billingInterval === "monthly"
                            ? monthlyPrice
                            : annualPrice}
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
                      <ul className="space-y-3 mb-6">
                        {features.map((feature, i) => (
                          <li key={i} className="flex items-start">
                            <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-600">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Link
                        href={`/checkout/${
                          billingInterval === "monthly"
                            ? product.prices.find(
                                (p) => p.recurringInterval === "month"
                              )?.id
                            : product.prices.find(
                                (p) => p.recurringInterval === "year"
                              )?.id
                        }`}
                        className="w-full"
                      >
                        <Button
                          className={cn(
                            "w-full cursor-pointer",
                            isPopular
                              ? "bg-blue-600 hover:bg-blue-700 text-white"
                              : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                          )}
                        >
                          Buy Now
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
    </div>
  );
}
