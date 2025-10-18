import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { referralCode, newUserId } = body;

    if (!referralCode || !newUserId) {
      return NextResponse.json(
        { success: false, error: 'كود الإحالة ومعرف المستخدم مطلوبان' },
        { status: 400 }
      );
    }

    const sql = neon(process.env.DATABASE_URL!);

    // Find referrer by referral code
    const referrers = await sql`
      SELECT id, referral_code, referral_count
      FROM users
      WHERE referral_code = ${referralCode}
    `;

    if (referrers.length === 0) {
      return NextResponse.json(
        { success: false, error: 'كود الإحالة غير صحيح' },
        { status: 404 }
      );
    }

    const referrer = referrers[0];

    // Check if new user is already referred
    const existingReferral = await sql`
      SELECT id FROM referrals WHERE referred_id = ${newUserId}
    `;

    if (existingReferral.length > 0) {
      return NextResponse.json(
        { success: false, error: 'المستخدم مسجل بالفعل عبر إحالة' },
        { status: 400 }
      );
    }

    // Create referral record
    await sql`
      INSERT INTO referrals (
        referrer_id, referred_id, referral_code, status, created_at, updated_at
      ) VALUES (
        ${referrer.id}, ${newUserId}, ${referralCode}, 'pending', NOW(), NOW()
      )
    `;

    // Update referrer's referral count and referred_by in new user
    await sql`
      UPDATE users
      SET referral_count = referral_count + 1, updated_at = NOW()
      WHERE id = ${referrer.id}
    `;

    await sql`
      UPDATE users
      SET referred_by = ${referrer.id}, updated_at = NOW()
      WHERE id = ${newUserId}
    `;

    return NextResponse.json({
      success: true,
      message: 'تم تسجيل الإحالة بنجاح'
    });
  } catch (error) {
    console.error('Error tracking referral:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}

