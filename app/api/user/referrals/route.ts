import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('bithrah-token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'غير مصرح' },
        { status: 401 }
      );
    }

    // Verify token and get user
    const { jwtVerify } = await import('jose');
    const JWT_SECRET = new TextEncoder().encode(
      process.env.NEXTAUTH_SECRET || 'bithrah-super-secret-key-2025-production-v1'
    );
    
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.userId as number;

    // Get user's referrals
    const referrals = await db.query.users.findMany({
      where: eq(users.referredBy, userId),
      orderBy: [desc(users.createdAt)],
      columns: {
        id: true,
        name: true,
        username: true,
        avatar: true,
        createdAt: true,
        subscriptionTier: true,
      }
    });

    return NextResponse.json({
      success: true,
      referrals,
      count: referrals.length,
    });
  } catch (error) {
    console.error('Error fetching referrals:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}
