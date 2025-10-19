/**
 * Demo Mode Configuration
 * Centralized configuration for the luxury demo experience
 */

export const demoConfig = {
  // Demo mode status - enabled by default for demo experience
  isEnabled: process.env.NEXT_PUBLIC_DEMO_MODE !== 'false',
  
  // Wallet configuration
  wallet: {
    initialCredit: parseInt(process.env.DEMO_WALLET_CREDIT || '100000'),
    currency: 'ريال',
    currencySymbol: 'ر.س',
  },
  
  // Negotiation pricing
  negotiation: {
    baseFee: parseInt(process.env.NEGOTIATION_BASE_FEE || '2000'),
    rate: parseFloat(process.env.NEGOTIATION_RATE || '0.02'),
    minFee: parseInt(process.env.NEGOTIATION_MIN || '1000'),
    maxFee: parseInt(process.env.NEGOTIATION_MAX || '20000'),
  },
  
  // Platform contact
  contact: {
    phone: process.env.PLATFORM_PHONE || '0592725341',
    phoneFormatted: '+966 59 272 5341',
    email: 'info@bithrahapp.com',
  },
  
  // Demo messages
  messages: {
    demoNotice: 'هذا وضع تجريبي، جميع العمليات محاكاة لتجربتك قبل الإطلاق الرسمي',
    walletNotice: 'الرصيد التجريبي يُستخدم لتجربة جميع ميزات المنصة',
    refundNotice: 'جميع المبالغ تُخصم من رصيدك التجريبي وتُسترد تلقائيًا',
    subscriptionNotice: 'الاشتراك محاكاة لتجربتك قبل الإطلاق الرسمي',
  },
  
  // Feature flags
  features: {
    aiEvaluation: true,
    paymentSimulation: true,
    interactiveWalkthroughs: true,
    analytics: true,
  },
};

/**
 * Calculate negotiation fee based on target amount
 */
export function calculateNegotiationFee(targetAmount: number): number {
  const { baseFee, rate, minFee, maxFee } = demoConfig.negotiation;
  
  // Calculate fee: BASE + RATE × target_amount
  let fee = baseFee + (rate * targetAmount);
  
  // Round to nearest 100
  fee = Math.round(fee / 100) * 100;
  
  // Apply min/max constraints
  fee = Math.max(minFee, Math.min(maxFee, fee));
  
  return fee;
}

/**
 * Format currency amount
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

