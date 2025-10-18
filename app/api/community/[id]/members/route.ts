import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const { db } = await import('@/lib/db');
    const { communityMembers, users } = await import('@/lib/db/schema');
    const { eq, desc } = await import('drizzle-orm');

    const members = await db
      .select({
        id: communityMembers.id,
        userId: communityMembers.userId,
        role: communityMembers.role,
        points: communityMembers.points,
        level: communityMembers.level,
        postsCount: communityMembers.postsCount,
        commentsCount: communityMembers.commentsCount,
        joinedAt: communityMembers.joinedAt,
        // User info
        userName: users.name,
        userAvatar: users.avatar,
        userUsername: users.username,
      })
      .from(communityMembers)
      .leftJoin(users, eq(communityMembers.userId, users.id))
      .where(eq(communityMembers.communityId, parseInt(id)))
      .orderBy(desc(communityMembers.points))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({
      success: true,
      members,
      hasMore: members.length === limit,
    });
  } catch (error) {
    console.error('Error fetching members:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch members' },
      { status: 500 }
    );
  }
}

