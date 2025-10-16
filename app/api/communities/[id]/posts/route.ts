import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { communityPosts, communityMembers } from '@/lib/db/schema';
import { eq, desc, and } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const communityId = parseInt(params.id);
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '20');

    // Fetch posts
    const posts = await db.query.communityPosts.findMany({
      where: eq(communityPosts.communityId, communityId),
      orderBy: [desc(communityPosts.createdAt)],
      limit: limit,
      with: {
        author: {
          columns: {
            id: true,
            name: true,
            username: true,
            avatar: true,
            level: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      posts,
    });
  } catch (error) {
    console.error('Posts fetch error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب المنشورات' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'غير مصرح' },
        { status: 401 }
      );
    }

    const communityId = parseInt(params.id);
    const body = await request.json();
    const { content, attachments } = body;

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'يرجى كتابة محتوى المنشور' },
        { status: 400 }
      );
    }

    // Check if user is a member
    const member = await db.query.communityMembers.findFirst({
      where: and(
        eq(communityMembers.communityId, communityId),
        eq(communityMembers.userId, parseInt(session.user.id))
      ),
    });

    if (!member) {
      return NextResponse.json(
        { error: 'يجب أن تكون عضواً في المجتمع للنشر' },
        { status: 403 }
      );
    }

    // Create post
    const [newPost] = await db
      .insert(communityPosts)
      .values({
        communityId,
        authorId: parseInt(session.user.id),
        content,
        attachments: attachments || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    // Fetch post with author details
    const postWithAuthor = await db.query.communityPosts.findFirst({
      where: eq(communityPosts.id, newPost.id),
      with: {
        author: {
          columns: {
            id: true,
            name: true,
            username: true,
            avatar: true,
            level: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      post: postWithAuthor,
      message: 'تم نشر المنشور بنجاح',
    });
  } catch (error) {
    console.error('Post creation error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء نشر المنشور' },
      { status: 500 }
    );
  }
}

