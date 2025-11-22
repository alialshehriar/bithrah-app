import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, referrals } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, username, email, password, referralCode } = body;

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

    // Validate username format (3-20 characters, alphanumeric and underscore only)
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
      return NextResponse.json(
        { error: 'اسم المستخدم يجب أن يكون من 3-20 حرف (حروف إنجليزية وأرقام و_ فقط)' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني غير صحيح' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingEmail = await db.query.users.findFirst({
      where: eq(users.email, email)
    });

    if (existingEmail) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني مستخدم بالفعل' },
        { status: 400 }
      );
    }

    // Check if username already exists
    const existingUsername = await db.query.users.findFirst({
      where: eq(users.username, username)
    });

    if (existingUsername) {
      return NextResponse.json(
        { error: 'اسم المستخدم مستخدم بالفعل' },
        { status: 400 }
      );
    }

    // Check referral code if provided
    let referredBy = null;
    if (referralCode) {
      const referrer = await db.query.users.findFirst({
        where: eq(users.referralCode, referralCode)
      });

      if (referrer) {
        referredBy = referrer.id;
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate unique referral code
    const newReferralCode = nanoid(10).toUpperCase();

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

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
        name,
        referralCode: newReferralCode,
        referredBy,
        emailVerificationToken: verificationToken,
        emailVerified: false,
        subscriptionTier: 'investor', // Beta users get investor tier for 1 year
        subscriptionStatus: 'pending', // Will activate after email verification
        subscriptionStartDate,
        subscriptionEndDate,
        role: 'user',
        status: 'active',
        onboardingCompleted: false,
      } as any)
      .returning();

    // If user was referred, create referral record and update referrer
    if (referredBy) {
      // Create referral record in referrals table
      try {
        await db.insert(referrals).values({
          referrerId: referredBy,
          referredId: newUser.id,
          referralCode: referralCode!,
          status: 'completed',
          source: 'web',
        } as any);
      } catch (refError) {
        console.error('Error creating referral record:', refError);
      }
      
      const referrer = await db.query.users.findFirst({
        where: eq(users.id, referredBy)
      });

      if (referrer) {
        // Extend subscription by 1 year from current end date (or from now if expired)
        const currentEndDate = referrer.subscriptionEndDate ? new Date(referrer.subscriptionEndDate) : new Date();
        const now = new Date();
        const baseDate = currentEndDate > now ? currentEndDate : now;
        
        const newEndDate = new Date(baseDate);
        newEndDate.setFullYear(newEndDate.getFullYear() + 1);

        await db.update(users)
          .set({
            referralCount: (referrer.referralCount || 0) + 1,
            subscriptionTier: 'investor',
            subscriptionStatus: 'active',
            subscriptionEndDate: newEndDate,
          } as any)
          .where(eq(users.id, referredBy));
      }
    }

    // Send verification email
    try {
      const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${verificationToken}`;
      
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'بذرة Bithrah <info@bithrahapp.com>',
          to: email,
          subject: 'تأكيد بريدك الإلكتروني - بذرة',
          html: `
            <!DOCTYPE html>
            <html dir="rtl" lang="ar">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; direction: rtl;">
              <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <div style="text-align: center; margin-bottom: 30px;">
                  <h1 style="color: #10b981; margin: 0;">🌱 بذرة</h1>
                  <p style="color: #666; margin-top: 10px;">منصة التمويل الجماعي</p>
                </div>
                
                <h2 style="color: #333; text-align: center;">مرحباً ${name}! 👋</h2>
                
                <p style="color: #666; line-height: 1.8; font-size: 16px;">
                  شكراً لانضمامك إلى <strong>بذرة</strong>! نحن سعداء بوجودك معنا.
                </p>
                
                <p style="color: #666; line-height: 1.8; font-size: 16px;">
                  للبدء في استخدام حسابك، يرجى تأكيد بريدك الإلكتروني بالضغط على الزر أدناه:
                </p>
                
                <div style="text-align: center; margin: 40px 0;">
                  <a href="${verificationUrl}" 
                     style="background-color: #10b981; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold; font-size: 16px;">
                    تأكيد البريد الإلكتروني
                  </a>
                </div>
                
                <div style="background-color: #f0fdf4; border-right: 4px solid #10b981; padding: 20px; margin: 30px 0; border-radius: 5px;">
                  <h3 style="color: #10b981; margin-top: 0;">🎁 مكافأة التسجيل المبكر</h3>
                  <p style="color: #666; margin: 0; line-height: 1.8;">
                    كمستخدم مبكر، حصلت على <strong>اشتراك مستثمر لمدة سنة كاملة مجاناً!</strong>
                  </p>
                </div>
                
                <div style="background-color: #eff6ff; border-right: 4px solid #3b82f6; padding: 20px; margin: 30px 0; border-radius: 5px;">
                  <h3 style="color: #3b82f6; margin-top: 0;">🔗 كود الإحالة الخاص بك</h3>
                  <p style="color: #666; margin: 10px 0;">شارك كود الإحالة مع أصدقائك واحصل على سنة إضافية لكل صديق يسجل:</p>
                  <div style="background-color: white; padding: 15px; border-radius: 5px; text-align: center; font-size: 24px; font-weight: bold; color: #3b82f6; letter-spacing: 2px; margin-top: 15px;">
                    ${newReferralCode}
                  </div>
                </div>
                
                <p style="color: #999; font-size: 14px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee;">
                  إذا لم تقم بإنشاء هذا الحساب، يمكنك تجاهل هذه الرسالة.
                </p>
                
                <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                  <p style="color: #999; font-size: 14px; margin: 5px 0;">
                    © 2025 بذرة - جميع الحقوق محفوظة
                  </p>
                  <p style="color: #999; font-size: 14px; margin: 5px 0;">
                    <a href="${process.env.NEXTAUTH_URL}" style="color: #10b981; text-decoration: none;">www.bithrahapp.com</a>
                  </p>
                </div>
              </div>
            </body>
            </html>
          `,
        }),
      });

      if (!response.ok) {
        console.error('Failed to send verification email:', await response.text());
      }
    } catch (emailError) {
      console.error('Error sending verification email:', emailError);
      // Don't fail registration if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'تم إنشاء الحساب بنجاح! يرجى التحقق من بريدك الإلكتروني لتأكيد حسابك.',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        username: newUser.username,
        referralCode: newUser.referralCode,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إنشاء الحساب' },
      { status: 500 }
    );
  }
}
