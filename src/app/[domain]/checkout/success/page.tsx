import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="min-h-screen w-full bg-gray-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50" />

      <div className="relative w-full min-h-screen">
        <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 h-full">
          <Card className="border shadow-xl ring-1 ring-gray-200 overflow-hidden">
            <CardHeader className="border-b bg-white">
              <div className="flex items-center justify-center mb-4">
                <div className="rounded-full bg-green-100 p-3">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-center text-2xl font-bold text-gray-900">
                Payment Successful!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 bg-white p-6">
              <div className="text-center space-y-2">
                <p className="text-gray-600">
                  Thank you for your purchase. Your payment has been processed
                  successfully.
                </p>
                <p className="text-gray-500 text-sm">
                  You will receive a confirmation email shortly with your order
                  details.
                </p>
              </div>

              <div className="flex flex-col items-center gap-4 pt-4">
                <Link href="/portal">
                  <Button className="w-full max-w-xs">
                    Go to Customer Portal
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
