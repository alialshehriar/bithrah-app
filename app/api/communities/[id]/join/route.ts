import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { communities, communityMembers } from '@/lib/db/schema';
import { eq, and, sql } from 'drizzle-orm';

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

    // Check if community exists
    const community = await db.query.communities.findFirst({
      where: eq(communities.id, communityId),
    });

    if (!community) {
      return NextResponse.json(
        { error: 'المجتمع غير موجود' },
        { status: 404 }
      );
    }

    // Check if already a member
    const existingMember = await db.query.communityMembers.findFirst({
      where: and(
        eq(communityMembers.communityId, communityId),
        eq(communityMembers.userId, parseInt(session.user.id))
      ),
    });

    if (existingMember) {
      return NextResponse.json(
        { error: 'أنت عضو بالفعل في هذا المجتمع' },
        { status: 400 }
      );
    }

    // Add member
    await db.insert(communityMembers).values({
      communityId,
      userId: parseInt(session.user.id),
      role: 'member',
      joinedAt: new Date(),
    });

    // Increment member count
    await db
      .update(communities)
      .set({
        memberCount: sql`${communities.memberCount} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(communities.id, communityId));

    return NextResponse.json({
      success: true,
      message: 'تم الانضمام للمجتمع بنجاح',
    });
  } catch (error) {
    console.error('Join community error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء الانضمام للمجتمع' },
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

    // Check if member exists
    const member = await db.query.communityMembers.findFirst({
      where: and(
        eq(communityMembers.communityId, communityId),
        eq(communityMembers.userId, parseInt(session.user.id))
      ),
    });

    if (!member) {
      return NextResponse.json(
        { error: 'لست عضواً في هذا المجتمع' },
        { status: 400 }
      );
    }

    // Check if user is creator/admin
    const community = await db.query.communities.findFirst({
      where: eq(communities.id, communityId),
    });

    if (community?.creatorId === parseInt(session.user.id)) {
      return NextResponse.json(
        { error: 'لا يمكن للمنشئ مغادرة المجتمع' },
        { status: 400 }
      );
    }

    // Remove member
    await db
      .delete(communityMembers)
      .where(
        and(
          eq(communityMembers.communityId, communityId),
          eq(communityMembers.userId, parseInt(session.user.id))
        )
      );

    // Decrement member count
    await db
      .update(communities)
      .set({
        memberCount: sql`${communities.memberCount} - 1`,
        updatedAt: new Date(),
      })
      .where(eq(communities.id, communityId));

    return NextResponse.json({
      success: true,
      message: 'تم مغادرة المجتمع بنجاح',
    });
  } catch (error) {
    console.error('Leave community error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء مغادرة المجتمع' },
      { status: 500 }
    );
  }
}

