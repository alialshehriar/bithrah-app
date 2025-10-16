import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifySession } from '@/lib/auth';

// GET /api/subscriptions/me - Get current user's subscription
export async function GET(request: NextRequest) {
  try {
    const session = await verifySession(request);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const subscriptions = await query(
      `SELECT us.*, sp.name, sp.price, sp.commission_percentage, sp.partnership_percentage, sp.features
      FROM user_subscriptions us
      JOIN subscription_packages sp ON us.package_id = sp.id
      WHERE us.user_id = $1 AND us.status = 'active'
      ORDER BY us.created_at DESC
      LIMIT 1`,
      [session.id]
    );

    if (subscriptions.length === 0) {
      return NextResponse.json({ success: true, subscription: null });
    }

    return NextResponse.json({ success: true, subscription: subscriptions[0] });
  } catch (error) {
    console.error('Error fetching user subscription:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch subscription' }, { status: 500 });
  }
}

