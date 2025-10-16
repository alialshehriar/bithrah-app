import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { projects, backings } from '@/lib/db/schema';
import { eq, desc, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'غير مصرح' },
        { status: 401 }
      );
    }

    const userId = parseInt(session.user.id);

    // Get user projects with additional stats
    const userProjects = await db.query.projects.findMany({
      where: eq(projects.creatorId, userId),
      orderBy: [desc(projects.createdAt)],
    });

    // Enrich projects with investment data
    const enrichedProjects = await Promise.all(
      userProjects.map(async (project) => {
        // Get investment count for this project
        const investmentCount = await db
          .select({ count: sql<number>`COUNT(*)` })
          .from(backings)
          .where(eq(backings.projectId, project.id));

        const backersCount = investmentCount[0]?.count || 0;

        // Calculate funding percentage
        const fundingGoal = parseFloat(project.fundingGoal);
        const currentFunding = parseFloat(project.currentFunding || '0');
        const fundingPercentage = fundingGoal > 0 ? (currentFunding / fundingGoal) * 100 : 0;

        // Calculate days remaining
        const endDate = new Date(project.endDate);
        const today = new Date();
        const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

        return {
          ...project,
          backersCount,
          fundingPercentage: parseFloat(fundingPercentage.toFixed(2)),
          daysRemaining,
          isActive: project.status === 'active',
          isFunded: project.status === 'funded',
          isCompleted: project.status === 'completed',
        };
      })
    );

    return NextResponse.json({
      success: true,
      projects: enrichedProjects,
      total: enrichedProjects.length,
    });
  } catch (error) {
    console.error('User projects error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب المشاريع' },
      { status: 500 }
    );
  }
}

