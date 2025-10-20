import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, projects, communities } from '@/lib/db/schema';
import { count, sql, desc, gte, eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
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

    // Calculate total funding
    const fundingResult = await db
      .select({
        total: sql<string>`COALESCE(SUM(CAST(current_funding AS NUMERIC)), 0)`,
      })
      .from(projects);
    const totalFunding = parseFloat(fundingResult[0]?.total || '0');

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
        pending: pendingProjects,
        funded: fundedProjects,
      },
      communities: {
        total: totalCommunities,
        active: activeCommunities,
        thisMonth: 0,
      },
      events: {
        total: 0,
        upcoming: 0,
        past: 0,
      },
      funding: {
        total: totalFunding,
        thisMonth: 0,
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

