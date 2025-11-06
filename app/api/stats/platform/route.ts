import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, projects, transactions, communities } from '@/lib/db/schema';
import { eq, sql, and, gte } from 'drizzle-orm';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();


    // Get real stats from database
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Count active projects
    const activeProjectsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(projects)
      .where(eq(projects.status, 'active'));
    
    const activeProjects = Number(activeProjectsResult[0]?.count || 0);

    // Count active users
    const activeUsersResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(eq(users.status, 'active'));
    
    const activeUsers = Number(activeUsersResult[0]?.count || 0);

    // Sum today's funding
    const todayFundingResult = await db
      .select({ total: sql<number>`COALESCE(SUM(CAST(amount AS DECIMAL)), 0)` })
      .from(transactions)
      .where(
        and(
          eq(transactions.type, 'investment'),
          gte(transactions.createdAt, todayStart)
        )
      );
    
    const todayFunding = Number(todayFundingResult[0]?.total || 0);

    // Count new achievements today (simplified - count new transactions)
    const newAchievementsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(transactions)
      .where(gte(transactions.createdAt, todayStart));
    
    const newAchievements = Number(newAchievementsResult[0]?.count || 0);

    // Count total projects
    const totalProjectsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(projects);
    
    const totalProjects = Number(totalProjectsResult[0]?.count || 0);

    // Sum total funding
    const totalFundingResult = await db
      .select({ total: sql<number>`COALESCE(SUM(CAST(current_funding AS DECIMAL)), 0)` })
      .from(projects);
    
    const totalFunding = Number(totalFundingResult[0]?.total || 0);

    // Count completed projects for success rate
    const completedProjectsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(projects)
      .where(eq(projects.status, 'completed'));
    
    const completedProjects = Number(completedProjectsResult[0]?.count || 0);
    const successRate = totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0;

    // Count total communities
    const totalCommunitiesResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(communities);
    
    const totalCommunities = Number(totalCommunitiesResult[0]?.count || 0);

    return NextResponse.json({
      success: true,
      stats: {
        activeProjects,
        activeUsers,
        todayFunding,
        newAchievements,
        totalProjects,
        totalFunding,
        totalCommunities,
        successRate,
      },
      sandbox: false
    });
  } catch (error) {
    console.error('Error fetching platform stats:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في جلب الإحصائيات' },
      { status: 500 }
    );
  }
}

