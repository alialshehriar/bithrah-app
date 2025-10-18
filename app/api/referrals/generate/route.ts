import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { neon } from '@neondatabase/serverless';

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'bithrah-super-secret-key-2025-production-v1'
);

// Generate unique referral code
function generateReferralCode(username: string): string {
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  const usernamePart = username.substring(0, 4).toUpperCase();
  return `${usernamePart}${randomPart}`;
}

export async function POST(request: NextRequest) {
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

    // Get user details
    const users = await sql`
      SELECT id, username, referral_code, subscription_tier
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

    // Check if user already has a referral code
    if (user.referral_code) {
      return NextResponse.json({
        success: true,
        referralCode: user.referral_code,
        message: 'لديك بالفعل كود إحالة'
      });
    }

    // Generate unique referral code
    let referralCode = generateReferralCode(user.username || `USER${userId}`);
    let attempts = 0;
    const maxAttempts = 10;

    // Ensure uniqueness
    while (attempts < maxAttempts) {
      const existing = await sql`
        SELECT id FROM users WHERE referral_code = ${referralCode}
      `;

      if (existing.length === 0) {
        break;
      }

      referralCode = generateReferralCode(user.username || `USER${userId}`);
      attempts++;
    }

    if (attempts >= maxAttempts) {
      return NextResponse.json(
        { success: false, error: 'فشل في توليد كود إحالة فريد' },
        { status: 500 }
      );
    }

    // Update user with referral code
    await sql`
      UPDATE users
      SET referral_code = ${referralCode}, updated_at = NOW()
      WHERE id = ${userId}
    `;

    return NextResponse.json({
      success: true,
      referralCode,
      message: 'تم إنشاء كود الإحالة بنجاح'
    });
  } catch (error) {
    console.error('Error generating referral code:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}

