import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { neon } from '@neondatabase/serverless';

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'bithrah-super-secret-key-2025-production-v1'
);

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('bithrah-token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'غير مصرح' },
        { status: 401 }
      );
    }

    // Verify token
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.userId as string;

    const sql = neon(process.env.DATABASE_URL!);

    // Get user's referral code and stats
    const users = await sql`
      SELECT 
        id, username, referral_code, referral_count, referral_earnings,
        subscription_tier
      FROM users
      WHERE id = ${userId}
    `;

    if (users.length === 0) {
      return NextResponse.json(
        { success: false, error: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }

    const user = users[0];

    // Get referrals list
    const referrals = await sql`
      SELECT 
        r.id,
        r.referral_code,
        r.status,
        r.commission_earned,
        r.commission_paid,
        r.created_at,
        u.id as referred_user_id,
        u.name as referred_user_name,
        u.username as referred_username,
        u.email as referred_email,
        u.created_at as referred_joined_at
      FROM referrals r
      JOIN users u ON r.referred_id = u.id
      WHERE r.referrer_id = ${userId}
      ORDER BY r.created_at DESC
    `;

    // Calculate stats
    const totalReferrals = referrals.length;
    const activeReferrals = referrals.filter((r: any) => r.status === 'completed').length;
    const pendingReferrals = referrals.filter((r: any) => r.status === 'pending').length;
    const totalEarnings = referrals.reduce((sum: number, r: any) => 
      sum + parseFloat(r.commission_earned || 0), 0
    );
    const paidEarnings = referrals.filter((r: any) => r.commission_paid)
      .reduce((sum: number, r: any) => sum + parseFloat(r.commission_earned || 0), 0);
    const pendingEarnings = totalEarnings - paidEarnings;

    // Get commissions
    const commissions = await sql`
      SELECT 
        id, type, source_type, amount, rate, base_amount,
        status, created_at, approved_at, paid_at
      FROM commissions
      WHERE user_id = ${userId} AND type = 'referral'
      ORDER BY created_at DESC
      LIMIT 50
    `;

    return NextResponse.json({
      success: true,
      referralCode: user.referral_code,
      stats: {
        totalReferrals,
        activeReferrals,
        pendingReferrals,
        totalEarnings: totalEarnings.toFixed(2),
        paidEarnings: paidEarnings.toFixed(2),
        pendingEarnings: pendingEarnings.toFixed(2),
        referralCount: user.referral_count || 0,
        referralEarnings: parseFloat(user.referral_earnings || 0).toFixed(2)
      },
      referrals: referrals.map((r: any) => ({
        id: r.id,
        referralCode: r.referral_code,
        status: r.status,
        commissionEarned: parseFloat(r.commission_earned || 0).toFixed(2),
        commissionPaid: r.commission_paid,
        createdAt: r.created_at,
        referredUser: {
          id: r.referred_user_id,
          name: r.referred_user_name,
          username: r.referred_username,
          email: r.referred_email,
          joinedAt: r.referred_joined_at
        }
      })),
      commissions: commissions.map((c: any) => ({
        id: c.id,
        type: c.type,
        sourceType: c.source_type,
        amount: parseFloat(c.amount).toFixed(2),
        rate: parseFloat(c.rate).toFixed(2),
        baseAmount: parseFloat(c.base_amount).toFixed(2),
        status: c.status,
        createdAt: c.created_at,
        approvedAt: c.approved_at,
        paidAt: c.paid_at
      })),
      hasReferralCode: !!user.referral_code,
      subscriptionTier: user.subscription_tier
    });
  } catch (error) {
    console.error('Error fetching referral stats:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}

