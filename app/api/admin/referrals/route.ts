import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { users, referrals } from '@/lib/db/schema';
import { eq, desc, count, sql } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Check if admin
    const cookieStore = await cookies();
    const token = cookieStore.get('bithrah-token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'غير مصرح' },
        { status: 401 }
      );
    }

    const { jwtVerify } = await import('jose');
    const JWT_SECRET = new TextEncoder().encode(
      process.env.NEXTAUTH_SECRET || 'bithrah-super-secret-key-2025-production-v1'
    );
    
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.userId as number;

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId)
    });

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'غير مصرح - يجب أن تكون مسؤولاً' },
        { status: 403 }
      );
    }

    // Get all referrals with user details
    const allReferrals = await db
      .select({
        id: referrals.id,
        referrerId: referrals.referrerId,
        referredId: referrals.referredId,
        status: referrals.status,
        createdAt: referrals.createdAt,
        rewardedAt: referrals.rewardedAt,
      })
      .from(referrals)
      .orderBy(desc(referrals.createdAt));

    // Get user details for each referral
    const referralsWithDetails = await Promise.all(
      allReferrals.map(async (ref) => {
        const referrer = await db.query.users.findFirst({
          where: eq(users.id, ref.referrerId),
          columns: {
            id: true,
            name: true,
            email: true,
          }
        });

        const referred = await db.query.users.findFirst({
          where: eq(users.id, ref.referredId),
          columns: {
            id: true,
            name: true,
            email: true,
          }
        });

        return {
          ...ref,
          referrerName: referrer?.name || 'مستخدم محذوف',
          referrerEmail: referrer?.email || '-',
          referredName: referred?.name || 'مستخدم محذوف',
          referredEmail: referred?.email || '-',
        };
      })
    );

    // Calculate stats
    const totalReferrals = allReferrals.length;
    const activeReferrals = allReferrals.filter(r => r.status === 'active').length;
    const pendingReferrals = allReferrals.filter(r => r.status === 'pending').length;

    // Get referrals this month
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const referralsThisMonth = allReferrals.filter(
      r => new Date(r.createdAt) >= thirtyDaysAgo
    ).length;

    // Get top referrers
    const topReferrersData = await db
      .select({
        referrerId: referrals.referrerId,
        count: count(),
      })
      .from(referrals)
      .groupBy(referrals.referrerId)
      .orderBy(desc(count()))
      .limit(10);

    const topReferrers = await Promise.all(
      topReferrersData.map(async (item) => {
        const user = await db.query.users.findFirst({
          where: eq(users.id, item.referrerId),
          columns: {
            id: true,
            name: true,
            email: true,
          }
        });

        const activeCount = allReferrals.filter(
          r => r.referrerId === item.referrerId && r.status === 'active'
        ).length;

        return {
          id: item.referrerId,
          name: user?.name || 'مستخدم محذوف',
          email: user?.email || '-',
          referralCount: item.count,
          activeReferrals: activeCount,
        };
      })
    );

    return NextResponse.json({
      success: true,
      referrals: referralsWithDetails,
      stats: {
        total: totalReferrals,
        active: activeReferrals,
        pending: pendingReferrals,
        thisMonth: referralsThisMonth,
        topReferrers,
      },
    });
  } catch (error) {
    console.error('Error fetching referrals:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}
