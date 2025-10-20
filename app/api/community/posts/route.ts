import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const communityId = searchParams.get('communityId');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const sort = searchParams.get('sort') || 'recent'; // recent, popular, trending

    if (!communityId) {
      return NextResponse.json(
        { success: false, error: 'Community ID is required' },
        { status: 400 }
      );
    }

    const { db } = await import('@/lib/db');
    const { communityPosts, users, postLikes, postComments } = await import('@/lib/db/schema');
    const { eq, desc, sql } = await import('drizzle-orm');

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

    // Build query based on sort
    let orderBy;
    switch (sort) {
      case 'popular':
        orderBy = desc(communityPosts.likesCount);
        break;
      case 'trending':
        // Trending = combination of likes and recency
        orderBy = sql`(${communityPosts.likesCount} * 10 + ${communityPosts.commentsCount} * 5) / EXTRACT(EPOCH FROM (NOW() - ${communityPosts.createdAt})) DESC`;
        break;
      default:
        orderBy = desc(communityPosts.createdAt);
    }

    const posts = await db
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
      .where(eq(communityPosts.communityId, parseInt(communityId)))
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    // If user is logged in, check if they liked each post
    let postsWithLikes = posts;
    if (currentUserId) {
      const postIds = posts.map(p => p.id);
      const { inArray } = await import('drizzle-orm');
      
      const userLikes = await db
        .select({ postId: postLikes.postId })
        .from(postLikes)
        .where(
          sql`${postLikes.postId} IN (${sql.join(postIds.map(id => sql`${id}`), sql`, `)}) AND ${postLikes.userId} = ${currentUserId}`
        );

      const likedPostIds = new Set(userLikes.map(l => l.postId));
      
      postsWithLikes = posts.map(post => ({
        ...post,
        isLiked: likedPostIds.has(post.id),
      }));
    } else {
      postsWithLikes = posts.map(post => ({
        ...post,
        isLiked: false,
      }));
    }

    return NextResponse.json({
      success: true,
      posts: postsWithLikes,
      hasMore: posts.length === limit,
    });
  } catch (error) {
    console.error('Error fetching community posts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch posts' },
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
    const { communityId, title, content, contentType, attachments } = body;

    if (!communityId || !content) {
      return NextResponse.json(
        { success: false, error: 'Community ID and content are required' },
        { status: 400 }
      );
    }

    const { db } = await import('@/lib/db');
    const { communityPosts, communityMembers, communities } = await import('@/lib/db/schema');
    const { eq, and, sql } = await import('drizzle-orm');

    // Check if user is a member of the community
    const [membership] = await db
      .select()
      .from(communityMembers)
      .where(
        and(
          eq(communityMembers.communityId, parseInt(communityId)),
          eq(communityMembers.userId, userId)
        )
      )
      .limit(1);

    if (!membership) {
      return NextResponse.json(
        { success: false, error: 'You must be a member to post' },
        { status: 403 }
      );
    }

    // Create post
    const [newPost] = await db
      .insert(communityPosts)
      .values({
        communityId: parseInt(communityId),
        userId,
        title: title || null,
        content,
        contentType: contentType || 'text',
        attachments: attachments || null,
      } as any)
      .returning();

    // Update community posts count
    await db
      .update(communities)
      .set({
        postsCount: sql`${communities.postsCount} + 1`,
      } as any)
      .where(eq(communities.id, parseInt(communityId)));

    // Update member posts count
    await db
      .update(communityMembers)
      .set({
        postsCount: sql`${communityMembers.postsCount} + 1`,
        points: sql`${communityMembers.points} + 10`, // Award points for posting
      } as any)
      .where(
        and(
          eq(communityMembers.communityId, parseInt(communityId)),
          eq(communityMembers.userId, userId)
        )
      );

    return NextResponse.json({
      success: true,
      post: newPost,
    });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create post' },
      { status: 500 }
    );
  }
}

