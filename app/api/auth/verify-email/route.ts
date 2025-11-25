import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'رمز التحقق مطلوب' },
        { status: 400 }
      );
    }

    // Find user with this verification token
    const user = await db.query.users.findFirst({
      where: eq(users.emailVerificationToken, token)
    });

    if (!user) {
      return NextResponse.json(
        { error: 'رمز التحقق غير صحيح أو منتهي الصلاحية' },
        { status: 400 }
      );
    }

    // Check if already verified
    if (user.emailVerified) {
      return NextResponse.json({
        success: true,
        message: 'تم تأكيد بريدك الإلكتروني مسبقاً',
        alreadyVerified: true,
      });
    }

    // Update user - verify email and activate subscription
    await db.update(users)
      .set({
        emailVerified: true,
        emailVerificationToken: null,
        subscriptionStatus: 'active', // Activate the 1-year investor subscription
      } as any)
      .where(eq(users.id, user.id));

    return NextResponse.json({
      success: true,
      message: 'تم تأكيد بريدك الإلكتروني بنجاح! يمكنك الآن تسجيل الدخول.',
    });
  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تأكيد البريد الإلكتروني' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني مطلوب' },
        { status: 400 }
      );
    }

    // Find user
    const user = await db.query.users.findFirst({
      where: eq(users.email, email)
    });

    if (!user) {
      return NextResponse.json(
        { error: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني مؤكد بالفعل' },
        { status: 400 }
      );
    }

    // Generate new verification token
    const crypto = require('crypto');
    const newToken = crypto.randomBytes(32).toString('hex');

    // Update user with new token
    await db.update(users)
      .set({
        emailVerificationToken: newToken,
      } as any)
      .where(eq(users.id, user.id));

    // Send verification email
    const verificationUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${newToken}`;
    
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
              
              <h2 style="color: #333; text-align: center;">تأكيد البريد الإلكتروني</h2>
              
              <p style="color: #666; line-height: 1.8; font-size: 16px;">
                مرحباً ${user.name}،
              </p>
              
              <p style="color: #666; line-height: 1.8; font-size: 16px;">
                يرجى تأكيد بريدك الإلكتروني بالضغط على الزر أدناه:
              </p>
              
              <div style="text-align: center; margin: 40px 0;">
                <a href="${verificationUrl}" 
                   style="background-color: #10b981; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold; font-size: 16px;">
                  تأكيد البريد الإلكتروني
                </a>
              </div>
              
              <p style="color: #999; font-size: 14px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee;">
                إذا لم تطلب هذا التأكيد، يمكنك تجاهل هذه الرسالة.
              </p>
              
              <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                <p style="color: #999; font-size: 14px; margin: 5px 0;">
                  © 2025 بذرة - جميع الحقوق محفوظة
                </p>
              </div>
            </div>
          </body>
          </html>
        `,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send email');
    }

    return NextResponse.json({
      success: true,
      message: 'تم إرسال رسالة التأكيد إلى بريدك الإلكتروني',
    });
  } catch (error) {
    console.error('Resend verification error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إرسال رسالة التأكيد' },
      { status: 500 }
    );
  }
}
