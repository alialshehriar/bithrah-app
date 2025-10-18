import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

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
    const { postId, commentId, action } = body; // action: 'like' or 'unlike'

    if ((!postId && !commentId) || !action) {
      return NextResponse.json(
        { success: false, error: 'Post/Comment ID and action are required' },
        { status: 400 }
      );
    }

    const { db } = await import('@/lib/db');
    const { eq, and, sql } = await import('drizzle-orm');

    if (postId) {
      // Handle post like/unlike
      const { postLikes, communityPosts } = await import('@/lib/db/schema');

      if (action === 'like') {
        // Check if already liked
        const [existing] = await db
          .select()
          .from(postLikes)
          .where(
            and(
              eq(postLikes.postId, parseInt(postId)),
              eq(postLikes.userId, userId)
            )
          )
          .limit(1);

        if (existing) {
          return NextResponse.json({
            success: false,
            error: 'Already liked',
          });
        }

        // Add like
        await db.insert(postLikes).values({
          postId: parseInt(postId),
          userId,
        });

        // Update post likes count
        await db
          .update(communityPosts)
          .set({
            likesCount: sql`${communityPosts.likesCount} + 1`,
          } as any)
          .where(eq(communityPosts.id, parseInt(postId)));

        return NextResponse.json({
          success: true,
          message: 'Post liked',
        });
      } else if (action === 'unlike') {
        // Remove like
        await db
          .delete(postLikes)
          .where(
            and(
              eq(postLikes.postId, parseInt(postId)),
              eq(postLikes.userId, userId)
            )
          );

        // Update post likes count
        await db
          .update(communityPosts)
          .set({
            likesCount: sql`GREATEST(${communityPosts.likesCount} - 1, 0)`,
          } as any)
          .where(eq(communityPosts.id, parseInt(postId)));

        return NextResponse.json({
          success: true,
          message: 'Post unliked',
        });
      }
    } else if (commentId) {
      // Handle comment like/unlike
      const { commentLikes, postComments } = await import('@/lib/db/schema');

      if (action === 'like') {
        // Check if already liked
        const [existing] = await db
          .select()
          .from(commentLikes)
          .where(
            and(
              eq(commentLikes.commentId, parseInt(commentId)),
              eq(commentLikes.userId, userId)
            )
          )
          .limit(1);

        if (existing) {
          return NextResponse.json({
            success: false,
            error: 'Already liked',
          });
        }

        // Add like
        await db.insert(commentLikes).values({
          commentId: parseInt(commentId),
          userId,
        });

        // Update comment likes count
        await db
          .update(postComments)
          .set({
            likesCount: sql`${postComments.likesCount} + 1`,
          } as any)
          .where(eq(postComments.id, parseInt(commentId)));

        return NextResponse.json({
          success: true,
          message: 'Comment liked',
        });
      } else if (action === 'unlike') {
        // Remove like
        await db
          .delete(commentLikes)
          .where(
            and(
              eq(commentLikes.commentId, parseInt(commentId)),
              eq(commentLikes.userId, userId)
            )
          );

        // Update comment likes count
        await db
          .update(postComments)
          .set({
            likesCount: sql`GREATEST(${postComments.likesCount} - 1, 0)`,
          } as any)
          .where(eq(postComments.id, parseInt(commentId)));

        return NextResponse.json({
          success: true,
          message: 'Comment unliked',
        });
      }
    }

    return NextResponse.json(
      { success: false, error: 'Invalid request' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error handling like:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process like' },
      { status: 500 }
    );
  }
}

