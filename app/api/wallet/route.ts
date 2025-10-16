import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/auth';
import { db } from '@/lib/db';
import { wallets, transactions, commissions, referrals } from '@/lib/db/schema';
import { eq, desc, sql as drizzleSql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('bithrah-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const session = await verifySession(request);
    const userId = session.id;

    // Get wallet info
    const walletData = await db.select().from(wallets)
      .where(eq(wallets.userId, userId))
      .limit(1);

    let wallet;
    if (walletData.length === 0) {
      // Create wallet if doesn't exist
      const newWallet = await db.insert(wallets).values({
        userId,
        balance: '0.00',
        currency: 'SAR',
        status: 'active',
      }).returning();
      
      return NextResponse.json({
        success: true,
        wallet: newWallet[0],
      });
    }

    wallet = walletData[0];

    // Get recent transactions
    const recentTransactions = await db.select().from(transactions)
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.createdAt))
      .limit(10);

    // Get pending commissions
    const pendingCommissions = await db.select({
      count: drizzleSql<number>`count(*)::int`,
      total: drizzleSql<number>`coalesce(sum(${commissions.amount}), 0)::decimal`,
    }).from(commissions)
      .where(eq(commissions.userId, userId))
      .where(eq(commissions.status, 'pending'));

    // Get referral stats
    const referralStats = await db.select({
      totalReferrals: drizzleSql<number>`count(*)::int`,
      totalCommissions: drizzleSql<number>`coalesce(sum(${referrals.commissionAmount}), 0)::decimal`,
    }).from(referrals)
      .where(eq(referrals.referrerId, userId));

    return NextResponse.json({
      success: true,
      wallet,
      recentTransactions,
      pendingCommissions: pendingCommissions[0] || { count: 0, total: 0 },
      referralStats: referralStats[0] || { totalReferrals: 0, totalCommissions: 0 },
    });
  } catch (error) {
    console.error('Wallet API error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في جلب بيانات المحفظة' },
      { status: 500 }
    );
  }
}

