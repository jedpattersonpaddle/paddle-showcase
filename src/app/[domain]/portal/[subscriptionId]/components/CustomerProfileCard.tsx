import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

interface CustomerInfo {
  name: string;
  email: string;
}

interface CustomerProfileCardProps {
  customerInfo: CustomerInfo;
}

export default function CustomerProfileCard({
  customerInfo,
}: CustomerProfileCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isEditingCustomer, setIsEditingCustomer] = useState(false);
  const [editedCustomerInfo, setEditedCustomerInfo] = useState<CustomerInfo>({
    name: customerInfo.name,
    email: customerInfo.email,
  });

  const handleCustomerEdit = () => {
    setIsEditingCustomer(true);
    setEditedCustomerInfo({
      name: customerInfo.name,
      email: customerInfo.email,
    });
  };

  const handleCustomerSave = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement the actual API call to update customer info
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated API call
      toast.success("Customer information updated successfully");
      // In a real implementation, you would update the customerInfo state with the response
      setIsEditingCustomer(false);
    } catch (error) {
      toast.error("Failed to update customer information");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-200 p-6 lg:p-8 transition duration-200 hover:shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Customer Profile
        </h3>
        {!isEditingCustomer && (
          <button
            onClick={handleCustomerEdit}
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            Edit
          </button>
        )}
      </div>
      <div className="space-y-4">
        {isEditingCustomer ? (
          <>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-500"
              >
                Name
              </label>
              <Input
                type="text"
                id="name"
                value={editedCustomerInfo.name}
                onChange={(e) =>
                  setEditedCustomerInfo((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-500"
              >
                Email
              </label>
              <Input
                type="email"
                id="email"
                value={editedCustomerInfo.email}
                onChange={(e) =>
                  setEditedCustomerInfo((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
              />
            </div>
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => setIsEditingCustomer(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleCustomerSave}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </>
        ) : (
          <>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Name</h4>
              <p className="mt-1 text-base text-gray-900">
                {customerInfo.name}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Email</h4>
              <p className="mt-1 text-base text-gray-900">
                {customerInfo.email}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
