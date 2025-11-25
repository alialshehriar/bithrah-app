import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { earlySignups } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// Generate unique referral code
function generateReferralCode(email: string): string {
  const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
  const emailPrefix = email.split('@')[0].substring(0, 3).toUpperCase();
  return `${emailPrefix}${randomStr}`;
}

export async function POST(request: NextRequest) {
  try {
    const { email, name, phone, referralCode, source, interests } = await request.json();

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني غير صالح' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existing = await db
      .select()
      .from(earlySignups)
      .where(eq(earlySignups.email, email))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'هذا البريد الإلكتروني مسجل مسبقاً', signup: existing[0] },
        { status: 400 }
      );
    }

    // Generate unique referral code for this user
    const ownReferralCode = generateReferralCode(email);

    // Create signup
    const [signup] = await db
      .insert(earlySignups)
      .values({
        email,
        name: name || null,
        phone: phone || null,
        referralCode: referralCode || null,
        ownReferralCode,
        source: source || 'website',
        interests: interests ? JSON.stringify(interests) : null,
        status: 'pending',
      })
      .returning();

    // If they used a referral code, increment the referrer's count
    if (referralCode) {
      await db
        .update(earlySignups)
        .set({
          referralCount: (earlySignups.referralCount as any) + 1,
        } as any)
        .where(eq(earlySignups.ownReferralCode, referralCode));
    }

    // TODO: Send welcome email with their referral code

    return NextResponse.json({
      success: true,
      message: 'تم التسجيل بنجاح!',
      signup: {
        email: signup.email,
        name: signup.name,
        ownReferralCode: signup.ownReferralCode,
        referralCount: 0,
      },
    });

  } catch (error) {
    console.error('Early signup error:', error);
    return NextResponse.json(
      { error: 'فشل التسجيل، يرجى المحاولة مرة أخرى' },
      { status: 500 }
    );
  }
}

// GET endpoint to check signup status by email or referral code
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const referralCode = searchParams.get('referralCode');

    if (!email && !referralCode) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني أو كود الإحالة مطلوب' },
        { status: 400 }
      );
    }

    let signup;

    if (email) {
      const result = await db
        .select()
        .from(earlySignups)
        .where(eq(earlySignups.email, email))
        .limit(1);
      signup = result[0];
    } else if (referralCode) {
      const result = await db
        .select()
        .from(earlySignups)
        .where(eq(earlySignups.ownReferralCode, referralCode))
        .limit(1);
      signup = result[0];
    }

    if (!signup) {
      return NextResponse.json(
        { error: 'التسجيل غير موجود' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      signup: {
        email: signup.email,
        name: signup.name,
        ownReferralCode: signup.ownReferralCode,
        referralCount: signup.referralCount,
        status: signup.status,
        createdAt: signup.createdAt,
      },
    });

  } catch (error) {
    console.error('Get signup error:', error);
    return NextResponse.json(
      { error: 'فشل جلب البيانات' },
      { status: 500 }
    );
  }
}
