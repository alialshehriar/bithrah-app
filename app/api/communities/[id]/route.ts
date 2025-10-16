import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { communities, communityMembers, communityPosts } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const communityId = parseInt(params.id);
    const session = await auth();

    // Fetch community details
    const community = await db.query.communities.findFirst({
      where: eq(communities.id, communityId),
      with: {
        creator: {
          columns: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    if (!community) {
      return NextResponse.json(
        { error: 'المجتمع غير موجود' },
        { status: 404 }
      );
    }

    // Check if user is a member
    let isMember = false;
    let memberRole = null;
    
    if (session?.user?.id) {
      const membership = await db.query.communityMembers.findFirst({
        where: eq(communityMembers.communityId, communityId) && eq(communityMembers.userId, parseInt(session.user.id)),
      });
      
      if (membership) {
        isMember = true;
        memberRole = membership.role;
      }
    }

    // Fetch recent posts
    const posts = await db.query.communityPosts.findMany({
      where: eq(communityPosts.communityId, communityId),
      orderBy: [desc(communityPosts.createdAt)],
      limit: 10,
      with: {
        author: {
          columns: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    // Fetch top members
    const members = await db.query.communityMembers.findMany({
      where: eq(communityMembers.communityId, communityId),
      orderBy: [desc(communityMembers.points)],
      limit: 10,
      with: {
        user: {
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
      community,
      isMember,
      memberRole,
      posts,
      members,
    });
  } catch (error) {
    console.error('Community fetch error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب تفاصيل المجتمع' },
      { status: 500 }
    );
  }
}

export async function PUT(
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

    // Check if user is admin
    const membership = await db.query.communityMembers.findFirst({
      where: eq(communityMembers.communityId, communityId) && eq(communityMembers.userId, parseInt(session.user.id)),
    });

    if (!membership || membership.role !== 'admin') {
      return NextResponse.json(
        { error: 'غير مصرح بتعديل المجتمع' },
        { status: 403 }
      );
    }

    // Update community
    const [updatedCommunity] = await db
      .update(communities)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(communities.id, communityId))
      .returning();

    return NextResponse.json({
      success: true,
      community: updatedCommunity,
      message: 'تم تحديث المجتمع بنجاح',
    });
  } catch (error) {
    console.error('Community update error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تحديث المجتمع' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    // Check if user is creator
    const community = await db.query.communities.findFirst({
      where: eq(communities.id, communityId),
    });

    if (!community) {
      return NextResponse.json(
        { error: 'المجتمع غير موجود' },
        { status: 404 }
      );
    }

    if (community.creatorId !== parseInt(session.user.id)) {
      return NextResponse.json(
        { error: 'غير مصرح بحذف المجتمع' },
        { status: 403 }
      );
    }

    // Delete community (cascade will delete members and posts)
    await db.delete(communities).where(eq(communities.id, communityId));

    return NextResponse.json({
      success: true,
      message: 'تم حذف المجتمع بنجاح',
    });
  } catch (error) {
    console.error('Community deletion error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء حذف المجتمع' },
      { status: 500 }
    );
  }
}

