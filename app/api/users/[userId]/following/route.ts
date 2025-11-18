import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { follows, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// Get users that this user is following
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = parseInt(params.userId);

    // Get following
    const following = await db
      .select({
        id: users.id,
        name: users.name,
        username: users.username,
        avatar: users.avatar,
        bio: users.bio,
        level: users.level,
        followedAt: follows.createdAt,
      })
      .from(follows)
      .innerJoin(users, eq(follows.followingId, users.id))
      .where(eq(follows.followerId, userId))
      .orderBy(follows.createdAt);

    return NextResponse.json({
      success: true,
      following,
      count: following.length,
    });
  } catch (error) {
    console.error('Get following error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get following' },
      { status: 500 }
    );
  }
}
