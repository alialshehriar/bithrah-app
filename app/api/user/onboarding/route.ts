import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { neon } from '@neondatabase/serverless';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'bithrah-super-secret-key-2025-production-v1';

interface JWTPayload {
  id: number;
  email: string;
  name: string;
  role: string;
}

export async function POST(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('bithrah-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'غير مصرح' },
        { status: 401 }
      );
    }

    // Verify token
    let decoded: JWTPayload;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch (error) {
      return NextResponse.json(
        { error: 'غير مصرح' },
        { status: 401 }
      );
    }

    const userId = decoded.id;
    const body = await request.json();
    const { username, interests } = body;

    if (!username) {
      return NextResponse.json(
        { error: 'اسم المستخدم مطلوب' },
        { status: 400 }
      );
    }

    const sql = neon(process.env.DATABASE_URL!);

    // Check if username already exists
    const existingUsers = await sql`
      SELECT id FROM users WHERE username = ${username} AND id != ${userId}
    `;

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: 'اسم المستخدم مستخدم بالفعل' },
        { status: 400 }
      );
    }

    // Prepare preferences with interests
    const preferencesData = interests && interests.length > 0 
      ? JSON.stringify({ interests })
      : null;

    // Update user with username, preferences, and mark onboarding as completed
    await sql`
      UPDATE users
      SET 
        username = ${username},
        preferences = ${preferencesData}::jsonb,
        onboarding_completed = true,
        updated_at = NOW()
      WHERE id = ${userId}
    `;

    // Create welcome notification
    await sql`
      INSERT INTO notifications (
        user_id, type, title, content, message, created_at
      ) VALUES (
        ${userId},
        'welcome',
        'مرحباً بك في بذرة! 🎉',
        'نحن سعداء بانضمامك إلينا. ابدأ باستكشاف المشاريع أو إنشاء مشروعك الخاص.',
        'نحن سعداء بانضمامك إلينا. ابدأ باستكشاف المشاريع أو إنشاء مشروعك الخاص.',
        NOW()
      )
    `;

    return NextResponse.json({
      success: true,
      message: 'تم حفظ البيانات بنجاح'
    });
  } catch (error) {
    console.error('Error saving onboarding data:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}

