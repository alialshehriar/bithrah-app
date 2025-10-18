import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { projects, users, transactions } from '@/lib/db/schema';
import { eq, sql, and } from 'drizzle-orm';
import { isSandboxMode, generateDummyStats } from '@/lib/sandbox';

export async function GET(request: NextRequest) {
  try {
    // Get total active projects
    const [projectsCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(projects)
      .where(eq(projects.status, 'active'));

    // Get total funding
    const [fundingSum] = await db
      .select({ 
        total: sql<number>`COALESCE(SUM(CAST(${projects.currentFunding} AS NUMERIC)), 0)` 
      })
      .from(projects)
      .where(eq(projects.status, 'active'));

    // Get total backers (unique users who backed projects)
    const [backersCount] = await db
      .select({ count: sql<number>`count(DISTINCT ${projects.creatorId})` })
      .from(projects);

    // Calculate success rate
    const [completedProjects] = await db
      .select({ count: sql<number>`count(*)` })
      .from(projects)
      .where(eq(projects.status, 'completed'));

    const [totalProjects] = await db
      .select({ count: sql<number>`count(*)` })
      .from(projects);

    const successRate = totalProjects.count > 0 
      ? Math.round((completedProjects.count / totalProjects.count) * 100)
      : 0;

    // Check sandbox mode
    const sandboxEnabled = await isSandboxMode();
    
    if (sandboxEnabled && projectsCount.count === 0) {
      // Return dummy stats in sandbox mode if no real data
      const dummyStats = generateDummyStats();
      return NextResponse.json({
        success: true,
        ...dummyStats,
        sandbox: true,
      });
    }

    return NextResponse.json({
      success: true,
      totalProjects: projectsCount.count || 0,
      totalFunding: Math.round(Number(fundingSum.total) || 0),
      totalBackers: backersCount.count || 0,
      successRate: successRate,
      sandbox: false,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      {
        success: false,
        totalProjects: 0,
        totalFunding: 0,
        totalBackers: 0,
        successRate: 0,
      },
      { status: 500 }
    );
  }
}

