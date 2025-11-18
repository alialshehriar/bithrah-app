import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { follows, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// Get user's followers
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = parseInt(params.userId);

    // Get followers
    const followers = await db
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
      .innerJoin(users, eq(follows.followerId, users.id))
      .where(eq(follows.followingId, userId))
      .orderBy(follows.createdAt);

    return NextResponse.json({
      success: true,
      followers,
      count: followers.length,
    });
  } catch (error) {
    console.error('Get followers error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get followers' },
      { status: 500 }
    );
  }
}
