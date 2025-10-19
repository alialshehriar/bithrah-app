/**
 * Demo Wallet System Types
 */

export type TransactionType = 
  | 'initial_credit'
  | 'support_package'
  | 'subscription'
  | 'negotiation_fee'
  | 'refund'
  | 'bonus';

export type TransactionStatus = 'pending' | 'completed' | 'refunded' | 'failed';

export interface DemoTransaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  balance: number;
  status: TransactionStatus;
  description: string;
  metadata?: {
    projectId?: string;
    subscriptionId?: string;
    negotiationId?: string;
    originalTransactionId?: string; // For refunds
  };
  createdAt: Date;
  refundedAt?: Date;
}

export interface DemoWallet {
  userId: string;
  balance: number;
  totalEarned: number;
  totalSpent: number;
  transactions: DemoTransaction[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SupportPackage {
  id: string;
  name: string;
  amount: number;
  benefits: string[];
  icon: string;
  color: string;
}

export interface Subscription {
  id: string;
  name: string;
  nameEn: 'silver' | 'gold' | 'platinum';
  price: number;
  duration: number; // in days
  features: string[];
  icon: string;
  color: string;
  gradient: string;
  popular?: boolean;
}

export interface NegotiationFeeCalculation {
  targetAmount: number;
  baseFee: number;
  rateFee: number;
  totalFee: number;
  breakdown: string;
}

