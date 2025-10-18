import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { communities, users } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';
import { sandboxCommunities, sandboxStats } from '@/lib/sandbox/data';

export async function GET(request: NextRequest) {
  try {
    // Check if sandbox mode is enabled
    const sandboxMode = request.cookies.get('sandbox-mode')?.value === 'true';
    
    if (sandboxMode) {
      return NextResponse.json({
        success: true,
        communities: sandboxCommunities,
        stats: sandboxStats.communities,
      });
    }
    // Fetch all communities
    const allCommunities = await db
      .select({
        id: communities.id,
        name: communities.name,
        description: communities.description,
        category: communities.category,
        memberCount: communities.memberCount,
        postsCount: communities.postsCount,
        status: communities.status,
        creatorId: communities.creatorId,
      })
      .from(communities);

    // Get creator names
    const creatorIds = [...new Set(allCommunities.map(c => c.creatorId))];
    const creators = await db
      .select({
        id: users.id,
        name: users.name,
      })
      .from(users)
      .where(sql`${users.id} = ANY(${creatorIds})`);

    const creatorMap = new Map(creators.map(c => [c.id, c.name || 'مستخدم']));

    // Calculate stats
    const stats = {
      total: allCommunities.length,
      active: allCommunities.filter(c => c.status === 'active').length,
      totalMembers: allCommunities.reduce((sum, c) => sum + (c.memberCount || 0), 0),
      totalPosts: allCommunities.reduce((sum, c) => sum + (c.postsCount || 0), 0),
    };

    // Format communities data
    const formattedCommunities = allCommunities.map(community => ({
      id: community.id.toString(),
      name: community.name || 'مجتمع',
      description: community.description || '',
      category: community.category || 'عام',
      memberCount: community.memberCount || 0,
      postsCount: community.postsCount || 0,
      status: community.status || 'active',
      creatorName: creatorMap.get(community.creatorId) || 'مستخدم',
    }));

    return NextResponse.json({
      success: true,
      communities: formattedCommunities,
      stats,
    });
  } catch (error) {
    console.error('Error fetching communities:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في جلب المجتمعات' },
      { status: 500 }
    );
  }
}

