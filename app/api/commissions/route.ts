import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/auth';
import { db } from '@/lib/db';
import { commissions, backings, projects } from '@/lib/db/schema';
import { eq, desc, and, sql as drizzleSql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('bithrah-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const session = await verifySession(request);
    const userId = session.id;

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';
    const limit = parseInt(searchParams.get('limit') || '50');

    // Build query conditions
    const conditions = [eq(commissions.userId, userId)];
    if (status !== 'all') {
      conditions.push(eq(commissions.status, status));
    }

    // Get commissions
    const commissionsData = await db.select().from(commissions)
      .where(and(...conditions))
      .orderBy(desc(commissions.createdAt))
      .limit(limit);

    // Get summary stats
    const stats = await db.select({
      totalCount: drizzleSql<number>`count(*)::int`,
      totalAmount: drizzleSql<number>`coalesce(sum(${commissions.amount}), 0)::decimal`,
      pendingAmount: drizzleSql<number>`coalesce(sum(case when ${commissions.status} = 'pending' then ${commissions.amount} else 0 end), 0)::decimal`,
      approvedAmount: drizzleSql<number>`coalesce(sum(case when ${commissions.status} = 'approved' then ${commissions.amount} else 0 end), 0)::decimal`,
      paidAmount: drizzleSql<number>`coalesce(sum(case when ${commissions.status} = 'paid' then ${commissions.amount} else 0 end), 0)::decimal`,
    }).from(commissions)
      .where(eq(commissions.userId, userId));

    return NextResponse.json({
      success: true,
      commissions: commissionsData,
      stats: stats[0] || { totalCount: 0, totalAmount: 0, pendingAmount: 0, approvedAmount: 0, paidAmount: 0 },
    });
  } catch (error) {
    console.error('Commissions API error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في جلب بيانات العمولات' },
      { status: 500 }
    );
  }
}

