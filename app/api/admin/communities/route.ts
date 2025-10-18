import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { communities, users } from '@/lib/db/schema';
import { eq, like, or, and, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const privacy = searchParams.get('privacy');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');

    let query = db
      .select({
        id: communities.id,
        name: communities.name,
        description: communities.description,
        category: communities.category,
        isPrivate: communities.isPrivate,
        status: communities.status,
        coverImage: communities.coverImage,
        memberCount: communities.memberCount,
        postsCount: communities.postsCount,
        createdAt: communities.createdAt,
        creator: {
          id: users.id,
          name: users.name,
          username: users.username,
        },
      })
      .from(communities)
      .leftJoin(users, eq(communities.creatorId, users.id));

    // Apply filters
    const conditions = [];

    if (search) {
      conditions.push(
        or(
          like(communities.name, `%${search}%`),
          like(communities.description, `%${search}%`)
        )
      );
    }

    if (privacy && privacy !== 'all') {
      conditions.push(eq(communities.isPrivate, privacy === 'private'));
    }

    if (status && status !== 'all') {
      conditions.push(eq(communities.status, status));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    query = query.orderBy(desc(communities.createdAt)).limit(limit) as any;

    const allCommunities = await query;

    return NextResponse.json({
      success: true,
      communities: allCommunities,
      total: allCommunities.length,
    });
  } catch (error) {
    console.error('Error fetching communities:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch communities',
        communities: [],
      },
      { status: 500 }
    );
  }
}

