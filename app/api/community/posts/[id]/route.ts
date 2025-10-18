import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { db } = await import('@/lib/db');
    const { communityPosts, users, postLikes, postComments } = await import('@/lib/db/schema');
    const { eq, and, isNull, desc } = await import('drizzle-orm');

    // Get current user ID if logged in
    const cookieStore = await cookies();
    const token = cookieStore.get('bithrah-token')?.value;
    let currentUserId: number | null = null;

    if (token) {
      try {
        const { jwtVerify } = await import('jose');
        const JWT_SECRET = new TextEncoder().encode(
          process.env.NEXTAUTH_SECRET || 'bithrah-super-secret-key-2025-production-v1'
        );
        const { payload } = await jwtVerify(token, JWT_SECRET);
        currentUserId = payload.userId as number;
      } catch (error) {
        // Invalid token, continue as guest
      }
    }

    // Fetch post
    const [post] = await db
      .select({
        id: communityPosts.id,
        uuid: communityPosts.uuid,
        communityId: communityPosts.communityId,
        userId: communityPosts.userId,
        title: communityPosts.title,
        content: communityPosts.content,
        contentType: communityPosts.contentType,
        attachments: communityPosts.attachments,
        likesCount: communityPosts.likesCount,
        commentsCount: communityPosts.commentsCount,
        sharesCount: communityPosts.sharesCount,
        pinned: communityPosts.pinned,
        createdAt: communityPosts.createdAt,
        updatedAt: communityPosts.updatedAt,
        // User info
        userName: users.name,
        userAvatar: users.avatar,
        userUsername: users.username,
        userLevel: users.level,
      })
      .from(communityPosts)
      .leftJoin(users, eq(communityPosts.userId, users.id))
      .where(eq(communityPosts.id, parseInt(id)))
      .limit(1);

    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    // Check if user liked the post
    let isLiked = false;
    if (currentUserId) {
      const [like] = await db
        .select()
        .from(postLikes)
        .where(
          and(
            eq(postLikes.postId, parseInt(id)),
            eq(postLikes.userId, currentUserId)
          )
        )
        .limit(1);

      isLiked = !!like;
    }

    // Fetch top-level comments
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
      .where(
        and(
          eq(postComments.postId, parseInt(id)),
          isNull(postComments.parentId)
        )
      )
      .orderBy(desc(postComments.createdAt));

    return NextResponse.json({
      success: true,
      post: {
        ...post,
        isLiked,
      },
      comments,
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

