import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('bithrah-token')?.value;

    if (!token) {
      return NextResponse.json({
        success: true,
        stats: {
          totalProjects: 0,
          totalBackings: 0,
          totalEarnings: '0',
          totalReferrals: 0,
          level: 1,
          points: 0,
          experience: 0,
        },
      });
    }

    const { jwtVerify } = await import('jose');
    const JWT_SECRET = new TextEncoder().encode(
      process.env.NEXTAUTH_SECRET || 'bithrah-super-secret-key-2025-production-v1'
    );
    
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.userId as number;

    const { db } = await import('@/lib/db');
    const { users, projects, backings } = await import('@/lib/db/schema');
    const { eq, count, sql } = await import('drizzle-orm');

    // Get user info
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    // Count projects
    const [projectCount] = await db
      .select({ count: count() })
      .from(projects)
      .where(eq(projects.creatorId, userId));

    // Count backings
    const [backingCount] = await db
      .select({ count: count() })
      .from(backings)
      .where(eq(backings.userId, userId));

    // Count referrals (users referred by this user)
    const [referralCount] = await db
      .select({ count: count() })
      .from(users)
      .where(eq(users.referredBy, userId));

    // Calculate total earnings (sum of current_funding from user's projects)
    const [earnings] = await db
      .select({
        total: sql<string>`COALESCE(SUM(CAST(current_funding AS NUMERIC)), 0)`,
      })
      .from(projects)
      .where(eq(projects.creatorId, userId));

    return NextResponse.json({
      success: true,
      stats: {
        totalProjects: projectCount?.count || 0,
        totalBackings: backingCount?.count || 0,
        totalEarnings: earnings?.total || '0',
        totalReferrals: referralCount?.count || 0,
        level: user?.level || 1,
        points: user?.points || 0,
        experience: user?.points || 0,
      },
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json({
      success: true,
      stats: {
        totalProjects: 0,
        totalBackings: 0,
        totalEarnings: '0',
        totalReferrals: 0,
        level: 1,
        points: 0,
        experience: 0,
      },
    });
  }
}
