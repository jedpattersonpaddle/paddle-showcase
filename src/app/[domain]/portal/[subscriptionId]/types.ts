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
  managementUrls: {
    updatePaymentMethod: string;
    cancel: string;
  };
  scheduledChange?: {
    action: string;
    effectiveAt: string;
  } | null;
}
