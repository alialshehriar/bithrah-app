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
      SELECT id, name, email, role, created_at
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
      WHERE owner_id = ${userId}
    `;

    const investmentsCount = await sql`
      SELECT COUNT(*) as count
      FROM investments
      WHERE investor_id = ${userId}
    `;

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.created_at,
      stats: {
        projects: parseInt(projectsCount[0].count),
        investments: parseInt(investmentsCount[0].count),
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

