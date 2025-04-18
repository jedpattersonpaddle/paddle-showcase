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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateShowcase } from "./actions";
import { showcase, product } from "@/db/schema";

type Showcase = typeof showcase.$inferSelect;
type Product = typeof product.$inferSelect;

interface EditShowcaseClientProps {
  showcase: Showcase;
  products: Product[];
}

interface ProductFormData {
  id: string;
  name: string;
  priceName: string;
  basePriceInCents: number;
  priceQuantity: number;
  recurringInterval: "day" | "week" | "month" | "year" | "one-time";
  recurringFrequency: number;
}

export function EditShowcaseClient({
  showcase,
  products,
}: EditShowcaseClientProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [companyName, setCompanyName] = useState(showcase.companyName);
  const [logoUrl, setLogoUrl] = useState(showcase.logoUrl || "");
  const [brandColor, setBrandColor] = useState(showcase.brandColor);
  const [subdomain, setSubdomain] = useState(showcase.subdomain);
  const [formProducts, setFormProducts] = useState<ProductFormData[]>(
    products.map((product) => ({
      id: product.id,
      name: product.name,
      priceName: product.priceName,
      basePriceInCents: product.basePriceInCents,
      priceQuantity: product.priceQuantity,
      recurringInterval:
        product.recurringInterval as ProductFormData["recurringInterval"],
      recurringFrequency: product.recurringFrequency,
    }))
  );

  const addProduct = () => {
    setFormProducts([
      ...formProducts,
      {
        id: crypto.randomUUID(),
        name: "",
        priceName: "",
        basePriceInCents: 0,
        priceQuantity: 1,
        recurringInterval: "month",
        recurringFrequency: 1,
      },
    ]);
  };

  const removeProduct = (id: string) => {
    if (formProducts.length > 1) {
      setFormProducts(formProducts.filter((product) => product.id !== id));
    }
  };

  const updateProduct = (
    id: string,
    updatedProduct: Partial<ProductFormData>
  ) => {
    setFormProducts(
      formProducts.map((product) =>
        product.id === id ? { ...product, ...updatedProduct } : product
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (formProducts.length === 0) {
        throw new Error("At least one product is required");
      }

      const showcaseData = {
        id: showcase.id,
        companyName,
        logoUrl: logoUrl || undefined,
        brandColor,
        subdomain,
        products: formProducts as [ProductFormData, ...ProductFormData[]],
      };

      const result = await updateShowcase(showcaseData);

      if (!result) {
        throw new Error("Failed to update showcase");
      }

      toast.success("Showcase updated successfully!");
      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update showcase"
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
    <div className="min-h-screen w-full bg-gray-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50" />

      <div className="relative w-full min-h-screen">
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 h-full">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Edit Checkout Showcase
            </h1>
            <p className="text-gray-500 mt-2">
              Update your checkout showcase settings and products
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Company Information Card */}
            <Card className="border shadow-xl ring-1 ring-gray-200 overflow-hidden">
              <CardHeader className="border-b bg-white">
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  Company Branding
                </CardTitle>
                <CardDescription>
                  Define how your brand appears during checkout
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 bg-white">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="company-name"
                      className="text-sm font-medium"
                    >
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
                    <Label
                      htmlFor="brand-color"
                      className="text-sm font-medium"
                    >
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
                      <p className="text-xs text-gray-500">
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
                      <div className="px-3 py-2 bg-gray-100 border border-l-0 rounded-r-md text-gray-500 text-sm">
                        .paddle-showcase.com
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      Your unique URL for the checkout page
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product Information Card */}
            <Card className="border shadow-xl ring-1 ring-gray-200 overflow-hidden">
              <CardHeader className="border-b bg-white">
                <CardTitle className="flex items-center gap-2 text-gray-900">
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
                  Add or update the products customers can purchase
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 bg-white">
                {formProducts.map((product, index) => (
                  <Card key={product.id} className="border shadow-sm">
                    <CardHeader className="p-4 border-b">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-medium text-gray-900">
                          Product {index + 1}
                        </CardTitle>
                        {formProducts.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeProduct(product.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
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
                              updateProduct(product.id, {
                                name: e.target.value,
                              })
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
                          <p className="text-xs text-gray-500">
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
                          <p className="text-xs text-gray-500">
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
                                  value as ProductFormData["recurringInterval"],
                              })
                            }
                          >
                            <SelectTrigger
                              id={`recurring-interval-${product.id}`}
                            >
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
                          <p className="text-xs text-gray-500">
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
                  className="w-full cursor-pointer border-dashed border-2 py-6 bg-gray-50 hover:bg-gray-100 text-blue-600 hover:text-blue-700"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Another Product
                </Button>
              </CardContent>
            </Card>

            {/* Form Actions */}
            <div className="flex items-center justify-between gap-4 bg-white rounded-2xl shadow-xl ring-1 ring-gray-200 p-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <p className="text-sm text-gray-500">
                  {formProducts.length}{" "}
                  {formProducts.length === 1 ? "product" : "products"} added
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  type="submit"
                  style={{ backgroundColor: brandColor }}
                  className="text-white hover:opacity-90 min-w-[140px]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Showcase"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
