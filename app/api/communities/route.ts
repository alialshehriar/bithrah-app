import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { communities, users } from '@/lib/db/schema';
import { eq, like, or, desc, sql } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const sort = searchParams.get('sort') || 'popular';
    
    // Build query conditions
    const conditions = [];
    
    // Filter by search
    if (search) {
      conditions.push(
        or(
          like(communities.name, `%${search}%`),
          like(communities.description, `%${search}%`)
        )
      );
    }
    
    // Filter by category
    if (category) {
      conditions.push(eq(communities.category, category));
    }
    
    // Fetch communities from database with creator info
    const result = await db
      .select({
        id: communities.id,
        name: communities.name,
        description: communities.description,
        category: communities.category,
        tier: communities.tier,
        memberCount: communities.memberCount,
        postsCount: communities.postsCount,
        createdAt: communities.createdAt,
        creatorId: communities.creatorId,
        creatorName: users.name,
        creatorUsername: users.username,
        creatorAvatar: users.avatar,
      })
      .from(communities)
      .leftJoin(users, eq(communities.creatorId, users.id))
      .where(conditions.length > 0 ? sql`${conditions.join(' AND ')}` : undefined)
      .orderBy(
        sort === 'recent' 
          ? desc(communities.createdAt)
          : desc(communities.memberCount)
      );
    
    // Format response
    const formatted = result.map(c => ({
      id: c.id,
      name: c.name || '',
      description: c.description || '',
      category: c.category || 'other',
      privacy: c.tier === 'public' ? 'public' : 'private',
      coverImage: null,
      memberCount: c.memberCount || 0,
      postCount: c.postsCount || 0,
      createdAt: c.createdAt?.toISOString() || new Date().toISOString(),
      isDemo: false,
      creator: {
        id: c.creatorId || 0,
        name: c.creatorName || 'Unknown',
        username: c.creatorUsername || 'unknown',
        avatar: c.creatorAvatar || null,
      },
    }));
    
    return NextResponse.json({
      success: true,
      communities: formatted,
      total: formatted.length,
    });
  } catch (error) {
    console.error('Error fetching communities:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في جلب المجتمعات', communities: [] },
      { status: 500 }
    );
  }
}

