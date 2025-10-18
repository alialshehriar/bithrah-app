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
      console.error('[Dashboard API] No token found');
      return NextResponse.json(
        { success: false, error: 'غير مصرح' },
        { status: 401 }
      );
    }

    // Verify token
    let payload;
    try {
      const verified = await jwtVerify(token, JWT_SECRET);
      payload = verified.payload;
    } catch (error) {
      console.error('[Dashboard API] Token verification failed:', error);
      return NextResponse.json(
        { success: false, error: 'غير مصرح' },
        { status: 401 }
      );
    }

    const userId = payload.id as number;
    console.log('[Dashboard API] User ID:', userId);

    if (!process.env.DATABASE_URL) {
      console.error('[Dashboard API] DATABASE_URL not found');
      return NextResponse.json(
        { success: false, error: 'خطأ في الإعدادات' },
        { status: 500 }
      );
    }

    const sql = neon(process.env.DATABASE_URL);

    // Get user stats
    let users;
    try {
      users = await sql`
        SELECT points, level
        FROM users
        WHERE id = ${userId}
      `;
      console.log('[Dashboard API] User data:', users[0]);
    } catch (error) {
      console.error('[Dashboard API] Error fetching user:', error);
      throw error;
    }

    if (users.length === 0) {
      console.error('[Dashboard API] User not found:', userId);
      return NextResponse.json(
        { success: false, error: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }

    const user = users[0];

    // Get projects count
    let projectsCount;
    try {
      projectsCount = await sql`
        SELECT COUNT(*)::int as count
        FROM projects
        WHERE creator_id = ${userId}
      `;
      console.log('[Dashboard API] Projects count:', projectsCount[0]);
    } catch (error) {
      console.error('[Dashboard API] Error fetching projects count:', error);
      projectsCount = [{ count: 0 }];
    }

    // Get backings count and total backed amount
    let backingsData;
    try {
      backingsData = await sql`
        SELECT COUNT(*)::int as count, COALESCE(SUM(amount), 0)::numeric as total
        FROM backings
        WHERE user_id = ${userId}
      `;
      console.log('[Dashboard API] Backings data:', backingsData[0]);
    } catch (error) {
      console.error('[Dashboard API] Error fetching backings:', error);
      backingsData = [{ count: 0, total: 0 }];
    }

    // Get recent projects
    let recentProjects;
    try {
      recentProjects = await sql`
        SELECT 
          id, title, goal_amount,
          (SELECT COUNT(*)::int FROM backings WHERE project_id = projects.id) as backers_count,
          (SELECT COALESCE(SUM(amount), 0)::numeric FROM backings WHERE project_id = projects.id) as raised_amount
        FROM projects
        WHERE creator_id = ${userId}
        ORDER BY created_at DESC
        LIMIT 5
      `;
      console.log('[Dashboard API] Recent projects count:', recentProjects.length);
    } catch (error) {
      console.error('[Dashboard API] Error fetching recent projects:', error);
      recentProjects = [];
    }

    // Get recent backings
    let recentBackings;
    try {
      recentBackings = await sql`
        SELECT 
          b.id, b.project_id, b.amount, b.created_at,
          p.title as project_title
        FROM backings b
        LEFT JOIN projects p ON b.project_id = p.id
        WHERE b.user_id = ${userId}
        ORDER BY b.created_at DESC
        LIMIT 5
      `;
      console.log('[Dashboard API] Recent backings count:', recentBackings.length);
    } catch (error) {
      console.error('[Dashboard API] Error fetching recent backings:', error);
      recentBackings = [];
    }

    const responseData = {
      success: true,
      data: {
        stats: {
          projectsCount: parseInt(projectsCount[0].count) || 0,
          backingsCount: parseInt(backingsData[0].count) || 0,
          totalBacked: parseFloat(backingsData[0].total) || 0,
          points: parseInt(user.points) || 0,
          level: parseInt(user.level) || 1,
        },
        recentProjects: recentProjects.map((p: any) => ({
          id: p.id,
          title: p.title,
          backersCount: parseInt(p.backers_count) || 0,
          raisedAmount: parseFloat(p.raised_amount) || 0,
          goalAmount: parseFloat(p.goal_amount) || 0,
        })),
        recentBackings: recentBackings.map((b: any) => ({
          id: b.id,
          projectId: b.project_id,
          projectTitle: b.project_title,
          amount: parseFloat(b.amount) || 0,
          createdAt: b.created_at,
        })),
      },
    };

    console.log('[Dashboard API] Response stats:', responseData.data.stats);
    return NextResponse.json(responseData);
  } catch (error: any) {
    console.error('[Dashboard API] Fatal error:', error);
    console.error('[Dashboard API] Error stack:', error?.stack);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في الخادم', details: error?.message },
      { status: 500 }
    );
  }
}

