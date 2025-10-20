import { NextRequest, NextResponse } from 'next/server';
import { getDemoCredit, isDemoMode } from '@/middleware/demoMode';

export const dynamic = 'force-dynamic';
/**
 * GET /api/wallet/demo
 * Get demo wallet information
 */
export async function GET(request: NextRequest) {
  try {
    if (!isDemoMode()) {
      return NextResponse.json(
        { error: 'Demo mode is not enabled' },
        { status: 403 }
      );
    }
    
    const demoCredit = getDemoCredit();
    
    return NextResponse.json({
      balance: demoCredit,
      currency: 'SAR',
      isDemo: true,
      message: 'رصيد تجريبي - جميع المعاملات وهمية وسيتم استردادها تلقائياً'
    });
  } catch (error) {
    console.error('Error fetching demo wallet:', error);
    return NextResponse.json(
      { error: 'Failed to fetch demo wallet' },
      { status: 500 }
    );
  }
}

