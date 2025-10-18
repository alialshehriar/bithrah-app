import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { db } = await import('@/lib/db');
    const { communities, communityMembers } = await import('@/lib/db/schema');
    const { eq, and } = await import('drizzle-orm');

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

    // Fetch community
    const [community] = await db
      .select()
      .from(communities)
      .where(eq(communities.id, parseInt(id)))
      .limit(1);

    if (!community) {
      return NextResponse.json(
        { success: false, error: 'Community not found' },
        { status: 404 }
      );
    }

    // Check if user is a member
    let isMember = false;
    let memberRole = null;
    if (currentUserId) {
      const [membership] = await db
        .select()
        .from(communityMembers)
        .where(
          and(
            eq(communityMembers.communityId, parseInt(id)),
            eq(communityMembers.userId, currentUserId)
          )
        )
        .limit(1);

      if (membership) {
        isMember = true;
        memberRole = membership.role;
      }
    }

    return NextResponse.json({
      success: true,
      community: {
        id: community.id,
        name: community.name,
        description: community.description,
        category: community.category,
        image: community.image,
        coverImage: community.coverImage,
        memberCount: community.memberCount || 0,
        postsCount: community.postsCount || 0,
        status: community.status,
        createdAt: community.createdAt,
      },
      isMember,
      memberRole,
    });
  } catch (error) {
    console.error('Error fetching community:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch community' },
      { status: 500 }
    );
  }
}

