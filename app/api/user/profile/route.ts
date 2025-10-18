import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('bithrah-token');

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'غير مصرح' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token.value, JWT_SECRET) as { userId: number };
    
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, decoded.userId))
      .limit(1);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }

    const totalPoints = 150;
    const level = Math.floor(totalPoints / 100) + 1;
    const nextLevelPoints = level * 100;

    const profileData = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.name.toLowerCase().replace(/\s+/g, '_'),
        bio: 'رائد أعمال ومستثمر في المشاريع الناشئة',
        avatar: null,
        role: user.role,
        createdAt: user.createdAt?.toISOString() || new Date().toISOString(),
      },
      level: {
        level,
        totalPoints,
        nextLevelPoints,
      },
      stats: {
        projects: 0,
        backings: 0,
        followers: 0,
        following: 0,
      },
      achievements: [
        {
          id: 1,
          title: 'أول مشروع',
          description: 'أنشئ مشروعك الأول',
          icon: '🚀',
          unlocked: false,
        },
        {
          id: 2,
          title: 'داعم نشط',
          description: 'ادعم 5 مشاريع',
          icon: '💎',
          unlocked: false,
        },
        {
          id: 3,
          title: 'مستكشف',
          description: 'قم بزيارة 10 مشاريع',
          icon: '🔍',
          unlocked: true,
        },
      ],
    };

    return NextResponse.json(profileData);
  } catch (error) {
    console.error('Profile API error:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}
