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

    // Verify token and check if user is admin
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userRole = payload.role as string;

    if (userRole !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'غير مصرح - يجب أن تكون مديراً' },
        { status: 403 }
      );
    }

    const sql = neon(process.env.DATABASE_URL!);
    const { searchParams } = new URL(request.url);
    const sandboxMode = searchParams.get('sandbox') === 'true';

    // Get total users
    const usersResult = await sql`
      SELECT COUNT(*) as total
      FROM users
      WHERE ${sandboxMode ? sql`is_sandbox = true` : sql`(is_sandbox = false OR is_sandbox IS NULL)`}
    `;
    const totalUsers = parseInt(usersResult[0].total);

    // Get users this month
    const usersThisMonthResult = await sql`
      SELECT COUNT(*) as count
      FROM users
      WHERE created_at >= NOW() - INTERVAL '30 days'
      AND ${sandboxMode ? sql`is_sandbox = true` : sql`(is_sandbox = false OR is_sandbox IS NULL)`}
    `;
    const usersThisMonth = parseInt(usersThisMonthResult[0].count);

    // Get total projects
    const projectsResult = await sql`
      SELECT COUNT(*) as total
      FROM projects
      WHERE ${sandboxMode ? sql`is_sandbox = true` : sql`(is_sandbox = false OR is_sandbox IS NULL)`}
    `;
    const totalProjects = parseInt(projectsResult[0].total);

    // Get active projects
    const activeProjectsResult = await sql`
      SELECT COUNT(*) as count
      FROM projects
      WHERE status = 'active'
      AND ${sandboxMode ? sql`is_sandbox = true` : sql`(is_sandbox = false OR is_sandbox IS NULL)`}
    `;
    const activeProjects = parseInt(activeProjectsResult[0].count);

    // Get total communities
    const communitiesResult = await sql`
      SELECT COUNT(*) as total
      FROM communities
      WHERE ${sandboxMode ? sql`is_sandbox = true` : sql`(is_sandbox = false OR is_sandbox IS NULL)`}
    `;
    const totalCommunities = parseInt(communitiesResult[0].total);

    // Get total events
    const eventsResult = await sql`
      SELECT COUNT(*) as total
      FROM events
      WHERE ${sandboxMode ? sql`is_sandbox = true` : sql`(is_sandbox = false OR is_sandbox IS NULL)`}
    `;
    const totalEvents = parseInt(eventsResult[0].total);

    // Get total funding
    const fundingResult = await sql`
      SELECT COALESCE(SUM(amount), 0) as total
      FROM investments
      WHERE ${sandboxMode ? sql`is_sandbox = true` : sql`(is_sandbox = false OR is_sandbox IS NULL)`}
    `;
    const totalFunding = parseFloat(fundingResult[0].total);

    // Get recent users
    const recentUsers = await sql`
      SELECT id, name, email, role, created_at
      FROM users
      WHERE ${sandboxMode ? sql`is_sandbox = true` : sql`(is_sandbox = false OR is_sandbox IS NULL)`}
      ORDER BY created_at DESC
      LIMIT 10
    `;

    // Get subscription distribution (placeholder)
    const subscriptions = [
      { tier: 'مجاني', count: totalUsers },
      { tier: 'مميز', count: 0 },
      { tier: 'احترافي', count: 0 },
    ];

    const stats = {
      users: {
        total: totalUsers,
        active: totalUsers,
        thisMonth: usersThisMonth,
        growth: totalUsers > 0 ? Math.round((usersThisMonth / totalUsers) * 100) : 0,
      },
      projects: {
        total: totalProjects,
        active: activeProjects,
      },
      communities: {
        total: totalCommunities,
      },
      events: {
        total: totalEvents,
      },
      funding: {
        total: totalFunding,
      },
      subscriptions,
      recentUsers,
    };

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}

