import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { communities, users } from '@/lib/db/schema';
import { eq, desc, asc, like, and, sql } from 'drizzle-orm';
import { isSandboxMode, generateDummyCommunities } from '@/lib/sandbox';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const sort = searchParams.get('sort') || 'popular';
    const limit = parseInt(searchParams.get('limit') || '20');

    // Build query conditions
    const conditions = [];
    
    if (search) {
      conditions.push(like(communities.name, `%${search}%`));
    }
    
    if (category) {
      conditions.push(eq(communities.category, category));
    }

    // Add status filter - only active communities
    conditions.push(eq(communities.status, 'active'));

    // Build order by
    let orderBy;
    switch (sort) {
      case 'newest':
        orderBy = desc(communities.createdAt);
        break;
      case 'members':
        orderBy = desc(communities.memberCount);
        break;
      case 'popular':
      default:
        orderBy = desc(communities.memberCount);
        break;
    }

    // Fetch communities with creator info
    const communitiesData = await db
      .select({
        id: communities.id,
        name: communities.name,
        description: communities.description,
        category: communities.category,
        coverImage: communities.coverImage,
        image: communities.image,
        memberCount: communities.memberCount,
        postsCount: communities.postsCount,
        tier: communities.tier,
        isPrivate: communities.isPrivate,
        verified: communities.verified,
        createdAt: communities.createdAt,
        creator: {
          id: users.id,
          name: users.name,
          username: users.username,
          avatar: users.avatar,
        },
      })
      .from(communities)
      .leftJoin(users, eq(communities.creatorId, users.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(orderBy)
      .limit(limit);

    // Format response
    const formattedCommunities = communitiesData.map((community) => ({
      id: community.id,
      name: community.name,
      description: community.description,
      category: community.category,
      privacy: community.isPrivate ? 'private' : 'public',
      coverImage: community.coverImage,
      image: community.image,
      memberCount: community.memberCount,
      postCount: community.postsCount || 0,
      tier: community.tier,
      verified: community.verified,
      createdAt: community.createdAt,
      creator: {
        id: community.creator.id,
        name: community.creator.name || 'مستخدم',
        username: community.creator.username || 'user',
        avatar: community.creator.avatar,
      },
    }));

    // Check sandbox mode
    const sandboxEnabled = await isSandboxMode();
    
    if (sandboxEnabled && formattedCommunities.length === 0) {
      // Return dummy data in sandbox mode if no real data
      const dummyCommunities = generateDummyCommunities(limit);
      return NextResponse.json({
        success: true,
        communities: dummyCommunities,
        total: dummyCommunities.length,
        sandbox: true,
      });
    }

    return NextResponse.json({
      success: true,
      communities: formattedCommunities,
      total: formattedCommunities.length,
      sandbox: false,
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, category, isPrivate, tier } = body;

    // TODO: Get user from session
    const userId = 1; // Placeholder

    // Create community
    const [newCommunity] = await db
      .insert(communities)
      .values({
        name,
        description,
        category,
        isPrivate: isPrivate || false,
        tier: tier || 'public',
        creatorId: userId,
        memberCount: 1,
        status: 'active',
      })
      .returning();

    return NextResponse.json({
      success: true,
      community: newCommunity,
    });
  } catch (error) {
    console.error('Error creating community:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create community',
      },
      { status: 500 }
    );
  }
}

