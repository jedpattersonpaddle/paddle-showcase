"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CreditCard, UserCircle } from "lucide-react";

interface PreviewNavProps {
  domain: string;
}

export default function PreviewNav({ domain }: PreviewNavProps) {
  const pathname = usePathname();

  const previews = [
    {
      name: "Pricing",
      path: `/pricing`,
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      name: "Checkout",
      path: `/checkout`,
      icon: <CreditCard className="h-4 w-4" />,
    },
    {
      name: "Customer Portal",
      path: `/portal`,
      icon: <UserCircle className="h-4 w-4" />,
    },
  ];

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-white rounded-xl shadow-lg p-4 border border-blue-200">
        <div className="flex items-center gap-2 mb-3">
          <div className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full">
            PREVIEW NAVIGATION
          </div>
        </div>
        <ul className="space-y-1.5">
          {previews.map((preview) => (
            <li key={preview.path}>
              <Link
                href={preview.path}
                className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                  pathname.startsWith(preview.path)
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span
                  className={`${
                    pathname.startsWith(preview.path)
                      ? "text-blue-600"
                      : "text-gray-500"
                  }`}
                >
                  {preview.icon}
                </span>
                {preview.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
