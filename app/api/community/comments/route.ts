import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');
    const parentId = searchParams.get('parentId');

    if (!postId) {
      return NextResponse.json(
        { success: false, error: 'Post ID is required' },
        { status: 400 }
      );
    }

    const { db } = await import('@/lib/db');
    const { postComments, users } = await import('@/lib/db/schema');
    const { eq, and, isNull, desc } = await import('drizzle-orm');

    // Get comments (top-level if no parentId, or replies if parentId is provided)
    const whereCondition = parentId
      ? and(
          eq(postComments.postId, parseInt(postId)),
          eq(postComments.parentId, parseInt(parentId))
        )
      : and(
          eq(postComments.postId, parseInt(postId)),
          isNull(postComments.parentId)
        );

    const comments = await db
      .select({
        id: postComments.id,
        uuid: postComments.uuid,
        postId: postComments.postId,
        userId: postComments.userId,
        parentId: postComments.parentId,
        content: postComments.content,
        likesCount: postComments.likesCount,
        repliesCount: postComments.repliesCount,
        createdAt: postComments.createdAt,
        updatedAt: postComments.updatedAt,
        // User info
        userName: users.name,
        userAvatar: users.avatar,
        userUsername: users.username,
        userLevel: users.level,
      })
      .from(postComments)
      .leftJoin(users, eq(postComments.userId, users.id))
      .where(whereCondition)
      .orderBy(desc(postComments.createdAt));

    return NextResponse.json({
      success: true,
      comments,
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('bithrah-token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { jwtVerify } = await import('jose');
    const JWT_SECRET = new TextEncoder().encode(
      process.env.NEXTAUTH_SECRET || 'bithrah-super-secret-key-2025-production-v1'
    );
    
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.userId as number;

    const body = await request.json();
    const { postId, parentId, content } = body;

    if (!postId || !content) {
      return NextResponse.json(
        { success: false, error: 'Post ID and content are required' },
        { status: 400 }
      );
    }

    const { db } = await import('@/lib/db');
    const { postComments, communityPosts, communityMembers } = await import('@/lib/db/schema');
    const { eq, and, sql } = await import('drizzle-orm');

    // Create comment
    const [newComment] = await db
      .insert(postComments)
      .values({
        postId: parseInt(postId),
        userId,
        parentId: parentId ? parseInt(parentId) : null,
        content,
      } as any)
      .returning();

    // Update post comments count
    await db
      .update(communityPosts)
      .set({
        commentsCount: sql`${communityPosts.commentsCount} + 1`,
      } as any)
      .where(eq(communityPosts.id, parseInt(postId)));

    // If this is a reply, update parent comment replies count
    if (parentId) {
      await db
        .update(postComments)
        .set({
          repliesCount: sql`${postComments.repliesCount} + 1`,
        } as any)
        .where(eq(postComments.id, parseInt(parentId)));
    }

    // Get post to find community ID
    const [post] = await db
      .select({ communityId: communityPosts.communityId })
      .from(communityPosts)
      .where(eq(communityPosts.id, parseInt(postId)))
      .limit(1);

    if (post) {
      // Update member comments count and award points
      await db
        .update(communityMembers)
        .set({
          commentsCount: sql`${communityMembers.commentsCount} + 1`,
          points: sql`${communityMembers.points} + 5`, // Award points for commenting
        } as any)
        .where(
          and(
            eq(communityMembers.communityId, post.communityId),
            eq(communityMembers.userId, userId)
          )
        );
    }

    // Get user info for the response
    const { users } = await import('@/lib/db/schema');
    const [user] = await db
      .select({
        name: users.name,
        avatar: users.avatar,
        username: users.username,
        level: users.level,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    return NextResponse.json({
      success: true,
      comment: {
        ...newComment,
        userName: user?.name,
        userAvatar: user?.avatar,
        userUsername: user?.username,
        userLevel: user?.level,
      },
    });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}

