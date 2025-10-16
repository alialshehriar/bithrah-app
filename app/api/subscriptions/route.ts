import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifySession } from '@/lib/auth';

// GET /api/subscriptions - Get all subscription packages
export async function GET(request: NextRequest) {
  try {
    const packages = await query(
      `SELECT * FROM subscription_packages ORDER BY price ASC`
    );

    return NextResponse.json({ success: true, packages });
  } catch (error) {
    console.error('Error fetching subscription packages:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch packages' }, { status: 500 });
  }
}

// POST /api/subscriptions - Subscribe to a package
export async function POST(request: NextRequest) {
  try {
    const session = await verifySession(request);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { packageId } = await request.json();

    if (!packageId) {
      return NextResponse.json({ success: false, error: 'Package ID is required' }, { status: 400 });
    }

    // Get package details
    const packages = await query(
      `SELECT * FROM subscription_packages WHERE id = $1`,
      [packageId]
    );

    if (packages.length === 0) {
      return NextResponse.json({ success: false, error: 'Package not found' }, { status: 404 });
    }

    const pkg = packages[0];

    // Check if user already has an active subscription
    const existingSubscriptions = await query(
      `SELECT * FROM user_subscriptions WHERE user_id = $1 AND status = 'active'`,
      [session.id]
    );

    if (existingSubscriptions.length > 0) {
      // Cancel existing subscription
      await query(
        `UPDATE user_subscriptions SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP WHERE user_id = $1 AND status = 'active'`,
        [session.id]
      );
    }

    // Calculate expiry date (30 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    // Create new subscription
    const result = await query(
      `INSERT INTO user_subscriptions (user_id, package_id, status, expires_at, created_at, updated_at)
      VALUES ($1, $2, 'active', $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *`,
      [session.id, packageId, expiresAt]
    );

    // Track activity
    await query(
      `INSERT INTO user_activities (user_id, activity_type, activity_data, created_at)
      VALUES ($1, 'subscription_created', $2, CURRENT_TIMESTAMP)`,
      [session.id, JSON.stringify({ packageId, packageName: pkg.name })]
    );

    return NextResponse.json({ success: true, subscription: result[0] });
  } catch (error) {
    console.error('Error creating subscription:', error);
    return NextResponse.json({ success: false, error: 'Failed to create subscription' }, { status: 500 });
  }
}

