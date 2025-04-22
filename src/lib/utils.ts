import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, currencyCode: string = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(amount / 100);
}

export function generateLicenseKey() {
  const segments = [];
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  for (let i = 0; i < hex.length; i += 8) {
    segments.push(hex.slice(i, i + 8));
  }

  return segments.join("-").toUpperCase();
}

export function generateId() {
  return crypto.randomUUID();
}
