import { NextRequest, NextResponse } from 'next/server';

/**
 * Demo Mode Middleware
 * 
 * This middleware handles demo mode functionality:
 * - Provides virtual wallet credit (100,000 SAR)
 * - Simulates transactions without real payment processing
 * - Auto-refunds demo transactions
 */

export function demoModeMiddleware(request: NextRequest) {
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
  
  if (!isDemoMode) {
    return NextResponse.next();
  }
  
  // Add demo mode header to all responses
  const response = NextResponse.next();
  response.headers.set('X-Demo-Mode', 'true');
  response.headers.set('X-Demo-Credit', process.env.NEXT_PUBLIC_DEMO_WALLET_CREDIT || '100000');
  
  return response;
}

/**
 * Check if demo mode is enabled
 */
export function isDemoMode(): boolean {
  return process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
}

/**
 * Get demo wallet credit amount
 */
export function getDemoCredit(): number {
  return parseInt(process.env.NEXT_PUBLIC_DEMO_WALLET_CREDIT || '100000');
}

/**
 * Process demo transaction
 * Returns success without actual payment processing
 */
export async function processDemoTransaction(
  userId: string,
  amount: number,
  type: 'backing' | 'subscription' | 'negotiation'
): Promise<{
  success: boolean;
  transactionId: string;
  message: string;
}> {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    success: true,
    transactionId: `demo-${type}-${Date.now()}`,
    message: 'تمت العملية بنجاح في الوضع التجريبي. سيتم استرداد المبلغ تلقائياً.'
  };
}

/**
 * Auto-refund demo transaction
 * Simulates refund after a short delay
 */
export async function autoRefundDemoTransaction(
  transactionId: string,
  amount: number
): Promise<void> {
  // Simulate refund delay (5 seconds)
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  console.log(`[Demo Mode] Auto-refunded transaction ${transactionId}: ${amount} SAR`);
}

