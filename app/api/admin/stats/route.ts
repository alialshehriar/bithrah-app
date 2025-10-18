import { NextRequest, NextResponse } from 'next/server';
import { sandboxStats } from '@/lib/sandbox/data';

export async function GET(request: NextRequest) {
  try {
    // Check if sandbox mode is enabled from cookie
    const sandboxMode = request.cookies.get('sandbox-mode')?.value === 'true';
    
    if (sandboxMode) {
      // Return comprehensive sandbox stats
      return NextResponse.json({
        success: true,
        stats: {
          users: {
            total: 10247,
            active: 8932,
            thisMonth: 1523,
            growth: 15,
          },
          projects: {
            total: 1247,
            active: 892,
            pending: 156,
            funded: 623,
          },
          communities: {
            total: 156,
            active: 134,
            thisMonth: 23,
          },
          events: {
            total: 89,
            upcoming: 34,
            past: 55,
          },
          funding: {
            total: 52847392.50,
            thisMonth: 4523891.25,
            avgPerProject: 42389.50,
          },
          subscriptions: [
            { tier: 'مجاني', count: 8432, percentage: 82 },
            { tier: 'مميز', count: 1234, percentage: 12 },
            { tier: 'احترافي', count: 581, percentage: 6 },
          ],
          recentUsers: [
            { id: 1, name: 'أحمد محمد', email: 'ahmed@example.com', role: 'user', created_at: new Date().toISOString() },
            { id: 2, name: 'فاطمة علي', email: 'fatima@example.com', role: 'user', created_at: new Date().toISOString() },
            { id: 3, name: 'محمد سعيد', email: 'mohammed@example.com', role: 'investor', created_at: new Date().toISOString() },
            { id: 4, name: 'نورة خالد', email: 'noura@example.com', role: 'user', created_at: new Date().toISOString() },
            { id: 5, name: 'عبدالله أحمد', email: 'abdullah@example.com', role: 'user', created_at: new Date().toISOString() },
          ],
        },
      });
    }

    // Real data mode - import database connection
    const { db } = await import('@/lib/db');
    const { users, projects, communities } = await import('@/lib/db/schema');
    const { count, sql, desc, gte } = await import('drizzle-orm');

    // Get total users
    const totalUsersResult = await db.select({ count: count() }).from(users);
    const totalUsers = totalUsersResult[0]?.count || 0;

    // Get users this month
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const usersThisMonthResult = await db
      .select({ count: count() })
      .from(users)
      .where(gte(users.createdAt, thirtyDaysAgo));
    const usersThisMonth = usersThisMonthResult[0]?.count || 0;

    // Get total projects
    const totalProjectsResult = await db.select({ count: count() }).from(projects);
    const totalProjects = totalProjectsResult[0]?.count || 0;

    // Get active projects
    const { eq } = await import('drizzle-orm');
    const activeProjectsResult = await db
      .select({ count: count() })
      .from(projects)
      .where(eq(projects.status, 'active'));
    const activeProjects = activeProjectsResult[0]?.count || 0;

    // Get pending projects
    const pendingProjectsResult = await db
      .select({ count: count() })
      .from(projects)
      .where(eq(projects.status, 'pending'));
    const pendingProjects = pendingProjectsResult[0]?.count || 0;

    // Get funded projects
    const fundedProjectsResult = await db
      .select({ count: count() })
      .from(projects)
      .where(eq(projects.status, 'funded'));
    const fundedProjects = fundedProjectsResult[0]?.count || 0;

    // Get total communities
    const totalCommunitiesResult = await db.select({ count: count() }).from(communities);
    const totalCommunities = totalCommunitiesResult[0]?.count || 0;

    // Get active communities
    const activeCommunitiesResult = await db
      .select({ count: count() })
      .from(communities)
      .where(eq(communities.status, 'active'));
    const activeCommunities = activeCommunitiesResult[0]?.count || 0;

    // Get recent users
    const recentUsers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        created_at: users.createdAt,
      })
      .from(users)
      .orderBy(desc(users.createdAt))
      .limit(10);

    // Calculate total funding (sum of current_funding from all projects)
    const fundingResult = await db
      .select({
        total: sql<string>`COALESCE(SUM(CAST(current_funding AS NUMERIC)), 0)`,
      })
      .from(projects);
    const totalFunding = parseFloat(fundingResult[0]?.total || '0');

    const stats = {
      users: {
        total: totalUsers,
        active: totalUsers, // Assuming all users are active for now
        thisMonth: usersThisMonth,
        growth: totalUsers > 0 ? Math.round((usersThisMonth / totalUsers) * 100) : 0,
      },
      projects: {
        total: totalProjects,
        active: activeProjects,
        pending: pendingProjects,
        funded: fundedProjects,
      },
      communities: {
        total: totalCommunities,
        active: activeCommunities,
        thisMonth: 0, // Can be calculated if needed
      },
      events: {
        total: 0, // Events table not implemented yet
        upcoming: 0,
        past: 0,
      },
      funding: {
        total: totalFunding,
        thisMonth: 0, // Can be calculated if needed
        avgPerProject: totalProjects > 0 ? totalFunding / totalProjects : 0,
      },
      subscriptions: [
        { tier: 'مجاني', count: totalUsers, percentage: 100 },
        { tier: 'مميز', count: 0, percentage: 0 },
        { tier: 'احترافي', count: 0, percentage: 0 },
      ],
      recentUsers: recentUsers.map(user => ({
        id: user.id,
        name: user.name || 'مستخدم',
        email: user.email,
        role: user.role || 'user',
        created_at: user.created_at,
      })),
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

