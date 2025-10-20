/**
 * Demo Mode Configuration - Unified and Enhanced
 * Centralized configuration for the complete demo experience
 */

export const demoConfig = {
  // Demo mode status - enabled by default
  isEnabled: true,
  
  // Wallet configuration
  wallet: {
    initialCredit: parseInt(process.env.DEMO_WALLET_CREDIT || '100000'),
    currency: 'ريال',
    currencySymbol: 'ر.س',
  },
  
  // Negotiation pricing - Auto-calculated based on target amount
  negotiation: {
    baseFee: parseInt(process.env.NEGOTIATION_BASE_FEE || '2000'),
    rate: parseFloat(process.env.NEGOTIATION_RATE || '0.02'), // 2%
    minFee: parseInt(process.env.NEGOTIATION_MIN || '1000'),
    maxFee: parseInt(process.env.NEGOTIATION_MAX || '20000'),
    // Examples:
    // 100k → 2000 + (100000 * 0.02) = 4000 ريال
    // 200k → 2000 + (200000 * 0.02) = 6000 ريال
    // 500k → 2000 + (500000 * 0.02) = 12000 ريال
  },
  
  // Subscription plans with auto-refund in demo
  subscriptions: {
    silver: {
      id: 'silver',
      name: 'الباقة الفضية',
      price: 99,
      duration: 30,
      discount: 0.05, // 5% discount on negotiation fees
    },
    gold: {
      id: 'gold',
      name: 'الباقة الذهبية',
      price: 199,
      duration: 30,
      discount: 0.10, // 10% discount on negotiation fees
      popular: true,
    },
    platinum: {
      id: 'platinum',
      name: 'الباقة البلاتينية',
      price: 399,
      duration: 30,
      discount: 0.20, // 20% discount on negotiation fees
    },
  },
  
  // Platform contact
  contact: {
    phone: process.env.PLATFORM_PHONE || '0592725341',
    phoneFormatted: '+966 59 272 5341',
    email: 'info@bithrahapp.com',
  },
  
  // Demo messages
  messages: {
    welcome: 'مرحباً بك في تجربة بذرة التفاعلية! هذه نسخة ديمو كاملة مع رصيد 100,000 ريال تجريبي.',
    demoNotice: 'جميع العمليات تجريبية ومُستردة تلقائياً - لا توجد مدفوعات حقيقية',
    walletNotice: 'الرصيد التجريبي يُستخدم لتجربة جميع ميزات المنصة بدون أي التزامات مالية',
    refundNotice: 'جميع المبالغ تُخصم من رصيدك التجريبي وتُسترد تلقائياً بعد انتهاء الجلسة',
    subscriptionNotice: 'الاشتراكات تُخصم من الرصيد التجريبي وتُسترد عند انتهاء الديمو',
    negotiationNotice: 'رسوم التفاوض محسوبة تلقائياً وتُسترد بعد انتهاء الجلسة',
    ipProtection: 'أي فكرة داخل بذره تُختم زمنياً وتُحفظ بحقوق مالكها؛ يمنع النسخ أو النشر دون إذن صاحبها.',
  },
  
  // Feature flags
  features: {
    aiEvaluation: true,
    paymentSimulation: true,
    interactiveWalkthroughs: true,
    analytics: true,
    autoRefund: true,
    realTimeUpdates: true,
  },
  
  // Demo data IDs
  demoIds: {
    projectId: 'demo-bithrah-project',
    communityId: 'demo-bithrah-community',
    eventId: 'demo-bithrah-event',
  },
};

/**
 * Calculate negotiation fee based on target amount
 * Formula: BASE_FEE + (RATE × target_amount)
 * 
 * Examples:
 * - 100,000 ريال → 2,000 + (0.02 × 100,000) = 4,000 ريال
 * - 200,000 ريال → 2,000 + (0.02 × 200,000) = 6,000 ريال
 * - 500,000 ريال → 2,000 + (0.02 × 500,000) = 12,000 ريال
 */
export function calculateNegotiationFee(targetAmount: number, subscriptionTier?: string): number {
  const { baseFee, rate, minFee, maxFee } = demoConfig.negotiation;
  
  // Calculate base fee
  let fee = baseFee + (rate * targetAmount);
  
  // Apply subscription discount if applicable
  if (subscriptionTier && demoConfig.subscriptions[subscriptionTier as keyof typeof demoConfig.subscriptions]) {
    const discount = demoConfig.subscriptions[subscriptionTier as keyof typeof demoConfig.subscriptions].discount;
    fee = fee * (1 - discount);
  }
  
  // Round to nearest 100
  fee = Math.round(fee / 100) * 100;
  
  // Apply min/max constraints
  fee = Math.max(minFee, Math.min(maxFee, fee));
  
  return fee;
}

/**
 * Format currency amount in Arabic
 */
export function formatCurrency(amount: number): string {
  return `${amount.toLocaleString('ar-SA')} ${demoConfig.wallet.currencySymbol}`;
}

/**
 * Check if demo mode is enabled
 */
export function isDemoMode(): boolean {
  return demoConfig.isEnabled;
}

/**
 * Get subscription plan details
 */
export function getSubscriptionPlan(tier: string) {
  return demoConfig.subscriptions[tier as keyof typeof demoConfig.subscriptions] || null;
}

/**
 * Process demo transaction (deduct and schedule refund)
 */
export interface DemoTransaction {
  success: boolean;
  message: string;
  transactionId?: string;
  amount: number;
  refundScheduled?: boolean;
  refundTime?: string;
}

export async function processDemoTransaction(
  userId: string,
  amount: number,
  type: 'debit' | 'credit',
  description: string
): Promise<DemoTransaction> {
  if (!isDemoMode()) {
    return {
      success: false,
      message: 'الوضع التجريبي غير مفعل',
      amount: 0,
    };
  }
  
  const transactionId = `demo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  if (type === 'debit') {
    // Deduct from demo balance and schedule refund
    return {
      success: true,
      message: `تم خصم ${formatCurrency(amount)} من رصيدك التجريبي`,
      transactionId,
      amount: -amount,
      refundScheduled: true,
      refundTime: new Date(Date.now() + 300000).toISOString(), // 5 minutes
    };
  } else {
    // Credit to demo balance
    return {
      success: true,
      message: `تم إضافة ${formatCurrency(amount)} إلى رصيدك التجريبي`,
      transactionId,
      amount: amount,
    };
  }
}

export default demoConfig;

