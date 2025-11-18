import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { follows, users } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';

// Follow a user
export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const followingId = parseInt(params.userId);
    const followerId = parseInt(session.user.id);

    // Can't follow yourself
    if (followerId === followingId) {
      return NextResponse.json(
        { success: false, error: 'Cannot follow yourself' },
        { status: 400 }
      );
    }

    // Check if already following
    const existing = await db
      .select()
      .from(follows)
      .where(
        and(
          eq(follows.followerId, followerId),
          eq(follows.followingId, followingId)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Already following this user' },
        { status: 400 }
      );
    }

    // Create follow relationship
    await db.insert(follows).values({
      followerId,
      followingId,
    });

    return NextResponse.json({
      success: true,
      message: 'Successfully followed user',
    });
  } catch (error) {
    console.error('Follow error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to follow user' },
      { status: 500 }
    );
  }
}

// Unfollow a user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const followingId = parseInt(params.userId);
    const followerId = parseInt(session.user.id);

    // Delete follow relationship
    await db
      .delete(follows)
      .where(
        and(
          eq(follows.followerId, followerId),
          eq(follows.followingId, followingId)
        )
      );

    return NextResponse.json({
      success: true,
      message: 'Successfully unfollowed user',
    });
  } catch (error) {
    console.error('Unfollow error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to unfollow user' },
      { status: 500 }
    );
  }
}

// Check if following
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({
        success: true,
        isFollowing: false,
      });
    }

    const followingId = parseInt(params.userId);
    const followerId = parseInt(session.user.id);

    const existing = await db
      .select()
      .from(follows)
      .where(
        and(
          eq(follows.followerId, followerId),
          eq(follows.followingId, followingId)
        )
      )
      .limit(1);

    return NextResponse.json({
      success: true,
      isFollowing: existing.length > 0,
    });
  } catch (error) {
    console.error('Check follow error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check follow status' },
      { status: 500 }
    );
  }
}
