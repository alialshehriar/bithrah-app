import { NextRequest, NextResponse } from 'next/server';
import { isDemoMode, processDemoTransaction, autoRefundDemoTransaction } from '@/middleware/demoMode';

/**
 * POST /api/transactions/demo
 * Process a demo transaction
 */
export async function POST(request: NextRequest) {
  try {
    if (!isDemoMode()) {
      return NextResponse.json(
        { error: 'Demo mode is not enabled' },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    const { userId, amount, type } = body;
    
    if (!userId || !amount || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Process demo transaction
    const result = await processDemoTransaction(userId, amount, type);
    
    // Schedule auto-refund
    autoRefundDemoTransaction(result.transactionId, amount).catch(console.error);
    
    return NextResponse.json({
      ...result,
      autoRefund: true,
      refundDelay: 5000 // 5 seconds
    });
  } catch (error) {
    console.error('Error processing demo transaction:', error);
    return NextResponse.json(
      { error: 'Failed to process demo transaction' },
      { status: 500 }
    );
  }
}

