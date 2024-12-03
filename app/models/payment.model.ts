export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_account';
  last4: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

export interface Transaction {
  id: string;
  userId: string;
  hotspotId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  paymentMethodId: string;
  createdAt: Date;
  completedAt?: Date;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  clientSecret: string;
}