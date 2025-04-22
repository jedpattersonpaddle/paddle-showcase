"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Copy, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface LicenseKeyCardProps {
  licenseKey: string;
  onResetLicense: () => Promise<void>;
}

export default function LicenseKeyCard({
  licenseKey,
  onResetLicense,
}: LicenseKeyCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleCopyLicense = () => {
    navigator.clipboard.writeText(licenseKey);
    toast.success("License key copied to clipboard");
  };

  const handleResetLicense = async () => {
    setIsLoading(true);
    try {
      await onResetLicense();
      toast.success("License key reset successfully");
    } catch (error) {
      toast.error("Failed to reset license key");
    } finally {
      setIsLoading(false);
      setShowConfirmDialog(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-200 p-6 lg:p-8 transition duration-200 hover:shadow-md">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">License Key</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLicense}
              className="flex items-center gap-2"
            >
              <Copy className="h-4 w-4" />
              Copy
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowConfirmDialog(true)}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <code className="text-sm font-mono text-gray-900 break-all">
            {licenseKey}
          </code>
        </div>

        <p className="text-sm text-gray-500">
          Use this license key to activate your software. Keep it secure and
          don&apos;t share it with others.
        </p>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Reset License Key
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to reset your license key? This will
              invalidate your current key and generate a new one. Any devices
              using the old key will need to be updated.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowConfirmDialog(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleResetLicense}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  "Reset License Key"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
