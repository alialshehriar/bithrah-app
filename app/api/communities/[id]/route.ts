import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { communities, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // Fetch community from database
    const communityResult = await db
      .select()
      .from(communities)
      .where(eq(communities.id, parseInt(id)))
      .limit(1);

    if (communityResult.length === 0) {
      return NextResponse.json(
        { success: false, error: 'المجتمع غير موجود' },
        { status: 404 }
      );
    }

    const community = communityResult[0];

    // Get creator info
    const creatorResult = await db
      .select({
        id: users.id,
        name: users.name,
        avatar: users.avatar,
      })
      .from(users)
      .where(eq(users.id, community.creatorId))
      .limit(1);

    const creator = creatorResult[0] || { id: 0, name: 'مستخدم', avatar: null };

    return NextResponse.json({
      success: true,
      community: {
        id: community.id,
        name: community.name,
        slug: community.slug,
        description: community.description,
        category: community.category,
        memberCount: community.memberCount || 0,
        postsCount: community.postsCount || 0,
        status: community.status,
        creator: {
          id: creator.id,
          name: creator.name,
          avatar: creator.avatar,
        },
        createdAt: community.createdAt,
      },
    });
  } catch (error) {
    console.error('Error fetching community:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}

