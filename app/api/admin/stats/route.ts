import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { users, projects, communities, events, transactions, wallets } from '@/lib/db/schema';
import { eq, sql, and, gte } from 'drizzle-orm';

// GET /api/admin/stats - Get admin dashboard stats
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const includeSandbox = searchParams.get('sandbox') === 'true';

    // Total users
    const totalUsersQuery = includeSandbox
      ? db.select({ count: sql<number>`count(*)` }).from(users)
      : db.select({ count: sql<number>`count(*)` }).from(users).where(eq(users.isSandbox, false));
    const totalUsers = await totalUsersQuery;

    // Active users (logged in last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const activeUsersQuery = includeSandbox
      ? db.select({ count: sql<number>`count(*)` }).from(users).where(gte(users.lastLoginAt, sevenDaysAgo))
      : db.select({ count: sql<number>`count(*)` }).from(users).where(
          and(eq(users.isSandbox, false), gte(users.lastLoginAt, sevenDaysAgo))
        );
    const activeUsers = await activeUsersQuery;

    // Total projects
    const totalProjectsQuery = includeSandbox
      ? db.select({ count: sql<number>`count(*)` }).from(projects)
      : db.select({ count: sql<number>`count(*)` }).from(projects).where(eq(projects.isSandbox, false));
    const totalProjects = await totalProjectsQuery;

    // Active projects
    const activeProjectsQuery = includeSandbox
      ? db.select({ count: sql<number>`count(*)` }).from(projects).where(eq(projects.status, 'active'))
      : db.select({ count: sql<number>`count(*)` }).from(projects).where(
          and(eq(projects.isSandbox, false), eq(projects.status, 'active'))
        );
    const activeProjects = await activeProjectsQuery;

    // Total communities
    const totalCommunitiesQuery = includeSandbox
      ? db.select({ count: sql<number>`count(*)` }).from(communities)
      : db.select({ count: sql<number>`count(*)` }).from(communities).where(eq(communities.isSandbox, false));
    const totalCommunities = await totalCommunitiesQuery;

    // Total events
    const totalEventsQuery = includeSandbox
      ? db.select({ count: sql<number>`count(*)` }).from(events)
      : db.select({ count: sql<number>`count(*)` }).from(events).where(eq(events.isSandbox, false));
    const totalEvents = await totalEventsQuery;

    // Total funding
    const totalFundingQuery = includeSandbox
      ? db.select({ sum: sql<number>`sum(${projects.currentFunding})` }).from(projects)
      : db.select({ sum: sql<number>`sum(${projects.currentFunding})` }).from(projects).where(eq(projects.isSandbox, false));
    const totalFunding = await totalFundingQuery;

    // Subscription tiers
    const subscriptionStats = await db
      .select({
        tier: users.subscriptionTier,
        count: sql<number>`count(*)`,
      })
      .from(users)
      .where(includeSandbox ? sql`true` : eq(users.isSandbox, false))
      .groupBy(users.subscriptionTier);

    // Recent activity (last 10 users)
    const recentUsers = await db.query.users.findMany({
      where: includeSandbox ? sql`true` : eq(users.isSandbox, false),
      orderBy: (users, { desc }) => [desc(users.createdAt)],
      limit: 10,
    });

    // Growth stats (this month vs last month)
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    const lastMonth = new Date(thisMonth);
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const thisMonthUsers = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(
        includeSandbox
          ? gte(users.createdAt, thisMonth)
          : and(eq(users.isSandbox, false), gte(users.createdAt, thisMonth))
      );

    const lastMonthUsers = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(
        includeSandbox
          ? and(gte(users.createdAt, lastMonth), sql`${users.createdAt} < ${thisMonth}`)
          : and(
              eq(users.isSandbox, false),
              gte(users.createdAt, lastMonth),
              sql`${users.createdAt} < ${thisMonth}`
            )
      );

    const userGrowth = lastMonthUsers[0]?.count
      ? ((thisMonthUsers[0]?.count - lastMonthUsers[0]?.count) / lastMonthUsers[0]?.count) * 100
      : 0;

    return NextResponse.json({
      success: true,
      stats: {
        users: {
          total: totalUsers[0]?.count || 0,
          active: activeUsers[0]?.count || 0,
          thisMonth: thisMonthUsers[0]?.count || 0,
          growth: Math.round(userGrowth),
        },
        projects: {
          total: totalProjects[0]?.count || 0,
          active: activeProjects[0]?.count || 0,
        },
        communities: {
          total: totalCommunities[0]?.count || 0,
        },
        events: {
          total: totalEvents[0]?.count || 0,
        },
        funding: {
          total: totalFunding[0]?.sum || 0,
        },
        subscriptions: subscriptionStats,
        recentUsers,
      },
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب الإحصائيات' },
      { status: 500 }
    );
  }
}

