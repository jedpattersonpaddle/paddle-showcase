export interface CustomerInfo {
  name: string;
  email: string;
}

export interface PaymentMethod {
  brand: string;
  last4: string;
  expiryMonth: string;
  expiryYear: string;
}

export interface Transaction {
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  billedAt: string | null;
  totalAmount: string | undefined;
  items: Array<{
    price: {
      name: string;
      unitPrice: {
        amount: string;
        currencyCode: string;
      };
    };
    quantity: number;
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
  }>;
  customer: {
    id: string;
    name: string | null;
    email: string;
  } | null;
  address?: {
    countryCode: string;
    postalCode: string | null;
  } | null;
  business?: {
    name: string;
    taxIdentifier: string | null;
  } | null;
  paymentMethod?: {
    type: string;
    card?: {
      brand: string;
      last4: string;
      expiryMonth: string;
      expiryYear: string;
    };
  } | null;
  invoiceUrl?: string;
  receiptUrl?: string;
}

export interface PaymentHistory {
  id: string;
  date: string;
  amount: string;
  status: string;
  paymentMethod: string;
  invoiceUrl?: string;
  cardBrand?: string;
  cardLast4?: string;
  description?: string;
  transactionId: string;
  billingDate: string;
}

export interface SimplifiedSubscription {
  id: string;
  status: string;
  currencyCode: string;
  startedAt: string;
  nextBilledAt: string;
  licenseKey: string;
  billingCycle: {
    frequency: number;
    interval: string;
  };
  items: Array<{
    quantity: number;
    price: {
      name: string;
      unitPrice: {
        amount: string;
        currencyCode: string;
      };
    };
    product: {
      name: string;
      description: string;
      imageUrl: string;
    };
  }>;
  customer: {
    name: string | null;
    email: string;
  };
  managementUrls: {
    updatePaymentMethod: string;
    cancel: string;
  };
  scheduledChange?: {
    action: string;
    effectiveAt: string;
  } | null;
}
