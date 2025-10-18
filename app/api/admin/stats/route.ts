import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {
  users,
  projects,
  communities,
  transactions,
  wallets,
  negotiations,
  aiEvaluations,
  subscriptions,
} from '@/lib/db/schema';
import { eq, sql, and, gte } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // Get total users
    const [usersCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(users);

    // Get active users (logged in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const [activeUsersCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(gte(users.lastLoginAt, thirtyDaysAgo));

    // Get new users this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const [newUsersCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(gte(users.createdAt, startOfMonth));

    // Get suspended users
    const [suspendedUsersCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(eq(users.status, 'suspended'));

    // Get projects stats
    const [totalProjectsCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(projects);

    const [activeProjectsCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(projects)
      .where(eq(projects.status, 'active'));

    const [pendingProjectsCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(projects)
      .where(eq(projects.status, 'pending'));

    const [completedProjectsCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(projects)
      .where(eq(projects.status, 'completed'));

    const [rejectedProjectsCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(projects)
      .where(eq(projects.status, 'cancelled'));

    // Get financial stats
    const [totalFunding] = await db
      .select({ 
        total: sql<number>`COALESCE(SUM(CAST(${projects.currentFunding} AS NUMERIC)), 0)` 
      })
      .from(projects);

    const [totalTransactions] = await db
      .select({ count: sql<number>`count(*)` })
      .from(transactions);

    const [platformRevenue] = await db
      .select({ 
        total: sql<number>`COALESCE(SUM(CAST(${transactions.fee} AS NUMERIC)), 0)` 
      })
      .from(transactions)
      .where(eq(transactions.status, 'completed'));

    const [pendingPayouts] = await db
      .select({ 
        total: sql<number>`COALESCE(SUM(CAST(${wallets.balance} AS NUMERIC)), 0)` 
      })
      .from(wallets);

    // Get communities stats
    const [totalCommunitiesCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(communities);

    const [activeCommunitiesCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(communities)
      .where(eq(communities.status, 'active'));

    const [totalMembers] = await db
      .select({ 
        total: sql<number>`COALESCE(SUM(${communities.memberCount}), 0)` 
      })
      .from(communities);

    // Get negotiations stats
    const [totalNegotiationsCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(negotiations);

    const [activeNegotiationsCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(negotiations)
      .where(eq(negotiations.status, 'active'));

    const [completedNegotiationsCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(negotiations)
      .where(eq(negotiations.status, 'completed'));

    // Get evaluations stats
    const [totalEvaluationsCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(aiEvaluations);

    const [pendingEvaluationsCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(aiEvaluations)
      .where(eq(aiEvaluations.status, 'pending'));

    const [completedEvaluationsCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(aiEvaluations)
      .where(eq(aiEvaluations.status, 'completed'));

    // Get subscription distribution
    const subscriptionDistribution = await db
      .select({
        tier: users.subscriptionTier,
        count: sql<number>`count(*)`,
      })
      .from(users)
      .groupBy(users.subscriptionTier);

    // Get recent users
    const recentUsers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        avatar: users.avatar,
        role: users.role,
        subscriptionTier: users.subscriptionTier,
        createdAt: users.createdAt,
      })
      .from(users)
      .orderBy(sql`${users.createdAt} DESC`)
      .limit(10);

    const stats = {
      users: {
        total: usersCount.count || 0,
        active: activeUsersCount.count || 0,
        new: newUsersCount.count || 0,
        suspended: suspendedUsersCount.count || 0,
        thisMonth: newUsersCount.count || 0,
        growth: usersCount.count > 0 
          ? Math.round((newUsersCount.count / usersCount.count) * 100) 
          : 0,
      },
      projects: {
        total: totalProjectsCount.count || 0,
        active: activeProjectsCount.count || 0,
        pending: pendingProjectsCount.count || 0,
        completed: completedProjectsCount.count || 0,
        rejected: rejectedProjectsCount.count || 0,
      },
      financial: {
        totalFunding: Math.round(Number(totalFunding.total) || 0),
        totalTransactions: totalTransactions.count || 0,
        platformRevenue: Math.round(Number(platformRevenue.total) || 0),
        pendingPayouts: Math.round(Number(pendingPayouts.total) || 0),
      },
      communities: {
        total: totalCommunitiesCount.count || 0,
        active: activeCommunitiesCount.count || 0,
        members: totalMembers.total || 0,
      },
      negotiations: {
        total: totalNegotiationsCount.count || 0,
        active: activeNegotiationsCount.count || 0,
        completed: completedNegotiationsCount.count || 0,
      },
      evaluations: {
        total: totalEvaluationsCount.count || 0,
        pending: pendingEvaluationsCount.count || 0,
        completed: completedEvaluationsCount.count || 0,
      },
      subscriptions: subscriptionDistribution.map((sub) => ({
        tier: sub.tier || 'free',
        count: sub.count || 0,
      })),
      recentUsers: recentUsers,
      events: {
        total: 0, // TODO: Add events table
      },
      funding: {
        total: Math.round(Number(totalFunding.total) || 0),
      },
    };

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch admin stats',
        stats: {
          users: { total: 0, active: 0, new: 0, suspended: 0, thisMonth: 0, growth: 0 },
          projects: { total: 0, active: 0, pending: 0, completed: 0, rejected: 0 },
          financial: { totalFunding: 0, totalTransactions: 0, platformRevenue: 0, pendingPayouts: 0 },
          communities: { total: 0, active: 0, members: 0 },
          negotiations: { total: 0, active: 0, completed: 0 },
          evaluations: { total: 0, pending: 0, completed: 0 },
          subscriptions: [],
          recentUsers: [],
          events: { total: 0 },
          funding: { total: 0 },
        },
      },
      { status: 500 }
    );
  }
}

