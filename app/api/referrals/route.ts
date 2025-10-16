import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/auth';
import { db } from '@/lib/db';
import { referralCodes, referrals, users, projects } from '@/lib/db/schema';
import { eq, desc, sql as drizzleSql } from 'drizzle-orm';

// GET - Get user's referral codes and stats
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('bithrah-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const session = await verifySession(request);
    const userId = session.id;

    // Get user's referral codes
    const codesData = await db.select({
      id: referralCodes.id,
      uuid: referralCodes.uuid,
      code: referralCodes.code,
      type: referralCodes.type,
      projectId: referralCodes.projectId,
      commissionRate: referralCodes.commissionRate,
      usesCount: referralCodes.usesCount,
      maxUses: referralCodes.maxUses,
      totalEarned: referralCodes.totalEarned,
      status: referralCodes.status,
      expiresAt: referralCodes.expiresAt,
      createdAt: referralCodes.createdAt,
      projectTitle: projects.title,
    })
      .from(referralCodes)
      .leftJoin(projects, eq(referralCodes.projectId, projects.id))
      .where(eq(referralCodes.userId, userId))
      .orderBy(desc(referralCodes.createdAt));

    // Get referral history
    const referralsData = await db.select({
      id: referrals.id,
      uuid: referrals.uuid,
      amount: referrals.amount,
      commissionAmount: referrals.commissionAmount,
      commissionRate: referrals.commissionRate,
      status: referrals.status,
      paidAt: referrals.paidAt,
      createdAt: referrals.createdAt,
      referredUsername: users.username,
      referredEmail: users.email,
      projectTitle: projects.title,
      referralCode: referralCodes.code,
    })
      .from(referrals)
      .leftJoin(users, eq(referrals.referredUserId, users.id))
      .leftJoin(projects, eq(referrals.projectId, projects.id))
      .leftJoin(referralCodes, eq(referrals.referralCodeId, referralCodes.id))
      .where(eq(referrals.referrerId, userId))
      .orderBy(desc(referrals.createdAt))
      .limit(50);

    // Get summary stats
    const stats = await db.select({
      totalReferrals: drizzleSql<number>`count(distinct ${referrals.id})::int`,
      uniqueUsers: drizzleSql<number>`count(distinct ${referrals.referredUserId})::int`,
      totalAmount: drizzleSql<number>`coalesce(sum(${referrals.amount}), 0)::decimal`,
      totalCommissions: drizzleSql<number>`coalesce(sum(${referrals.commissionAmount}), 0)::decimal`,
      paidCommissions: drizzleSql<number>`coalesce(sum(case when ${referrals.status} = 'paid' then ${referrals.commissionAmount} else 0 end), 0)::decimal`,
      pendingCommissions: drizzleSql<number>`coalesce(sum(case when ${referrals.status} = 'pending' then ${referrals.commissionAmount} else 0 end), 0)::decimal`,
    }).from(referrals)
      .where(eq(referrals.referrerId, userId));

    return NextResponse.json({
      success: true,
      codes: codesData,
      referrals: referralsData,
      stats: stats[0] || { totalReferrals: 0, uniqueUsers: 0, totalAmount: 0, totalCommissions: 0, paidCommissions: 0, pendingCommissions: 0 },
    });
  } catch (error) {
    console.error('Referrals API error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في جلب بيانات الإحالات' },
      { status: 500 }
    );
  }
}

// POST - Generate new referral code
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('bithrah-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const session = await verifySession(request);
    const userId = session.id;

    const body = await request.json();
    const { type = 'general', projectId = null, commissionRate = 5.0 } = body;

    // Generate unique code
    const code = await generateUniqueCode();

    // Create referral code
    const newCode = await db.insert(referralCodes).values({
      userId,
      code,
      type,
      projectId,
      commissionRate: commissionRate.toString(),
      status: 'active',
    }).returning();

    return NextResponse.json({
      success: true,
      code: newCode[0],
    });
  } catch (error) {
    console.error('Create referral code error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في إنشاء كود الإحالة' },
      { status: 500 }
    );
  }
}

async function generateUniqueCode(): Promise<string> {
  let code: string;
  let exists = true;

  while (exists) {
    // Generate random 8-character code
    code = Math.random().toString(36).substring(2, 10).toUpperCase();

    // Check if exists
    const result = await db.select().from(referralCodes)
      .where(eq(referralCodes.code, code))
      .limit(1);

    exists = result.length > 0;
  }

  return code!;
}

