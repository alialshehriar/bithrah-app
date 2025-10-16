import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, firstName, lastName } = body;

    // Validation
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني وكلمة المرور والاسم مطلوبة' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني مستخدم بالفعل' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');

    // Generate unique referral code
    const referralCode = `BITH${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        email,
        password: hashedPassword,
        name,
        firstName: firstName || name.split(' ')[0],
        lastName: lastName || name.split(' ').slice(1).join(' '),
        emailVerificationToken,
        emailVerified: false,
        referralCode,
        role: 'user',
        status: 'active',
        level: 1,
        points: 0,
        experience: 0,
        subscriptionTier: 'free',
        subscriptionStatus: 'active',
        language: 'ar',
        timezone: 'Asia/Riyadh',
        currency: 'SAR',
        onboardingCompleted: false,
        twoFactorEnabled: false,
      })
      .returning();

    // TODO: Send verification email
    // For now, we'll return the token in the response (in production, send via email)
    
    return NextResponse.json({
      success: true,
      message: 'تم إنشاء الحساب بنجاح. يرجى التحقق من بريدك الإلكتروني.',
      userId: newUser.id,
      verificationToken: emailVerificationToken, // Remove this in production
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إنشاء الحساب' },
      { status: 500 }
    );
  }
}

