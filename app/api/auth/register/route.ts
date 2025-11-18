import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import { randomUUID } from 'crypto';
import { nanoid } from 'nanoid';
import { sendWelcomeEmail } from '@/lib/resend-service';

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'bithrah-super-secret-key-2025-production-v1'
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, username, email, password } = body;

    // Validation
    if (!name || !username || !email || !password) {
      return NextResponse.json(
        { error: 'جميع الحقول مطلوبة' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'يجب أن تكون كلمة المرور 8 أحرف على الأقل' },
        { status: 400 }
      );
    }

    // Validate username format
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
      return NextResponse.json(
        { error: 'اسم المستخدم يجب أن يكون من 3-20 حرف (حروف إنجليزية وأرقام و_ فقط)' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const [existingEmail] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingEmail) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني مستخدم بالفعل' },
        { status: 400 }
      );
    }

    // Check if username already exists
    const [existingUsername] = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    if (existingUsername) {
      return NextResponse.json(
        { error: 'اسم المستخدم مستخدم بالفعل' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate referral code
    const referralCode = nanoid(10).toUpperCase();

    // Set subscription (Investor tier for 1 year for beta users)
    const subscriptionStartDate = new Date();
    const subscriptionEndDate = new Date();
    subscriptionEndDate.setFullYear(subscriptionEndDate.getFullYear() + 1);

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        email,
        password: hashedPassword,
        username,
        name: name,
        referralCode,
        subscriptionTier: 'investor', // Beta users get investor tier
        subscriptionStatus: 'active',
        subscriptionStartDate,
        subscriptionEndDate,
      } as any)
      .returning();

    // Create JWT token
    const token = await new SignJWT({
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name || newUser.email,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(JWT_SECRET);

    // Create response with cookie
    const response = NextResponse.json({
      success: true,
      message: 'تم إنشاء الحساب بنجاح',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        username: newUser.username,
      },
      verificationToken: randomUUID(), // For compatibility with frontend
    });

    // Set cookie
    response.cookies.set('bithrah-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    // Send welcome email (don't wait for it)
    sendWelcomeEmail({
      to: newUser.email,
      name: newUser.name || newUser.email,
      referralCode: newUser.referralCode || '',
    }).catch(err => console.error('Failed to send welcome email:', err));

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إنشاء الحساب' },
      { status: 500 }
    );
  }
}

