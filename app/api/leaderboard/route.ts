import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { desc, sql, and, gte } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get('period') || 'all'; // all, week, month, year
    const type = searchParams.get('type') || 'points'; // points, level, projects, backings
    const limit = parseInt(searchParams.get('limit') || '50');

    // Calculate date filter based on period
    let dateFilter;
    const now = new Date();
    
    switch (period) {
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        dateFilter = gte(users.createdAt, weekAgo);
        break;
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        dateFilter = gte(users.createdAt, monthAgo);
        break;
      case 'year':
        const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        dateFilter = gte(users.createdAt, yearAgo);
        break;
      default:
        dateFilter = undefined;
    }

    // Build query based on type
    let orderBy;
    switch (type) {
      case 'level':
        orderBy = [desc(users.level), desc(users.experience)];
        break;
      case 'projects':
        // This would need a join with projects table
        orderBy = [desc(users.points)]; // Fallback to points for now
        break;
      case 'backings':
        // This would need a join with backings table
        orderBy = [desc(users.points)]; // Fallback to points for now
        break;
      default:
        orderBy = [desc(users.points), desc(users.level)];
    }

    // Fetch leaderboard data
    const leaderboardUsers = await db.query.users.findMany({
      where: dateFilter ? and(dateFilter) : undefined,
      orderBy: orderBy,
      limit: limit,
      columns: {
        id: true,
        name: true,
        username: true,
        avatar: true,
        level: true,
        points: true,
        experience: true,
        subscriptionTier: true,
        createdAt: true,
      },
    });

    // Add rank to each user
    const rankedUsers = leaderboardUsers.map((user, index) => ({
      ...user,
      rank: index + 1,
      // Calculate additional stats (these would come from joins in a real implementation)
      projectsCount: 0,
      backingsCount: 0,
      totalEarnings: '0',
    }));

    // Get total count
    const totalCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(dateFilter ? and(dateFilter) : undefined);

    return NextResponse.json({
      success: true,
      leaderboard: rankedUsers,
      total: totalCount[0]?.count || 0,
      period,
      type,
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب لوحة الصدارة' },
      { status: 500 }
    );
  }
}

