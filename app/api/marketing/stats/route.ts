import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { referrals, users, projects } from '@/lib/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session || !session.id) {
      return NextResponse.json(
        { success: false, error: 'غير مصرح' },
        { status: 401 }
      );
    }

    const userId = session.id;

    // Get total referrals count
    const totalReferralsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(referrals)
      .where(eq(referrals.referrerId, userId));

    const totalReferrals = Number(totalReferralsResult[0]?.count || 0);

    // Get commission stats
    const commissionStats = await db
      .select({
        total: sql<string>`COALESCE(SUM(${referrals.commissionEarned}), 0)`,
        pending: sql<string>`COALESCE(SUM(CASE WHEN ${referrals.commissionPaid} = false THEN ${referrals.commissionEarned} ELSE 0 END), 0)`,
        paid: sql<string>`COALESCE(SUM(CASE WHEN ${referrals.commissionPaid} = true THEN ${referrals.commissionEarned} ELSE 0 END), 0)`,
      })
      .from(referrals)
      .where(eq(referrals.referrerId, userId));

    const stats = commissionStats[0] || {
      total: '0',
      pending: '0',
      paid: '0'
    };

    // Get user's referral code
    const userResult = await db
      .select({ referralCode: users.referralCode })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    const referralCode = userResult[0]?.referralCode || '';

    // Get top referred users (simplified - in real app would track project referrals)
    const topReferrals = await db
      .select({
        id: users.id,
        name: users.name,
        username: users.username,
        commission: referrals.commissionEarned,
        createdAt: referrals.createdAt
      })
      .from(referrals)
      .innerJoin(users, eq(referrals.referredId, users.id))
      .where(eq(referrals.referrerId, userId))
      .orderBy(sql`${referrals.commissionEarned} DESC`)
      .limit(5);

    return NextResponse.json({
      success: true,
      data: {
        totalReferrals,
        totalCommissions: parseFloat(stats.total).toFixed(2),
        pendingCommissions: parseFloat(stats.pending).toFixed(2),
        paidCommissions: parseFloat(stats.paid).toFixed(2),
        referralCode,
        topReferrals: topReferrals.map(r => ({
          id: r.id,
          name: r.name,
          username: r.username,
          commission: parseFloat(r.commission || '0').toFixed(2),
          date: r.createdAt
        }))
      }
    });

  } catch (error) {
    console.error('Error fetching marketing stats:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في جلب الإحصائيات' },
      { status: 500 }
    );
  }
}

