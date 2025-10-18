import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'bithrah-super-secret-key-2025-production-v1'
);

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('bithrah-token')?.value;

    if (!token) {
      return NextResponse.json(
        { user: null },
        { status: 200 }
      );
    }

    // Verify token
    const { payload } = await jwtVerify(token, JWT_SECRET);

    // Get user from database
    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        username: users.username,
        avatar: users.avatar,
        role: users.role,
        level: users.level,
        points: users.points,
      })
      .from(users)
      .where(eq(users.id, parseInt(payload.userId as string)))
      .limit(1);

    if (!user) {
      return NextResponse.json(
        { user: null },
        { status: 200 }
      );
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        role: user.role,
        level: user.level,
        points: user.points,
      },
    });
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json(
      { user: null },
      { status: 200 }
    );
  }
}

