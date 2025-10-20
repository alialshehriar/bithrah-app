import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';
import { getSession } from '@/lib/auth';

function generateReferralCode(username: string): string {
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  const usernamePart = username.substring(0, 4).toUpperCase();
  return `${usernamePart}${randomPart}`;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session || !session.id) {
      return NextResponse.json(
        { success: false, error: 'غير مصرح' },
        { status: 401 }
      );
    }

    const userId = session.id;

    // Get user data
    const userResult = await db
      .select({
        id: users.id,
        username: users.username,
        referralCode: users.referralCode
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!userResult.length) {
      return NextResponse.json(
        { success: false, error: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }

    const user = userResult[0];

    // If user already has a referral code, return it
    if (user.referralCode) {
      return NextResponse.json({
        success: true,
        referralCode: user.referralCode
      });
    }

    // Generate new referral code
    const newReferralCode = generateReferralCode(user.username);

    // Update user with new referral code
    await db.execute(
      sql`UPDATE users SET referral_code = ${newReferralCode} WHERE id = ${userId}`
    );

    return NextResponse.json({
      success: true,
      referralCode: newReferralCode
    });

  } catch (error) {
    console.error('Error generating referral code:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في توليد كود الإحالة' },
      { status: 500 }
    );
  }
}

