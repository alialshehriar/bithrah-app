import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, referrals } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { referralCode, referredUserId } = body;

    if (!referralCode || !referredUserId) {
      return NextResponse.json(
        { success: false, error: 'بيانات غير كاملة' },
        { status: 400 }
      );
    }

    // Find referrer by code
    const referrer = await db.query.users.findFirst({
      where: eq(users.referralCode, referralCode)
    });

    if (!referrer) {
      return NextResponse.json(
        { success: false, error: 'كود الإحالة غير صحيح' },
        { status: 404 }
      );
    }

    // Check if referral already exists
    const existingReferral = await db.query.referrals.findFirst({
      where: and(
        eq(referrals.referrerId, referrer.id),
        eq(referrals.referredId, referredUserId)
      )
    });

    if (existingReferral) {
      return NextResponse.json({
        success: true,
        message: 'الإحالة موجودة بالفعل',
        referral: existingReferral,
      });
    }

    // Create referral record
    const [newReferral] = await db
      .insert(referrals)
      .values({
        referrerId: referrer.id,
        referredId: referredUserId,
        referralCode,
        status: 'completed',
        source: 'web',
      } as any)
      .returning();

    return NextResponse.json({
      success: true,
      message: 'تم تسجيل الإحالة بنجاح',
      referral: newReferral,
    });
  } catch (error) {
    console.error('Error tracking referral:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}
