import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, projects, backings } from '@/lib/db/schema';
import { eq, and, count, sql } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    // Check if userId is a number (ID) or string (username)
    const isNumericId = /^\d+$/.test(userId);
    
    let user;
    if (isNumericId) {
      // Query by ID
      user = await db.query.users.findFirst({
        where: eq(users.id, parseInt(userId))
      });
    } else {
      // Query by username
      user = await db.query.users.findFirst({
        where: eq(users.username, userId)
      });
    }

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }

    // Get user stats
    const [projectsCount] = await db
      .select({ count: count() })
      .from(projects)
      .where(eq(projects.creatorId, user.id));

    const [backingsCount] = await db
      .select({ count: count() })
      .from(backings)
      .where(eq(backings.userId, user.id));

    // Get total funding from user's projects
    const [fundingResult] = await db
      .select({
        total: sql<string>`COALESCE(SUM(${projects.currentAmount}), 0)`
      })
      .from(projects)
      .where(eq(projects.creatorId, user.id));

    // Calculate success rate
    const [successfulProjects] = await db
      .select({ count: count() })
      .from(projects)
      .where(
        and(
          eq(projects.creatorId, user.id),
          eq(projects.status, 'funded')
        )
      );

    const successRate = projectsCount.count > 0
      ? Math.round((successfulProjects.count / projectsCount.count) * 100)
      : 0;

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        avatar: user.avatar,
        bio: user.bio,
        city: user.city,
        country: user.country,
        socialLinks: user.socialLinks,
        level: user.level || 1,
        points: user.points || 0,
        subscriptionTier: user.subscriptionTier || 'free',
        createdAt: user.createdAt,
      },
      stats: {
        totalProjects: projectsCount.count,
        totalBackings: backingsCount.count,
        totalFunding: fundingResult.total || '0',
        successRate,
        level: user.level || 1,
        points: user.points || 0,
        experience: user.experience || 0,
      },
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}
