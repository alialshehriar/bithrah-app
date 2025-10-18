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

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('bithrah-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'غير مصرح' },
        { status: 401 }
      );
    }

    // Verify token using jsonwebtoken (same as createSession)
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

    if (!userId) {
      return NextResponse.json(
        { error: 'غير مصرح' },
        { status: 401 }
      );
    }

    // Get user data from database
    const sql = neon(process.env.DATABASE_URL!);
    
    const users = await sql`
      SELECT id, name, email, role, created_at, onboarding_completed, points, level
      FROM users
      WHERE id = ${userId}
    `;

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }

    const user = users[0];

    // Get user stats
    const projectsCount = await sql`
      SELECT COUNT(*) as count
      FROM projects
      WHERE creator_id = ${userId}
    `;

    const backingsCount = await sql`
      SELECT COUNT(*) as count
      FROM backings
      WHERE user_id = ${userId}
    `;

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.created_at,
      onboardingCompleted: user.onboarding_completed || false,
      stats: {
        projects: parseInt(projectsCount[0].count),
        backings: parseInt(backingsCount[0].count),
        points: user.points || 0,
        level: user.level || 1,
      },
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}

