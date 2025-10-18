import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { communities, users } from '@/lib/db/schema';
import { eq, like, desc, and, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'popular';
    
    let query = db
      .select({
        id: communities.id,
        name: communities.name,
        description: communities.description,
        category: communities.category,
        privacy: sql<string>`CASE WHEN ${communities.isPrivate} THEN 'private' ELSE 'public' END`,
        coverImage: communities.coverImage,
        memberCount: communities.memberCount,
        postCount: communities.postsCount,
        createdAt: communities.createdAt,
        creator: {
          id: users.id,
          name: users.name,
          username: users.username,
          avatar: users.avatar,
        },
      })
      .from(communities)
      .leftJoin(users, eq(communities.creatorId, users.id));
    
    // Apply filters
    const conditions = [];
    
    if (category && category !== '' && category !== 'all') {
      conditions.push(eq(communities.category, category));
    }
    
    if (search) {
      conditions.push(like(communities.name, `%${search}%`));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }
    
    // Apply sorting
    if (sort === 'popular') {
      query = query.orderBy(desc(communities.memberCount)) as any;
    } else if (sort === 'recent') {
      query = query.orderBy(desc(communities.createdAt)) as any;
    } else if (sort === 'members') {
      query = query.orderBy(desc(communities.memberCount)) as any;
    }
    
    const result = await query;
    
    return NextResponse.json({ communities: result });
  } catch (error) {
    console.error('Error fetching communities:', error);
    return NextResponse.json({ error: 'خطأ في جلب المجتمعات', communities: [] }, { status: 500 });
  }
}

