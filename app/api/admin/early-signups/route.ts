import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { earlySignups } from '@/lib/db/schema';
import { desc, sql, gte } from 'drizzle-orm';
import { auth } from '@/auth';

export async function GET(request: NextRequest) {
  try {
    // Check if user is admin
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get all signups
    const allSignups = await db
      .select()
      .from(earlySignups)
      .orderBy(desc(earlySignups.createdAt));

    // Get stats
    const total = allSignups.length;

    // Today's signups
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaySignups = allSignups.filter(s => new Date(s.createdAt) >= today);

    // Total referrals
    const totalReferrals = allSignups.reduce((sum, s) => sum + (s.referralCount || 0), 0);

    // Top referrer
    const topReferrer = allSignups.reduce((max, s) => 
      (s.referralCount || 0) > (max.referralCount || 0) ? s : max
    , allSignups[0]);

    return NextResponse.json({
      signups: allSignups,
      stats: {
        total,
        today: todaySignups.length,
        totalReferrals,
        topReferrer: topReferrer?.email || '-',
      },
    });

  } catch (error) {
    console.error('Get early signups error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch signups' },
      { status: 500 }
    );
  }
}
