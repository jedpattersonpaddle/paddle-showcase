"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createShowcase } from "./actions";

interface Product {
  id: string;
  name: string;
  priceName: string;
  basePriceInCents: number;
  priceQuantity: number;
  recurringInterval: "day" | "week" | "month" | "year" | "one-time";
  recurringFrequency: number;
}

export function CreateShowcaseClient() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [brandColor, setBrandColor] = useState("#3b82f6");
  const [subdomain, setSubdomain] = useState("");
  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      name: "",
      priceName: "",
      basePriceInCents: 0,
      priceQuantity: 1,
      recurringInterval: "month",
      recurringFrequency: 1,
    },
  ]);

  const addProduct = () => {
    setProducts([...products]);
  };

  const removeProduct = (id: string) => {
    if (products.length > 1) {
      setProducts(products.filter((product) => product.id !== id));
    }
  };

  const updateProduct = (id: string, updatedProduct: Partial<Product>) => {
    setProducts(
      products.map((product) =>
        product.id === id ? { ...product, ...updatedProduct } : product
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (products.length === 0) {
        throw new Error("At least one product is required");
      }

      const showcaseData = {
        companyName,
        logoUrl: logoUrl || undefined,
        brandColor,
        subdomain,
        products: products as [Product, ...Product[]],
      };

      const result = await createShowcase(showcaseData);

      if (!result) {
        throw new Error("Failed to create showcase");
      }

      toast.success("Showcase created successfully!");
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create showcase"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (cents: number) => {
    return (cents / 100).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Create New Checkout Showcase
        </h1>
        <p className="text-muted-foreground mt-2">
          Customize how your customers will see and interact with your checkout
          flow
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Company Information Card */}
        <Card className="border shadow-md overflow-hidden">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              Company Branding
            </CardTitle>
            <CardDescription>
              Define how your brand appears during checkout
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="company-name" className="text-sm font-medium">
                  Company Name
                </Label>
                <Input
                  id="company-name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Enter company name"
                  className="focus-visible:ring-blue-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo-url" className="text-sm font-medium">
                  Logo URL
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="logo-url"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="Enter logo URL"
                    className="focus-visible:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand-color" className="text-sm font-medium">
                  Brand Color
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="brand-color"
                    type="color"
                    value={brandColor}
                    onChange={(e) => setBrandColor(e.target.value)}
                    className="w-16 p-1 h-10"
                  />
                  <Input
                    value={brandColor}
                    onChange={(e) => setBrandColor(e.target.value)}
                    placeholder="#000000"
                    className="flex-1"
                    pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                    title="Please enter a valid hex color code (e.g. #FF0000)"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: brandColor }}
                  ></div>
                  <p className="text-xs text-muted-foreground">
                    Primary color for buttons and accents
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subdomain" className="text-sm font-medium">
                  Subdomain
                </Label>
                <div className="flex items-center">
                  <Input
                    id="subdomain"
                    value={subdomain}
                    onChange={(e) => setSubdomain(e.target.value)}
                    placeholder="your-company"
                    className="rounded-r-none border-r-0 focus-visible:ring-blue-500 focus-visible:ring-offset-0"
                    required
                  />
                  <div className="px-3 py-2 bg-muted border border-l-0 rounded-r-md text-muted-foreground text-sm">
                    .paddle-showcase.com
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Your unique URL for the checkout page
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Information Card */}
        <Card className="border shadow-md overflow-hidden">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <svg
                className="h-5 w-5 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              Products For Sale
            </CardTitle>
            <CardDescription>
              Add the products customers can purchase
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {products.map((product, index) => (
              <Card key={product.id} className="border shadow-sm">
                <CardHeader className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium">
                      Product {index + 1}
                    </CardTitle>
                    {products.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeProduct(product.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor={`product-name-${product.id}`}
                        className="text-sm"
                      >
                        Product Name
                      </Label>
                      <Input
                        id={`product-name-${product.id}`}
                        value={product.name}
                        onChange={(e) =>
                          updateProduct(product.id, { name: e.target.value })
                        }
                        placeholder="e.g. Premium Plan"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor={`price-name-${product.id}`}
                        className="text-sm"
                      >
                        Price Name
                      </Label>
                      <Input
                        id={`price-name-${product.id}`}
                        value={product.priceName}
                        onChange={(e) =>
                          updateProduct(product.id, {
                            priceName: e.target.value,
                          })
                        }
                        placeholder="e.g. Monthly Plan"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor={`base-price-${product.id}`}
                        className="text-sm"
                      >
                        Base Price (in cents)
                      </Label>
                      <Input
                        id={`base-price-${product.id}`}
                        type="number"
                        value={product.basePriceInCents}
                        onChange={(e) =>
                          updateProduct(product.id, {
                            basePriceInCents: parseInt(e.target.value),
                          })
                        }
                        placeholder="0"
                        min="0"
                      />
                      <p className="text-xs text-muted-foreground">
                        {formatCurrency(product.basePriceInCents)}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor={`price-quantity-${product.id}`}
                        className="text-sm"
                      >
                        Price Quantity
                      </Label>
                      <Input
                        id={`price-quantity-${product.id}`}
                        type="number"
                        value={product.priceQuantity}
                        onChange={(e) =>
                          updateProduct(product.id, {
                            priceQuantity: parseInt(e.target.value),
                          })
                        }
                        placeholder="1"
                        min="1"
                      />
                      <p className="text-xs text-muted-foreground">
                        Initial quantity loaded in checkout
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor={`recurring-interval-${product.id}`}
                        className="text-sm"
                      >
                        Recurring Interval
                      </Label>
                      <Select
                        value={product.recurringInterval}
                        onValueChange={(value) =>
                          updateProduct(product.id, {
                            recurringInterval:
                              value as Product["recurringInterval"],
                          })
                        }
                      >
                        <SelectTrigger id={`recurring-interval-${product.id}`}>
                          <SelectValue placeholder="Select interval" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="day">Daily</SelectItem>
                          <SelectItem value="week">Weekly</SelectItem>
                          <SelectItem value="month">Monthly</SelectItem>
                          <SelectItem value="year">Yearly</SelectItem>
                          <SelectItem value="one-time">One Time</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor={`recurring-frequency-${product.id}`}
                        className="text-sm"
                      >
                        Recurring Frequency
                      </Label>
                      <Input
                        id={`recurring-frequency-${product.id}`}
                        type="number"
                        value={product.recurringFrequency}
                        onChange={(e) =>
                          updateProduct(product.id, {
                            recurringFrequency: parseInt(e.target.value),
                          })
                        }
                        placeholder="1"
                        min="1"
                        disabled={product.recurringInterval === "one-time"}
                      />
                      <p className="text-xs text-muted-foreground">
                        {product.recurringInterval === "one-time"
                          ? "Not applicable for one-time purchases"
                          : `Every ${product.recurringFrequency} ${
                              product.recurringInterval
                            }${product.recurringFrequency > 1 ? "s" : ""}`}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addProduct}
              className="w-full cursor-pointer border-dashed border-2 py-6 bg-gray-50 hover:bg-gray-100 dark:bg-gray-900/20 hover:dark:bg-gray-900/30 text-blue-600 hover:text-blue-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Another Product
            </Button>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <Card className="border shadow-md overflow-hidden">
          <CardContent className="p-4 flex justify-end items-center">
            <Button
              type="submit"
              style={{ backgroundColor: brandColor }}
              className="text-white hover:opacity-90"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create"
              )}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
