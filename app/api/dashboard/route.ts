import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { neon } from '@neondatabase/serverless';

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'bithrah-super-secret-key-2025-production-v1'
);

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('bithrah-token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'غير مصرح' },
        { status: 401 }
      );
    }

    // Verify token
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.id as number;

    const sql = neon(process.env.DATABASE_URL!);

    // Get user stats
    const users = await sql`
      SELECT points, level
      FROM users
      WHERE id = ${userId}
    `;

    if (users.length === 0) {
      return NextResponse.json(
        { success: false, error: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }

    const user = users[0];

    // Get projects count
    const projectsCount = await sql`
      SELECT COUNT(*) as count
      FROM projects
      WHERE creator_id = ${userId}
    `;

    // Get backings count and total backed amount
    const backingsData = await sql`
      SELECT COUNT(*) as count, COALESCE(SUM(amount), 0) as total
      FROM backings
      WHERE user_id = ${userId}
    `;

    // Get recent projects
    const recentProjects = await sql`
      SELECT 
        id, title, goal_amount,
        (SELECT COUNT(*) FROM backings WHERE project_id = projects.id) as backers_count,
        (SELECT COALESCE(SUM(amount), 0) FROM backings WHERE project_id = projects.id) as raised_amount
      FROM projects
      WHERE creator_id = ${userId}
      ORDER BY created_at DESC
      LIMIT 5
    `;

    // Get recent backings
    const recentBackings = await sql`
      SELECT 
        b.id, b.project_id, b.amount, b.created_at,
        p.title as project_title
      FROM backings b
      LEFT JOIN projects p ON b.project_id = p.id
      WHERE b.user_id = ${userId}
      ORDER BY b.created_at DESC
      LIMIT 5
    `;

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          projectsCount: parseInt(projectsCount[0].count),
          backingsCount: parseInt(backingsData[0].count),
          totalBacked: parseFloat(backingsData[0].total),
          points: user.points || 0,
          level: user.level || 1,
        },
        recentProjects: recentProjects.map((p: any) => ({
          id: p.id,
          title: p.title,
          backersCount: parseInt(p.backers_count),
          raisedAmount: parseFloat(p.raised_amount),
          goalAmount: parseFloat(p.goal_amount),
        })),
        recentBackings: recentBackings.map((b: any) => ({
          id: b.id,
          projectId: b.project_id,
          projectTitle: b.project_title,
          amount: parseFloat(b.amount),
          createdAt: b.created_at,
        })),
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}

